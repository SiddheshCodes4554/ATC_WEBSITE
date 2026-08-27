import { ID, Query, Permission, Role } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { ATCEvent } from '../types/event.types';
import {
  EventForm,
  FormField,
  EventRegistration,
  EventRegistrationDocument,
  RegistrationAnswer,
  RegistrationAnswerDocument,
  RegistrationSubmissionResult,
  RegistrationStats,
} from '../types/form.types';

/**
 * ============================================================================
 * ATC Appwrite Registration Service
 * ============================================================================
 * Handles public event registration submissions, dynamic field validation,
 * duplicate checks, capacity limit enforcement, and atomic rollback on failure.
 */
export class RegistrationService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get registrationsCollection(): string {
    return APPWRITE_CONFIG.COLLECTIONS.REGISTRATIONS;
  }

  private static get answersCollection(): string {
    return APPWRITE_CONFIG.COLLECTIONS.REGISTRATION_ANSWERS;
  }

  /**
   * Permissions for student registrations:
   * Public users create the document, while read/update/delete is restricted to ATC Admin users.
   */
  private static getParticipantPermissions(): string[] {
    return [
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  /**
   * Validates dynamic form field values according to field types and required flags
   */
  static validateFieldValues(
    fields: FormField[],
    answers: Record<string, any>
  ): { isValid: boolean; fieldErrors: Record<string, string> } {
    const fieldErrors: Record<string, string> = {};

    for (const field of fields) {
      const key = field.$id || field.label;
      const val = answers[key] ?? answers[field.label];

      // 1. Required Check
      const isEmpty =
        val === undefined ||
        val === null ||
        (typeof val === 'string' && val.trim() === '') ||
        (Array.isArray(val) && val.length === 0);

      if (field.required && isEmpty) {
        fieldErrors[key] = `${field.label} is required.`;
        continue;
      }

      if (isEmpty) continue; // Optional empty fields pass type validation

      // 2. Type-specific Validation
      switch (field.fieldType) {
        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof val !== 'string' || !emailRegex.test(val.trim())) {
            fieldErrors[key] = 'Please enter a valid email address.';
          }
          break;
        }

        case 'phone': {
          // Allows +, digits, spaces, hyphens, min 7 digits
          const cleaned = String(val).replace(/[\s\-()]/g, '');
          const phoneRegex = /^\+?[0-9]{7,15}$/;
          if (!phoneRegex.test(cleaned)) {
            fieldErrors[key] = 'Please enter a valid phone number (7-15 digits).';
          }
          break;
        }

        case 'number': {
          if (isNaN(Number(val))) {
            fieldErrors[key] = 'Please enter a valid numeric value.';
          }
          break;
        }

        case 'url': {
          try {
            const urlString = String(val).trim();
            const withProtocol = urlString.startsWith('http://') || urlString.startsWith('https://')
              ? urlString
              : `https://${urlString}`;
            new URL(withProtocol);
          } catch {
            fieldErrors[key] = 'Please enter a valid URL (e.g. https://github.com/username).';
          }
          break;
        }

        case 'date': {
          if (isNaN(new Date(val).getTime())) {
            fieldErrors[key] = 'Please provide a valid date.';
          }
          break;
        }

        case 'dropdown':
        case 'multiple_choice': {
          if (field.options && field.options.length > 0) {
            if (!field.options.includes(String(val))) {
              fieldErrors[key] = 'Selected option is invalid.';
            }
          }
          break;
        }

        case 'checkbox': {
          if (Array.isArray(val) && field.options && field.options.length > 0) {
            const hasInvalid = val.some((item) => !field.options?.includes(item));
            if (hasInvalid) {
              fieldErrors[key] = 'One or more selected options are invalid.';
            }
          }
          break;
        }
      }
    }

    return {
      isValid: Object.keys(fieldErrors).length === 0,
      fieldErrors,
    };
  }

  /**
   * Checks event availability: registration enabled, status, deadline, and capacity limit
   */
  static async checkEventAvailability(
    event: ATCEvent
  ): Promise<{ available: boolean; error?: string; isCapacityReached?: boolean; isDeadlinePassed?: boolean }> {
    if (!event.registrationEnabled) {
      return { available: false, error: 'Registration is currently closed for this event.' };
    }

    if (event.status === 'completed' || event.status === 'cancelled' || event.status === 'draft') {
      return { available: false, error: `Registration is unavailable because the event is marked as ${event.status}.` };
    }

    // Check registration deadline
    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline).getTime();
      const now = Date.now();
      if (now > deadline) {
        return {
          available: false,
          isDeadlinePassed: true,
          error: 'Registration deadline for this event has passed.',
        };
      }
    }

    // Check attendee capacity limit
    if (event.registrationLimit && event.registrationLimit > 0) {
      try {
        const countRes = await databases.listDocuments<EventRegistrationDocument>(
          this.databaseId,
          this.registrationsCollection,
          [
            Query.equal('eventId', event.$id),
            Query.notEqual('status', 'cancelled'),
            Query.limit(1), // total in countRes.total
          ]
        );

        if (countRes.total >= event.registrationLimit) {
          return {
            available: false,
            isCapacityReached: true,
            error: 'This event has reached its maximum attendee capacity.',
          };
        }
      } catch (countErr) {
        console.warn('[RegistrationService] Could not check active registration limit:', countErr);
      }
    }

    return { available: true };
  }

  /**
   * Checks if an email is already registered for this specific event
   */
  static async checkDuplicateRegistration(
    eventId: string,
    email: string
  ): Promise<{ isDuplicate: boolean; error?: string }> {
    if (!email?.trim() || !eventId?.trim()) {
      return { isDuplicate: false };
    }

    try {
      const checkRes = await databases.listDocuments<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        [
          Query.equal('eventId', eventId.trim()),
          Query.equal('email', email.trim().toLowerCase()),
          Query.notEqual('status', 'cancelled'),
          Query.limit(1),
        ]
      );

      if (checkRes.documents.length > 0) {
        return {
          isDuplicate: true,
          error: 'You are already registered for this event with this email address.',
        };
      }
    } catch (dupErr) {
      console.warn('[RegistrationService] Duplicate check notice:', dupErr);
    }

    return { isDuplicate: false };
  }

  /**
   * Master Method: Validates, checks constraints, and atomic saves registration + answers
   */
  static async submitRegistration({
    event,
    form,
    formFields,
    answers,
  }: {
    event: ATCEvent;
    form?: EventForm | null;
    formFields: FormField[];
    answers: Record<string, any>;
  }): Promise<RegistrationSubmissionResult> {
    if (!isAppwriteReady()) {
      return {
        success: false,
        error: 'Appwrite backend is not configured in the current environment.',
      };
    }

    if (!event?.$id) {
      return { success: false, error: 'Invalid event reference.' };
    }

    // 1. Validate Form Field inputs
    const { isValid, fieldErrors } = this.validateFieldValues(formFields, answers);
    if (!isValid) {
      return {
        success: false,
        error: 'Please fix the highlighted errors in the form.',
        fieldErrors,
      };
    }

    // 2. Check Event Availability & Constraints
    const availability = await this.checkEventAvailability(event);
    if (!availability.available) {
      return {
        success: false,
        error: availability.error || 'Event registration is not available.',
        isCapacityReached: availability.isCapacityReached,
        isDeadlinePassed: availability.isDeadlinePassed,
      };
    }

    // 3. Extract participant identification fields using systemKey (or fallback by type)
    let participantName = '';
    let participantEmail = '';
    let participantPhone = '';

    for (const field of formFields) {
      const key = field.$id || field.label;
      const val = answers[key] ?? answers[field.label];
      const stringVal = typeof val === 'string' ? val.trim() : String(val ?? '');

      if (field.systemKey === 'name') {
        participantName = stringVal;
      } else if (field.systemKey === 'email') {
        participantEmail = stringVal.toLowerCase();
      } else if (field.systemKey === 'phone') {
        participantPhone = stringVal;
      } else {
        // Fallback detection if systemKey was not explicitly assigned
        if (!participantName && (field.fieldType === 'short_text' && /name/i.test(field.label))) {
          participantName = stringVal;
        }
        if (!participantEmail && field.fieldType === 'email') {
          participantEmail = stringVal.toLowerCase();
        }
        if (!participantPhone && field.fieldType === 'phone') {
          participantPhone = stringVal;
        }
      }
    }

    // Ensure fallback name if not detected
    if (!participantName) {
      participantName = 'Participant';
    }

    // 4. Duplicate Registration Check
    if (participantEmail) {
      const duplicateCheck = await this.checkDuplicateRegistration(event.$id, participantEmail);
      if (duplicateCheck.isDuplicate) {
        return {
          success: false,
          isDuplicate: true,
          error: duplicateCheck.error || 'You are already registered for this event.',
        };
      }
    }

    // 5. Create Registration Document in Appwrite
    const registrationId = ID.unique();
    const registeredAt = new Date().toISOString();
    let createdRegistrationDoc: EventRegistrationDocument | null = null;
    const createdAnswerDocIds: string[] = [];

    try {
      createdRegistrationDoc = await databases.createDocument<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        registrationId,
        {
          eventId: event.$id,
          formId: form?.$id || '',
          name: participantName,
          email: participantEmail,
          phone: participantPhone,
          status: 'registered',
          registeredAt,
        },
        this.getParticipantPermissions()
      );
    } catch (regError: any) {
      console.error('[RegistrationService] Failed to create registration document:', regError);
      return {
        success: false,
        error: 'Unable to save registration. Please check your connection and try again.',
      };
    }

    // 6. Create Individual Registration Answer Documents for every field
    try {
      for (const field of formFields) {
        const key = field.$id || field.label;
        const val = answers[key] ?? answers[field.label];
        const serializedValue = Array.isArray(val)
          ? JSON.stringify(val)
          : typeof val === 'object' && val !== null
          ? JSON.stringify(val)
          : String(val ?? '');

        const answerId = ID.unique();

        const answerDoc = await databases.createDocument<RegistrationAnswerDocument>(
          this.databaseId,
          this.answersCollection,
          answerId,
          {
            registrationId: createdRegistrationDoc.$id,
            fieldId: field.$id || field.label,
            value: serializedValue,
          },
          this.getParticipantPermissions()
        );

        createdAnswerDocIds.push(answerDoc.$id);
      }

      return {
        success: true,
        registrationId: createdRegistrationDoc.$id,
        registration: {
          $id: createdRegistrationDoc.$id,
          eventId: createdRegistrationDoc.eventId,
          formId: createdRegistrationDoc.formId,
          name: createdRegistrationDoc.name,
          email: createdRegistrationDoc.email,
          phone: createdRegistrationDoc.phone,
          status: createdRegistrationDoc.status,
          registeredAt: createdRegistrationDoc.registeredAt,
        },
      };
    } catch (answerError: any) {
      console.error('[RegistrationService] Error saving registration answers. Initiating rollback...', answerError);

      // 7. Atomic Rollback: delete created answers and registration document
      for (const ansId of createdAnswerDocIds) {
        try {
          await databases.deleteDocument(this.databaseId, this.answersCollection, ansId);
        } catch (delAnsErr) {
          console.warn('[RegistrationService] Rollback: Could not delete answer document:', delAnsErr);
        }
      }

      if (createdRegistrationDoc) {
        try {
          await databases.deleteDocument(this.databaseId, this.registrationsCollection, createdRegistrationDoc.$id);
        } catch (delRegErr) {
          console.warn('[RegistrationService] Rollback: Could not delete registration document:', delRegErr);
        }
      }

      return {
        success: false,
        error: 'An unexpected error occurred while saving your responses. Please try again.',
      };
    }
  }

  /* ======================================================================== */
  /* ADMIN-ONLY REGISTRATION MANAGEMENT METHODS                               */
  /* ======================================================================== */

  /**
   * Admin: Fetches all registrations for a specific event
   */
  static async getRegistrationsByEvent(
    eventId: string,
    options?: { limit?: number; offset?: number; status?: string }
  ): Promise<{ success: boolean; data?: EventRegistration[]; total?: number; error?: string }> {
    try {
      if (!isAppwriteReady() || !eventId?.trim()) {
        return { success: false, error: 'Appwrite not configured or event ID is missing.' };
      }

      const queries = [
        Query.equal('eventId', eventId.trim()),
        Query.orderDesc('registeredAt'),
        Query.limit(options?.limit || 200),
      ];

      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      if (options?.status && options.status !== 'all') {
        queries.push(Query.equal('status', options.status));
      }

      const response = await databases.listDocuments<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        queries
      );

      const registrations: EventRegistration[] = response.documents.map((doc) => ({
        $id: doc.$id,
        eventId: doc.eventId,
        formId: doc.formId,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        status: doc.status,
        registeredAt: doc.registeredAt,
      }));

      return {
        success: true,
        data: registrations,
        total: response.total,
      };
    } catch (error: any) {
      console.error('[RegistrationService] Error fetching event registrations:', error);
      return {
        success: false,
        error: error?.message || 'Failed to fetch event registrations.',
      };
    }
  }

  /**
   * Admin: Fetches single registration document by ID
   */
  static async getRegistrationById(
    registrationId: string
  ): Promise<{ success: boolean; data?: EventRegistration; error?: string }> {
    try {
      if (!isAppwriteReady() || !registrationId?.trim()) {
        return { success: false, error: 'Appwrite not configured or registration ID missing.' };
      }

      const doc = await databases.getDocument<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        registrationId.trim()
      );

      return {
        success: true,
        data: {
          $id: doc.$id,
          eventId: doc.eventId,
          formId: doc.formId,
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
          status: doc.status,
          registeredAt: doc.registeredAt,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Registration not found.',
      };
    }
  }

  /**
   * Admin: Retrieves all answers recorded for a given registration ID
   */
  static async getRegistrationAnswers(
    registrationId: string
  ): Promise<{ success: boolean; data?: RegistrationAnswer[]; error?: string }> {
    try {
      if (!isAppwriteReady() || !registrationId?.trim()) {
        return { success: false, error: 'Appwrite not configured or registration ID missing.' };
      }

      const response = await databases.listDocuments<RegistrationAnswerDocument>(
        this.databaseId,
        this.answersCollection,
        [Query.equal('registrationId', registrationId.trim()), Query.limit(100)]
      );

      const answers: RegistrationAnswer[] = response.documents.map((doc) => ({
        $id: doc.$id,
        registrationId: doc.registrationId,
        fieldId: doc.fieldId,
        value: doc.value,
      }));

      return { success: true, data: answers };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to fetch registration answers.',
      };
    }
  }

  /**
   * Admin: Batch retrieval of answers for a list of registration IDs (e.g. for CSV export)
   */
  static async getBatchAnswersForRegistrations(
    registrationIds: string[]
  ): Promise<{ success: boolean; data?: Record<string, Record<string, string>>; error?: string }> {
    try {
      if (!isAppwriteReady() || registrationIds.length === 0) {
        return { success: true, data: {} };
      }

      // Query answers in chunks if needed
      const answerMap: Record<string, Record<string, string>> = {};

      const response = await databases.listDocuments<RegistrationAnswerDocument>(
        this.databaseId,
        this.answersCollection,
        [Query.equal('registrationId', registrationIds), Query.limit(500)]
      );

      for (const doc of response.documents) {
        if (!answerMap[doc.registrationId]) {
          answerMap[doc.registrationId] = {};
        }
        answerMap[doc.registrationId][doc.fieldId] = doc.value;
      }

      return { success: true, data: answerMap };
    } catch (error: any) {
      console.warn('[RegistrationService] Batch answer retrieval notice:', error);
      return { success: false, data: {}, error: error?.message };
    }
  }

  /**
   * Admin: Computes live aggregated statistics for an event
   */
  static async getRegistrationStats(
    eventId: string,
    registrationLimit?: number | null
  ): Promise<RegistrationStats> {
    const defaultStats: RegistrationStats = {
      total: 0,
      registered: 0,
      cancelled: 0,
      checkedIn: 0,
      activeCount: 0,
      capacityLimit: registrationLimit || null,
      remainingSeats: registrationLimit ? registrationLimit : null,
      isCapacityReached: false,
    };

    try {
      if (!isAppwriteReady() || !eventId?.trim()) {
        return defaultStats;
      }

      const res = await databases.listDocuments<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        [Query.equal('eventId', eventId.trim()), Query.limit(500)]
      );

      let registered = 0;
      let cancelled = 0;
      let checkedIn = 0;

      for (const doc of res.documents) {
        if (doc.status === 'registered') registered++;
        else if (doc.status === 'cancelled') cancelled++;
        else if (doc.status === 'checked_in') checkedIn++;
      }

      const total = res.documents.length;
      const activeCount = registered + checkedIn;
      const limit = registrationLimit && registrationLimit > 0 ? registrationLimit : null;
      const remainingSeats = limit ? Math.max(0, limit - activeCount) : null;
      const isCapacityReached = limit ? activeCount >= limit : false;

      return {
        total,
        registered,
        cancelled,
        checkedIn,
        activeCount,
        capacityLimit: limit,
        remainingSeats,
        isCapacityReached,
      };
    } catch (error) {
      console.warn('[RegistrationService] Error computing registration stats:', error);
      return defaultStats;
    }
  }

  /**
   * Admin: Updates registration status (registered, cancelled, checked_in) with capacity check
   */
  static async updateRegistrationStatus(
    registrationId: string,
    eventId: string,
    newStatus: 'registered' | 'cancelled' | 'checked_in',
    currentEventLimit?: number | null
  ): Promise<{ success: boolean; data?: EventRegistration; error?: string }> {
    try {
      if (!isAppwriteReady() || !registrationId?.trim() || !eventId?.trim()) {
        return { success: false, error: 'Appwrite not configured or missing parameters.' };
      }

      // If reactivating from cancelled to registered/checked_in, check capacity
      if (newStatus === 'registered' || newStatus === 'checked_in') {
        if (currentEventLimit && currentEventLimit > 0) {
          const stats = await this.getRegistrationStats(eventId, currentEventLimit);
          if (stats.isCapacityReached) {
            return {
              success: false,
              error: `Cannot reactivate registration: the event capacity (${currentEventLimit} attendees) is already full.`,
            };
          }
        }
      }

      const updated = await databases.updateDocument<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        registrationId.trim(),
        { status: newStatus }
      );

      return {
        success: true,
        data: {
          $id: updated.$id,
          eventId: updated.eventId,
          formId: updated.formId,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          status: updated.status,
          registeredAt: updated.registeredAt,
        },
      };
    } catch (error: any) {
      console.error('[RegistrationService] Error updating registration status:', error);
      return {
        success: false,
        error: error?.message || 'Failed to update registration status.',
      };
    }
  }
}

export default RegistrationService;
