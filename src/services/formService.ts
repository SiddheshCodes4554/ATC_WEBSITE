import { ID, Query, Permission, Role, Models } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  EventForm,
  EventFormDocument,
  FormField,
  FormFieldDocument,
  CreateEventFormInput,
  FormFieldInput,
} from '../types/form.types';
import { EventService } from './eventService';
import { StorageService } from './storage.service';
import { CreateEventInput, UpdateEventInput, ATCEvent, EventServiceResult } from '../types/event.types';

/**
 * ============================================================================
 * ATC Appwrite Form & Field Database Service
 * ============================================================================
 * Handles creation and retrieval of dynamic registration forms and fields.
 */
export class FormService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get formCollectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.EVENT_FORMS;
  }

  private static get fieldsCollectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.FORM_FIELDS;
  }

  /**
   * Helper: Standard permissions (Public Read, Admin Write)
   */
  private static getStandardPermissions(): string[] {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  /**
   * Resilient document creator that removes unknown attributes if the collection schema lacks them
   */
  private static async createDocumentResilient<T extends Models.Document = Models.Document>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, any>,
    permissions?: string[]
  ): Promise<T> {
    const payload = { ...data };
    let currentPermissions = permissions;
    const maxRetries = 10;

    for (let i = 0; i < maxRetries; i++) {
      try {
        if (currentPermissions && currentPermissions.length > 0) {
          return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any, currentPermissions);
        } else {
          return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any);
        }
      } catch (err: any) {
        if (currentPermissions && (err?.code === 401 || err?.code === 403 || /permission/i.test(err?.message || ''))) {
          currentPermissions = undefined;
          continue;
        }

        const match =
          err?.message?.match(/Unknown attribute:\s*"([^"]+)"/i) ||
          err?.message?.match(/Attribute not found.*?:\s*"([^"]+)"/i) ||
          err?.message?.match(/attribute\s+"([^"]+)"\s+is unknown/i);

        if (match && match[1] && payload[match[1]] !== undefined) {
          console.warn(`[FormService] Stripping unknown attribute "${match[1]}" from payload and retrying...`);
          delete payload[match[1]];
          continue;
        }

        throw err;
      }
    }

    return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any);
  }

  /**
   * Creates an Event Form record and its nested Form Field records in Appwrite
   */
  static async createEventForm(
    input: CreateEventFormInput
  ): Promise<{ success: boolean; data?: EventForm; error?: string }> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in the environment.' };
      }

      if (!input.eventId) {
        return { success: false, error: 'Event ID is required to create a registration form.' };
      }

      const formId = ID.unique();

      // 1. Create event_forms record
      const formDoc = await this.createDocumentResilient<EventFormDocument>(
        this.databaseId,
        this.formCollectionId,
        formId,
        {
          eventId: input.eventId,
          title: input.title?.trim() || 'Registration Form',
          description: input.description?.trim() || '',
          isActive: input.isActive !== false,
        },
        this.getStandardPermissions()
      );

      const savedFields: FormField[] = [];

      // 2. Create form_fields records
      if (input.fields && input.fields.length > 0) {
        for (let i = 0; i < input.fields.length; i++) {
          const field = input.fields[i];
          const fieldId = ID.unique();
          const optionsString = field.options && field.options.length > 0
            ? JSON.stringify(field.options)
            : '';

          try {
            const fieldDoc = await this.createDocumentResilient<FormFieldDocument>(
              this.databaseId,
              this.fieldsCollectionId,
              fieldId,
              {
                formId: formDoc.$id,
                label: field.label.trim(),
                fieldType: field.fieldType,
                placeholder: field.placeholder?.trim() || '',
                required: Boolean(field.required),
                options: optionsString,
                position: field.position ?? i,
                ...(field.systemKey ? { systemKey: field.systemKey } : {}),
              },
              this.getStandardPermissions()
            );

            savedFields.push({
              $id: fieldDoc.$id,
              formId: fieldDoc.formId,
              label: fieldDoc.label,
              fieldType: fieldDoc.fieldType,
              placeholder: fieldDoc.placeholder,
              required: fieldDoc.required,
              options: field.options || [],
              position: fieldDoc.position,
            });
          } catch (fieldErr: any) {
            console.warn(`[FormService] Notice: Could not write form_fields document. Ensure the 'form_fields' collection is created in Appwrite console:`, fieldErr);
          }
        }
      }

      return {
        success: true,
        data: {
          $id: formDoc.$id,
          eventId: formDoc.eventId,
          title: formDoc.title,
          description: formDoc.description,
          isActive: formDoc.isActive,
          fields: savedFields,
        },
      };
    } catch (error: any) {
      console.warn(`[FormService] Notice: Could not save event_form document to Appwrite:`, error);
      return {
        success: false,
        error: error?.message || 'Failed to save event registration form.',
      };
    }
  }

  /**
   * Retrieves the active registration form and its fields for a given Event ID
   */
  static async getFormByEventId(
    eventId: string
  ): Promise<{ success: boolean; data?: EventForm; error?: string }> {
    try {
      if (!isAppwriteReady() || !eventId?.trim()) {
        return { success: false, error: 'Appwrite not configured or missing event ID.' };
      }

      // Query event_forms
      const formResponse = await databases.listDocuments<EventFormDocument>(
        this.databaseId,
        this.formCollectionId,
        [
          Query.equal('eventId', eventId.trim()),
          Query.equal('isActive', true),
          Query.limit(1),
        ]
      );

      if (formResponse.documents.length === 0) {
        return { success: false, error: 'No active form found for this event.' };
      }

      const formDoc = formResponse.documents[0];

      // Query form_fields
      let fields: FormField[] = [];
      try {
        const fieldsResponse = await databases.listDocuments<FormFieldDocument>(
          this.databaseId,
          this.fieldsCollectionId,
          [
            Query.equal('formId', formDoc.$id),
            Query.orderAsc('position'),
            Query.limit(50),
          ]
        );

        fields = fieldsResponse.documents.map((f) => {
          let parsedOptions: string[] = [];
          if (f.options) {
            try {
              parsedOptions = JSON.parse(f.options);
            } catch {
              parsedOptions = [];
            }
          }

          return {
            $id: f.$id,
            formId: f.formId,
            label: f.label,
            fieldType: f.fieldType,
            placeholder: f.placeholder,
            required: f.required,
            options: parsedOptions,
            position: f.position,
            systemKey: (f.systemKey as any) || undefined,
          };
        });
      } catch (fErr) {
        console.warn(`[FormService] Could not retrieve form_fields for form ${formDoc.$id}:`, fErr);
      }

      return {
        success: true,
        data: {
          $id: formDoc.$id,
          eventId: formDoc.eventId,
          title: formDoc.title,
          description: formDoc.description,
          isActive: formDoc.isActive,
          fields,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to fetch registration form.',
      };
    }
  }

  /**
   * Unified Master Coordinator: Saves Event + Form + Form Fields in one clean sequence
   */
  static async saveCompleteEvent(
    eventInput: CreateEventInput,
    formFields?: FormFieldInput[],
    formTitle?: string,
    formDescription?: string
  ): Promise<EventServiceResult<ATCEvent>> {
    // 1. Create Event record first
    const eventResult = await EventService.createEvent(eventInput);
    if (!eventResult.success || !eventResult.data) {
      return eventResult;
    }

    const createdEvent = eventResult.data;

    // 2. If registration is enabled and form fields are provided, create the form & fields
    if (eventInput.registrationEnabled && formFields && formFields.length > 0) {
      try {
        await this.createEventForm({
          eventId: createdEvent.$id,
          title: formTitle || `${eventInput.title} Registration`,
          description: formDescription || 'Please fill in your details to register.',
          isActive: true,
          fields: formFields,
        });
      } catch (formErr) {
        console.warn('[FormService] Event created, but form setup encounter:', formErr);
      }
    }

    return {
      success: true,
      data: createdEvent,
    };
  }

  /**
   * Unified Master Coordinator: Updates Event + Form + Form Fields in one clean sequence
   */
  static async updateCompleteEvent(
    eventId: string,
    eventInput: UpdateEventInput,
    formFields?: FormFieldInput[],
    formTitle?: string,
    formDescription?: string
  ): Promise<EventServiceResult<ATCEvent>> {
    // 1. Update event document
    const eventResult = await EventService.updateEvent(eventId, eventInput);
    if (!eventResult.success || !eventResult.data) {
      return eventResult;
    }

    const updatedEvent = eventResult.data;

    // 2. If registration is enabled, sync form and fields
    if (eventInput.registrationEnabled && formFields) {
      try {
        // Check for existing form
        const existingFormRes = await databases.listDocuments<EventFormDocument>(
          this.databaseId,
          this.formCollectionId,
          [Query.equal('eventId', eventId), Query.limit(1)]
        );

        let formId: string;
        if (existingFormRes.documents.length > 0) {
          formId = existingFormRes.documents[0].$id;
          // Update form document
          await databases.updateDocument(this.databaseId, this.formCollectionId, formId, {
            title: formTitle || `${updatedEvent.title} Registration`,
            description: formDescription || 'Please fill in your details to register.',
            isActive: true,
          });

          // Delete previous form_fields
          try {
            const oldFields = await databases.listDocuments<FormFieldDocument>(
              this.databaseId,
              this.fieldsCollectionId,
              [Query.equal('formId', formId), Query.limit(100)]
            );
            for (const oldField of oldFields.documents) {
              await databases.deleteDocument(this.databaseId, this.fieldsCollectionId, oldField.$id);
            }
          } catch (delErr) {
            console.warn('[FormService] Could not clear old fields:', delErr);
          }
        } else {
          // Create new form
          formId = ID.unique();
          await this.createDocumentResilient(
            this.databaseId,
            this.formCollectionId,
            formId,
            {
              eventId: eventId,
              title: formTitle || `${updatedEvent.title} Registration`,
              description: formDescription || 'Please fill in your details to register.',
              isActive: true,
            },
            this.getStandardPermissions()
          );
        }

        // Re-create form_fields
        for (let i = 0; i < formFields.length; i++) {
          const field = formFields[i];
          const fieldId = ID.unique();
          const optionsString = field.options && field.options.length > 0 ? JSON.stringify(field.options) : '';

          try {
            await this.createDocumentResilient(
              this.databaseId,
              this.fieldsCollectionId,
              fieldId,
              {
                formId: formId,
                label: field.label.trim(),
                fieldType: field.fieldType,
                placeholder: field.placeholder?.trim() || '',
                required: Boolean(field.required),
                options: optionsString,
                position: field.position ?? i,
                ...(field.systemKey ? { systemKey: field.systemKey } : {}),
              },
              this.getStandardPermissions()
            );
          } catch (fErr) {
            console.warn('[FormService] Notice: Could not save updated form field:', fErr);
          }
        }
      } catch (formErr) {
        console.warn('[FormService] Notice: Error syncing registration form on event update:', formErr);
      }
    }

    return {
      success: true,
      data: updatedEvent,
    };
  }

  /**
   * Unified Master Coordinator: Deletes Event + associated cover image + gallery images + Form + Form Fields
   */
  static async deleteCompleteEvent(
    eventId: string,
    coverImageId?: string | null,
    galleryImageIds?: string[] | null
  ): Promise<EventServiceResult<void>> {
    // 1. Delete cover image from storage if present
    if (coverImageId) {
      try {
        await StorageService.deleteEventImage(coverImageId);
      } catch (imgErr) {
        console.warn('[FormService] Could not delete event cover image:', imgErr);
      }
    }

    // 2. Delete gallery images from storage if present
    if (galleryImageIds && Array.isArray(galleryImageIds)) {
      for (const gId of galleryImageIds) {
        if (gId?.trim()) {
          try {
            await StorageService.deleteEventImage(gId.trim());
          } catch (gErr) {
            console.warn('[FormService] Could not delete event gallery image:', gErr);
          }
        }
      }
    }

    // 3. Delete event_forms & form_fields
    try {
      const formResponse = await databases.listDocuments<EventFormDocument>(
        this.databaseId,
        this.formCollectionId,
        [Query.equal('eventId', eventId), Query.limit(10)]
      );

      for (const formDoc of formResponse.documents) {
        // Delete form_fields
        try {
          const fieldsResponse = await databases.listDocuments<FormFieldDocument>(
            this.databaseId,
            this.fieldsCollectionId,
            [Query.equal('formId', formDoc.$id), Query.limit(100)]
          );
          for (const fieldDoc of fieldsResponse.documents) {
            await databases.deleteDocument(this.databaseId, this.fieldsCollectionId, fieldDoc.$id);
          }
        } catch (fErr) {
          console.warn('[FormService] Could not delete form fields:', fErr);
        }

        await databases.deleteDocument(this.databaseId, this.formCollectionId, formDoc.$id);
      }
    } catch (formErr) {
      console.warn('[FormService] Could not delete associated event form:', formErr);
    }

    // 4. Delete event document
    return EventService.deleteEvent(eventId, coverImageId || undefined, galleryImageIds || undefined);
  }
}

export default FormService;
