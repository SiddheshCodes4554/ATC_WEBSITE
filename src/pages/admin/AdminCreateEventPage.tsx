import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormService } from '../../services/formService';
import { StorageService } from '../../services/storage.service';
import { APPWRITE_CONFIG } from '../../services/appwrite';
import { EventStatus, EventType } from '../../types/event.types';
import { FormFieldInput, FormFieldType } from '../../types/form.types';
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
  Image as ImageIcon,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  Eye,
  CheckCircle2,
  Upload,
  X,
  Layers,
  FileCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminCreateEventPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Current Step: 1 = Details, 2 = Appearance, 3 = Registration, 4 = Form Builder, 5 = Review & Publish
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1: EVENT DETAILS
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('workshop');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');

  // STEP 2: APPEARANCE
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState('#FFE600');
  const [featured, setFeatured] = useState(false);

  // STEP 3: REGISTRATION SETTINGS
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [registrationLimit, setRegistrationLimit] = useState<string>('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');

  // STEP 4: FORM BUILDER
  const [formFields, setFormFields] = useState<FormFieldInput[]>([
    {
      id: 'field-1',
      label: 'Full Name',
      fieldType: 'short_text',
      placeholder: 'e.g. Alex Sharma',
      required: true,
      position: 0,
    },
    {
      id: 'field-2',
      label: 'Email Address',
      fieldType: 'email',
      placeholder: 'alex@example.com',
      required: true,
      position: 1,
    },
    {
      id: 'field-3',
      label: 'Phone Number',
      fieldType: 'phone',
      placeholder: '+91 98765 43210',
      required: false,
      position: 2,
    },
  ]);

  // Modal / Drawer state for adding new field
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormFieldType>('short_text');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptionsText, setNewFieldOptionsText] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to slugify title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

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

  // Image selection handling
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
      setCoverImagePreview(null);
    }
  };

  // Form Builder Handlers
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
    setNewFieldOptionsText('');
    setNewFieldRequired(false);
    setShowAddFieldModal(false);
  };

  const handleDeleteField = (index: number) => {
    const updated = formFields.filter((_, i) => i !== index).map((f, i) => ({ ...f, position: i }));
    setFormFields(updated);
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

  // Step Validation before progressing
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
        setError('Please provide a short description for event cards.');
        return false;
      }
      if (!description.trim()) {
        setError('Please provide a full description for the event.');
        return false;
      }
      if (!startDate) {
        setError('Please select an event start date and time.');
        return false;
      }
      if (!venue.trim()) {
        setError('Please specify the event venue or lab room.');
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

  // Submit Handler for Save as Draft / Publish
  const handleSaveEvent = async (targetStatus: EventStatus) => {
    if (isSubmitting) return;

    setError(null);

    // Validate details
    if (!title.trim() || !slug.trim() || !startDate || !venue.trim()) {
      setError('Please ensure all required fields in Step 1 (Event Details) are completed.');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Cover Image if provided
      let finalCoverImageId: string | null = null;
      if (coverImageFile) {
        try {
          const uploadRes = await StorageService.uploadFile(
            APPWRITE_CONFIG.BUCKETS.EVENT_COVERS,
            coverImageFile
          );
          if (uploadRes.success && uploadRes.data?.file_id) {
            finalCoverImageId = uploadRes.data.file_id;
          } else {
            console.warn('[AdminCreateEventPage] Cover image upload notice:', uploadRes.error);
          }
        } catch (uploadErr) {
          console.warn('[AdminCreateEventPage] Could not upload cover image to storage:', uploadErr);
        }
      }

      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = endDate ? new Date(endDate).toISOString() : null;
      const isoDeadline = registrationDeadline ? new Date(registrationDeadline).toISOString() : null;
      const parsedLimit = registrationLimit ? parseInt(registrationLimit, 10) : null;

      const eventPayload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        eventType,
        startDate: isoStartDate,
        endDate: isoEndDate,
        venue: venue.trim(),
        coverImageId: finalCoverImageId,
        accentColor,
        featured,
        status: targetStatus,
        registrationEnabled,
        registrationLimit: isNaN(parsedLimit as any) ? null : parsedLimit,
        registrationDeadline: isoDeadline,
        createdBy: user?.$id || 'admin',
      };

      const result = await FormService.saveCompleteEvent(
        eventPayload,
        registrationEnabled ? formFields : [],
        `${title} Registration`,
        `Registration form for ${title}`
      );

      if (result.success) {
        confetti({
          particleCount: 90,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
        });

        navigate('/admin/events');
      } else {
        setError(result.error || 'Failed to save event to Appwrite.');
      }
    } catch (err: any) {
      console.error('Error saving event with form:', err);
      setError(err?.message || 'An unexpected error occurred while saving the event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Details' },
    { num: 2, label: 'Appearance' },
    { num: 3, label: 'Registration' },
    { num: 4, label: 'Form Builder' },
    { num: 5, label: 'Review & Publish' },
  ];

  const colorPalette = [
    { label: 'Yellow', color: '#FFE600' },
    { label: 'Purple', color: '#6C5CE7' },
    { label: 'Red', color: '#FF6B6B' },
    { label: 'Green', color: '#2ED573' },
    { label: 'Blue', color: '#0984E3' },
    { label: 'Orange', color: '#FF9F43' },
  ];

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
                ADMIN EVENT BUILDER
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Create & Configure Event
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E1DCFF] border border-[#121316] font-mono text-xs font-black text-[#6C5CE7] self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>STEP {currentStep} OF 5</span>
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

        {/* Error Alert Message */}
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
                  Basic event overview, title, slug, timing, and venue location.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Git & GitHub: Road to GSoC"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                />
              </div>

              {/* Event Slug */}
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
                    placeholder="e.g. git-github-road-to-gsoc"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-mono font-bold text-xs text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                  />
                </div>
                <p className="text-[11px] font-mono text-gray-500">
                  Landing page URL: <span className="text-[#6C5CE7] font-bold">/events/{slug || 'your-slug'}</span>
                </p>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Short Description (Hook for Cards) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Concise 1-2 sentence hook explaining the event value..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Full Description & Agenda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full agenda breakdown, topics covered, hardware prerequisites, schedule..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-medium text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                />
              </div>

              {/* Type, Venue & Schedule Grid */}
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
                    placeholder="e.g. ATC 5.0 Maker Studio"
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
                  Step 2: Visual Appearance
                </h2>
                <p className="text-xs font-bold text-gray-500">
                  Select cover visual, card accent theme color, and featured visibility.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Cover Image Upload & Dropzone */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Cover Image (Optional)
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
                        Replace
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
                        Click to browse or drop event cover image
                      </p>
                      <p className="font-mono text-xs text-gray-500">
                        PNG, JPG, WebP up to 5MB (Fallback vector header will be used if omitted)
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

              {/* Accent Color Palette */}
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
                      title="Custom Color"
                    />
                    <span className="font-mono text-xs font-bold text-gray-600 uppercase">{accentColor}</span>
                  </div>
                </div>
              </div>

              {/* Featured Event Checkbox */}
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
                      Places this event prominently on the website homepage hero and banners.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: REGISTRATION SETTINGS                                     */}
        {/* ================================================================= */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#FFF9DB] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                <Users className="w-4 h-4 text-[#121316]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#121316] tracking-tight">
                  Step 3: Registration Settings
                </h2>
                <p className="text-xs font-bold text-gray-500">
                  Control whether student registrations are enabled, capacity limits, and deadlines.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Registration Enable / Disable Toggle Switch */}
              <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-base text-[#121316]">
                    Accept Student Registrations
                  </h3>
                  <p className="text-xs font-bold text-gray-600 mt-0.5">
                    {registrationEnabled
                      ? 'Students will be able to fill the custom registration form on the public event page.'
                      : 'Registration is disabled. The event will display as an informational showcase only.'}
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

              {registrationEnabled ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  {/* Registration Capacity Limit */}
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
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
                    />
                    <p className="text-[11px] font-mono text-gray-500">
                      💡 Leave empty for unlimited registrations.
                    </p>
                  </div>

                  {/* Registration Deadline */}
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
                    <p className="text-[11px] font-mono text-gray-500">
                      💡 Leave empty if registration should stay open until manually closed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <span>
                    When registration is disabled, the next step (Form Builder) will be skipped as no custom form fields are required.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 4: FORM BUILDER                                              */}
        {/* ================================================================= */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#121316]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#121316]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#121316] tracking-tight">
                    Step 4: Registration Form Builder
                  </h2>
                  <p className="text-xs font-bold text-gray-500">
                    Configure custom questions and input fields for student attendees.
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
                  <span>Add Field</span>
                </button>
              )}
            </div>

            {!registrationEnabled ? (
              <div className="p-8 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] text-center space-y-3">
                <p className="font-black text-base text-[#121316]">
                  Registration is currently turned OFF for this event.
                </p>
                <p className="text-xs font-bold text-gray-600 max-w-md mx-auto">
                  No registration form will be created. You can enable registrations in Step 3 if you'd like to collect attendee responses.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationEnabled(true);
                  }}
                  className="px-5 py-2 rounded-full bg-[#2ED573] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm cursor-pointer"
                >
                  Turn ON Registrations
                </button>
              </div>
            ) : (
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

                    {/* Move & Delete Controls */}
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

            {/* ADD FIELD MODAL / DRAWER */}
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
                        Question / Field Label <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="e.g. GitHub Profile URL or Branch of Study"
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
                        <option value="long_text">Long Text (Multi-line)</option>
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
                        Placeholder Hint
                      </label>
                      <input
                        type="text"
                        value={newFieldPlaceholder}
                        onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                        placeholder="e.g. https://github.com/username"
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
                        Mark this question as mandatory (Required)
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
        {/* STEP 5: REVIEW & PUBLISH                                          */}
        {/* ================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
                <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-[#121316]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#121316] tracking-tight">
                    Step 5: Review & Publish
                  </h2>
                  <p className="text-xs font-bold text-gray-500">
                    Double-check all event details and registration parameters before saving to Appwrite.
                  </p>
                </div>
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
                  {shortDescription || 'No short description provided.'}
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
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#2ED573]" />
                    <span>
                      Registration: {registrationEnabled ? 'Enabled' : 'Disabled'}
                      {registrationLimit ? ` (${registrationLimit} seats max)` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Fields Summary */}
              {registrationEnabled && (
                <div className="p-6 rounded-3xl bg-white border-3 border-[#121316] space-y-3">
                  <h4 className="font-black text-sm text-[#121316] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#6C5CE7]" />
                    <span>Configured Form Questions ({formFields.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {formFields.map((f, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#FAF7F0] border border-gray-300 text-xs font-mono flex items-center justify-between">
                        <span className="font-bold text-[#121316] truncate">{i + 1}. {f.label}</span>
                        <span className="text-gray-500 text-[10px] uppercase">({f.fieldType})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS: SAVE DRAFT VS PUBLISH */}
            <div className="p-6 rounded-[36px] bg-[#121316] text-white border-4 border-[#121316] shadow-pop-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-black text-base text-white">
                  Ready to save to Appwrite?
                </h4>
                <p className="text-xs text-gray-400 font-bold">
                  Drafts remain private to admins. Published events immediately appear on the public website.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveEvent('draft')}
                  className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-white shadow-pop-sm disabled:opacity-50 cursor-pointer transition-all"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveEvent('upcoming')}
                  className="px-7 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-white shadow-pop hover:shadow-pop-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Appwrite...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 stroke-[3]" />
                      <span>Publish Event</span>
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

          {currentStep < 5 && (
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
    </div>
  );
};

export default AdminCreateEventPage;
