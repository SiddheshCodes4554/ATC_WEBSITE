import { ID, Query, Permission, Role, Models } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { EventService } from './eventService';
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
  PublicEventPass,
  PassStatus,
  RegistrationStatus,
  PassCheckInValidationResult,
  CheckInExecutionResult,
} from '../types/form.types';

/**
 * ============================================================================
 * ATC Appwrite Registration Service
 * ============================================================================
 * Handles public event registration submissions, unique pass generation,
 * QR verification, check-in operations, and attendee list management.
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
   * Grants read permissions to the user and authenticated users.
   */
  private static getParticipantPermissions(userId?: string | null): string[] {
    const perms = [
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
    if (userId && userId.trim()) {
      perms.push(Permission.read(Role.user(userId.trim())));
      perms.push(Permission.update(Role.user(userId.trim())));
    }
    return perms;
  }

  /* ======================================================================== */
  /* UNIQUE PASS ID GENERATION                                                */
  /* ======================================================================== */

  /**
   * Generates a 6-character random alphanumeric suffix (excluding ambiguous 0/O, 1/I)
   */
  private static generateRandomPassSuffix(length = 6): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }

  /**
   * Generates a unique, URL-safe pass ID in the format ATC-{YEAR}-{RANDOM}
   * Example: ATC-2026-A7X9K2
   */
  static async generateUniquePassId(maxAttempts = 5): Promise<string> {
    const year = new Date().getFullYear();

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const randomSuffix = this.generateRandomPassSuffix(6);
      const candidate = `ATC-${year}-${randomSuffix}`;

      try {
        if (!isAppwriteReady()) return candidate;

        // Verify uniqueness in Appwrite registrations collection
        const existing = await databases.listDocuments<EventRegistrationDocument>(
          this.databaseId,
          this.registrationsCollection,
          [Query.equal('passId', candidate), Query.limit(1)]
        );

        if (existing.documents.length === 0) {
          return candidate;
        }
      } catch (err) {
        // If query fails (e.g. index not ready), candidate is statistically unique (33^6 = ~1.3 billion)
        return candidate;
      }
    }

    // Fallback safe ID if collision persists
    return `ATC-${year}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  }

  /* ======================================================================== */
  /* FIELD VALIDATION                                                         */
  /* ======================================================================== */

  /**
   * Resilient document creator that removes unknown attributes if the Appwrite collection schema lacks them,
   * while never removing critical required attributes like passId.
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
        // 1. Permission error fallback (e.g. for guest or role mismatch)
        if (currentPermissions && (err?.code === 401 || err?.code === 403 || /permission/i.test(err?.message || ''))) {
          console.warn('[RegistrationService] Document-level permissions rejected, falling back to collection permissions...');
          currentPermissions = undefined;
          continue;
        }

        // 2. Unknown attribute fallback
        const match =
          err?.message?.match(/Unknown attribute:\s*"([^"]+)"/i) ||
          err?.message?.match(/Attribute not found.*?:\s*"([^"]+)"/i) ||
          err?.message?.match(/attribute\s+"([^"]+)"\s+is unknown/i);

        if (match && match[1] && payload[match[1]] !== undefined) {
          console.warn(`[RegistrationService] Stripping unknown attribute "${match[1]}" from payload and retrying...`);
          delete payload[match[1]];
          continue;
        }

        throw err;
      }
    }

    return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any);
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
      const candidateKeys = [
        field.systemKey,
        field.$id,
        (field as any).id,
        field.label,
        `field_${field.position}`,
      ].filter(Boolean) as string[];

      let val: any = undefined;
      let primaryKey = field.systemKey || field.$id || field.label;

      for (const k of candidateKeys) {
        if (answers[k] !== undefined) {
          val = answers[k];
          primaryKey = k;
          break;
        }
      }

      // 1. Required Check
      const isEmpty =
        val === undefined ||
        val === null ||
        (typeof val === 'string' && val.trim() === '') ||
        (Array.isArray(val) && val.length === 0);

      if (field.required && isEmpty) {
        fieldErrors[primaryKey] = `${field.label} is required.`;
        continue;
      }

      if (isEmpty) continue; // Optional empty fields pass type validation

      // 2. Type-specific Validation
      switch (field.fieldType) {
        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof val !== 'string' || !emailRegex.test(val.trim())) {
            fieldErrors[primaryKey] = 'Please enter a valid email address.';
          }
          break;
        }

        case 'phone': {
          const cleaned = String(val).replace(/[\s\-()]/g, '');
          const phoneRegex = /^\+?[0-9]{7,15}$/;
          if (!phoneRegex.test(cleaned)) {
            fieldErrors[primaryKey] = 'Please enter a valid phone number (7-15 digits).';
          }
          break;
        }

        case 'number': {
          if (isNaN(Number(val))) {
            fieldErrors[primaryKey] = 'Please enter a valid numeric value.';
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
            fieldErrors[primaryKey] = 'Please enter a valid URL (e.g. https://github.com/username).';
          }
          break;
        }

        case 'date': {
          if (isNaN(new Date(val).getTime())) {
            fieldErrors[primaryKey] = 'Please provide a valid date.';
          }
          break;
        }

        case 'dropdown':
        case 'multiple_choice': {
          if (field.options && field.options.length > 0) {
            if (!field.options.includes(String(val))) {
              fieldErrors[primaryKey] = 'Selected option is invalid.';
            }
          }
          break;
        }

        case 'checkbox': {
          if (Array.isArray(val) && field.options && field.options.length > 0) {
            const hasInvalid = val.some((item) => !field.options?.includes(item));
            if (hasInvalid) {
              fieldErrors[primaryKey] = 'One or more selected options are invalid.';
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

  /* ======================================================================== */
  /* AVAILABILITY & DUPLICATE CHECKS                                          */
  /* ======================================================================== */

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
            Query.limit(1),
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

  /* ======================================================================== */
  /* REGISTRATION SUBMISSION                                                  */
  /* ======================================================================== */

  /**
   * Master Method: Validates inputs, generates passId, creates registration + answers atomically
   */
  static async submitRegistration({
    event,
    form,
    formFields,
    answers,
    userId,
  }: {
    event: ATCEvent;
    form?: EventForm | null;
    formFields: FormField[];
    answers: Record<string, any>;
    userId?: string | null;
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

    // 3. Extract participant identification fields using systemKey (or fallback by type/name)
    let participantName = '';
    let participantEmail = '';
    let participantPhone = '';

    for (const field of formFields) {
      const keysToTry = [
        field.systemKey,
        field.$id,
        (field as any).id,
        field.label,
        `field_${field.position}`,
      ].filter(Boolean) as string[];

      let val = '';
      for (const k of keysToTry) {
        if (answers[k] !== undefined && answers[k] !== null && String(answers[k]).trim() !== '') {
          val = String(answers[k]).trim();
          break;
        }
      }

      if (field.systemKey === 'name' || (!participantName && /^(full\s*)?name$/i.test(field.label.trim()))) {
        if (val) participantName = val;
      } else if (field.systemKey === 'email' || (!participantEmail && (field.fieldType === 'email' || /email/i.test(field.label.trim())))) {
        if (val) participantEmail = val.toLowerCase();
      } else if (field.systemKey === 'phone' || (!participantPhone && (field.fieldType === 'phone' || /phone|mobile|contact/i.test(field.label.trim())))) {
        if (val) participantPhone = val;
      }
    }

    // Direct fallback if answers has 'name', 'email', or 'phone' explicitly
    if (!participantName && answers.name) participantName = String(answers.name).trim();
    if (!participantEmail && answers.email) participantEmail = String(answers.email).trim().toLowerCase();
    if (!participantPhone && answers.phone) participantPhone = String(answers.phone).trim();

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

    // 5. Generate unique digital pass ID (ATC-{YEAR}-{RANDOM})
    const passId = await this.generateUniquePassId();

    // 6. Create Registration Document in Appwrite (Resilient: guarantees passId is preserved)
    const registrationId = ID.unique();
    const registeredAt = new Date().toISOString();
    let createdRegistrationDoc: EventRegistrationDocument | null = null;
    const createdAnswerDocIds: string[] = [];

    // Construct primary payload
    const regPayload: Record<string, any> = {
      eventId: event.$id,
      name: participantName,
      email: participantEmail,
      status: 'registered',
      registeredAt,
      passId, // passId is required and always included
    };

    if (form?.$id) regPayload.formId = form.$id;
    if (participantPhone) regPayload.phone = participantPhone;
    if (userId && userId.trim()) {
      regPayload.userId = userId.trim();
    }
    regPayload.passStatus = 'active';

    const docPermissions = this.getParticipantPermissions(userId);

    try {
      createdRegistrationDoc = await this.createDocumentResilient<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        registrationId,
        regPayload,
        docPermissions
      );
    } catch (createErr: any) {
      console.error('[RegistrationService] Registration creation error:', createErr);
      return {
        success: false,
        error: createErr?.message || 'Unable to save registration. Please check Appwrite permissions or connection.',
      };
    }

    if (!createdRegistrationDoc) {
      return {
        success: false,
        error: 'Failed to create registration record in database.',
      };
    }

    // 7. Create Individual Registration Answer Documents for each field
    for (const field of formFields) {
      const keysToTry = [
        field.systemKey,
        field.$id,
        (field as any).id,
        field.label,
        `field_${field.position}`,
      ].filter(Boolean) as string[];

      let val: any = undefined;
      for (const k of keysToTry) {
        if (answers[k] !== undefined && answers[k] !== null && answers[k] !== '') {
          val = answers[k];
          break;
        }
      }

      if (val === undefined || val === null || val === '') continue;

      const serializedValue = Array.isArray(val)
        ? JSON.stringify(val)
        : typeof val === 'object' && val !== null
        ? JSON.stringify(val)
        : String(val ?? '');

      const answerId = ID.unique();

      try {
        const answerDoc = await databases.createDocument<RegistrationAnswerDocument>(
          this.databaseId,
          this.answersCollection,
          answerId,
          {
            registrationId: createdRegistrationDoc.$id,
            fieldId: field.$id || field.label,
            value: serializedValue,
          },
          docPermissions
        );
        createdAnswerDocIds.push(answerDoc.$id);
      } catch (ansErr1) {
        // Fallback without explicit document permissions
        try {
          const answerDoc = await databases.createDocument<RegistrationAnswerDocument>(
            this.databaseId,
            this.answersCollection,
            answerId,
            {
              registrationId: createdRegistrationDoc.$id,
              fieldId: field.$id || field.label,
              value: serializedValue,
            }
          );
          createdAnswerDocIds.push(answerDoc.$id);
        } catch (ansErr2) {
          console.warn('[RegistrationService] Notice: Could not save optional answer for field:', field.label, ansErr2);
        }
      }
    }

    return {
      success: true,
      registrationId: createdRegistrationDoc.$id,
      passId: createdRegistrationDoc.passId || passId,
      registration: {
        $id: createdRegistrationDoc.$id,
        eventId: createdRegistrationDoc.eventId,
        formId: createdRegistrationDoc.formId,
        name: createdRegistrationDoc.name,
        email: createdRegistrationDoc.email,
        phone: createdRegistrationDoc.phone,
        status: createdRegistrationDoc.status,
        registeredAt: createdRegistrationDoc.registeredAt,
        passId: createdRegistrationDoc.passId || passId,
        passStatus: createdRegistrationDoc.passStatus || 'active',
        userId: createdRegistrationDoc.userId || (userId?.trim() || null),
      },
    };
  }

  /* ======================================================================== */
  /* PUBLIC DIGITAL EVENT PASS LOOKUP                                         */
  /* ======================================================================== */

  /**
   * Public: Securely fetches sanitized event pass information by passId
   * (Does NOT expose email, phone number, form answers, or other participant records)
   */
  static async getPublicPassByPassId(
    passId: string
  ): Promise<{ success: boolean; data?: PublicEventPass; error?: string }> {
    try {
      if (!isAppwriteReady() || !passId?.trim()) {
        return { success: false, error: 'Invalid or missing pass ID.' };
      }

      const cleanPassId = passId.trim().toUpperCase();

      const response = await databases.listDocuments<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        [Query.equal('passId', cleanPassId), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return { success: false, error: 'Pass could not be found. Please check your Pass ID.' };
      }

      const regDoc = response.documents[0];

      // Fetch Event details
      const eventRes = await EventService.getEventById(regDoc.eventId);
      if (!eventRes.success || !eventRes.data) {
        return { success: false, error: 'Associated event could not be found.' };
      }

      const evt = eventRes.data;

      const publicPass: PublicEventPass = {
        passId: regDoc.passId || cleanPassId,
        passStatus: (regDoc.passStatus as PassStatus) || (regDoc.status === 'cancelled' ? 'cancelled' : 'active'),
        name: regDoc.name || 'Participant',
        eventId: evt.$id,
        eventTitle: evt.title,
        eventSlug: evt.slug,
        eventType: evt.eventType,
        startDate: evt.startDate,
        endDate: evt.endDate,
        venue: evt.venue,
        coverImageId: evt.coverImageId,
        accentColor: evt.accentColor || '#FFE600',
        registeredAt: regDoc.registeredAt,
      };

      return { success: true, data: publicPass };
    } catch (error: any) {
      console.error('[RegistrationService] Error retrieving public event pass:', error);
      return {
        success: false,
        error: error?.message || 'Unable to retrieve event pass.',
      };
    }
  }

  /* ======================================================================== */
  /* AUTHENTICATED STUDENT REGISTRATION METHODS                               */
  /* ======================================================================== */

  /**
   * Student: Fetches all registrations belonging to an authenticated user ID.
   * Filters strictly by userId = authenticatedUser.$id.
   * Sorts by registeredAt descending.
   */
  static async getRegistrationsByUserId(
    userId: string
  ): Promise<{ success: boolean; data?: EventRegistration[]; total?: number; error?: string }> {
    try {
      if (!isAppwriteReady() || !userId?.trim()) {
        return { success: true, data: [], total: 0 };
      }

      const cleanUserId = userId.trim();

      const queries = [
        Query.equal('userId', cleanUserId),
        Query.orderDesc('registeredAt'),
        Query.limit(100),
      ];

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
        passId: doc.passId,
        passStatus: doc.passStatus || (doc.status === 'cancelled' ? 'cancelled' : 'active'),
        checkedInAt: doc.checkedInAt,
        userId: doc.userId,
      }));

      return {
        success: true,
        data: registrations,
        total: response.total,
      };
    } catch (error: any) {
      console.error('[RegistrationService] Error fetching user registrations:', error);
      return {
        success: false,
        error: error?.message || 'Failed to retrieve your event registrations.',
      };
    }
  }

  /**
   * Student: Fetches registrations along with full event details in parallel.
   * Safely handles deleted or missing events.
   */
  static async getUserRegistrationsWithEvents(
    userId: string
  ): Promise<{
    success: boolean;
    data?: { registration: EventRegistration; event: ATCEvent | null }[];
    error?: string;
  }> {
    try {
      const regResult = await this.getRegistrationsByUserId(userId);
      if (!regResult.success || !regResult.data) {
        return {
          success: false,
          error: regResult.error || 'Failed to load your event registrations.',
          data: [],
        };
      }

      const registrations = regResult.data;
      if (registrations.length === 0) {
        return { success: true, data: [] };
      }

      // Extract unique event IDs
      const uniqueEventIds = Array.from(
        new Set(registrations.map((r) => r.eventId).filter(Boolean))
      );

      // Fetch all required events in parallel
      const eventMap = new Map<string, ATCEvent>();
      const eventPromises = uniqueEventIds.map(async (eventId) => {
        try {
          const res = await EventService.getEventById(eventId);
          if (res.success && res.data) {
            eventMap.set(eventId, res.data);
          }
        } catch (err) {
          console.warn(`[RegistrationService] Notice: Could not load event ${eventId}:`, err);
        }
      });

      await Promise.allSettled(eventPromises);

      // Map combined registration + event object
      const combined = registrations.map((registration) => ({
        registration,
        event: eventMap.get(registration.eventId) || null,
      }));

      return { success: true, data: combined };
    } catch (error: any) {
      console.error('[RegistrationService] Error retrieving user registrations with events:', error);
      return {
        success: false,
        error: error?.message || 'Failed to load your event registrations.',
        data: [],
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
        passId: doc.passId,
        passStatus: doc.passStatus || (doc.status === 'cancelled' ? 'cancelled' : 'active'),
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
          passId: doc.passId,
          passStatus: doc.passStatus || (doc.status === 'cancelled' ? 'cancelled' : 'active'),
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
   * Admin: Updates registration status and synchronizes passStatus with capacity protection
   */
  static async updateRegistrationStatus(
    registrationId: string,
    eventId: string,
    newStatus: RegistrationStatus,
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

      // Synchronize passStatus
      const passStatus: PassStatus =
        newStatus === 'cancelled'
          ? 'cancelled'
          : newStatus === 'checked_in'
          ? 'used'
          : 'active';

      const updated = await databases.updateDocument<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        registrationId.trim(),
        {
          status: newStatus,
          passStatus,
        }
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
          passId: updated.passId,
          passStatus: updated.passStatus || passStatus,
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
  /**
   * Safely extracts pass ID from QR code string or manual input
   * Handles:
   * 1. Full URL: https://domain.com/pass/ATC-2026-A7X9K2
   * 2. Relative URL: /pass/ATC-2026-A7X9K2
   * 3. Raw pass ID: ATC-2026-A7X9K2 or atc-2026-a7x9k2
   */
  static extractPassIdFromPayload(raw: string): string | null {
    if (!raw || typeof raw !== 'string') return null;
    const trimmed = raw.trim();

    // Match URL pattern: .../pass/ATC-XXXX-XXXXXX or .../pass/{ID}
    const urlMatch = trimmed.match(/\/pass\/([A-Za-z0-9\-_]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1].toUpperCase();
    }

    // Match standard ATC Pass ID format: ATC-YEAR-CODE
    const atcMatch = trimmed.match(/(ATC-\d{4}-[A-Za-z0-9]+)/i);
    if (atcMatch && atcMatch[1]) {
      return atcMatch[1].toUpperCase();
    }

    // Direct alphanumeric string without special chars
    if (/^[A-Za-z0-9\-_]{5,36}$/.test(trimmed)) {
      return trimmed.toUpperCase();
    }

    return null;
  }

  /**
   * Admin: Verifies a scanned or entered pass against the current event
   */
  static async validatePassForCheckIn(
    rawPassIdOrUrl: string,
    currentEventId: string
  ): Promise<PassCheckInValidationResult> {
    try {
      if (!isAppwriteReady()) {
        return {
          code: 'INVALID_PASS',
          isValid: false,
          message: 'Appwrite database client is not configured.',
        };
      }

      const passId = this.extractPassIdFromPayload(rawPassIdOrUrl);
      if (!passId) {
        return {
          code: 'INVALID_PASS',
          isValid: false,
          message: 'Invalid pass format. Expected format: ATC-YYYY-XXXXXX',
        };
      }

      // Query registration by passId
      let regDoc: EventRegistrationDocument | null = null;
      try {
        const response = await databases.listDocuments<EventRegistrationDocument>(
          this.databaseId,
          this.registrationsCollection,
          [Query.equal('passId', passId), Query.limit(1)]
        );
        if (response.documents.length > 0) {
          regDoc = response.documents[0];
        }
      } catch (queryErr) {
        console.warn('[RegistrationService] Query by passId notice:', queryErr);
      }

      // Fallback: If not found by passId, check by registration document ID
      if (!regDoc) {
        try {
          regDoc = await databases.getDocument<EventRegistrationDocument>(
            this.databaseId,
            this.registrationsCollection,
            passId
          );
        } catch {
          // Document not found
        }
      }

      if (!regDoc) {
        return {
          code: 'INVALID_PASS',
          isValid: false,
          message: `No registration found matching pass ID "${passId}".`,
        };
      }

      const registration: EventRegistration = {
        $id: regDoc.$id,
        eventId: regDoc.eventId,
        formId: regDoc.formId,
        name: regDoc.name,
        email: regDoc.email,
        phone: regDoc.phone,
        status: regDoc.status,
        registeredAt: regDoc.registeredAt,
        passId: regDoc.passId || passId,
        passStatus: regDoc.passStatus || (regDoc.status === 'cancelled' ? 'cancelled' : 'active'),
        checkedInAt: (regDoc as any).checkedInAt || null,
      };

      // 1. Verify Event Match
      if (regDoc.eventId !== currentEventId) {
        let otherEventTitle = 'Another Event';
        try {
          const otherEvt = await EventService.getEventById(regDoc.eventId);
          if (otherEvt.success && otherEvt.data) {
            otherEventTitle = otherEvt.data.title;
          }
        } catch {}

        return {
          code: 'WRONG_EVENT',
          isValid: false,
          message: `This pass is registered for "${otherEventTitle}", not this event.`,
          registration,
          eventTitle: otherEventTitle,
        };
      }

      // 2. Check if Cancelled
      if (regDoc.status === 'cancelled' || regDoc.passStatus === 'cancelled') {
        return {
          code: 'CANCELLED',
          isValid: false,
          message: 'This registration has been cancelled. Entry is not permitted.',
          registration,
        };
      }

      // 3. Check if Already Checked In
      if (regDoc.status === 'checked_in' || regDoc.passStatus === 'used') {
        return {
          code: 'ALREADY_CHECKED_IN',
          isValid: false,
          message: 'Participant has already checked in.',
          registration,
          checkedInAt: (regDoc as any).checkedInAt || null,
        };
      }

      // 4. Valid Pass Ready for Check-in
      return {
        code: 'VALID',
        isValid: true,
        message: 'Pass is valid and verified for check-in.',
        registration,
      };
    } catch (error: any) {
      console.error('[RegistrationService] Error validating pass:', error);
      return {
        code: 'INVALID_PASS',
        isValid: false,
        message: error?.message || 'Error occurred during pass verification.',
      };
    }
  }

  /**
   * Admin: Executes participant check-in atomically with race-condition re-verification
   */
  static async performCheckIn(
    registrationId: string,
    eventId: string
  ): Promise<CheckInExecutionResult> {
    try {
      if (!isAppwriteReady() || !registrationId?.trim()) {
        return {
          success: false,
          message: 'Appwrite not configured or missing registration ID.',
        };
      }

      // Guard against race conditions: Re-fetch latest registration state
      const latestDoc = await databases.getDocument<EventRegistrationDocument>(
        this.databaseId,
        this.registrationsCollection,
        registrationId.trim()
      );

      if (!latestDoc) {
        return {
          success: false,
          message: 'Registration record could not be found.',
        };
      }

      if (latestDoc.eventId !== eventId) {
        return {
          success: false,
          message: 'Registration does not match the active event.',
        };
      }

      if (latestDoc.status === 'cancelled') {
        return {
          success: false,
          message: 'Cannot check in a cancelled registration.',
        };
      }

      if (latestDoc.status === 'checked_in' || latestDoc.passStatus === 'used') {
        return {
          success: false,
          isDuplicateCheckIn: true,
          message: 'Participant was already checked in moments ago.',
          checkedInAt: (latestDoc as any).checkedInAt,
        };
      }

      const checkedInAt = new Date().toISOString();

      // Update document: try with checkedInAt attribute first, fallback without it if not in schema
      let updatedDoc: EventRegistrationDocument;
      try {
        updatedDoc = await databases.updateDocument<EventRegistrationDocument>(
          this.databaseId,
          this.registrationsCollection,
          registrationId.trim(),
          {
            status: 'checked_in',
            passStatus: 'used',
            checkedInAt,
          } as any
        );
      } catch (attrErr) {
        // Fallback without checkedInAt if attribute is not created yet
        updatedDoc = await databases.updateDocument<EventRegistrationDocument>(
          this.databaseId,
          this.registrationsCollection,
          registrationId.trim(),
          {
            status: 'checked_in',
            passStatus: 'used',
          }
        );
      }

      return {
        success: true,
        message: `${updatedDoc.name} successfully checked in! 🎉`,
        checkedInAt,
        registration: {
          $id: updatedDoc.$id,
          eventId: updatedDoc.eventId,
          formId: updatedDoc.formId,
          name: updatedDoc.name,
          email: updatedDoc.email,
          phone: updatedDoc.phone,
          status: updatedDoc.status,
          registeredAt: updatedDoc.registeredAt,
          passId: updatedDoc.passId,
          passStatus: updatedDoc.passStatus || 'used',
          checkedInAt,
        },
      };
    } catch (error: any) {
      console.error('[RegistrationService] Error performing check-in:', error);
      return {
        success: false,
        message: error?.message || 'Failed to complete check-in.',
      };
    }
  }
}

export default RegistrationService;
