import React from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { DynamicRegistrationFormSection } from './DynamicRegistrationFormSection';
import { 
  Layers, 
  Cpu, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Share2, 
  Check, 
  Terminal, 
  Radio, 
  ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DigitalExperience: React.FC<EventExperienceProps> = (props) => {
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
    <div className="min-h-screen bg-[#030C08] text-emerald-300 pb-24 select-none relative overflow-hidden font-mono">
      
      {/* CRT Monitor Scanline Overlay effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] [background-size:100%_4px] pointer-events-none z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(#10ac8418_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Top Retro Digital Header */}
      <div className="bg-[#051710]/90 backdrop-blur-md border-b-2 border-emerald-500/50 py-3.5 sticky top-20 z-30 shadow-[0_0_20px_rgba(16,172,132,0.2)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>[ SYSTEM // EVENTS ]</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-xs font-black text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? 'SIGNAL_DISPATCHED' : 'BROADCAST_SIGNAL'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHOSPHOR CRT HERO */}
      {/* ========================================================================= */}
      <section className="pt-10 sm:pt-16 pb-10 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded bg-emerald-950 border border-emerald-400 text-xs font-black text-emerald-300 uppercase shadow-[0_0_10px_rgba(46,213,115,0.4)]">
              ⚡ {event.eventType || 'HARDWARE & IOT LAB'}
            </span>

            <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              STATUS: {event.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-[0_0_15px_rgba(46,213,115,0.6)]">
              {event.title}
            </h1>

            {event.shortDescription && (
              <p className="text-base sm:text-xl text-emerald-200/90 leading-relaxed font-sans">
                {event.shortDescription}
              </p>
            )}
          </div>

          {/* Circuit Metrics Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-[#071F15] border border-emerald-500/40 space-y-1 shadow-[0_0_10px_rgba(16,172,132,0.15)]">
              <span className="text-[10px] text-emerald-400/70 uppercase block">EVENT_CLOCK</span>
              <span className="text-xs sm:text-sm font-black text-white">{formatDate(event.startDate)}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#071F15] border border-emerald-500/40 space-y-1 shadow-[0_0_10px_rgba(16,172,132,0.15)]">
              <span className="text-[10px] text-emerald-400/70 uppercase block">NODE_LOCATION</span>
              <span className="text-xs sm:text-sm font-black text-white">{event.venue || 'NIAT Lab 5.0, Pune'}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#071F15] border border-emerald-500/40 space-y-1 shadow-[0_0_10px_rgba(16,172,132,0.15)]">
              <span className="text-[10px] text-emerald-400/70 uppercase block">ENTITLEMENT</span>
              <span className="text-xs sm:text-sm font-black text-emerald-300">OPEN PROTOCOL (FREE)</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* COVER IMAGE */}
      {/* ========================================================================= */}
      {coverUrl && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-[0_0_25px_rgba(16,172,132,0.3)] max-h-[440px]">
            <img src={coverUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CIRCUIT DETAILS + REGISTRATION */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#071F15] border border-emerald-500/40 shadow-lg space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/30 text-xs font-black uppercase text-emerald-400">
                <Cpu className="w-4 h-4" />
                <span>CIRCUIT_SCHEMATIC_DESCRIPTION</span>
              </div>

              <div className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans whitespace-pre-line">
                {event.description || event.shortDescription || 'Hands-on embedded systems, IoT architecture, and telemetry laboratory.'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DynamicRegistrationFormSection
              theme="digital"
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
