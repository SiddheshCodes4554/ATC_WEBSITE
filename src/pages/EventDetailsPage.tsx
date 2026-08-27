import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventService } from '../services/eventService';
import { FormService } from '../services/formService';
import { StorageService } from '../services/storage.service';
import { ATCEvent } from '../types/event.types';
import { EventForm, FormField } from '../types/form.types';
import { eventsArchive } from '../data/eventsData';

// Legacy Archive Sub-components (for rich retrospective showcase chapters)
import { EventHeroSection } from '../components/event-details/EventHeroSection';
import { EventAtAGlance } from '../components/event-details/EventAtAGlance';
import { AboutEventSection } from '../components/event-details/AboutEventSection';
import { MissionSection } from '../components/event-details/MissionSection';
import { EventHighlightsSection } from '../components/event-details/EventHighlightsSection';
import { EventGalleryScrapbook } from '../components/event-details/EventGalleryScrapbook';
import { LearningsSection } from '../components/event-details/LearningsSection';
import { WinnersSection } from '../components/event-details/WinnersSection';
import { EventQuotesSection } from '../components/event-details/EventQuotesSection';
import { EventClosingFooter } from '../components/event-details/EventClosingFooter';

import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Share2, 
  CalendarCheck, 
  ShieldCheck,
  Zap,
  ArrowUpRight,
  FileText,
  Lock
} from 'lucide-react';
import { PlayfulButton } from '../components/ui/PlayfulButton';
import confetti from 'canvas-confetti';

export const EventDetailsPage: React.FC = () => {
  const params = useParams<{ slug?: string; eventId?: string }>();
  const slug = params.slug || params.eventId || '';

  const [event, setEvent] = useState<ATCEvent | null>(null);
  const [eventForm, setEventForm] = useState<EventForm | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [isLegacyArchive, setIsLegacyArchive] = useState<boolean>(false);
  const [legacyEventData, setLegacyEventData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadEventData = async () => {
      if (!slug.trim()) {
        setLoading(false);
        setEvent(null);
        return;
      }

      setLoading(true);
      setEvent(null);
      setEventForm(null);
      setIsLegacyArchive(false);
      setLegacyEventData(null);

      try {
        // 1. Fetch from Appwrite database first using the exact slug
        const result = await EventService.getEventBySlug(slug.trim());

        if (!isMounted) return;

        if (result.success && result.data) {
          const loadedEvent = result.data;
          setEvent(loadedEvent);
          setIsLegacyArchive(false);

          // 2. If registration is enabled, fetch registration form from Appwrite
          if (loadedEvent.registrationEnabled) {
            setFormLoading(true);
            try {
              const formResult = await FormService.getFormByEventId(loadedEvent.$id);
              if (isMounted && formResult.success && formResult.data) {
                setEventForm(formResult.data);
              }
            } catch (formErr) {
              console.warn('Notice: Registration form not found in Appwrite:', formErr);
            } finally {
              if (isMounted) setFormLoading(false);
            }
          }
        } else {
          // 3. Check if this slug exists as a legacy retrospective archive
          if (eventsArchive[slug.trim()]) {
            setIsLegacyArchive(true);
            setLegacyEventData(eventsArchive[slug.trim()]);
          } else {
            // Slug was not found in Appwrite or legacy archive
            setEvent(null);
            setIsLegacyArchive(false);
          }
        }
      } catch (err) {
        console.error('Error fetching event by slug:', err);
        // Fallback to legacy archive if exact match exists
        if (eventsArchive[slug.trim()]) {
          setIsLegacyArchive(true);
          setLegacyEventData(eventsArchive[slug.trim()]);
        } else {
          setEvent(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEventData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
    });
    alert('Student registration submission pipeline will be connected in the upcoming registration submissions step!');
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'TBA';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center gap-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center animate-bounce">
            <Calendar className="w-8 h-8 text-[#121316]" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[#121316] tracking-tight">Loading Event</h3>
            <p className="font-mono text-xs font-bold text-gray-600 mt-1">Retrieving details from Appwrite...</p>
          </div>
          <Loader2 className="w-6 h-6 text-[#6C5CE7] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // If this matches a legacy retrospective archive chapter, render the rich legacy showcase
  if (isLegacyArchive && legacyEventData) {
    return (
      <div className="flex flex-col min-h-screen">
        <EventHeroSection event={legacyEventData} />
        <EventAtAGlance stats={legacyEventData.stats} />
        <AboutEventSection about={legacyEventData.about} />
        <MissionSection mission={legacyEventData.mission} />
        <EventHighlightsSection highlights={legacyEventData.highlights} />
        <EventGalleryScrapbook gallery={legacyEventData.gallery} />
        <LearningsSection learnings={legacyEventData.learnings} />
        <WinnersSection winners={legacyEventData.winners} />
        <EventQuotesSection quotes={legacyEventData.quotes} />
        <EventClosingFooter />
      </div>
    );
  }

  // Not Found State (strictly shown when no Appwrite event or legacy archive matches this slug)
  if (!event) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#FFE5E5] border-3 border-[#121316] shadow-pop flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-[#FF4757]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black uppercase text-gray-600">
              404 • NOT FOUND
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
              Event Not Found
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
              We could not find any active event matching the URL slug <span className="text-[#6C5CE7] font-mono font-black">"{slug}"</span> in Appwrite.
            </p>
          </div>

          <div className="pt-3">
            <PlayfulButton to="/events" variant="primary" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Browse All Events
            </PlayfulButton>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic Public Appwrite Event Landing Page
  const coverUrl = event.coverImageId ? StorageService.getEventCoverUrl(event.coverImageId, 1200) : '';
  const accentColor = event.accentColor || '#FFE600';
  const isRegistrationActive = event.registrationEnabled && (event.status === 'upcoming' || event.status === 'ongoing');

  // Fallback default fields if no custom form_fields exist in Appwrite yet
  const displayedFields: FormField[] = eventForm?.fields && eventForm.fields.length > 0
    ? eventForm.fields
    : [
        { label: 'Full Name', fieldType: 'short_text', placeholder: 'Enter your full name', required: true, position: 0 },
        { label: 'Email Address', fieldType: 'email', placeholder: 'your.email@example.com', required: true, position: 1 },
        { label: 'Phone Number', fieldType: 'phone', placeholder: '+91 98765 43210', required: false, position: 2 },
      ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] paper-pattern pb-20 select-none">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b-3 border-[#121316] py-3.5 sticky top-20 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#121316] hover:text-[#6C5CE7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied! ✓' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        
        {/* ================================================================= */}
        {/* HERO SECTION                                                      */}
        {/* ================================================================= */}
        <div 
          className="rounded-[40px] border-4 border-[#121316] shadow-pop-xl bg-white overflow-hidden relative"
          style={{ borderTopColor: accentColor, borderTopWidth: '10px' }}
        >
          {/* Cover Graphic / Visual Header */}
          {coverUrl ? (
            <div className="w-full h-64 sm:h-96 border-b-4 border-[#121316] bg-gray-100 overflow-hidden relative">
              <img
                src={coverUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-full py-12 px-6 sm:px-12 border-b-4 border-[#121316] flex items-center justify-between relative overflow-hidden"
              style={{ backgroundColor: accentColor }}
            >
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm">
                  {event.eventType}
                </span>
                <p className="font-mono text-xs font-bold text-[#121316]">
                  Advanced Tech Club • NIAT Pune
                </p>
              </div>

              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-white/90 border-3 border-[#121316] shadow-pop flex items-center justify-center p-3">
                <Calendar className="w-12 h-12 text-[#121316]" />
              </div>
              <Sparkles className="w-40 h-40 text-black/10 absolute -right-8 -bottom-8 pointer-events-none" />
            </div>
          )}

          {/* Hero Content Body */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-[#121316] text-white font-mono text-xs font-black uppercase">
                {event.eventType}
              </span>

              {event.featured && (
                <span className="px-3.5 py-1 rounded-full bg-[#FFE600] text-[#121316] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm">
                  ★ Featured Event
                </span>
              )}

              <span className="px-3.5 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-xs font-black uppercase">
                Status: {event.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight leading-tight">
              {event.title}
            </h1>

            {event.shortDescription && (
              <p className="text-base sm:text-xl font-bold text-gray-700 leading-relaxed max-w-3xl">
                {event.shortDescription}
              </p>
            )}

            {/* Event Quick Logistics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t-2 border-[#121316]/10">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  <span>START TIME</span>
                </div>
                <div className="font-bold text-sm text-[#121316]">
                  {formatDate(event.startDate)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" />
                  <span>VENUE</span>
                </div>
                <div className="font-bold text-sm text-[#121316] truncate">
                  {event.venue}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500">
                  <Users className="w-3.5 h-3.5 text-[#2ED573]" />
                  <span>REGISTRATION</span>
                </div>
                <div className="font-bold text-sm text-[#121316]">
                  {isRegistrationActive ? (
                    <span className="text-emerald-700 font-black">● Open for Students</span>
                  ) : (
                    <span className="text-gray-500 font-bold">○ Closed</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* FULL DESCRIPTION & AGENDA                                         */}
        {/* ================================================================= */}
        <div className="p-6 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-[#121316]/10">
            <div className="w-10 h-10 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#121316]" />
            </div>
            <h2 className="text-2xl font-black text-[#121316] tracking-tight">
              About this Event
            </h2>
          </div>

          {/* Description Text */}
          <div className="prose prose-neutral max-w-none font-medium text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {event.description}
          </div>
        </div>

        {/* ================================================================= */}
        {/* DYNAMIC REGISTRATION SECTION                                      */}
        {/* ================================================================= */}
        <div className="p-6 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#121316]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#121316]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#121316] tracking-tight">
                  {eventForm?.title || 'Event Registration Form'}
                </h3>
                <p className="text-xs font-bold text-gray-500">
                  {eventForm?.description || 'Fill out the form below to register your participation.'}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-xs font-black text-gray-700">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>ATC VERIFIED</span>
            </div>
          </div>

          {isRegistrationActive ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {displayedFields.map((field, idx) => (
                <div key={idx} className="space-y-1.5">
                  <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {/* Input Rendering based on fieldType */}
                  {field.fieldType === 'long_text' ? (
                    <textarea
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={formValues[field.label] || ''}
                      onChange={(e) => handleFormFieldChange(field.label, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                    />
                  ) : field.fieldType === 'dropdown' ? (
                    <select
                      required={field.required}
                      value={formValues[field.label] || ''}
                      onChange={(e) => handleFormFieldChange(field.label, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-bold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                    >
                      <option value="">{field.placeholder || 'Select an option...'}</option>
                      {field.options?.map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.fieldType === 'multiple_choice' ? (
                    <div className="space-y-2 p-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316]">
                      {field.options?.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#121316]">
                          <input
                            type="radio"
                            name={`field-${idx}`}
                            value={opt}
                            required={field.required}
                            checked={formValues[field.label] === opt}
                            onChange={(e) => handleFormFieldChange(field.label, e.target.value)}
                            className="w-4 h-4 accent-[#6C5CE7]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : field.fieldType === 'checkbox' ? (
                    <div className="space-y-2 p-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316]">
                      {field.options?.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#121316]">
                          <input
                            type="checkbox"
                            value={opt}
                            onChange={(e) => {
                              const currentVals: string[] = formValues[field.label] || [];
                              const newVals = e.target.checked
                                ? [...currentVals, opt]
                                : currentVals.filter((v) => v !== opt);
                              handleFormFieldChange(field.label, newVals);
                            }}
                            className="w-4 h-4 rounded accent-[#2ED573]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={
                        field.fieldType === 'email' ? 'email' :
                        field.fieldType === 'phone' ? 'tel' :
                        field.fieldType === 'number' ? 'number' :
                        field.fieldType === 'date' ? 'date' :
                        field.fieldType === 'url' ? 'url' : 'text'
                      }
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={formValues[field.label] || ''}
                      onChange={(e) => handleFormFieldChange(field.label, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-bold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                    />
                  )}
                </div>
              ))}

              <div className="pt-4 border-t-2 border-[#121316]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="font-mono text-xs text-gray-500 font-bold">
                  ⚡ Registration responses will be confirmed via student email.
                </p>

                <button
                  type="submit"
                  className="px-8 py-4 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-sm font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                >
                  <span>Submit Registration</span>
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] text-center space-y-2">
              <Lock className="w-8 h-8 text-gray-400 mx-auto" />
              <h4 className="font-black text-lg text-[#121316]">
                Registration is currently closed
              </h4>
              <p className="text-xs font-bold text-gray-600 max-w-md mx-auto">
                This event is not currently accepting new registrations. Check out other upcoming events or join the ATC community.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default EventDetailsPage;
