import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EventService } from '../../services/eventService';
import { FormService } from '../../services/formService';
import { StorageService } from '../../services/storage.service';
import { ATCEvent, EventStatus, EventType, EventVisualTheme } from '../../types/event.types';
import { FormFieldInput, FormFieldType } from '../../types/form.types';
import { EventExperienceSelector } from '../../components/admin/EventExperienceSelector';
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  Clock, 
  Type, 
  Link as LinkIcon, 
  FileText, 
  Palette, 
  Users, 
  ShieldCheck,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Upload,
  X,
  FileCheck,
  Save,
  Eye,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdminEventGalleryManager } from '../../components/admin/AdminEventGalleryManager';

export const AdminEditEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const stepsList = [
    { num: 1, label: 'Details' },
    { num: 2, label: 'Appearance' },
    { num: 3, label: 'Gallery' },
    { num: 4, label: 'Registration' },
    { num: 5, label: 'Form Builder' },
    { num: 6, label: 'Review & Save' },
  ];

  // STEP 1: EVENT DETAILS
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('workshop');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [status, setStatus] = useState<EventStatus>('upcoming');

  // STEP 2: APPEARANCE
  const [existingCoverImageId, setExistingCoverImageId] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [existingGalleryImageIds, setExistingGalleryImageIds] = useState<string[]>([]);
  const [newGalleryImageFiles, setNewGalleryImageFiles] = useState<File[]>([]);
  const [newGalleryImagePreviews, setNewGalleryImagePreviews] = useState<string[]>([]);
  const [accentColor, setAccentColor] = useState('#FFE600');
  const [visualTheme, setVisualTheme] = useState<EventVisualTheme>('playful');
  const [featured, setFeatured] = useState(false);

  // STEP 3: REGISTRATION SETTINGS
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [registrationLimit, setRegistrationLimit] = useState<string>('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');

  // STEP 4: FORM BUILDER
  const [formFields, setFormFields] = useState<FormFieldInput[]>([]);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormFieldType>('short_text');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptionsText, setNewFieldOptionsText] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Convert ISO Date to datetime-local input string format (YYYY-MM-DDTHH:mm)
  const formatDatetimeForInput = (isoString?: string | null) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const mins = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${mins}`;
    } catch {
      return '';
    }
  };

  // Helper to slugify title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Fetch existing event & form data
  useEffect(() => {
    let isMounted = true;

    const loadEventForEdit = async () => {
      if (!eventId?.trim()) {
        setError('No event ID provided in the URL.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await EventService.getEventById(eventId.trim());
        if (!isMounted) return;

        if (!result.success || !result.data) {
          setError(result.error || 'Event could not be located in Appwrite.');
          setLoading(false);
          return;
        }

        const evt = result.data;
        setTitle(evt.title || '');
        setSlug(evt.slug || '');
        setShortDescription(evt.shortDescription || '');
        setDescription(evt.description || '');
        setEventType(evt.eventType || 'workshop');
        setStartDate(formatDatetimeForInput(evt.startDate));
        setEndDate(formatDatetimeForInput(evt.endDate));
        setVenue(evt.venue || '');
        setStatus(evt.status || 'upcoming');
        setAccentColor(evt.accentColor || '#FFE600');
        setVisualTheme(evt.visualTheme || 'playful');
        setFeatured(Boolean(evt.featured));
        setRegistrationEnabled(Boolean(evt.registrationEnabled));
        setRegistrationLimit(evt.registrationLimit ? String(evt.registrationLimit) : '');
        setRegistrationDeadline(formatDatetimeForInput(evt.registrationDeadline));
        setExistingGalleryImageIds(evt.galleryImageIds || []);

        if (evt.coverImageId) {
          setExistingCoverImageId(evt.coverImageId);
          setCoverImagePreview(StorageService.getEventImageUrl(evt.coverImageId, 800));
        }

        // Load existing form questions if registration is enabled
        if (evt.registrationEnabled) {
          try {
            const formRes = await FormService.getFormByEventId(evt.$id);
            if (formRes.success && formRes.data?.fields && formRes.data.fields.length > 0) {
              setFormFields(formRes.data.fields.map((f, idx) => ({
                id: f.$id || `field-${idx}`,
                label: f.label,
                fieldType: f.fieldType,
                placeholder: f.placeholder,
                required: f.required,
                options: f.options,
                position: f.position ?? idx,
                systemKey: f.systemKey,
              })));
            } else {
              setFormFields([
                { id: 'field-1', label: 'Full Name', fieldType: 'short_text', placeholder: 'Enter full name', required: true, position: 0, systemKey: 'name' },
                { id: 'field-2', label: 'Email Address', fieldType: 'email', placeholder: 'Enter email', required: true, position: 1, systemKey: 'email' },
                { id: 'field-3', label: 'Phone Number', fieldType: 'phone', placeholder: 'Enter phone number', required: false, position: 2, systemKey: 'phone' },
              ]);
            }
          } catch (formErr) {
            console.warn('Notice: Could not load existing form questions:', formErr);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Error loading event.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEventForEdit();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (autoSlug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false);
    setSlug(generateSlug(e.target.value));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = StorageService.validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid image file.');
        return;
      }
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    setExistingCoverImageId(null);
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
      setCoverImagePreview(null);
    }
  };

  // Gallery Photos Handlers
  const handleNewGalleryImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = StorageService.validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'One or more gallery photos have an invalid format.');
        return;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setError(null);
    setNewGalleryImageFiles((prev) => [...prev, ...newFiles]);
    setNewGalleryImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewGalleryImage = (index: number) => {
    if (newGalleryImagePreviews[index]) {
      URL.revokeObjectURL(newGalleryImagePreviews[index]);
    }
    setNewGalleryImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingGalleryImage = async (imageId: string) => {
    setExistingGalleryImageIds((prev) => prev.filter((id) => id !== imageId));
    try {
      await StorageService.deleteEventImage(imageId);
    } catch (delErr) {
      console.warn('Storage cleanup notice:', delErr);
    }
  };

  // Form Builder handlers
  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;

    let optionsArray: string[] | undefined = undefined;
    if (['dropdown', 'multiple_choice', 'checkbox'].includes(newFieldType)) {
      optionsArray = newFieldOptionsText
        .split('\n')
        .map((opt) => opt.trim())
        .filter((opt) => opt.length > 0);
      if (optionsArray.length === 0) {
        optionsArray = ['Option 1', 'Option 2'];
      }
    }

    const newField: FormFieldInput = {
      id: `field-${Date.now()}`,
      label: newFieldLabel.trim(),
      fieldType: newFieldType,
      placeholder: newFieldPlaceholder.trim(),
      required: newFieldRequired,
      options: optionsArray,
      position: formFields.length,
    };

    setFormFields([...formFields, newField]);
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldRequired(false);
    setNewFieldOptionsText('');
    setShowAddFieldModal(false);
  };

  const handleDeleteField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index).map((f, i) => ({ ...f, position: i })));
  };

  const handleRemoveField = (id: string) => {
    setFormFields(formFields.filter((f) => f.id !== id));
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formFields.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...formFields];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setFormFields(updated.map((f, i) => ({ ...f, position: i })));
  };

  const validateCurrentStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!title.trim()) {
        setError('Please enter an event title.');
        return false;
      }
      if (!slug.trim()) {
        setError('Please enter a valid unique slug.');
        return false;
      }
      if (!shortDescription.trim()) {
        setError('Please provide a short description.');
        return false;
      }
      if (!description.trim()) {
        setError('Please provide a full description.');
        return false;
      }
      if (!startDate) {
        setError('Please select an event start date and time.');
        return false;
      }
      if (!venue.trim()) {
        setError('Please specify the event venue.');
        return false;
      }
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const goToPrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Save Updates
  const handleUpdateEvent = async (targetStatus?: EventStatus) => {
    if (isSubmitting || !eventId) return;

    setError(null);

    if (!title.trim() || !slug.trim() || !startDate || !venue.trim()) {
      setError('Please ensure all required fields in Step 1 are completed.');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    let finalCoverImageId = existingCoverImageId;

    try {
      // 1. Upload new cover image if a new file was chosen
      if (coverImageFile) {
        const uploadRes = await StorageService.uploadEventImage(coverImageFile);
        if (uploadRes.success && uploadRes.data?.file_id) {
          finalCoverImageId = uploadRes.data.file_id;
        } else {
          setError(uploadRes.error || 'Failed to upload new cover image.');
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Upload any new gallery photos
      const uploadedGalleryIds: string[] = [];
      if (newGalleryImageFiles.length > 0) {
        for (let i = 0; i < newGalleryImageFiles.length; i++) {
          const galRes = await StorageService.uploadEventImage(newGalleryImageFiles[i]);
          if (galRes.success && galRes.data?.file_id) {
            uploadedGalleryIds.push(galRes.data.file_id);
          } else {
            console.warn('Failed to upload event gallery photo:', galRes.error);
          }
        }
      }

      const finalGalleryImageIds = [...existingGalleryImageIds, ...uploadedGalleryIds];

      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = endDate ? new Date(endDate).toISOString() : null;
      const isoDeadline = registrationDeadline ? new Date(registrationDeadline).toISOString() : null;
      const parsedLimit = registrationLimit ? parseInt(registrationLimit, 10) : null;

      const updatePayload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        eventType,
        startDate: isoStartDate,
        endDate: isoEndDate,
        venue: venue.trim(),
        coverImageId: finalCoverImageId,
        galleryImageIds: finalGalleryImageIds,
        accentColor,
        visualTheme: visualTheme || 'playful',
        featured,
        status: targetStatus || status,
        registrationEnabled,
        registrationLimit: isNaN(parsedLimit as any) ? null : parsedLimit,
        registrationDeadline: isoDeadline,
      };

      const result = await FormService.updateCompleteEvent(
        eventId,
        updatePayload,
        registrationEnabled ? formFields : [],
        `${title} Registration`,
        `Registration form for ${title}`
      );

      if (result.success) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });

        navigate('/admin/events');
      } else {
        setError(result.error || 'Failed to update event in Appwrite.');
      }
    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(err?.message || 'An unexpected error occurred while updating the event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async () => {
    if (!eventId || isDeleting) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await FormService.deleteCompleteEvent(
        eventId,
        existingCoverImageId,
        existingGalleryImageIds
      );
      if (result.success) {
        navigate('/admin/events');
      } else {
        setError(result.error || 'Failed to delete event.');
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Error deleting event.');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const colorPalette = [
    { label: 'Yellow', color: '#FFE600' },
    { label: 'Purple', color: '#6C5CE7' },
    { label: 'Red', color: '#FF6B6B' },
    { label: 'Green', color: '#2ED573' },
    { label: 'Blue', color: '#0984E3' },
    { label: 'Orange', color: '#FF9F43' },
  ];

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center gap-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center animate-bounce">
            <Calendar className="w-8 h-8 text-[#121316]" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[#121316]">Loading Event Details</h3>
            <p className="font-mono text-xs font-bold text-gray-600 mt-1">Retrieving record from Appwrite...</p>
          </div>
          <Loader2 className="w-6 h-6 text-[#6C5CE7] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/events"
              className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE600] transition-colors"
              title="Back to Events"
            >
              <ArrowLeft className="w-5 h-5 text-[#121316]" />
            </Link>
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#6C5CE7]">
                ADMIN EVENT MANAGEMENT • EDIT
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight truncate max-w-lg">
                Edit: {title || 'Event'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#FFE5E5] hover:bg-[#FF4757] hover:text-white border-2 border-[#FF4757] font-mono text-xs font-black text-[#FF4757] flex items-center gap-1.5 transition-all cursor-pointer shadow-pop-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Event</span>
            </button>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E1DCFF] border border-[#121316] font-mono text-xs font-black text-[#6C5CE7]">
              <ShieldCheck className="w-4 h-4" />
              <span>STEP {currentStep} OF 5</span>
            </div>
          </div>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop">
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {stepsList.map((s) => {
              const isPast = s.num < currentStep;
              const isCurrent = s.num === currentStep;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < currentStep || validateCurrentStep(currentStep)) {
                      setCurrentStep(s.num);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl font-mono text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-sm scale-105'
                      : isPast
                      ? 'bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316]'
                      : 'text-gray-400 hover:text-[#121316]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-[#121316] text-white' : isPast ? 'bg-[#6C5CE7] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isPast ? '✓' : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] text-[#121316] flex items-start gap-3 shadow-pop animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-[#FF4757] flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-bold">
              {error}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 1: EVENT DETAILS                                             */}
        {/* ================================================================= */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                <Type className="w-4 h-4 text-[#121316]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#121316] tracking-tight">
                  Step 1: Event Details & Schedule
                </h2>
                <p className="text-xs font-bold text-gray-500">
                  Update event title, slug, descriptions, timing, and venue location.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(true);
                      setSlug(generateSlug(title));
                    }}
                    className="text-[11px] font-mono font-bold text-[#6C5CE7] hover:underline"
                  >
                    Auto-generate from title
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={handleSlugChange}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-mono font-bold text-xs text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Full Description & Agenda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-medium text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="tech_talk">Tech Talk</option>
                    <option value="competition">Competition</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                    Venue / Room <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                    End Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: APPEARANCE                                                */}
        {/* ================================================================= */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                <Palette className="w-4 h-4 text-[#6C5CE7]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#121316] tracking-tight">
                  Step 2: Visual Appearance & Cover
                </h2>
                <p className="text-xs font-bold text-gray-500">
                  Update cover visual, accent color, and homepage spotlight.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Cover Image (Stored in Appwrite atc_event_images)
                </label>

                {coverImagePreview ? (
                  <div className="relative rounded-3xl border-3 border-[#121316] overflow-hidden bg-gray-100 max-w-lg shadow-pop-sm">
                    <img
                      src={coverImagePreview}
                      alt="Cover Preview"
                      className="w-full h-48 sm:h-64 object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-full bg-white border-2 border-[#121316] text-xs font-mono font-black text-[#121316] shadow-pop-sm hover:bg-gray-100 cursor-pointer">
                        Replace Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-1.5 rounded-full bg-[#FF4757] text-white border-2 border-[#121316] shadow-pop-sm hover:bg-[#FF3838] cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="block p-8 border-3 border-dashed border-[#121316] rounded-3xl bg-[#FAF7F0] hover:bg-[#FFF9DB] text-center cursor-pointer transition-colors shadow-pop-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                        <Upload className="w-6 h-6 text-[#6C5CE7]" />
                      </div>
                      <p className="font-bold text-sm text-[#121316]">
                        Click to upload new cover image
                      </p>
                      <p className="font-mono text-xs text-gray-500">
                        JPG, PNG, WebP, AVIF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Event Photo Memories & Gallery (Multiple Photos) */}
              <div className="pt-4 border-t-2 border-[#121316]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                      Event Memories & Photo Gallery ({existingGalleryImageIds.length + newGalleryImagePreviews.length})
                    </label>
                    <span className="text-[11px] font-mono text-gray-500">
                      Upload past event photos, stage shots, hackathon photos, or lab captures
                    </span>
                  </div>

                  <label className="px-4 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex items-center gap-1.5 cursor-pointer transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Event Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleNewGalleryImagesSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Grid of Existing & Newly Added Event Photos */}
                {(existingGalleryImageIds.length > 0 || newGalleryImagePreviews.length > 0) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {/* Existing Photos from Storage */}
                    {existingGalleryImageIds.map((imgId) => (
                      <div
                        key={imgId}
                        className="relative rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 shadow-pop-sm group h-32"
                      >
                        <img
                          src={StorageService.getEventImageUrl(imgId, 400)}
                          alt="Existing event memory"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingGalleryImage(imgId)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white border border-[#121316] shadow-pop-sm text-[#FF4757] hover:bg-[#FFE5E5] transition-all cursor-pointer"
                          title="Delete Photo from Event"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#121316]/70 text-white font-mono text-[9px] font-bold">
                          Saved
                        </span>
                      </div>
                    ))}

                    {/* Newly Selected Photos */}
                    {newGalleryImagePreviews.map((previewUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-2xl border-2 border-[#2ED573] overflow-hidden bg-gray-100 shadow-pop-sm group h-32"
                      >
                        <img
                          src={previewUrl}
                          alt={`New memory preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewGalleryImage(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white border border-[#121316] shadow-pop-sm text-[#FF4757] hover:bg-[#FFE5E5] transition-all cursor-pointer"
                          title="Cancel Upload"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#2ED573] text-[#121316] font-mono text-[9px] font-black">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Accent Color Theme
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {colorPalette.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setAccentColor(p.color)}
                      className={`w-10 h-10 rounded-2xl border-3 border-[#121316] shadow-pop-sm transition-transform cursor-pointer flex items-center justify-center ${
                        accentColor === p.color ? 'scale-110 ring-2 ring-[#121316]' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: p.color }}
                      title={p.label}
                    >
                      {accentColor === p.color && <Check className="w-4 h-4 text-[#121316] stroke-[3]" />}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 pl-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-2xl border-3 border-[#121316] bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold text-gray-600 uppercase">{accentColor}</span>
                  </div>
                </div>
              </div>

              {/* EVENT EXPERIENCE CREATIVE STYLE SELECTOR */}
              <div className="pt-4 border-t border-[#121316]/10">
                <EventExperienceSelector
                  selectedTheme={visualTheme}
                  onThemeSelect={setVisualTheme}
                />
              </div>

              <div className="pt-4 border-t border-[#121316]/10">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-6 h-6 rounded-lg border-2 border-[#121316] accent-[#6C5CE7] cursor-pointer"
                  />
                  <div>
                    <span className="font-black text-sm text-[#121316] block">
                      ★ Highlight as Featured Event
                    </span>
                    <span className="text-xs text-gray-500 font-bold">
                      Places this event prominently on the website homepage.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: EVENT GALLERY MANAGER                                     */}
        {/* ================================================================= */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 animate-fadeIn">
            <AdminEventGalleryManager eventId={eventId || ''} />
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 4: REGISTRATION SETTINGS                                     */}
        {/* ================================================================= */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#FFF9DB] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                <Users className="w-4 h-4 text-[#121316]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#121316] tracking-tight">
                  Step 4: Registration Settings
                </h2>
                <p className="text-xs font-bold text-gray-500">
                  Manage registration availability, capacity limits, and deadlines.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-base text-[#121316]">
                    Accept Student Registrations
                  </h3>
                  <p className="text-xs font-bold text-gray-600 mt-0.5">
                    {registrationEnabled
                      ? 'Registration is currently ON for this event.'
                      : 'Registration is OFF. Displayed as an informational event only.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRegistrationEnabled(!registrationEnabled)}
                  className={`px-5 py-2.5 rounded-full font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all cursor-pointer ${
                    registrationEnabled
                      ? 'bg-[#2ED573] text-[#121316]'
                      : 'bg-[#FF6B6B] text-white'
                  }`}
                >
                  {registrationEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                </button>
              </div>

              {registrationEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                      Registration Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={registrationLimit}
                      onChange={(e) => setRegistrationLimit(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                    />
                    <p className="text-[11px] font-mono text-gray-500">
                      💡 Leave empty for unlimited registrations.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                      Registration Cutoff Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={registrationDeadline}
                      onChange={(e) => setRegistrationDeadline(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 5: FORM BUILDER                                              */}
        {/* ================================================================= */}
        {currentStep === 5 && (
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#121316]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#121316]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#121316] tracking-tight">
                    Step 5: Registration Form Questions
                  </h2>
                  <p className="text-xs font-bold text-gray-500">
                    Add, modify, reorder, or delete custom registration questions.
                  </p>
                </div>
              </div>

              {registrationEnabled && (
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(true)}
                  className="px-4 py-2 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Question</span>
                </button>
              )}
            </div>

            {registrationEnabled && (
              <div className="space-y-4">
                {formFields.map((field, idx) => (
                  <div
                    key={field.id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#121316] text-white font-mono text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-black text-sm text-[#121316]">
                          {field.label}
                        </h4>
                        {field.required && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FF6B6B] text-white font-mono text-[9px] font-black uppercase">
                            Required
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[9px] font-black uppercase">
                          {field.fieldType}
                        </span>
                      </div>

                      {field.placeholder && (
                        <p className="text-xs text-gray-500 font-mono pl-8">
                          Placeholder: "{field.placeholder}"
                        </p>
                      )}

                      {field.options && field.options.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pl-8 pt-1">
                          {field.options.map((opt, oIdx) => (
                            <span key={oIdx} className="px-2 py-0.5 bg-white rounded-lg border border-gray-300 font-mono text-[10px]">
                              • {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white border border-[#121316] disabled:opacity-30 hover:bg-gray-100 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, 'down')}
                        disabled={idx === formFields.length - 1}
                        className="p-1.5 rounded-lg bg-white border border-[#121316] disabled:opacity-30 hover:bg-gray-100 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteField(idx)}
                        className="p-1.5 rounded-lg bg-[#FFE5E5] text-[#FF4757] border border-[#FF4757] hover:bg-[#FF4757] hover:text-white transition-colors cursor-pointer ml-1"
                        title="Delete Field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADD FIELD MODAL */}
            {showAddFieldModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                <div className="w-full max-w-lg bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 space-y-5 paper-pattern">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#121316]/10">
                    <h3 className="font-black text-xl text-[#121316]">
                      Add Custom Form Field
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddFieldModal(false)}
                      className="w-8 h-8 rounded-full bg-[#FAF7F0] border-2 border-[#121316] flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                        Question / Label <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="e.g. GitHub Profile URL"
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-bold text-sm focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                        Field Type
                      </label>
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as FormFieldType)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-bold text-sm focus:outline-none focus:bg-white"
                      >
                        <option value="short_text">Short Text</option>
                        <option value="long_text">Long Text</option>
                        <option value="email">Email Address</option>
                        <option value="phone">Phone Number</option>
                        <option value="number">Number</option>
                        <option value="dropdown">Dropdown Select</option>
                        <option value="multiple_choice">Multiple Choice (Radio)</option>
                        <option value="checkbox">Checkboxes</option>
                        <option value="date">Date</option>
                        <option value="url">Website / URL</option>
                      </select>
                    </div>

                    {['dropdown', 'multiple_choice', 'checkbox'].includes(newFieldType) && (
                      <div className="space-y-1">
                        <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                          Options (One per line)
                        </label>
                        <textarea
                          rows={3}
                          value={newFieldOptionsText}
                          onChange={(e) => setNewFieldOptionsText(e.target.value)}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          className="w-full px-4 py-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs focus:outline-none focus:bg-white"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={newFieldPlaceholder}
                        onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                        placeholder="e.g. https://github.com/..."
                        className="w-full px-4 py-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-bold text-sm focus:outline-none focus:bg-white"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-2 border-[#121316] accent-[#FF6B6B]"
                      />
                      <span className="font-bold text-xs text-[#121316]">
                        Required Question
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#121316]/10">
                    <button
                      type="button"
                      onClick={() => setShowAddFieldModal(false)}
                      className="px-5 py-2 rounded-full bg-[#FAF7F0] font-mono text-xs font-black border-2 border-[#121316]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddField}
                      disabled={!newFieldLabel.trim()}
                      className="px-6 py-2.5 rounded-full bg-[#FFE600] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm disabled:opacity-50"
                    >
                      Add to Form
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6: REVIEW & SAVE                                             */}
        {/* ================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
                <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-[#121316]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#121316] tracking-tight">
                    Step 6: Review & Save Changes
                  </h2>
                  <p className="text-xs font-bold text-gray-500">
                    Confirm your updates before applying changes to Appwrite database.
                  </p>
                </div>
              </div>

              {/* Event Status Selector */}
              <div className="p-5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-sm text-[#121316]">Event Publication Status</h4>
                  <p className="text-xs text-gray-600 font-bold">Draft events are hidden from public listing.</p>
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="px-4 py-2 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316]"
                >
                  <option value="upcoming">Upcoming (Public)</option>
                  <option value="ongoing">Ongoing (Public)</option>
                  <option value="completed">Completed (Public Archive)</option>
                  <option value="draft">Draft (Admin Only)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Event Preview Card */}
              <div 
                className="p-6 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop space-y-4"
                style={{ borderTopColor: accentColor, borderTopWidth: '8px' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-white border border-[#121316] font-mono text-xs font-black uppercase">
                    {eventType}
                  </span>
                  <div className="flex items-center gap-2">
                    {featured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFE600] border border-[#121316] font-mono text-[10px] font-black uppercase">
                        ★ Featured
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] font-mono text-[10px] font-black uppercase">
                      Slug: /{slug}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                  {title || 'Untitled Event'}
                </h3>

                <p className="text-sm font-bold text-gray-700">
                  {shortDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#121316]/10 text-xs font-mono font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                    <span>Starts: {startDate ? new Date(startDate).toLocaleString() : 'Not Set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" />
                    <span>Venue: {venue || 'Not Set'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="p-6 rounded-[36px] bg-[#121316] text-white border-4 border-[#121316] shadow-pop-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-black text-base text-white">
                  Save Changes to Database
                </h4>
                <p className="text-xs text-gray-400 font-bold">
                  All updates and form question modifications will sync immediately.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/admin/events"
                  className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-white shadow-pop-sm cursor-pointer transition-all"
                >
                  Cancel
                </Link>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleUpdateEvent()}
                  className="px-7 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-white shadow-pop hover:shadow-pop-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Appwrite...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 stroke-[3]" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP NAVIGATION BOTTOM CONTROLS */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-[#121316]/10">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm text-[#121316] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <Link
              to="/admin/events"
              className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm text-[#121316] transition-all"
            >
              Cancel
            </Link>
          )}

          {currentStep < 6 && (
            <button
              type="button"
              onClick={goToNextStep}
              className="px-7 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] font-mono text-xs font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 text-[#121316] cursor-pointer transition-all"
            >
              <span>Next: {stepsList[currentStep]?.label || 'Continue'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 space-y-5 paper-pattern">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] shadow-pop flex items-center justify-center mx-auto text-[#FF4757]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-[#121316]">
                Delete Event Permanently?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                Are you sure you want to delete <span className="text-[#FF4757]">"{title}"</span>? This will remove the event, its registration form, and its cover image from Appwrite.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-full bg-[#FAF7F0] font-mono text-xs font-black border-2 border-[#121316] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteEvent}
                className="px-6 py-2.5 rounded-full bg-[#FF4757] hover:bg-[#FF3838] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Event</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEditEventPage;
