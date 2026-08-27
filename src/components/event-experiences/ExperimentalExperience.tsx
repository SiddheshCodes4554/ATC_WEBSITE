import React from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { DynamicRegistrationFormSection } from './DynamicRegistrationFormSection';
import { 
  Flame, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Share2, 
  Check, 
  Zap, 
  Skull, 
  ShieldAlert 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExperimentalExperience: React.FC<EventExperienceProps> = (props) => {
  const {
    event,
    eventForm,
    displayedFields,
    formValues,
    onFieldChange,
    onSubmit,
    isSubmitting,
    submissionResult,
    formErrorMessage,
    fieldErrors,
    formLoading,
    coverUrl,
    accentColor,
    isRegistrationActive,
    formatDate,
    handleShare,
    copied,
  } = props;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-black pb-24 select-none relative overflow-hidden font-mono">
      
      {/* Brutalist Hazard Warning Stripes Header Bar */}
      <div className="h-2.5 bg-[repeating-linear-gradient(45deg,#FFE600,#FFE600_12px,#000_12px,#000_24px)]" />

      {/* Top Raw Nav Header */}
      <div className="bg-white border-b-4 border-black py-3.5 sticky top-20 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FFE600] px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>[ ESC / EVENTS ]</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-1.5 bg-[#FF4757] text-white text-xs font-black border-2 border-black shadow-[3px_3px_0px_#000] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              {copied ? 'PAYLOAD_COPIED!' : 'SHARE_RAW'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BRUTALIST RAW HERO */}
      {/* ========================================================================= */}
      <section className="pt-10 sm:pt-16 pb-10 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-1 bg-black text-[#FFE600] border-2 border-black font-black text-xs uppercase shadow-[4px_4px_0px_#FF4757]">
              ⚠ {event.eventType || 'EXPERIMENTAL SPRINT'}
            </span>

            <span className="px-3.5 py-1 bg-[#FFE600] text-black border-2 border-black font-black text-xs uppercase">
              STATUS: {event.status.toUpperCase()}
            </span>
          </div>

          {/* Heavy Monospace Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] uppercase text-black bg-white inline-block p-2 border-4 border-black shadow-[8px_8px_0px_#000]">
              {event.title}
            </h1>

            {event.shortDescription && (
              <p className="text-base sm:text-xl font-black text-red-600 uppercase bg-[#FFE5E5] p-3 border-2 border-black inline-block">
                // {event.shortDescription}
              </p>
            )}
          </div>

          {/* Raw Grid Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white border-3 border-black shadow-[5px_5px_0px_#000] space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-black block">EXECUTION_DATE</span>
              <span className="text-xs sm:text-sm font-black text-black">{formatDate(event.startDate)}</span>
            </div>

            <div className="p-4 bg-white border-3 border-black shadow-[5px_5px_0px_#000] space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-black block">PHYSICAL_SECTOR</span>
              <span className="text-xs sm:text-sm font-black text-black">{event.venue || 'NIAT Lab 5.0, Pune'}</span>
            </div>

            <div className="p-4 bg-[#FFE600] border-3 border-black shadow-[5px_5px_0px_#000] space-y-1">
              <span className="text-[10px] text-black font-black uppercase block">STUDENT_PASS</span>
              <span className="text-xs sm:text-sm font-black text-black">FREE ENTRY (NO PAYWALL)</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* COVER IMAGE */}
      {/* ========================================================================= */}
      {coverUrl && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="border-4 border-black shadow-[10px_10px_0px_#000] overflow-hidden max-h-[440px] bg-black">
            <img src={coverUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CONTENT + BRUTALIST REGISTRATION */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="p-6 sm:p-8 bg-white border-4 border-black shadow-[8px_8px_0px_#000] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-black text-xs font-black uppercase">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>OPERATIONAL_SPEC</span>
              </div>

              <div className="text-xs sm:text-sm font-bold text-gray-900 leading-relaxed font-sans whitespace-pre-line">
                {event.description || event.shortDescription || 'Pushing hardware, firmware, and code boundaries with zero fluff.'}
              </div>
            </div>

            {/* Brutalist Warning Stamp */}
            <div className="p-6 bg-[#FFF3A8] border-3 border-black space-y-2">
              <span className="text-xs font-black uppercase text-red-600 block">⚡ BUILDER NOTICE:</span>
              <p className="text-xs font-bold text-gray-800">
                Bring your laptops, chargers, and curiosity. Soldering irons, test benches, and snacks provided by ATC Lab 5.0.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DynamicRegistrationFormSection
              theme="experimental"
              eventTitle={event.title}
              isRegistrationActive={isRegistrationActive}
              eventStatus={event.status}
              registrationDeadline={event.registrationDeadline}
              registrationLimit={event.registrationLimit}
              displayedFields={displayedFields}
              formValues={formValues}
              onFieldChange={onFieldChange}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              submissionResult={submissionResult}
              formErrorMessage={formErrorMessage}
              fieldErrors={fieldErrors}
              formLoading={formLoading}
              accentColor={accentColor}
              formatDate={formatDate}
            />
          </div>

        </div>
      </section>

    </div>
  );
};
