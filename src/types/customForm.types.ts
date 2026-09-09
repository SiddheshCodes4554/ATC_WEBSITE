import { Models } from 'appwrite';

/**
 * ============================================================================
 * ATC Forms System — Core TypeScript Types & DTOs
 * ============================================================================
 */

/**
 * Lifecycle status of a custom form
 */
export type FormStatus = 'draft' | 'published' | 'closed';

/**
 * Supported field types in the dynamic form builder
 */
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'url'
  | 'phone'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'time'
  | 'rating'
  | 'file';

/**
 * Configuration settings for a custom form
 */
export interface FormSettings {
  requireLogin: boolean;
  allowMultipleResponses: boolean;
  collectEmail: boolean;
  successMessage: string;
  [key: string]: unknown;
}

/**
 * Default form settings
 */
export const DEFAULT_FORM_SETTINGS: FormSettings = {
  requireLogin: false,
  allowMultipleResponses: true,
  collectEmail: true,
  successMessage: 'Thanks for submitting!',
};

/**
 * Dynamic Form Field Definition
 */
export interface FormFieldDefinition {
  id: string;
  type: FormFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
  // Extensible configuration attributes
  min?: number;
  max?: number;
  minRating?: number;
  maxRating?: number;
  acceptedTypes?: string[];
  maxSize?: number;
  [key: string]: unknown;
}

/**
 * Application-level Custom Form entity
 */
export interface CustomForm {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: FormStatus;
  fields: FormFieldDefinition[];
  settings: FormSettings;
  coverImageId?: string;
  responseCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Application-level Custom Form Response entity
 */
export interface CustomFormResponse {
  id: string;
  formId: string;
  formSlug?: string;
  userId?: string;
  respondentEmail?: string;
  answers: Record<string, unknown>;
  submittedAt: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Raw Appwrite Document structure for custom_forms collection
 */
export interface CustomFormDocument extends Models.Document {
  title: string;
  slug: string;
  description?: string;
  status: string;
  fields: string; // JSON serialized FormFieldDefinition[]
  settings: string; // JSON serialized FormSettings
  coverImageId?: string;
  responseCount?: number;
  createdBy?: string;
}

/**
 * Raw Appwrite Document structure for custom_form_responses collection
 */
export interface CustomFormResponseDocument extends Models.Document {
  formId: string;
  formSlug?: string;
  userId?: string;
  respondentEmail?: string;
  answers: string; // JSON serialized Record<string, unknown>
  submittedAt: string;
}

/**
 * DTO for creating a new form
 */
export interface CreateCustomFormInput {
  title: string;
  slug?: string;
  description?: string;
  status?: FormStatus;
  fields?: FormFieldDefinition[];
  settings?: Partial<FormSettings>;
  coverImageId?: string;
  createdBy?: string;
}

/**
 * DTO for updating an existing form
 */
export interface UpdateCustomFormInput {
  title?: string;
  slug?: string;
  description?: string;
  status?: FormStatus;
  fields?: FormFieldDefinition[];
  settings?: Partial<FormSettings>;
  coverImageId?: string;
}

/**
 * DTO for submitting a public or authenticated form response
 */
export interface CreateFormResponseInput {
  formId: string;
  formSlug?: string;
  answers: Record<string, unknown>;
  userId?: string;
  respondentEmail?: string;
}

/**
 * Form Validation Result
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Field-level Error Result
 */
export interface FieldError {
  fieldId: string;
  message: string;
}
