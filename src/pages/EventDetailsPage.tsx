import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventService } from '../services/eventService';
import { FormService } from '../services/formService';
import { StorageService } from '../services/storage.service';
import { RegistrationService } from '../services/registrationService';
import { ATCEvent } from '../types/event.types';
import { EventForm, FormField, EventRegistration } from '../types/form.types';
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
  Lock,
  Check,
  PartyPopper,
  Ticket
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
  const [imageError, setImageError] = useState<boolean>(false);

  // Registration Submission States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<EventRegistration | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const loadEventData = async () => {
      if (!slug.trim()) {
        setLoading(false);
        setEvent(null);
        return;
      }

      setImageError(false);
      setLoading(true);
      setEvent(null);
      setEventForm(null);
      setSubmissionResult(null);
      setFormErrorMessage(null);
      setFieldErrors({});
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
          const legacyMatch = eventsArchive[slug.toLowerCase()] || eventsArchive[slug];
          if (legacyMatch) {
            setLegacyEventData(legacyMatch);
            setIsLegacyArchive(true);
          } else {
            setEvent(null);
            setIsLegacyArchive(false);
          }
        }
      } catch (err: any) {
        console.error('Error fetching event data:', err);
        if (isMounted) {
          const legacyMatch = eventsArchive[slug.toLowerCase()] || eventsArchive[slug];
          if (legacyMatch) {
            setLegacyEventData(legacyMatch);
            setIsLegacyArchive(true);
          } else {
            setEvent(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
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

  const handleFormFieldChange = (fieldKey: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldKey]: value }));
    // Clear validation error on change
    if (fieldErrors[fieldKey]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldKey];
        return updated;
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || isSubmitting) return;

    setFormErrorMessage(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await RegistrationService.submitRegistration({
        event,
        form: eventForm,
        formFields: displayedFields,
        answers: formValues,
      });

      if (result.success && result.registration) {
        setSubmissionResult(result.registration);
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
        });
      } else {
        setFormErrorMessage(result.error || 'Failed to complete registration.');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }
    } catch (err: any) {
      console.error('Error submitting event registration:', err);
      setFormErrorMessage(err?.message || 'An unexpected error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

  // Not Found State
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
  const coverUrl = event.coverImageId ? StorageService.getEventImageUrl(event.coverImageId, 1200) : '';
  const accentColor = event.accentColor || '#FFE600';
  const isRegistrationActive = event.registrationEnabled && (event.status === 'upcoming' || event.status === 'ongoing');

  // Fallback default fields if no custom form_fields exist in Appwrite yet
  const displayedFields: FormField[] = eventForm?.fields && eventForm.fields.length > 0
    ? eventForm.fields
    : [
        { label: 'Full Name', fieldType: 'short_text', placeholder: 'Enter your full name', required: true, position: 0, systemKey: 'name' },
        { label: 'Email Address', fieldType: 'email', placeholder: 'your.email@example.com', required: true, position: 1, systemKey: 'email' },
        { label: 'Phone Number', fieldType: 'phone', placeholder: '+91 98765 43210', required: false, position: 2, systemKey: 'phone' },
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
              className="px-3.5 py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 shadow-pop-sm transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2ED573]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {isRegistrationActive && !submissionResult && (
              <a
                href="#register"
                className="px-4 py-1.5 rounded-full bg-[#121316] hover:bg-[#6C5CE7] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1 transition-all"
              >
                <span>Register</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* ================================================================= */}
        {/* EVENT HERO CARD                                                   */}
        {/* ================================================================= */}
        <div 
          className="rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl overflow-hidden"
          style={{ borderTopColor: accentColor, borderTopWidth: '10px' }}
        >
          {/* Cover Graphic / Visual Header */}
          {coverUrl && !imageError ? (
            <div className="w-full h-64 sm:h-96 border-b-4 border-[#121316] bg-gray-100 overflow-hidden relative">
              <img
                src={coverUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
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

          {/* Hero Content */}
          <div className="p-6 sm:p-10 space-y-6">
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316]">
                {event.eventType}
              </span>

              {event.featured && (
                <span className="px-3 py-1 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] flex items-center gap-1 shadow-pop-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#121316]" />
                  Featured Event
                </span>
              )}

              {event.status === 'ongoing' ? (
                <span className="px-3 py-1 rounded-full bg-[#2ED573] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] animate-pulse">
                  ● Happening Now
                </span>
              ) : event.status === 'upcoming' ? (
                <span className="px-3 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border-2 border-[#6C5CE7] font-mono text-xs font-black uppercase">
                  Upcoming
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 border-2 border-gray-400 font-mono text-xs font-black uppercase">
                  {event.status}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Short description */}
            {event.shortDescription && (
              <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">
                {event.shortDescription}
              </p>
            )}

            {/* Event Key Information Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t-2 border-[#121316]/10">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-600">
                  <Clock className="w-4 h-4 text-[#6C5CE7]" />
                  <span>START TIME</span>
                </div>
                <p className="font-mono text-xs font-black text-[#121316]">
                  {formatDate(event.startDate)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-600">
                  <MapPin className="w-4 h-4 text-[#FF6B6B]" />
                  <span>VENUE</span>
                </div>
                <p className="font-mono text-xs font-black text-[#121316] truncate">
                  {event.venue || 'NIAT Pune Campus'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-600">
                  <Users className="w-4 h-4 text-[#2ED573]" />
                  <span>REGISTRATION</span>
                </div>
                <p className="font-mono text-xs font-black text-[#121316]">
                  {isRegistrationActive ? 'Open • Free' : 'Closed'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* EVENT DETAILS & DESCRIPTION                                       */}
        {/* ================================================================= */}
        <div className="p-6 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#121316]" />
            </div>
            <h2 className="text-xl font-black text-[#121316] tracking-tight">
              About This Event
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
        <div id="register" className="p-6 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-6">
          
          {submissionResult ? (
            /* ============================================================= */
            /* REGISTRATION SUCCESS EXPERIENCE                               */
            /* ============================================================= */
            <div className="p-6 sm:p-10 rounded-[32px] bg-[#E8F8F0] border-4 border-[#2ED573] text-center space-y-6 animate-fadeIn shadow-pop">
              <div className="w-16 h-16 rounded-3xl bg-[#2ED573] border-3 border-[#121316] shadow-pop flex items-center justify-center mx-auto text-[#121316] animate-bounce">
                <Check className="w-9 h-9 stroke-[4]" />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm">
                  ✓ REGISTRATION CONFIRMED 🎉
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
                  You're officially on the list!
                </h3>
                <p className="text-sm font-bold text-gray-700 max-w-md mx-auto">
                  Thank you, <span className="text-[#121316] font-black">{submissionResult.name}</span>. Your digital pass has been generated and confirmed.
                </p>
              </div>

              {/* Digital Pass Preview Card */}
              {submissionResult.passId && (
                <div className="max-w-md mx-auto rounded-3xl bg-white border-3 border-[#121316] shadow-pop-md overflow-hidden text-left space-y-4">
                  <div className="p-4 bg-[#FAF7F0] border-b-2 border-[#121316] flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs font-black text-[#6C5CE7]">
                      <Ticket className="w-4 h-4" />
                      <span>ATC EVENT PASS</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2ED573] text-[#121316] border border-[#121316] font-mono text-[9px] font-black uppercase">
                      ● VALID PASS
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] font-bold text-gray-400 uppercase">ATTENDEE</span>
                        <h4 className="font-black text-lg text-[#121316]">{submissionResult.name}</h4>
                        <p className="font-mono text-xs text-gray-600 font-bold">{event.title}</p>
                      </div>

                      {/* Small QR Code Thumbnail */}
                      <div className="p-2 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm flex-shrink-0">
                        <QRCodeSVG
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/pass/${submissionResult.passId}`}
                          size={72}
                          level="M"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between font-mono text-xs">
                      <span className="text-gray-500 font-bold">Pass ID:</span>
                      <span className="font-black text-[#6C5CE7]">{submissionResult.passId}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {submissionResult.passId && (
                  <Link
                    to={`/pass/${submissionResult.passId}`}
                    className="px-7 py-3.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 stroke-[2.5]" />
                    <span>VIEW MY PASS →</span>
                  </Link>
                )}

                <Link
                  to="/events"
                  className="px-6 py-3.5 rounded-full bg-[#121316] hover:bg-gray-800 text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all"
                >
                  Back to Events
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmissionResult(null);
                    setFormValues({});
                  }}
                  className="px-5 py-3 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all cursor-pointer"
                >
                  Register Another
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================= */
            /* REGISTRATION FORM SECTION                                     */
            /* ============================================================= */
            <>
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

              {/* Form Global Error Notice */}
              {formErrorMessage && (
                <div className="p-4 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] text-[#121316] flex items-start gap-3 shadow-pop animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-[#FF4757] flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-bold">
                    {formErrorMessage}
                  </div>
                </div>
              )}

              {isRegistrationActive ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  {displayedFields.map((field, idx) => {
                    const fieldKey = field.$id || field.label;
                    const error = fieldErrors[fieldKey] || fieldErrors[field.label];
                    const hasError = Boolean(error);

                    return (
                      <div key={idx} className="space-y-1.5">
                        <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {/* Input Rendering based on fieldType */}
                        {field.fieldType === 'long_text' ? (
                          <textarea
                            rows={3}
                            placeholder={field.placeholder || ''}
                            value={formValues[fieldKey] || ''}
                            onChange={(e) => handleFormFieldChange(fieldKey, e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 font-medium text-sm focus:outline-none focus:bg-white transition-all ${
                              hasError ? 'border-[#FF4757] ring-2 ring-[#FF4757]/20 bg-[#FFF5F5]' : 'border-[#121316] focus:ring-2 focus:ring-[#FFE600]'
                            }`}
                          />
                        ) : field.fieldType === 'dropdown' ? (
                          <select
                            value={formValues[fieldKey] || ''}
                            onChange={(e) => handleFormFieldChange(fieldKey, e.target.value)}
                            className={`w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 font-bold text-sm focus:outline-none focus:bg-white transition-all ${
                              hasError ? 'border-[#FF4757] ring-2 ring-[#FF4757]/20 bg-[#FFF5F5]' : 'border-[#121316] focus:ring-2 focus:ring-[#FFE600]'
                            }`}
                          >
                            <option value="">{field.placeholder || 'Select an option...'}</option>
                            {field.options?.map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.fieldType === 'multiple_choice' ? (
                          <div className={`space-y-2 p-3 rounded-2xl bg-[#FAF7F0] border-2 ${hasError ? 'border-[#FF4757] bg-[#FFF5F5]' : 'border-[#121316]'}`}>
                            {field.options?.map((opt, oIdx) => (
                              <label key={oIdx} className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#121316]">
                                <input
                                  type="radio"
                                  name={`field-${idx}`}
                                  value={opt}
                                  checked={formValues[fieldKey] === opt}
                                  onChange={(e) => handleFormFieldChange(fieldKey, e.target.value)}
                                  className="w-4 h-4 accent-[#6C5CE7]"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : field.fieldType === 'checkbox' ? (
                          <div className={`space-y-2 p-3 rounded-2xl bg-[#FAF7F0] border-2 ${hasError ? 'border-[#FF4757] bg-[#FFF5F5]' : 'border-[#121316]'}`}>
                            {field.options?.map((opt, oIdx) => (
                              <label key={oIdx} className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#121316]">
                                <input
                                  type="checkbox"
                                  value={opt}
                                  checked={Array.isArray(formValues[fieldKey]) && formValues[fieldKey].includes(opt)}
                                  onChange={(e) => {
                                    const currentVals: string[] = Array.isArray(formValues[fieldKey]) ? formValues[fieldKey] : [];
                                    const newVals = e.target.checked
                                      ? [...currentVals, opt]
                                      : currentVals.filter((v) => v !== opt);
                                    handleFormFieldChange(fieldKey, newVals);
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
                            placeholder={field.placeholder || ''}
                            value={formValues[fieldKey] || ''}
                            onChange={(e) => handleFormFieldChange(fieldKey, e.target.value)}
                            className={`w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 font-bold text-sm focus:outline-none focus:bg-white transition-all ${
                              hasError ? 'border-[#FF4757] ring-2 ring-[#FF4757]/20 bg-[#FFF5F5]' : 'border-[#121316] focus:ring-2 focus:ring-[#FFE600]'
                            }`}
                          />
                        )}

                        {/* Inline Field Error Message */}
                        {hasError && (
                          <p className="text-[11px] font-mono font-bold text-[#FF4757] flex items-center gap-1 animate-fadeIn">
                            <AlertCircle className="w-3 h-3" />
                            <span>{error}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-4 border-t-2 border-[#121316]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="font-mono text-xs text-gray-500 font-bold">
                      ⚡ Free registration • Instant confirmation
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-sm font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>REGISTERING...</span>
                        </>
                      ) : (
                        <>
                          <span>REGISTER NOW</span>
                          <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                        </>
                      )}
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
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default EventDetailsPage;
