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
 * Known system keys for participant identification
 */
export type FormFieldSystemKey = 'name' | 'email' | 'phone' | null;

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
  systemKey?: FormFieldSystemKey;
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
  systemKey?: string | null;
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
  systemKey?: FormFieldSystemKey;
}

/**
 * Registration Document Schema
 */
export type RegistrationStatus = 'registered' | 'cancelled' | 'checked_in';
export type PassStatus = 'active' | 'used' | 'cancelled';

export interface EventRegistration {
  $id?: string;
  eventId: string;
  formId?: string;
  name: string;
  email: string;
  phone?: string;
  status: RegistrationStatus;
  registeredAt: string;
  passId?: string;
  passStatus?: PassStatus;
  checkedInAt?: string | null;
}

export interface EventRegistrationDocument extends Models.Document {
  eventId: string;
  formId?: string;
  name: string;
  email: string;
  phone?: string;
  status: RegistrationStatus;
  registeredAt: string;
  passId?: string;
  passStatus?: PassStatus;
  checkedInAt?: string | null;
}

export type CheckInValidationCode =
  | 'VALID'
  | 'ALREADY_CHECKED_IN'
  | 'WRONG_EVENT'
  | 'CANCELLED'
  | 'INVALID_PASS';

export interface PassCheckInValidationResult {
  code: CheckInValidationCode;
  isValid: boolean;
  message: string;
  registration?: EventRegistration;
  eventTitle?: string;
  checkedInAt?: string | null;
}

export interface CheckInExecutionResult {
  success: boolean;
  message: string;
  registration?: EventRegistration;
  checkedInAt?: string;
  error?: string;
  isDuplicateCheckIn?: boolean;
}

/**
 * Registration Custom Answer Document Schema
 */
export interface RegistrationAnswer {
  $id?: string;
  registrationId: string;
  fieldId: string;
  value: string;
}

export interface RegistrationAnswerDocument extends Models.Document {
  registrationId: string;
  fieldId: string;
  value: string;
}

/**
 * Payload for student submission
 */
export interface SubmitRegistrationInput {
  eventId: string;
  formId?: string;
  answers: Record<string, any>; // field identifier -> user submitted value
}

export interface RegistrationSubmissionResult {
  success: boolean;
  registrationId?: string;
  registration?: EventRegistration;
  passId?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  isDuplicate?: boolean;
  isCapacityReached?: boolean;
  isDeadlinePassed?: boolean;
}

/**
 * Sanitized Public Event Pass for public verification & ticket viewing
 */
export interface PublicEventPass {
  passId: string;
  passStatus: PassStatus;
  name: string;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  eventType: string;
  startDate: string;
  endDate?: string | null;
  venue: string;
  coverImageId?: string | null;
  accentColor?: string;
  registeredAt: string;
}

/**
 * Aggregated Registration Statistics for Admin Dashboard
 */
export interface RegistrationStats {
  total: number;
  registered: number;
  cancelled: number;
  checkedIn: number;
  activeCount: number;
  capacityLimit: number | null;
  remainingSeats: number | null;
  isCapacityReached: boolean;
}

/**
 * Enriched Participant Data for Detail Drawer
 */
export interface ParticipantDetailData {
  registration: EventRegistration;
  answers: RegistrationAnswer[];
  formattedAnswers: {
    fieldId: string;
    label: string;
    fieldType: FormFieldType;
    value: string;
    displayValue: any;
    isSystemKey?: boolean;
  }[];
}
