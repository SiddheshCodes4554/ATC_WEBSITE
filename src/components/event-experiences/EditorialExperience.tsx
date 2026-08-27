import React from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { DynamicRegistrationFormSection } from './DynamicRegistrationFormSection';
import { 
  BookOpen, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Share2, 
  Check, 
  Quote, 
  Award, 
  Sparkles, 
  Compass 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EditorialExperience: React.FC<EventExperienceProps> = (props) => {
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
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-24 select-none relative overflow-hidden font-sans">
      
      {/* Top Editorial Nav Header */}
      <div className="bg-[#FDFBF7]/90 backdrop-blur-md border-b border-gray-200 py-4 sticky top-20 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-gray-700 hover:text-black transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Index / Events</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-500 uppercase hidden sm:inline">
              EDITION 2026
            </span>

            <button
              onClick={handleShare}
              className="px-4 py-1.5 rounded-full bg-black text-white font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REFINED EDITORIAL MAGAZINE HERO */}
      {/* ========================================================================= */}
      <section className="pt-12 sm:pt-20 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="space-y-8">
          
          <div className="flex items-center justify-between border-b border-gray-300 pb-4">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#6C5CE7]">
              ● {event.eventType || 'SPECIAL KEYNOTE SESSION'}
            </span>
            <span className="font-mono text-xs text-gray-500">
              NIAT INNOVATION FORUM
            </span>
          </div>

          {/* Large Editorial Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.06] text-gray-900">
              {event.title}
            </h1>

            {event.shortDescription && (
              <p className="text-xl sm:text-2xl text-gray-600 font-serif italic leading-relaxed">
                "{event.shortDescription}"
              </p>
            )}
          </div>

          {/* Key Facts Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-b border-gray-300 py-6 font-mono text-xs">
            <div>
              <span className="text-gray-400 uppercase block mb-1">DATE & SCHEDULE</span>
              <span className="font-bold text-gray-900 text-sm">{formatDate(event.startDate)}</span>
            </div>
            <div>
              <span className="text-gray-400 uppercase block mb-1">AUDITORIUM / SECTOR</span>
              <span className="font-bold text-gray-900 text-sm">{event.venue || 'NIAT Lab 5.0 • Pune'}</span>
            </div>
            <div>
              <span className="text-gray-400 uppercase block mb-1">ADMISSION</span>
              <span className="font-bold text-emerald-700 text-sm">Complimentary • RSVP Required</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FULL COVER SPREAD */}
      {/* ========================================================================= */}
      {coverUrl && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
          <div className="overflow-hidden border border-gray-300 shadow-2xl max-h-[500px]">
            <img src={coverUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* ESSAY & REGISTRATION */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Session Overview
              </h3>

              <div className="font-serif text-base sm:text-lg text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
                {event.description || event.shortDescription || 'An insightful session bringing together engineering leaders, researchers, and students.'}
              </div>
            </div>

            {/* Editorial Quote Box */}
            <div className="p-8 bg-gray-100 border-l-4 border-black space-y-2">
              <Quote className="w-6 h-6 text-gray-400" />
              <p className="font-serif italic text-base sm:text-lg text-gray-900">
                "Curiosity is the engine of achievement. Learn with depth, build with intention."
              </p>
              <span className="font-mono text-xs font-bold text-gray-500 uppercase block pt-2">
                — Advanced Tech Club Keynote Board
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DynamicRegistrationFormSection
              theme="editorial"
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
