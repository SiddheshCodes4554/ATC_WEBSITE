import { Models } from 'appwrite';

/**
 * Supported Field Types in the Event Registration Form Builder
 */
export type FormFieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'number'
  | 'dropdown'
  | 'multiple_choice'
  | 'checkbox'
  | 'date'
  | 'url';

/**
 * Definition of a single Form Field inside an Event Registration Form
 */
export interface FormField {
  $id?: string;
  formId?: string;
  label: string;
  fieldType: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // Array of strings (e.g. for dropdown, multiple_choice, checkbox)
  position: number;
}

/**
 * Appwrite Document Mapping for form_fields
 */
export interface FormFieldDocument extends Models.Document {
  formId: string;
  label: string;
  fieldType: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string; // JSON serialized string array in Appwrite database
  position: number;
}

/**
 * Event Registration Form Header Document (event_forms)
 */
export interface EventForm {
  $id?: string;
  eventId: string;
  title?: string;
  description?: string;
  isActive: boolean;
  fields?: FormField[];
}

/**
 * Appwrite Document Mapping for event_forms
 */
export interface EventFormDocument extends Models.Document {
  eventId: string;
  title?: string;
  description?: string;
  isActive: boolean;
}

/**
 * DTO for creating an Event Form with nested Form Fields
 */
export interface CreateEventFormInput {
  eventId: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  fields: FormFieldInput[];
}

export interface FormFieldInput {
  id?: string; // local temporary UI ID
  label: string;
  fieldType: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  position: number;
}

/**
 * Registration Document Schema
 */
export interface EventRegistrationDocument extends Models.Document {
  eventId: string;
  formId?: string;
  name: string;
  email: string;
  phone?: string;
  status: 'registered' | 'cancelled' | 'checked_in';
  registeredAt: string;
}

/**
 * Registration Custom Answer Document Schema
 */
export interface RegistrationAnswerDocument extends Models.Document {
  registrationId: string;
  fieldId: string;
  value: string;
}
