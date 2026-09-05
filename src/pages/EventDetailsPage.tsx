import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventService } from '../services/eventService';
import { FormService } from '../services/formService';
import { StorageService } from '../services/storage.service';
import { EventGalleryService } from '../services/eventGalleryService';
import { RegistrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import { ATCEvent } from '../types/event.types';
import { EventForm, FormField, EventRegistration } from '../types/form.types';
import { EventGalleryImage } from '../types/eventGallery.types';
import { eventsArchive } from '../data/eventsData';

// Creative Experience System Renderer
import { EventExperienceRenderer } from '../components/event-experiences/EventExperienceRenderer';

// Legacy Archive Sub-components (for classic retrospective showcase fallback)
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
  ArrowLeft, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { PlayfulButton } from '../components/ui/PlayfulButton';
import confetti from 'canvas-confetti';

export const EventDetailsPage: React.FC = () => {
  const params = useParams<{ slug?: string; eventId?: string }>();
  const slug = params.slug || params.eventId || '';
  const { user } = useAuth();

  const [event, setEvent] = useState<ATCEvent | null>(null);
  const [eventForm, setEventForm] = useState<EventForm | null>(null);
  const [galleryImages, setGalleryImages] = useState<EventGalleryImage[]>([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [isLegacyArchive, setIsLegacyArchive] = useState<boolean>(false);
  const [legacyEventData, setLegacyEventData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

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

      setLoading(true);
      setEvent(null);
      setEventForm(null);
      setGalleryImages([]);
      setSubmissionResult(null);
      setFormErrorMessage(null);
      setFieldErrors({});
      setIsLegacyArchive(false);
      setLegacyEventData(null);

      if (user) {
        setFormValues((prev) => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          ...(user.phone ? { phone: user.phone } : {}),
        }));
      }

      try {
        // 1. Fetch from Appwrite database first using the exact slug
        const result = await EventService.getEventBySlug(slug.trim());

        if (!isMounted) return;

        if (result.success && result.data) {
          const loadedEvent = result.data;
          setEvent(loadedEvent);
          setIsLegacyArchive(false);

          // 2. Fetch event gallery from Appwrite event_gallery collection
          try {
            const galleryRes = await EventGalleryService.getEventGallery(loadedEvent.$id);
            if (isMounted && galleryRes.success && galleryRes.data && galleryRes.data.length > 0) {
              setGalleryImages(galleryRes.data);
            } else if (loadedEvent.galleryImageIds && loadedEvent.galleryImageIds.length > 0) {
              // Fallback to existing galleryImageIds mapped to EventGalleryImage items
              const fallbackItems: EventGalleryImage[] = loadedEvent.galleryImageIds.map((fileId, idx) => ({
                $id: `fallback-${fileId}`,
                eventId: loadedEvent.$id,
                fileId,
                caption: `Moment #${idx + 1}`,
                displayOrder: idx,
                isFeatured: idx === 0,
                $createdAt: loadedEvent.$createdAt,
                $updatedAt: loadedEvent.$updatedAt,
                imageUrl: StorageService.getEventImageUrl(fileId, 1600),
                previewUrl: StorageService.getEventImageUrl(fileId, 800),
              }));
              if (isMounted) setGalleryImages(fallbackItems);
            } else if (loadedEvent.slug?.includes('worst-ui') || loadedEvent.$id?.includes('worst-ui')) {
              const defaultWorstUiGallery: EventGalleryImage[] = (eventsArchive['worst-ui-ux']?.gallery || []).map((g, idx) => ({
                $id: `worst-ui-${idx}`,
                eventId: loadedEvent.$id,
                fileId: `worst-ui-${idx}`,
                caption: g.caption,
                displayOrder: idx,
                isFeatured: idx === 0,
                $createdAt: loadedEvent.$createdAt || new Date().toISOString(),
                $updatedAt: loadedEvent.$updatedAt || new Date().toISOString(),
                imageUrl: g.imgUrl || '',
                previewUrl: g.imgUrl || '',
              }));
              if (isMounted) setGalleryImages(defaultWorstUiGallery);
            } else if (loadedEvent.slug?.includes('git') || loadedEvent.$id?.includes('git')) {
              const defaultGitGallery: EventGalleryImage[] = (eventsArchive['git-github-gsoc']?.gallery || []).map((g, idx) => ({
                $id: `git-${idx}`,
                eventId: loadedEvent.$id,
                fileId: `git-${idx}`,
                caption: g.caption,
                displayOrder: idx,
                isFeatured: idx === 0,
                $createdAt: loadedEvent.$createdAt || new Date().toISOString(),
                $updatedAt: loadedEvent.$updatedAt || new Date().toISOString(),
                imageUrl: g.imgUrl || '',
                previewUrl: g.imgUrl || '',
              }));
              if (isMounted) setGalleryImages(defaultGitGallery);
            } else if (loadedEvent.slug?.includes('blockchain') || loadedEvent.$id?.includes('blockchain')) {
              const defaultBlockchainGallery: EventGalleryImage[] = (eventsArchive['mst-blockchain']?.gallery || []).map((g, idx) => ({
                $id: `blockchain-${idx}`,
                eventId: loadedEvent.$id,
                fileId: `blockchain-${idx}`,
                caption: g.caption,
                displayOrder: idx,
                isFeatured: idx === 0,
                $createdAt: loadedEvent.$createdAt || new Date().toISOString(),
                $updatedAt: loadedEvent.$updatedAt || new Date().toISOString(),
                imageUrl: g.imgUrl || '',
                previewUrl: g.imgUrl || '',
              }));
              if (isMounted) setGalleryImages(defaultBlockchainGallery);
            }
          } catch (galleryErr) {
            console.warn('Notice: Gallery fetch error:', galleryErr);
          }

          // 3. If registration is enabled, fetch registration form from Appwrite
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
          // 3. Check if this slug exists as a retrospective archive
          const normalizedSlug = slug.toLowerCase().trim();
          const legacyMatch =
            eventsArchive[normalizedSlug] ||
            eventsArchive[normalizedSlug === 'git-github-road-to-gsoc' ? 'git-github-gsoc' : normalizedSlug] ||
            eventsArchive[normalizedSlug === 'mst-blockchain-workshop' ? 'mst-blockchain' : normalizedSlug] ||
            eventsArchive[normalizedSlug === 'git-github-gsoc' ? 'git-github-road-to-gsoc' : normalizedSlug] ||
            eventsArchive[normalizedSlug === 'mst-blockchain' ? 'mst-blockchain-workshop' : normalizedSlug];

          if (legacyMatch) {
            const convertedEvent: ATCEvent = {
              $id: legacyMatch.id || normalizedSlug,
              $createdAt: new Date().toISOString(),
              $updatedAt: new Date().toISOString(),
              title: legacyMatch.title,
              slug: normalizedSlug,
              shortDescription: legacyMatch.tagline,
              description: legacyMatch.about?.paragraphs?.join('\n\n') || legacyMatch.tagline,
              eventType: (legacyMatch.category || 'workshop').toLowerCase(),
              startDate: normalizedSlug.includes('worst')
                ? '2025-12-13T10:00:00.000Z'
                : normalizedSlug.includes('git')
                ? '2026-02-07T10:00:00.000Z'
                : '2026-02-27T10:00:00.000Z',
              venue: legacyMatch.venue || 'NIAT Lab 5.0, Pune',
              accentColor: legacyMatch.heroTheme?.accentColor || '#FFE600',
              visualTheme: normalizedSlug.includes('worst')
                ? 'playful'
                : normalizedSlug.includes('git')
                ? 'terminal'
                : 'futuristic',
              featured: true,
              status: 'completed',
              registrationEnabled: false,
            };
            setEvent(convertedEvent);
            setLegacyEventData(legacyMatch);
            setIsLegacyArchive(false);

            if (legacyMatch.gallery && legacyMatch.gallery.length > 0) {
              const legacyGalleryItems: EventGalleryImage[] = legacyMatch.gallery.map((g: any, idx: number) => ({
                $id: `legacy-${idx}`,
                eventId: legacyMatch.id || normalizedSlug,
                fileId: `legacy-${idx}`,
                caption: g.caption,
                displayOrder: idx,
                isFeatured: idx === 0,
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                imageUrl: g.imgUrl || '',
                previewUrl: g.imgUrl || '',
              }));
              setGalleryImages(legacyGalleryItems);
            }
          } else {
            setEvent(null);
            setIsLegacyArchive(false);
          }
        }
      } catch (err: any) {
        console.error('Error fetching event data:', err);
        if (isMounted) {
          const normalizedSlug = slug.toLowerCase().trim();
          const legacyMatch =
            eventsArchive[normalizedSlug] ||
            eventsArchive[normalizedSlug === 'git-github-road-to-gsoc' ? 'git-github-gsoc' : normalizedSlug] ||
            eventsArchive[normalizedSlug === 'mst-blockchain-workshop' ? 'mst-blockchain' : normalizedSlug];

          if (legacyMatch) {
            const convertedEvent: ATCEvent = {
              $id: legacyMatch.id || normalizedSlug,
              $createdAt: new Date().toISOString(),
              $updatedAt: new Date().toISOString(),
              title: legacyMatch.title,
              slug: normalizedSlug,
              shortDescription: legacyMatch.tagline,
              description: legacyMatch.about?.paragraphs?.join('\n\n') || legacyMatch.tagline,
              eventType: (legacyMatch.category || 'workshop').toLowerCase(),
              startDate: normalizedSlug.includes('worst')
                ? '2025-12-13T10:00:00.000Z'
                : normalizedSlug.includes('git')
                ? '2026-02-07T10:00:00.000Z'
                : '2026-02-27T10:00:00.000Z',
              venue: legacyMatch.venue || 'NIAT Lab 5.0, Pune',
              accentColor: legacyMatch.heroTheme?.accentColor || '#FFE600',
              visualTheme: normalizedSlug.includes('worst')
                ? 'playful'
                : normalizedSlug.includes('git')
                ? 'terminal'
                : 'futuristic',
              featured: true,
              status: 'completed',
              registrationEnabled: false,
            };
            setEvent(convertedEvent);
            setLegacyEventData(legacyMatch);
            setIsLegacyArchive(false);

            if (legacyMatch.gallery && legacyMatch.gallery.length > 0) {
              const legacyGalleryItems: EventGalleryImage[] = legacyMatch.gallery.map((g: any, idx: number) => ({
                $id: `legacy-${idx}`,
                eventId: legacyMatch.id || normalizedSlug,
                fileId: `legacy-${idx}`,
                caption: g.caption,
                displayOrder: idx,
                isFeatured: idx === 0,
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                imageUrl: g.imgUrl || '',
                previewUrl: g.imgUrl || '',
              }));
              setGalleryImages(legacyGalleryItems);
            }
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

  // Ensures core attendee fields (Full Name, Email, Phone) are ALWAYS present in registration forms
  const getCombinedFormFields = (customFields?: FormField[]): FormField[] => {
    const coreFields: FormField[] = [
      {
        $id: 'core-name',
        label: 'Full Name',
        fieldType: 'short_text',
        placeholder: 'Enter your full name',
        required: true,
        position: 0,
        systemKey: 'name',
      },
      {
        $id: 'core-email',
        label: 'Email Address',
        fieldType: 'email',
        placeholder: 'your.email@example.com',
        required: true,
        position: 1,
        systemKey: 'email',
      },
      {
        $id: 'core-phone',
        label: 'Phone Number',
        fieldType: 'phone',
        placeholder: '+91 98765 43210',
        required: false,
        position: 2,
        systemKey: 'phone',
      },
    ];

    if (!customFields || customFields.length === 0) {
      return coreFields;
    }

    const hasName = customFields.some((f) => f.systemKey === 'name' || /^(full\s*)?name$/i.test(f.label.trim()));
    const hasEmail = customFields.some((f) => f.systemKey === 'email' || f.fieldType === 'email' || /email/i.test(f.label.trim()));
    const hasPhone = customFields.some((f) => f.systemKey === 'phone' || f.fieldType === 'phone' || /phone|mobile|contact/i.test(f.label.trim()));

    const missingCore: FormField[] = [];
    if (!hasName) missingCore.push(coreFields[0]);
    if (!hasEmail) missingCore.push(coreFields[1]);
    if (!hasPhone) missingCore.push(coreFields[2]);

    const formattedCustom = customFields.map((f, idx) => ({
      ...f,
      position: missingCore.length + (f.position ?? idx),
    }));

    return [...missingCore, ...formattedCustom];
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'core-name' || key === 'name' ? { name: value } : {}),
      ...(key === 'core-email' || key === 'email' ? { email: value } : {}),
      ...(key === 'core-phone' || key === 'phone' ? { phone: value } : {}),
    }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateForm = (fieldsToValidate: FormField[]): boolean => {
    const errors: Record<string, string> = {};

    for (const field of fieldsToValidate) {
      const keysToTry = [
        field.systemKey,
        field.$id,
        (field as any).id,
        field.label,
        `field_${field.position}`,
      ].filter(Boolean) as string[];

      let val: any = undefined;
      let primaryKey = field.systemKey || field.$id || `field_${field.position}`;

      for (const k of keysToTry) {
        if (formValues[k] !== undefined && formValues[k] !== null && String(formValues[k]).trim() !== '') {
          val = formValues[k];
          primaryKey = k;
          break;
        }
      }

      if (field.required) {
        if (val === undefined || val === null || String(val).trim() === '') {
          errors[primaryKey] = `${field.label} is required.`;
          continue;
        }
      }

      if (field.fieldType === 'email' && val && String(val).trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(String(val).trim())) {
          errors[primaryKey] = 'Please enter a valid email address.';
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setFormErrorMessage(null);

    const fieldsToUse = getCombinedFormFields(eventForm?.fields);

    if (!validateForm(fieldsToUse)) {
      setFormErrorMessage('Please complete all required fields correctly before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await RegistrationService.submitRegistration({
        event,
        form: eventForm,
        formFields: fieldsToUse,
        answers: formValues,
        userId: user?.$id || null,
      });

      if (result.success && result.registration) {
        setSubmissionResult(result.registration);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#6C5CE7', '#2ED573', '#FF4757', '#00D2D3'],
        });
      } else {
        setFormErrorMessage(result.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration submission error:', err);
      setFormErrorMessage(err?.message || 'An unexpected error occurred during submission.');
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
  const coverUrl = event.coverImageId
    ? (event.coverImageId.startsWith('/') || event.coverImageId.startsWith('http')
        ? event.coverImageId
        : StorageService.getEventImageUrl(event.coverImageId, 1200))
    : (event.slug?.includes('worst-ui') || event.$id?.includes('worst-ui'))
    ? '/events/worst-ui-ux-poster.png'
    : (event.slug?.includes('git') || event.$id?.includes('git'))
    ? '/events/git-workshop-poster.jpg'
    : (event.slug?.includes('blockchain') || event.$id?.includes('blockchain'))
    ? '/events/blockchain-workshop-poster.png'
    : '';
  const accentColor = event.accentColor || '#FFE600';
  const isRegistrationActive = event.registrationEnabled && (event.status === 'upcoming' || event.status === 'ongoing');

  // Combined fields: always guarantees Full Name, Email, Phone + custom fields
  const displayedFields: FormField[] = getCombinedFormFields(eventForm?.fields);

  return (
    <EventExperienceRenderer
      event={event}
      eventForm={eventForm}
      displayedFields={displayedFields}
      formValues={formValues}
      onFieldChange={handleFieldChange}
      onSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
      submissionResult={submissionResult}
      formErrorMessage={formErrorMessage}
      fieldErrors={fieldErrors}
      formLoading={formLoading}
      coverUrl={coverUrl}
      accentColor={accentColor}
      isRegistrationActive={isRegistrationActive}
      formatDate={formatDate}
      handleShare={handleShare}
      copied={copied}
      galleryImages={galleryImages}
    />
  );
};
