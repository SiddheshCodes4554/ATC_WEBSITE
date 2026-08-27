import React from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { DynamicRegistrationFormSection } from './DynamicRegistrationFormSection';
import { 
  Zap, 
  Trophy, 
  Flame, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Share2, 
  Check, 
  ShieldCheck, 
  Swords, 
  Timer, 
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EnergeticExperience: React.FC<EventExperienceProps> = (props) => {
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
    <div className="min-h-screen bg-[#0D0D11] text-white pb-24 select-none relative overflow-hidden font-sans">
      
      {/* High-Voltage Background Speed Lines & Neon Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#FFE60010_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FFE600]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[400px] h-[400px] bg-[#FF4757]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top High-Voltage Navigation Bar */}
      <div className="bg-[#121218]/90 backdrop-blur-md border-b-2 border-yellow-400/40 py-3.5 sticky top-20 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-yellow-300 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>All Contests</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-1.5 rounded-full bg-[#FFE600] text-black font-mono text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#fff] hover:scale-105 transition-transform cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Share Arena</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIGH-VOLTAGE ENERGETIC HERO */}
      {/* ========================================================================= */}
      <section className="pt-10 sm:pt-14 pb-10 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <div className="space-y-6">
          
          {/* Top Power Badges */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span className="px-4 py-1 rounded-full bg-[#FFE600] text-black font-black text-xs uppercase flex items-center gap-1.5 shadow-[3px_3px_0px_#FF4757]">
              <Zap className="w-4 h-4 fill-black" />
              {event.eventType || 'NATIONAL HACKATHON'}
            </span>

            <span className="px-3.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              HIGH INTENSITY ARENA
            </span>
          </div>

          {/* Huge Athletic Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] uppercase text-white drop-shadow-[0_4px_16px_rgba(255,230,0,0.3)]">
              {event.title}
            </h1>

            {event.shortDescription && (
              <p className="text-lg sm:text-2xl font-bold text-yellow-300 font-mono tracking-tight">
                ⚡ {event.shortDescription}
              </p>
            )}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono">
            <div className="p-4 rounded-2xl bg-[#181822] border-2 border-yellow-400/30 space-y-1">
              <span className="text-[10px] text-yellow-400 font-bold uppercase block">ARENA SCHEDULE</span>
              <span className="text-xs sm:text-sm font-black text-white">{formatDate(event.startDate)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#181822] border-2 border-yellow-400/30 space-y-1">
              <span className="text-[10px] text-yellow-400 font-bold uppercase block">BATTLEGROUND</span>
              <span className="text-xs sm:text-sm font-black text-white">{event.venue || 'NIAT Lab 5.0, Pune'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#181822] border-2 border-yellow-400/30 space-y-1">
              <span className="text-[10px] text-yellow-400 font-bold uppercase block">PRIZES & GEAR</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400">Podium Trophies + Swag</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* COVER IMAGE WITH SPEED BORDER */}
      {/* ========================================================================= */}
      {coverUrl && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="rounded-[32px] overflow-hidden border-3 border-yellow-400 shadow-[0_0_30px_rgba(255,230,0,0.25)] max-h-[440px]">
            <img src={coverUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CONTENT + FAST ENTRY REGISTRATION */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            
            {/* Arena Rules & Briefing */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-[#181822] border-3 border-white/15 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono text-yellow-300">
                <Swords className="w-4 h-4" />
                <span className="font-black uppercase tracking-wider">CHALLENGE BRIEFING</span>
              </div>

              <div className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                {event.description || event.shortDescription || 'Push your engineering skills to the extreme with fellow student hackers.'}
              </div>
            </div>

            {/* Arena Feature Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div className="p-5 rounded-2xl bg-yellow-400/10 border-2 border-yellow-400/40 space-y-1">
                <Trophy className="w-6 h-6 text-yellow-300" />
                <h4 className="font-black text-sm text-white">Podium Battle</h4>
                <p className="text-xs text-gray-400">Judged live by industry tech leads & NIAT faculty.</p>
              </div>

              <div className="p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/40 space-y-1">
                <Zap className="w-6 h-6 text-red-400" />
                <h4 className="font-black text-sm text-white">Hardware Power</h4>
                <p className="text-xs text-gray-400">Lab 5.0 3D printers, ROS testbeds & components provided.</p>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5">
            <DynamicRegistrationFormSection
              theme="energetic"
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
