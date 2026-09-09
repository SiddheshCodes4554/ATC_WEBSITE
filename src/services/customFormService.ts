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
   * Validates submitted answers against the form's dynamic field definitions
   */
  public static validateResponse(
    form: CustomForm,
    answers: Record<string, unknown>,
    userContext?: { userId?: string; email?: string }
  ): FormValidationResult {
    const errors: Record<string, string> = {};

    // 1. Check form login requirement
    if (form.settings.requireLogin && !userContext?.userId) {
      errors._general = 'You must be logged in to submit this form.';
      return { isValid: false, errors };
    }

    // 2. Validate each configured field
    for (const field of form.fields) {
      const val = answers[field.id];
      const isProvided =
        val !== undefined &&
        val !== null &&
        val !== '' &&
        !(Array.isArray(val) && val.length === 0);

      // Check required
      if (field.required && !isProvided) {
        errors[field.id] = `"${field.label}" is required.`;
        continue;
      }

      if (!isProvided) continue;

      // Type-specific validation
      switch (field.type) {
        case 'email': {
          const emailStr = String(val).trim().toLowerCase();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailStr)) {
            errors[field.id] = 'Please enter a valid email address.';
          }
          break;
        }

        case 'number': {
          const num = Number(val);
          if (isNaN(num)) {
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
          try {
            const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
            if (!parsed.hostname) {
              errors[field.id] = 'Please enter a valid URL.';
            }
          } catch {
            errors[field.id] = 'Please enter a valid website URL.';
          }
          break;
        }

        case 'phone': {
          const phoneStr = String(val).replace(/[\s\-()]/g, '');
          if (phoneStr.length < 7 || !/^\+?[0-9]{7,15}$/.test(phoneStr)) {
            errors[field.id] = 'Please enter a valid phone number.';
          }
          break;
        }

        case 'select':
        case 'radio': {
          const selectedOption = String(val);
          if (field.options && field.options.length > 0 && !field.options.includes(selectedOption)) {
            errors[field.id] = 'Selected option is not valid.';
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

        case 'rating': {
          const ratingVal = Number(val);
          const minR = field.minRating ?? 1;
          const maxR = field.maxRating ?? 5;
          if (isNaN(ratingVal) || ratingVal < minR || ratingVal > maxR) {
            errors[field.id] = `Rating must be between ${minR} and ${maxR}.`;
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

      const payload = {
        title: input.title.trim(),
        slug,
        description: input.description?.trim() || '',
        status: input.status || 'draft',
        fields: fieldsJson,
        settings: settingsJson,
        coverImageId: input.coverImageId || '',
        responseCount: 0,
        createdBy: user?.$id || input.createdBy || '',
      };

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

      if (input.coverImageId !== undefined) {
        payload.coverImageId = input.coverImageId;
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
   * Public & Auth: Submits a new form response with validation
   * (NO LOGIN REQUIRED for public forms)
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

      // 1. Load Form Document
      const formRes = await this.getForm(input.formId.trim());
      if (!formRes.success || !formRes.data) {
        return { success: false, error: 'Form does not exist or has been removed.', statusCode: 404 };
      }

      const form = formRes.data;

      // 2. Verify Form is published
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

      // 3. Obtain user context if available
      const currentUser = await AuthService.getCurrentUser();
      const userId = currentUser?.$id || input.userId || '';
      let respondentEmail = input.respondentEmail?.trim().toLowerCase() || currentUser?.email || '';

      // Extract respondent email from answers if not passed directly
      if (!respondentEmail) {
        const emailField = form.fields.find((f) => f.type === 'email');
        if (emailField && input.answers[emailField.id]) {
          respondentEmail = String(input.answers[emailField.id]).trim().toLowerCase();
        }
      }

      // 4. Validate Answers against Form Schema
      const validation = this.validateResponse(form, input.answers, {
        userId,
        email: respondentEmail,
      });

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0] || 'Invalid submission answers.';
        return { success: false, error: firstError };
      }

      // 5. Multiple response check (if allowMultipleResponses === false)
      if (!form.settings.allowMultipleResponses) {
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

      // 6. Create response document
      const documentId = ID.unique();
      const submittedAt = new Date().toISOString();

      const payload = {
        formId: form.id,
        formSlug: form.slug,
        userId,
        respondentEmail,
        answers: JSON.stringify(input.answers),
        submittedAt,
      };

      const doc = await databases.createDocument(
        this.databaseId,
        this.responsesCollectionId,
        documentId,
        payload
      );

      // 7. Increment responseCount on the form document (best-effort)
      try {
        const newCount = (form.responseCount || 0) + 1;
        await databases.updateDocument(
          this.databaseId,
          this.formsCollectionId,
          form.id,
          { responseCount: newCount }
        );
      } catch (countErr) {
        console.warn('[CustomFormService] Failed to increment responseCount cache:', countErr);
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
