/**
 * ============================================================================
 * ATC Backend Services Barrel Export
 * ============================================================================
 */

export * from './appwrite';
export * from './authService';
export * from './eventService';
export * from './formService';
export * from './database.service';
export * from './storage.service';
export * from './realtime.service';
export * from './functions.service';
export * from './registrationService';
export * from './membershipApplicationService';
export * from './customFormService';

export * from '../lib/appwrite/permissions';
export * from '../types/appwrite.types';
export * from '../types/event.types';
export * from '../types/form.types';
export * from '../types/membershipApplication.types';
export type {
  FormStatus,
  FormSettings,
  FormFieldDefinition,
  CustomForm,
  CustomFormResponse,
  CustomFormDocument,
  CustomFormResponseDocument,
  CreateCustomFormInput,
  UpdateCustomFormInput,
  CreateFormResponseInput,
  FormValidationResult,
  FieldError,
} from '../types/customForm.types';
export type { FormFieldType as CustomFormFieldType } from '../types/customForm.types';
export { DEFAULT_FORM_SETTINGS } from '../types/customForm.types';
