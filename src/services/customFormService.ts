import { ID, Query, Permission, Role, Models } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { AuthService } from './authService';
import { ServiceResponse } from '../types/appwrite.types';
import {
  FormStatus,
  FormFieldType,
  FormSettings,
  DEFAULT_FORM_SETTINGS,
  FormFieldDefinition,
  CustomForm,
  CustomFormResponse,
  CustomFormDocument,
  CustomFormResponseDocument,
  CreateCustomFormInput,
  UpdateCustomFormInput,
  CreateFormResponseInput,
  FormValidationResult,
} from '../types/customForm.types';

/**
 * ============================================================================
 * ATC Custom Form Service
 * ============================================================================
 * Handles form creation, editing, publishing, field schema serialization,
 * public validation & anonymous submissions, response tracking, and analytics.
 */
export class CustomFormService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get formsCollectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.CUSTOM_FORMS;
  }

  private static get responsesCollectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.CUSTOM_FORM_RESPONSES;
  }

  /* ======================================================================== */
  /* ADMIN AUTHORIZATION HELPER                                               */
  /* ======================================================================== */

  /**
   * Verifies if current active session belongs to an authorized ATC administrator
   */
  public static async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const user = await AuthService.getCurrentUser();
      return AuthService.isAdminUser(user);
    } catch {
      return false;
    }
  }

  /* ======================================================================== */
  /* SAFE JSON PARSERS & DOCUMENT MAPPERS                                     */
  /* ======================================================================== */

  /**
   * Safely parses JSON string to FormFieldDefinition[] with validation
   */
  public static parseFieldsJson(jsonStr?: string): FormFieldDefinition[] {
    if (!jsonStr || typeof jsonStr !== 'string') return [];
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item, index) => ({
          id: item.id || `field_${index + 1}`,
          type: (item.type || 'text') as FormFieldType,
          label: item.label || 'Untitled Question',
          description: item.description || '',
          placeholder: item.placeholder || '',
          required: Boolean(item.required),
          options: Array.isArray(item.options) ? item.options : [],
          order: typeof item.order === 'number' ? item.order : index,
          min: item.min,
          max: item.max,
          minRating: item.minRating,
          maxRating: item.maxRating,
          acceptedTypes: Array.isArray(item.acceptedTypes) ? item.acceptedTypes : undefined,
          maxSize: item.maxSize,
        }));
      }
      return [];
    } catch (err) {
      console.warn('[CustomFormService] Malformed fields JSON detected:', err);
      return [];
    }
  }

  /**
   * Safely parses JSON string to FormSettings with default fallback
   */
  public static parseSettingsJson(jsonStr?: string): FormSettings {
    if (!jsonStr || typeof jsonStr !== 'string') return { ...DEFAULT_FORM_SETTINGS };
    try {
      const parsed = JSON.parse(jsonStr);
      return {
        requireLogin: Boolean(parsed.requireLogin),
        allowMultipleResponses:
          parsed.allowMultipleResponses !== undefined
            ? Boolean(parsed.allowMultipleResponses)
            : DEFAULT_FORM_SETTINGS.allowMultipleResponses,
        collectEmail:
          parsed.collectEmail !== undefined
            ? Boolean(parsed.collectEmail)
            : DEFAULT_FORM_SETTINGS.collectEmail,
        successMessage:
          typeof parsed.successMessage === 'string' && parsed.successMessage.trim()
            ? parsed.successMessage.trim()
            : DEFAULT_FORM_SETTINGS.successMessage,
        ...parsed,
      };
    } catch (err) {
      console.warn('[CustomFormService] Malformed settings JSON detected:', err);
      return { ...DEFAULT_FORM_SETTINGS };
    }
  }

  /**
   * Safely parses JSON string to Record<string, unknown>
   */
  public static parseAnswersJson(jsonStr?: string): Record<string, unknown> {
    if (!jsonStr || typeof jsonStr !== 'string') return {};
    try {
      const parsed = JSON.parse(jsonStr);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (err) {
      console.warn('[CustomFormService] Malformed answers JSON detected:', err);
      return {};
    }
  }

  /**
   * Converts Appwrite document into clean, application-level CustomForm
   */
  public static mapDocumentToForm(doc: Models.Document): CustomForm {
    const raw = doc as unknown as CustomFormDocument;
    return {
      id: raw.$id,
      title: raw.title || 'Untitled Form',
      slug: raw.slug || raw.$id,
      description: raw.description || '',
      status: (raw.status as FormStatus) || 'draft',
      fields: this.parseFieldsJson(raw.fields),
      settings: this.parseSettingsJson(raw.settings),
      coverImageId: raw.coverImageId || '',
      responseCount: typeof raw.responseCount === 'number' ? raw.responseCount : 0,
      createdBy: raw.createdBy || '',
      createdAt: raw.$createdAt,
      updatedAt: raw.$updatedAt,
    };
  }

  /**
   * Converts Appwrite document into clean, application-level CustomFormResponse
   */
  public static mapDocumentToResponse(doc: Models.Document): CustomFormResponse {
    const raw = doc as unknown as CustomFormResponseDocument;
    return {
      id: raw.$id,
      formId: raw.formId,
      formSlug: raw.formSlug || '',
      userId: raw.userId || undefined,
      respondentEmail: raw.respondentEmail || undefined,
      answers: this.parseAnswersJson(raw.answers),
      submittedAt: raw.submittedAt || raw.$createdAt,
      createdAt: raw.$createdAt,
      updatedAt: raw.$updatedAt,
    };
  }

  /* ======================================================================== */
  /* SLUG GENERATION & UNIQUENESS UTILITIES                                   */
  /* ======================================================================== */

  /**
   * Generates a clean, URL-friendly slug from a title
   */
  public static generateSlug(title: string): string {
    if (!title || typeof title !== 'string') {
      return `form-${Date.now().toString(36)}`;
    }
    const clean = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return clean || `form-${Date.now().toString(36)}`;
  }

  /**
   * Checks slug uniqueness in Appwrite and generates an indexed suffix if collision occurs
   */
  public static async ensureUniqueSlug(
    baseSlug: string,
    currentFormId?: string
  ): Promise<string> {
    const cleanBase = this.generateSlug(baseSlug);
    let candidate = cleanBase;
    let attempt = 1;

    while (attempt <= 20) {
      try {
        const res = await databases.listDocuments(this.databaseId, this.formsCollectionId, [
          Query.equal('slug', candidate),
          Query.limit(2),
        ]);

        // If no match found or matched document is the current form itself, slug is valid
        if (
          res.documents.length === 0 ||
          (res.documents.length === 1 && currentFormId && res.documents[0].$id === currentFormId)
        ) {
          return candidate;
        }

        attempt++;
        candidate = `${cleanBase}-${attempt}`;
      } catch {
        // If collection or index is not ready, return candidate
        return candidate;
      }
    }

    return `${cleanBase}-${Date.now().toString(36)}`;
  }

  /* ======================================================================== */
  /* VALIDATION UTILITIES                                                     */
  /* ======================================================================== */

  /**
   * Validates form schema definition before saving/publishing
   */
  public static validateFormDefinition(
    form: Partial<CreateCustomFormInput | CustomForm>
  ): FormValidationResult {
    const errors: Record<string, string> = {};

    if (!form.title || !form.title.trim()) {
      errors.title = 'Form title is required.';
    } else if (form.title.trim().length > 255) {
      errors.title = 'Form title cannot exceed 255 characters.';
    }

    if (form.fields && Array.isArray(form.fields)) {
      form.fields.forEach((field, idx) => {
        if (!field.label || !field.label.trim()) {
          errors[`field_${field.id || idx}_label`] = `Question #${idx + 1} requires a label.`;
        }

        if (['select', 'radio', 'checkbox'].includes(field.type)) {
          if (!field.options || field.options.length === 0) {
            errors[`field_${field.id || idx}_options`] = `Question "${field.label || idx + 1}" requires at least one option.`;
          }
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validates submitted answers against the form's dynamic field definitions.
   * Performs deep type-checking, option verification, length constraints, and required checks.
   */
  public static validateResponse(
    form: CustomForm,
    answers: Record<string, unknown>,
    userContext?: { userId?: string; email?: string }
  ): FormValidationResult {
    const errors: Record<string, string> = {};

    // 1. Check form login requirement
    if (form.settings?.requireLogin && !userContext?.userId) {
      errors._general = 'You must be logged in to submit this form.';
      return { isValid: false, errors };
    }

    // 2. Validate each configured field
    for (const field of form.fields || []) {
      const val = answers[field.id];
      const isNullOrUndefined = val === undefined || val === null;
      const isWhitespaceString = typeof val === 'string' && val.trim() === '';
      const isEmptyArray = Array.isArray(val) && val.length === 0;
      const isProvided = !isNullOrUndefined && !isWhitespaceString && !isEmptyArray;

      // Check required constraint
      if (field.required && !isProvided) {
        errors[field.id] = `"${field.label}" is required.`;
        continue;
      }

      // If optional and not provided, continue to next field
      if (!isProvided) continue;

      // Type-specific validation
      switch (field.type) {
        case 'text': {
          if (typeof val !== 'string' && typeof val !== 'number') {
            errors[field.id] = 'Invalid text format.';
          } else if (String(val).length > 5000) {
            errors[field.id] = 'Text response cannot exceed 5,000 characters.';
          }
          break;
        }

        case 'textarea': {
          if (typeof val !== 'string' && typeof val !== 'number') {
            errors[field.id] = 'Invalid text format.';
          } else if (String(val).length > 10000) {
            errors[field.id] = 'Detailed response cannot exceed 10,000 characters.';
          }
          break;
        }

        case 'email': {
          const emailStr = String(val).trim().toLowerCase();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailStr.length > 255 || !emailRegex.test(emailStr)) {
            errors[field.id] = 'Please enter a valid email address.';
          }
          break;
        }

        case 'number': {
          const num = Number(val);
          if (isNaN(num) || !Number.isFinite(num)) {
            errors[field.id] = 'Please enter a valid number.';
          } else {
            if (field.min !== undefined && num < field.min) {
              errors[field.id] = `Value must be at least ${field.min}.`;
            }
            if (field.max !== undefined && num > field.max) {
              errors[field.id] = `Value cannot exceed ${field.max}.`;
            }
          }
          break;
        }

        case 'url': {
          const urlStr = String(val).trim();
          if (urlStr.length > 2048) {
            errors[field.id] = 'URL is too long.';
          } else {
            try {
              const parsed = new URL(urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`);
              if (!parsed.hostname || !parsed.hostname.includes('.')) {
                errors[field.id] = 'Please enter a valid website URL (e.g., https://example.com).';
              }
            } catch {
              errors[field.id] = 'Please enter a valid website URL.';
            }
          }
          break;
        }

        case 'phone': {
          const rawPhone = String(val).trim();
          const digitsOnly = rawPhone.replace(/[\s\-().+]/g, '');
          if (digitsOnly.length < 7 || digitsOnly.length > 15 || !/^[0-9]+$/.test(digitsOnly)) {
            errors[field.id] = 'Please enter a valid phone number (7–15 digits).';
          }
          break;
        }

        case 'select':
        case 'radio': {
          const selectedOption = String(val);
          if (field.options && field.options.length > 0) {
            if (!field.options.includes(selectedOption)) {
              errors[field.id] = 'Selected option is not valid.';
            }
          }
          break;
        }

        case 'checkbox': {
          if (!Array.isArray(val)) {
            errors[field.id] = 'Please select valid choices.';
          } else if (field.options && field.options.length > 0) {
            const hasInvalidOption = val.some((v) => !field.options?.includes(String(v)));
            if (hasInvalidOption) {
              errors[field.id] = 'One or more selected choices are invalid.';
            }
          }
          break;
        }

        case 'date': {
          const dateStr = String(val).trim();
          const timestamp = Date.parse(dateStr);
          if (isNaN(timestamp)) {
            errors[field.id] = 'Please provide a valid date.';
          }
          break;
        }

        case 'time': {
          const timeStr = String(val).trim();
          // Verify format HH:MM or HH:MM:SS
          if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(timeStr)) {
            errors[field.id] = 'Please provide a valid time format (HH:MM).';
          }
          break;
        }

        case 'rating': {
          const ratingVal = Number(val);
          const minR = field.minRating ?? 1;
          const maxR = field.maxRating ?? 5;
          if (
            isNaN(ratingVal) ||
            !Number.isInteger(ratingVal) ||
            ratingVal < minR ||
            ratingVal > maxR
          ) {
            errors[field.id] = `Rating must be an integer between ${minR} and ${maxR}.`;
          }
          break;
        }

        case 'file': {
          // File support check for current phase (Phase 9 implements full file upload)
          if (typeof val !== 'string') {
            errors[field.id] = 'Invalid file reference.';
          }
          break;
        }

        default:
          break;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /* ======================================================================== */
  /* FORMS CRUD OPERATIONS                                                    */
  /* ======================================================================== */

  /**
   * Admin: Creates a new custom form
   */
  public static async createForm(
    input: CreateCustomFormInput
  ): Promise<ServiceResponse<CustomForm>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { success: false, error: 'Unauthorized. Admin session required.', statusCode: 403 };
      }

      // 1. Validate form schema
      const validation = this.validateFormDefinition(input);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0] || 'Invalid form input.';
        return { success: false, error: firstError };
      }

      // 2. Ensure unique slug
      const slug = await this.ensureUniqueSlug(input.slug || input.title);

      // 3. Serialize fields & settings
      const fieldsJson = JSON.stringify(input.fields || []);
      const settingsJson = JSON.stringify({
        ...DEFAULT_FORM_SETTINGS,
        ...(input.settings || {}),
      });

      const user = await AuthService.getCurrentUser();
      const documentId = ID.unique();

      const payload: Record<string, unknown> = {
        title: input.title.trim(),
        slug,
        description: input.description?.trim() || '',
        status: input.status || 'draft',
        fields: fieldsJson,
        settings: settingsJson,
        responseCount: 0,
        createdBy: user?.$id || input.createdBy || '',
      };

      if (input.coverImageId && input.coverImageId.trim()) {
        payload.coverImageId = input.coverImageId.trim();
      }

      const doc = await databases.createDocument(
        this.databaseId,
        this.formsCollectionId,
        documentId,
        payload
      );

      return {
        success: true,
        data: this.mapDocumentToForm(doc),
      };
    } catch (err: any) {
      console.error('[CustomFormService] createForm error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to create form in database.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Retrieves a form by its Appwrite document ID
   */
  public static async getForm(formId: string): Promise<ServiceResponse<CustomForm>> {
    try {
      if (!isAppwriteReady() || !formId?.trim()) {
        return { success: false, error: 'Invalid form ID.' };
      }

      const doc = await databases.getDocument(
        this.databaseId,
        this.formsCollectionId,
        formId.trim()
      );

      return {
        success: true,
        data: this.mapDocumentToForm(doc),
      };
    } catch (err: any) {
      if (err?.code === 404) {
        return { success: false, error: 'Form not found.', statusCode: 404 };
      }
      return {
        success: false,
        error: err?.message || 'Failed to load form details.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Public & Admin: Retrieves a form by its URL slug
   * Note: For public unauthenticated requests, un-published forms return 404
   */
  public static async getFormBySlug(slug: string): Promise<ServiceResponse<CustomForm>> {
    try {
      if (!isAppwriteReady() || !slug?.trim()) {
        return { success: false, error: 'Form slug is required.' };
      }

      const res = await databases.listDocuments(this.databaseId, this.formsCollectionId, [
        Query.equal('slug', slug.trim().toLowerCase()),
        Query.limit(1),
      ]);

      if (res.documents.length === 0) {
        return { success: false, error: 'Form not found.', statusCode: 404 };
      }

      const form = this.mapDocumentToForm(res.documents[0]);

      // If form is in draft mode, allow only logged-in administrators to preview
      if (form.status === 'draft') {
        const isAdmin = await this.isCurrentUserAdmin();
        if (!isAdmin) {
          return {
            success: false,
            error: 'This form is currently a draft and is not available for submissions.',
            statusCode: 404,
          };
        }
      }

      return {
        success: true,
        data: form,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to retrieve form by slug.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Admin: List all forms with optional status filtering and search
   */
  public static async listForms(filters?: {
    status?: FormStatus | 'all';
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResponse<CustomForm[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const queries: string[] = [
        Query.limit(filters?.limit || 100),
        Query.orderDesc('$createdAt'),
      ];

      if (filters?.offset) {
        queries.push(Query.offset(filters.offset));
      }

      if (filters?.status && filters.status !== 'all') {
        queries.push(Query.equal('status', filters.status));
      }

      const res = await databases.listDocuments(
        this.databaseId,
        this.formsCollectionId,
        queries
      );

      let forms = res.documents.map((doc) => this.mapDocumentToForm(doc));

      // Client-side text search (title, slug, description)
      if (filters?.search && filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        forms = forms.filter(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.slug.toLowerCase().includes(q) ||
            (f.description && f.description.toLowerCase().includes(q))
        );
      }

      return {
        success: true,
        data: forms,
      };
    } catch (err: any) {
      console.error('[CustomFormService] listForms error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to list custom forms.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Public: List all published forms available to the community
   */
  public static async listPublishedForms(limit = 50): Promise<ServiceResponse<CustomForm[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const res = await databases.listDocuments(this.databaseId, this.formsCollectionId, [
        Query.equal('status', 'published'),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
      ]);

      return {
        success: true,
        data: res.documents.map((doc) => this.mapDocumentToForm(doc)),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to list published forms.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Admin: Update an existing custom form
   */
  public static async updateForm(
    formId: string,
    input: UpdateCustomFormInput
  ): Promise<ServiceResponse<CustomForm>> {
    try {
      if (!isAppwriteReady() || !formId?.trim()) {
        return { success: false, error: 'Invalid form ID.' };
      }

      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { success: false, error: 'Unauthorized. Admin session required.', statusCode: 403 };
      }

      const payload: Record<string, unknown> = {};

      if (input.title !== undefined) {
        payload.title = input.title.trim();
      }

      if (input.slug !== undefined) {
        payload.slug = await this.ensureUniqueSlug(input.slug, formId);
      }

      if (input.description !== undefined) {
        payload.description = input.description.trim();
      }

      if (input.status !== undefined) {
        payload.status = input.status;
      }

      if (input.fields !== undefined) {
        payload.fields = JSON.stringify(input.fields);
      }

      if (input.settings !== undefined) {
        // Merge with existing settings
        const existing = await this.getForm(formId);
        const currentSettings = existing.data?.settings || DEFAULT_FORM_SETTINGS;
        payload.settings = JSON.stringify({
          ...currentSettings,
          ...input.settings,
        });
      }

      if (input.coverImageId !== undefined && input.coverImageId.trim()) {
        payload.coverImageId = input.coverImageId.trim();
      }

      const doc = await databases.updateDocument(
        this.databaseId,
        this.formsCollectionId,
        formId.trim(),
        payload
      );

      return {
        success: true,
        data: this.mapDocumentToForm(doc),
      };
    } catch (err: any) {
      console.error('[CustomFormService] updateForm error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to update form.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Admin: Duplicates an existing form as a new draft
   */
  public static async duplicateForm(formId: string): Promise<ServiceResponse<CustomForm>> {
    try {
      const source = await this.getForm(formId);
      if (!source.success || !source.data) {
        return { success: false, error: 'Source form to duplicate could not be found.' };
      }

      const form = source.data;
      const newTitle = `${form.title} Copy`;
      const newSlug = await this.ensureUniqueSlug(newTitle);

      const createInput: CreateCustomFormInput = {
        title: newTitle,
        slug: newSlug,
        description: form.description || '',
        status: 'draft',
        fields: form.fields,
        settings: form.settings,
        coverImageId: form.coverImageId || '',
      };

      return await this.createForm(createInput);
    } catch (err: any) {
      console.error('[CustomFormService] duplicateForm error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to duplicate form.',
      };
    }
  }

  /**
   * Admin: Deletes a form and cleans up its associated response documents
   */
  public static async deleteForm(formId: string): Promise<ServiceResponse<void>> {
    try {
      if (!isAppwriteReady() || !formId?.trim()) {
        return { success: false, error: 'Invalid form ID.' };
      }

      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { success: false, error: 'Unauthorized. Admin session required.', statusCode: 403 };
      }

      // 1. Cleanup all associated responses to prevent orphaned records
      try {
        const responsesRes = await this.getFormResponses(formId, { limit: 100 });
        if (responsesRes.success && responsesRes.data && responsesRes.data.length > 0) {
          for (const resp of responsesRes.data) {
            try {
              await databases.deleteDocument(
                this.databaseId,
                this.responsesCollectionId,
                resp.id
              );
            } catch (delRespErr) {
              console.warn(`[CustomFormService] Error cleaning up response ${resp.id}:`, delRespErr);
            }
          }
        }
      } catch (cleanupErr) {
        console.warn('[CustomFormService] Notice during response cleanup:', cleanupErr);
      }

      // 2. Delete the form document itself
      await databases.deleteDocument(
        this.databaseId,
        this.formsCollectionId,
        formId.trim()
      );

      return { success: true };
    } catch (err: any) {
      console.error('[CustomFormService] deleteForm error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to delete form.',
        statusCode: err?.code,
      };
    }
  }

  /* ======================================================================== */
  /* RESPONSES CRUD & SUBMISSION OPERATIONS                                   */
  /* ======================================================================== */

  /**
   * Public & Auth: Submits a new form response with hardened validation and zero-login anonymous support.
   * Untrusted browser payloads are strictly sanitized against the form's defined schema.
   */
  public static async createFormResponse(
    input: CreateFormResponseInput
  ): Promise<ServiceResponse<CustomFormResponse>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!input.formId?.trim()) {
        return { success: false, error: 'Form ID is missing.' };
      }

      // 1. Fetch fresh Form Document from Appwrite
      const formRes = await this.getForm(input.formId.trim());
      if (!formRes.success || !formRes.data) {
        return {
          success: false,
          error: 'This form does not exist or has been removed.',
          statusCode: 404,
        };
      }

      const form = formRes.data;

      // 2. Verify Form Status
      if (form.status === 'closed') {
        return {
          success: false,
          error: 'This form has been closed and is no longer accepting submissions.',
          statusCode: 400,
        };
      }

      if (form.status === 'draft') {
        return {
          success: false,
          error: 'This form is currently a draft and is not accepting responses.',
          statusCode: 400,
        };
      }

      if (form.status !== 'published') {
        return {
          success: false,
          error: 'This form is currently unavailable for submissions.',
          statusCode: 400,
        };
      }

      // 3. Obtain user context if session exists
      const currentUser = await AuthService.getCurrentUser();
      const userId = currentUser?.$id || input.userId || '';

      // Check login requirement
      if (form.settings?.requireLogin && !userId) {
        return {
          success: false,
          error: 'You must be logged in to submit this form.',
          statusCode: 401,
        };
      }

      // 4. Unknown Field Protection & Sanitization
      // Build a whitelist of valid field IDs defined on this form
      const validFieldIds = new Set((form.fields || []).map((f) => f.id));
      const rawAnswers = input.answers && typeof input.answers === 'object' ? input.answers : {};
      const sanitizedAnswers: Record<string, unknown> = {};

      for (const key of Object.keys(rawAnswers)) {
        if (validFieldIds.has(key)) {
          sanitizedAnswers[key] = rawAnswers[key];
        }
      }

      // 5. Determine & Validate Respondent Email
      let respondentEmail = input.respondentEmail?.trim().toLowerCase() || currentUser?.email || '';

      // If not passed explicitly, attempt to extract from an email field in sanitized answers
      if (!respondentEmail) {
        const emailField = form.fields.find((f) => f.type === 'email');
        if (emailField && sanitizedAnswers[emailField.id]) {
          respondentEmail = String(sanitizedAnswers[emailField.id]).trim().toLowerCase();
        }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (form.settings?.collectEmail && !respondentEmail) {
        return {
          success: false,
          error: 'Respondent email address is required for this form.',
          statusCode: 400,
        };
      }

      if (respondentEmail && (respondentEmail.length > 255 || !emailRegex.test(respondentEmail))) {
        return {
          success: false,
          error: 'Please provide a valid respondent email address.',
          statusCode: 400,
        };
      }

      // 6. Deep Schema Validation on Sanitized Answers
      const validation = this.validateResponse(form, sanitizedAnswers, {
        userId,
        email: respondentEmail,
      });

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0] || 'Invalid submission answers.';
        return {
          success: false,
          error: firstError,
          statusCode: 422,
        };
      }

      // 7. Check Serialization and Appwrite Data Limits (50,000 char column limit)
      const serializedAnswers = JSON.stringify(sanitizedAnswers);
      if (serializedAnswers.length > 49000) {
        return {
          success: false,
          error: 'Your response is too large to submit. Please shorten your text entries.',
          statusCode: 413,
        };
      }

      // 8. Multiple Response Restriction Check (when allowMultipleResponses is false)
      if (form.settings && !form.settings.allowMultipleResponses) {
        try {
          const duplicateQueries: string[] = [
            Query.equal('formId', form.id),
            Query.limit(1),
          ];

          if (userId) {
            duplicateQueries.push(Query.equal('userId', userId));
          } else if (respondentEmail) {
            duplicateQueries.push(Query.equal('respondentEmail', respondentEmail));
          }

          // Only perform duplicate check if we have an identifier (userId or respondentEmail)
          if (duplicateQueries.length > 1) {
            const check = await databases.listDocuments(
              this.databaseId,
              this.responsesCollectionId,
              duplicateQueries
            );

            if (check.documents.length > 0) {
              return {
                success: false,
                error: 'You have already submitted a response for this form.',
                statusCode: 409,
              };
            }
          }
        } catch (dupErr) {
          console.warn('[CustomFormService] Duplicate check notice:', dupErr);
        }
      }

      // 9. Create Response Document in Appwrite
      const documentId = ID.unique();
      const submittedAt = new Date().toISOString();

      const payload = {
        formId: form.id,
        formSlug: form.slug,
        userId: userId || '',
        respondentEmail: respondentEmail || '',
        answers: serializedAnswers,
        submittedAt,
      };

      const doc = await databases.createDocument(
        this.databaseId,
        this.responsesCollectionId,
        documentId,
        payload
      );

      // 10. Increment responseCount on the form document (best-effort, non-blocking)
      try {
        const currentCount = Math.max(0, typeof form.responseCount === 'number' ? form.responseCount : 0);
        const newCount = currentCount + 1;
        await databases.updateDocument(
          this.databaseId,
          this.formsCollectionId,
          form.id,
          { responseCount: newCount }
        );
      } catch (countErr) {
        console.warn('[CustomFormService] Notice: Failed to increment cached responseCount:', countErr);
      }

      return {
        success: true,
        data: this.mapDocumentToResponse(doc),
      };
    } catch (err: any) {
      console.error('[CustomFormService] createFormResponse error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to submit form response. Please try again.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Admin: Fetches all submitted responses for a form
   */
  public static async getFormResponses(
    formId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<ServiceResponse<CustomFormResponse[]>> {
    try {
      if (!isAppwriteReady() || !formId?.trim()) {
        return { success: false, error: 'Invalid form ID.' };
      }

      const queries: string[] = [
        Query.equal('formId', formId.trim()),
        Query.orderDesc('submittedAt'),
        Query.limit(options?.limit || 100),
      ];

      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      const res = await databases.listDocuments(
        this.databaseId,
        this.responsesCollectionId,
        queries
      );

      return {
        success: true,
        data: res.documents.map((doc) => this.mapDocumentToResponse(doc)),
      };
    } catch (err: any) {
      console.error('[CustomFormService] getFormResponses error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to retrieve responses.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Admin: Retrieves a single response by ID
   */
  public static async getFormResponse(
    responseId: string
  ): Promise<ServiceResponse<CustomFormResponse>> {
    try {
      if (!isAppwriteReady() || !responseId?.trim()) {
        return { success: false, error: 'Invalid response ID.' };
      }

      const doc = await databases.getDocument(
        this.databaseId,
        this.responsesCollectionId,
        responseId.trim()
      );

      return {
        success: true,
        data: this.mapDocumentToResponse(doc),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Response not found.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Admin: Deletes an individual response and decrements the form's responseCount
   */
  public static async deleteFormResponse(
    responseId: string
  ): Promise<ServiceResponse<void>> {
    try {
      if (!isAppwriteReady() || !responseId?.trim()) {
        return { success: false, error: 'Invalid response ID.' };
      }

      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { success: false, error: 'Unauthorized. Admin session required.', statusCode: 403 };
      }

      // Fetch response to identify formId
      const respRes = await this.getFormResponse(responseId);
      const formId = respRes.data?.formId;

      await databases.deleteDocument(
        this.databaseId,
        this.responsesCollectionId,
        responseId.trim()
      );

      // Decrement counter if form exists
      if (formId) {
        try {
          const formRes = await this.getForm(formId);
          if (formRes.success && formRes.data) {
            const newCount = Math.max(0, (formRes.data.responseCount || 1) - 1);
            await databases.updateDocument(
              this.databaseId,
              this.formsCollectionId,
              formId,
              { responseCount: newCount }
            );
          }
        } catch (decErr) {
          console.warn('[CustomFormService] Failed to decrement responseCount cache:', decErr);
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error('[CustomFormService] deleteFormResponse error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to delete response.',
        statusCode: err?.code,
      };
    }
  }

  /**
   * Returns total count of responses for a form
   */
  public static async getFormResponseCount(
    formId: string
  ): Promise<ServiceResponse<number>> {
    try {
      if (!isAppwriteReady() || !formId?.trim()) {
        return { success: false, error: 'Invalid form ID.' };
      }

      const res = await databases.listDocuments(
        this.databaseId,
        this.responsesCollectionId,
        [Query.equal('formId', formId.trim()), Query.limit(1)]
      );

      return {
        success: true,
        data: res.total,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to fetch response count.',
      };
    }
  }
}

export const customFormService = CustomFormService;
export default CustomFormService;
