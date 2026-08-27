import { ID, Query, Permission, Role } from 'appwrite';
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
import { CreateEventInput, ATCEvent, EventServiceResult } from '../types/event.types';

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
      const formDoc = await databases.createDocument<EventFormDocument>(
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
            const fieldDoc = await databases.createDocument<FormFieldDocument>(
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
}

export default FormService;
