import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Loader2,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { customFormService } from '../../services/customFormService';
import { CustomForm, FormFieldDefinition } from '../../types/customForm.types';
import { PublicFieldRenderer } from '../../components/forms/public/PublicFieldRenderer';
import { FormSuccessScreen } from '../../components/forms/public/FormSuccessScreen';
import { FormClosedScreen } from '../../components/forms/public/FormClosedScreen';

export const PublicCustomFormPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Form & Loading State
  const [form, setForm] = useState<CustomForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form Inputs & Submission State
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [standaloneEmail, setStandaloneEmail] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Load Form from Slug
  const fetchForm = async () => {
    if (!slug?.trim()) {
      setError('Form slug is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await customFormService.getFormBySlug(slug.trim());
      if (res.success && res.data) {
        setForm(res.data);
      } else {
        setError(res.error || 'Form could not be found.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load form.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [slug]);

  // Set Dynamic Document Title
  useEffect(() => {
    if (form?.title) {
      document.title = `${form.title} — ATC Robotics Lab`;
    } else {
      document.title = 'ATC Forms — ATC Robotics Lab';
    }
    return () => {
      document.title = 'ATC Robotics Lab';
    };
  }, [form]);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !standaloneEmail) {
      setStandaloneEmail(user.email);
    }
  }, [user]);

  // Determine if standalone email field is needed
  const hasEmailFieldInForm = useMemo(() => {
    if (!form?.fields) return false;
    return form.fields.some((f) => f.type === 'email');
  }, [form]);

  const needsStandaloneEmail = Boolean(
    form?.settings.collectEmail && !hasEmailFieldInForm
  );

  // Handle Input Changes
  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  // Local Validation before Submitting
  const validateFormLocally = (): { isValid: boolean; errors: Record<string, string>; firstErrorId?: string } => {
    if (!form) return { isValid: false, errors: {} };

    const errors: Record<string, string> = {};
    let firstErrorId: string | undefined;

    // Check Standalone Email if required
    if (needsStandaloneEmail) {
      const emailVal = standaloneEmail.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        errors._standaloneEmail = 'Please provide your email address.';
        if (!firstErrorId) firstErrorId = '_standaloneEmail';
      } else if (!emailRegex.test(emailVal)) {
        errors._standaloneEmail = 'Please enter a valid email address.';
        if (!firstErrorId) firstErrorId = '_standaloneEmail';
      }
    }

    // Validate Each Configured Question
    for (const field of form.fields) {
      const val = answers[field.id];
      const isNullOrUndefined = val === undefined || val === null;
      const isWhitespaceString = typeof val === 'string' && val.trim() === '';
      const isEmptyArray = Array.isArray(val) && val.length === 0;
      const isProvided = !isNullOrUndefined && !isWhitespaceString && !isEmptyArray;

      if (field.required && !isProvided) {
        errors[field.id] = `"${field.label}" is required.`;
        if (!firstErrorId) firstErrorId = field.id;
        continue;
      }

      if (!isProvided) continue;

      // Type validations
      switch (field.type) {
        case 'text': {
          if (String(val).length > 5000) {
            errors[field.id] = 'Text response cannot exceed 5,000 characters.';
            if (!firstErrorId) firstErrorId = field.id;
          }
          break;
        }

        case 'textarea': {
          if (String(val).length > 10000) {
            errors[field.id] = 'Detailed response cannot exceed 10,000 characters.';
            if (!firstErrorId) firstErrorId = field.id;
          }
          break;
        }

        case 'email': {
          const emailStr = String(val).trim().toLowerCase();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailStr.length > 255 || !emailRegex.test(emailStr)) {
            errors[field.id] = 'Please enter a valid email address.';
            if (!firstErrorId) firstErrorId = field.id;
          }
          break;
        }

        case 'number': {
          const num = Number(val);
          if (isNaN(num) || !Number.isFinite(num)) {
            errors[field.id] = 'Please enter a valid number.';
            if (!firstErrorId) firstErrorId = field.id;
          } else {
            if (field.min !== undefined && num < field.min) {
              errors[field.id] = `Value must be at least ${field.min}.`;
              if (!firstErrorId) firstErrorId = field.id;
            }
            if (field.max !== undefined && num > field.max) {
              errors[field.id] = `Value cannot exceed ${field.max}.`;
              if (!firstErrorId) firstErrorId = field.id;
            }
          }
          break;
        }

        case 'url': {
          const urlStr = String(val).trim();
          if (urlStr.length > 2048) {
            errors[field.id] = 'URL is too long.';
            if (!firstErrorId) firstErrorId = field.id;
          } else {
            try {
              const parsed = new URL(urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`);
              if (!parsed.hostname || !parsed.hostname.includes('.')) {
                errors[field.id] = 'Please enter a valid website URL (e.g., https://example.com).';
                if (!firstErrorId) firstErrorId = field.id;
              }
            } catch {
              errors[field.id] = 'Please enter a valid website URL.';
              if (!firstErrorId) firstErrorId = field.id;
            }
          }
          break;
        }

        case 'phone': {
          const cleanPhone = String(val).replace(/[\s\-().+]/g, '');
          if (cleanPhone.length < 7 || cleanPhone.length > 15 || !/^[0-9]+$/.test(cleanPhone)) {
            errors[field.id] = 'Please enter a valid phone number (7–15 digits).';
            if (!firstErrorId) firstErrorId = field.id;
          }
          break;
        }

        case 'select':
        case 'radio': {
          const selected = String(val);
          if (field.options && field.options.length > 0 && !field.options.includes(selected)) {
            errors[field.id] = 'Selected choice is invalid.';
            if (!firstErrorId) firstErrorId = field.id;
          }
          break;
        }

        case 'checkbox': {
          if (!Array.isArray(val)) {
            errors[field.id] = 'Please select valid choices.';
            if (!firstErrorId) firstErrorId = field.id;
          } else if (field.options && field.options.length > 0) {
            const invalid = val.some((v) => !field.options?.includes(String(v)));
            if (invalid) {
              errors[field.id] = 'One or more choices are invalid.';
              if (!firstErrorId) firstErrorId = field.id;
            }
          }
          break;
        }

        case 'date': {
          const dateStr = String(val).trim();
          if (isNaN(Date.parse(dateStr))) {
            errors[field.id] = 'Please provide a valid date.';
            if (!firstErrorId) firstErrorId = field.id;
          }
          break;
        }

        case 'time': {
          const timeStr = String(val).trim();
          if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(timeStr)) {
            errors[field.id] = 'Please provide a valid time format (HH:MM).';
            if (!firstErrorId) firstErrorId = field.id;
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
            if (!firstErrorId) firstErrorId = field.id;
          }
          break;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      firstErrorId,
    };
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || isSubmitting) return;

    setSubmissionError(null);

    // 1. Client-side Validation
    const validation = validateFormLocally();
    if (!validation.isValid) {
      setFieldErrors(validation.errors);

      // Smooth scroll to the first invalid field
      if (validation.firstErrorId) {
        const elem = document.getElementById(
          validation.firstErrorId === '_standaloneEmail'
            ? 'standalone_email_container'
            : `field_container_${validation.firstErrorId}`
        );
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // 2. Determine Respondent Email
      let respondentEmail = standaloneEmail.trim().toLowerCase();
      if (!respondentEmail) {
        const emailField = form.fields.find((f) => f.type === 'email');
        if (emailField && answers[emailField.id]) {
          respondentEmail = String(answers[emailField.id]).trim().toLowerCase();
        }
      }

      // 3. Submit Response to Appwrite via CustomFormService
      const res = await customFormService.createFormResponse({
        formId: form.id,
        formSlug: form.slug,
        answers,
        userId: user?.$id,
        respondentEmail: respondentEmail || undefined,
      });

      if (res.success && res.data) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmissionError(res.error || 'Failed to submit form. Please verify your inputs and try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setSubmissionError(err?.message || 'An unexpected network error occurred. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to submit another response
  const handleResetForAnother = () => {
    setAnswers({});
    setFieldErrors({});
    setSubmissionError(null);
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading Skeleton
  if (loading || authLoading) {
    return (
      <div className="min-h-[85vh] bg-[#FAF7F0] py-14 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
        <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
          <div className="p-8 sm:p-10 rounded-[36px] bg-white border-4 border-gray-200 h-44" />
          <div className="p-6 rounded-[28px] bg-white border-3 border-gray-200 h-28" />
          <div className="p-6 rounded-[28px] bg-white border-3 border-gray-200 h-28" />
          <div className="p-6 rounded-[28px] bg-white border-3 border-gray-200 h-28" />
        </div>
      </div>
    );
  }

  // Error / Form Not Found State
  if (error || !form) {
    return (
      <div className="min-h-[85vh] bg-[#FAF7F0] py-14 px-4 sm:px-6 lg:px-8 paper-pattern select-none flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#FFE5E5] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-[#FF4757] stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#FFE5E5] text-[#FF4757] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs">
              FORM UNAVAILABLE
            </span>
            <h2 className="text-2xl font-black text-[#121316]">
              Form Not Found
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
              {error || "The form you are looking for doesn't exist, has been archived, or is no longer accepting submissions."}
            </p>
          </div>

          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={fetchForm}
              className="px-5 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-gray-200 font-mono text-xs font-black uppercase text-[#121316] border-2 border-[#121316] shadow-pop-xs transition-all cursor-pointer"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] font-mono text-xs font-black uppercase text-[#121316] border-2 border-[#121316] shadow-pop transition-all cursor-pointer"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Closed Form State
  if (form.status === 'closed') {
    return (
      <div className="min-h-[85vh] bg-[#FAF7F0] py-14 px-4 sm:px-6 lg:px-8 paper-pattern select-none flex items-center justify-center">
        <FormClosedScreen formTitle={form.title} />
      </div>
    );
  }

  // Draft Form Gate
  if (form.status === 'draft') {
    return (
      <div className="min-h-[85vh] bg-[#FAF7F0] py-14 px-4 sm:px-6 lg:px-8 paper-pattern select-none flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber-800 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#FFF9DB] text-amber-800 border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs">
              DRAFT FORM
            </span>
            <h2 className="text-2xl font-black text-[#121316]">
              Form Not Yet Published
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
              This form is currently being built and has not been published for public submissions yet.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] font-mono text-xs font-black uppercase text-[#121316] border-2 border-[#121316] shadow-pop transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Require Login Gate
  if (form.settings.requireLogin && !isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-[#FAF7F0] py-14 px-4 sm:px-6 lg:px-8 paper-pattern select-none flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-5">
          <div className="tape-strip pointer-events-none bg-[#6C5CE7]" />

          <div className="w-16 h-16 rounded-2xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
            <LogIn className="w-8 h-8 text-[#6C5CE7] stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs">
              AUTHENTICATION REQUIRED
            </span>
            <h2 className="text-2xl font-black text-[#121316]">
              Student Login Required
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
              "{form.title}" is an internal club form restricted to ATC members. Please sign in to submit your response.
            </p>
          </div>

          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              to={`/login?redirect=/forms/${form.slug}`}
              className="w-full py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 rounded-full bg-[#FAF7F0] hover:bg-gray-200 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs transition-all"
            >
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Submitted Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-[85vh] bg-[#FAF7F0] py-14 px-4 sm:px-6 lg:px-8 paper-pattern select-none flex items-center justify-center">
        <FormSuccessScreen
          formTitle={form.title}
          successMessage={form.settings.successMessage}
          allowMultipleResponses={form.settings.allowMultipleResponses}
          onSubmitAnother={handleResetForAnother}
        />
      </div>
    );
  }

  // Published Live Form
  return (
    <div className="min-h-[85vh] bg-[#FAF7F0] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Branding Pill & Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#121316] hover:text-[#6C5CE7] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            <span>ATC Robotics Lab</span>
          </Link>

          <span className="font-mono text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white border border-[#121316] text-gray-600">
            PUBLIC FORM
          </span>
        </div>

        {/* Master Form Card */}
        <div className="bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-10 space-y-8 relative">
          <div className="tape-strip pointer-events-none bg-[#FFE600]" />

          {/* Form Header */}
          <div className="border-b-3 border-[#121316] pb-6 sm:pb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600] text-[#121316] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs">
              <Sparkles className="w-3.5 h-3.5" />
              OFFICIAL ATC FORM
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
              {form.title}
            </h1>

            {form.description && (
              <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed whitespace-pre-line">
                {form.description}
              </p>
            )}
          </div>

          {/* Global Submission Error Alert */}
          {submissionError && (
            <div className="p-4 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] text-[#121316] flex items-start gap-3 shadow-pop-xs animate-fadeIn">
              <ShieldAlert className="w-5 h-5 text-[#FF4757] flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-bold leading-snug">
                {submissionError}
              </div>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Standalone Email Collector (if configured & no email field in schema) */}
            {needsStandaloneEmail && (
              <div
                id="standalone_email_container"
                className={`p-5 sm:p-6 rounded-[28px] bg-[#FAF7F0] border-3 border-[#121316] space-y-3 transition-all ${
                  fieldErrors._standaloneEmail
                    ? 'ring-3 ring-[#FF4757] bg-[#FFF8F8] shadow-pop'
                    : 'shadow-pop-xs'
                }`}
              >
                <div className="space-y-1">
                  <label
                    htmlFor="standalone_email_input"
                    className="block text-sm sm:text-base font-black text-[#121316] leading-snug cursor-pointer"
                  >
                    Your Email Address <span className="text-[#FF4757] font-black">*</span>
                  </label>
                  <p className="text-xs font-bold text-gray-500 italic">
                    We will send submission confirmation and relevant updates to this email.
                  </p>
                </div>

                <div className="relative">
                  <input
                    id="standalone_email_input"
                    type="email"
                    required
                    aria-required="true"
                    value={standaloneEmail}
                    onChange={(e) => {
                      setStandaloneEmail(e.target.value);
                      if (fieldErrors._standaloneEmail) {
                        setFieldErrors((prev) => {
                          const copy = { ...prev };
                          delete copy._standaloneEmail;
                          return copy;
                        });
                      }
                    }}
                    placeholder="alex@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] font-mono"
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {fieldErrors._standaloneEmail && (
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#FF4757] pt-1">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{fieldErrors._standaloneEmail}</span>
                  </div>
                )}
              </div>
            )}

            {/* Render Every Dynamic Question */}
            {form.fields.map((field, idx) => (
              <PublicFieldRenderer
                key={field.id}
                field={field}
                index={idx}
                value={answers[field.id]}
                error={fieldErrors[field.id]}
                onChange={(val) => handleFieldChange(field.id, val)}
              />
            ))}

            {/* Submission Action Button */}
            <div className="pt-4 border-t-2 border-[#121316]/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] disabled:opacity-60 disabled:cursor-not-allowed text-[#121316] font-mono text-base font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>SUBMITTING RESPONSE...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT RESPONSE</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footer Note */}
          <div className="text-center pt-2 font-mono text-[11px] font-bold text-gray-400">
            Powered by ATC Robotics Lab • Advanced Tech Club
          </div>
        </div>

      </div>
    </div>
  );
};

export default PublicCustomFormPage;
