import React from 'react';
import { Link } from 'react-router-dom';
import { EventForm, FormField, EventRegistration } from '../../types/form.types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Send, 
  Ticket, 
  PartyPopper, 
  Lock, 
  FileText, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  ArrowUpRight 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DynamicRegistrationFormSectionProps {
  theme: 'playful' | 'terminal' | 'futuristic' | 'energetic' | 'editorial' | 'experimental' | 'digital' | string;
  eventTitle: string;
  isRegistrationActive: boolean;
  eventStatus: string;
  registrationDeadline?: string | null;
  registrationLimit?: number | null;
  displayedFields: FormField[];
  formValues: Record<string, any>;
  onFieldChange: (key: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submissionResult: EventRegistration | null;
  formErrorMessage: string | null;
  fieldErrors: Record<string, string>;
  formLoading: boolean;
  accentColor?: string;
  formatDate: (iso?: string | null) => string;
}

export const DynamicRegistrationFormSection: React.FC<DynamicRegistrationFormSectionProps> = ({
  theme,
  eventTitle,
  isRegistrationActive,
  eventStatus,
  registrationDeadline,
  registrationLimit,
  displayedFields,
  formValues,
  onFieldChange,
  onSubmit,
  isSubmitting,
  submissionResult,
  formErrorMessage,
  fieldErrors,
  formLoading,
  accentColor = '#FFE600',
  formatDate,
}) => {
  // -------------------------------------------------------------
  // THEME-BASED STYLING CALCULATIONS
  // -------------------------------------------------------------
  const isDark = theme === 'terminal' || theme === 'futuristic' || theme === 'energetic' || theme === 'digital';

  const containerClasses = {
    playful: 'bg-[#FFF9DB] border-4 border-[#121316] shadow-pop-xl paper-pattern text-[#121316]',
    terminal: 'bg-[#0F172A] border-3 border-emerald-500/40 shadow-pop-purple text-emerald-400 font-mono',
    futuristic: 'bg-[#0B0F19]/90 backdrop-blur-xl border-3 border-cyan-500/50 shadow-[0_0_50px_rgba(0,210,211,0.2)] text-white',
    energetic: 'bg-[#18181B] border-4 border-[#FFE600] shadow-[8px_8px_0px_#FFE600] text-white',
    editorial: 'bg-white border-2 border-gray-900 shadow-2xl text-gray-900',
    experimental: 'bg-[#FAF7F0] border-4 border-black shadow-[8px_8px_0px_#000] text-black font-mono',
    digital: 'bg-[#05130E] border-3 border-emerald-500/60 shadow-[0_0_30px_rgba(16,172,132,0.3)] text-emerald-300 font-mono',
  }[theme] || 'bg-white border-4 border-[#121316] shadow-pop-xl text-[#121316]';

  const inputClasses = {
    playful: 'bg-white text-[#121316] border-3 border-[#121316] shadow-pop-sm focus:ring-4 focus:ring-[#FFE600]',
    terminal: 'bg-[#020617] text-emerald-300 border-2 border-emerald-500/50 focus:ring-2 focus:ring-emerald-400 font-mono',
    futuristic: 'bg-white/5 text-cyan-200 border-2 border-cyan-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 backdrop-blur-md',
    energetic: 'bg-black text-yellow-300 border-3 border-yellow-400 focus:ring-4 focus:ring-yellow-400 font-mono',
    editorial: 'bg-gray-50 text-gray-900 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black rounded-none font-serif',
    experimental: 'bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000] rounded-none',
    digital: 'bg-[#000000] text-emerald-400 border-2 border-emerald-500 focus:ring-2 focus:ring-emerald-500 font-mono',
  }[theme] || 'bg-white text-[#121316] border-2 border-[#121316]';

  const submitButtonClasses = {
    playful: 'bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] border-3 border-[#121316] shadow-pop hover:shadow-pop-lg',
    terminal: 'bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-black border-2 border-emerald-400 shadow-pop-sm',
    futuristic: 'bg-gradient-to-r from-[#00D2D3] to-[#6C5CE7] hover:opacity-90 text-white font-black border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,210,211,0.4)]',
    energetic: 'bg-[#FFE600] hover:bg-yellow-300 text-black font-black border-3 border-black shadow-[4px_4px_0px_#000] uppercase tracking-wider',
    editorial: 'bg-black hover:bg-gray-800 text-white font-bold border border-black uppercase tracking-widest text-xs',
    experimental: 'bg-[#FF4757] hover:bg-red-600 text-white font-black border-3 border-black shadow-[6px_6px_0px_#000] uppercase',
    digital: 'bg-emerald-500 hover:bg-emerald-400 text-black font-black border-2 border-emerald-300 shadow-[0_0_15px_rgba(46,213,115,0.6)] uppercase',
  }[theme] || 'bg-[#FFE600] text-[#121316] border-3 border-[#121316] shadow-pop';

  // -------------------------------------------------------------
  // SUCCESS STATE: DIGITAL EVENT PASS GENERATED
  // -------------------------------------------------------------
  if (submissionResult) {
    const passUrl = `${window.location.origin}/pass/${submissionResult.passId}`;
    return (
      <div id="registration" className={`p-8 sm:p-12 rounded-[36px] ${containerClasses} animate-fadeIn`}>
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-400/20 border-3 border-emerald-500 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
            <PartyPopper className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-xs font-black uppercase">
              ● REGISTRATION CONFIRMED
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              You're Registered! 🎉
            </h3>
            <p className="text-sm font-bold opacity-80">
              Your digital entry pass has been generated. Save or screenshot your unique QR ticket below:
            </p>
          </div>

          {/* DIGITAL PASS PREVIEW CARD */}
          <div className="p-6 rounded-3xl bg-black/40 border-2 border-white/20 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono opacity-60 uppercase block">EVENT PASS ID</span>
                <span className="font-mono text-base font-black text-yellow-400">{submissionResult.passId}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase border border-emerald-500/40">
                ACTIVE
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
              <div className="space-y-1">
                <h4 className="font-black text-base">{eventTitle}</h4>
                <p className="text-xs opacity-75 font-mono">Present this QR code at the check-in desk at NIAT Lab 5.0.</p>
              </div>

              <div className="p-2.5 bg-white rounded-2xl border-2 border-black flex-shrink-0 shadow-lg">
                <QRCodeSVG value={passUrl} size={110} level="M" />
              </div>
            </div>
          </div>

          {/* PASS ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={`/pass/${submissionResult.passId}`}
              className={`px-7 py-3.5 rounded-full ${submitButtonClasses} font-mono text-xs font-black inline-flex items-center gap-2 transition-all cursor-pointer`}
            >
              <Ticket className="w-4 h-4 stroke-[2.5]" />
              <span>Open Full Digital Pass</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // REGISTRATION CLOSED / INACTIVE STATE
  // -------------------------------------------------------------
  if (!isRegistrationActive) {
    return (
      <div id="registration" className={`p-8 sm:p-12 rounded-[36px] ${containerClasses} text-center space-y-4`}>
        <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-current flex items-center justify-center mx-auto opacity-70">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-2xl font-black tracking-tight">Registration Currently Closed</h3>
          <p className="text-xs sm:text-sm opacity-75 font-medium">
            {eventStatus === 'completed'
              ? 'This event has concluded. Stay tuned for our upcoming workshops and hackathons!'
              : 'Registrations for this event are not currently open.'}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-current text-xs font-bold transition-all"
          >
            <span>Explore Upcoming Events</span>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE REGISTRATION FORM RENDERER
  // -------------------------------------------------------------
  return (
    <div id="registration" className={`p-6 sm:p-10 lg:p-12 rounded-[36px] ${containerClasses}`}>
      
      {/* Form Header */}
      <div className="space-y-3 mb-8 border-b pb-6 border-current/15">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full bg-current/10 border border-current/20 font-mono text-xs font-black uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            REGISTRATION OPEN
          </span>

          {registrationLimit && (
            <span className="text-xs font-mono font-bold opacity-80">
              Capacity: {registrationLimit} Seats
            </span>
          )}
        </div>

        <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
          Reserve Your Spot 🚀
        </h3>

        <p className="text-xs sm:text-sm opacity-80 max-w-xl font-medium">
          Fill out the details below to secure your free builder pass for <span className="font-black underline">{eventTitle}</span>.
        </p>

        {registrationDeadline && (
          <p className="text-xs font-mono opacity-70">
            ⏳ Deadline: {formatDate(registrationDeadline)}
          </p>
        )}
      </div>

      {/* Error Alert */}
      {formErrorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border-2 border-red-500 text-red-600 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{formErrorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={onSubmit} className="space-y-5">
        {formLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-60">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs font-mono font-bold">Loading custom form fields...</span>
          </div>
        ) : (
          displayedFields.map((field, idx) => {
            const fieldKey = field.systemKey || field.$id || `field_${idx}`;
            const value = formValues[fieldKey] ?? '';
            const error = fieldErrors[fieldKey];

            return (
              <div key={field.$id || idx} className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase tracking-wider opacity-90">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.fieldType === 'long_text' ? (
                  <textarea
                    rows={3}
                    value={value}
                    onChange={(e) => onFieldChange(fieldKey, e.target.value)}
                    placeholder={field.placeholder || 'Enter your response...'}
                    className={`w-full px-4 py-3 rounded-2xl outline-none text-sm transition-all ${inputClasses} ${
                      error ? 'border-red-500 ring-2 ring-red-500/40' : ''
                    }`}
                  />
                ) : field.fieldType === 'dropdown' || field.fieldType === 'multiple_choice' ? (
                  <select
                    value={value}
                    onChange={(e) => onFieldChange(fieldKey, e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl outline-none text-sm transition-all ${inputClasses} ${
                      error ? 'border-red-500 ring-2 ring-red-500/40' : ''
                    }`}
                  >
                    <option value="" disabled>
                      {field.placeholder || 'Select an option...'}
                    </option>
                    {(field.options || []).map((opt) => (
                      <option key={opt} value={opt} className="text-black">
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.fieldType === 'email' ? 'email' : field.fieldType === 'number' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => onFieldChange(fieldKey, e.target.value)}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                    className={`w-full px-4 py-3 rounded-2xl outline-none text-sm transition-all ${inputClasses} ${
                      error ? 'border-red-500 ring-2 ring-red-500/40' : ''
                    }`}
                  />
                )}

                {error && (
                  <p className="text-[11px] font-mono text-red-500 font-bold flex items-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}
              </div>
            );
          })
        )}

        {/* Submit CTA */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || formLoading}
            className={`w-full py-4 rounded-2xl ${submitButtonClasses} font-mono text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none disabled:opacity-50`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Digital Pass...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Complete Registration & Get Pass</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] font-mono opacity-60">
          <span>🔒 100% Free for NIAT Pune students</span>
          <span>Instant Pass with QR Code</span>
        </div>
      </form>
    </div>
  );
};
