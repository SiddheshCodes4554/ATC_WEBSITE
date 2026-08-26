import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EventService } from '../../services/eventService';
import { EventStatus, EventType } from '../../types/event.types';
import { 
  Calendar, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  Clock, 
  Type, 
  Link as LinkIcon, 
  FileText, 
  Layers, 
  Palette, 
  Users, 
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminCreateEventPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('workshop');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [accentColor, setAccentColor] = useState('#FFE600');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<EventStatus>('upcoming');
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [registrationLimit, setRegistrationLimit] = useState<string>('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);

    // Client-side validations
    if (!title.trim()) {
      setError('Please enter an event title.');
      return;
    }
    if (!slug.trim()) {
      setError('Please enter a valid unique slug.');
      return;
    }
    if (!shortDescription.trim()) {
      setError('Please provide a short description for event cards.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a full description for the event.');
      return;
    }
    if (!startDate) {
      setError('Please select an event start date and time.');
      return;
    }
    if (!venue.trim()) {
      setError('Please specify the event venue or lab room.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Date formatting to ISO string
      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = endDate ? new Date(endDate).toISOString() : null;
      const isoDeadline = registrationDeadline ? new Date(registrationDeadline).toISOString() : null;
      const parsedLimit = registrationLimit ? parseInt(registrationLimit, 10) : null;

      const result = await EventService.createEvent({
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        eventType,
        startDate: isoStartDate,
        endDate: isoEndDate,
        venue: venue.trim(),
        accentColor,
        featured,
        status,
        registrationEnabled,
        registrationLimit: isNaN(parsedLimit as any) ? null : parsedLimit,
        registrationDeadline: isoDeadline,
        createdBy: user?.$id || 'admin',
        coverImageId: null, // As requested, empty for now
      });

      if (result.success) {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
        });

        // Navigate back to Admin Events list
        navigate('/admin/events');
      } else {
        setError(result.error || 'Failed to save event to Appwrite.');
      }
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err?.message || 'An unexpected error occurred while saving the event.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/events"
              className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE600] transition-colors"
              title="Back to Events List"
            >
              <ArrowLeft className="w-5 h-5 text-[#121316]" />
            </Link>
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#6C5CE7]">
                APPWRITE DATABASE • EVENTS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Create New Event
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E1DCFF] border border-[#121316] font-mono text-xs font-black text-[#6C5CE7]">
            <ShieldCheck className="w-4 h-4" />
            <span>ADMIN AUTHORIZED</span>
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

        {/* Main Event Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: CORE INFORMATION */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                <Type className="w-4 h-4 text-[#121316]" />
              </div>
              <h2 className="text-lg font-black text-[#121316] tracking-tight">
                1. Core Information
              </h2>
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
                  disabled={isSubmitting}
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Git & GitHub: Road to GSoC"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                />
              </div>

              {/* Event Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                    Unique URL Slug <span className="text-red-500">*</span>
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
                    disabled={isSubmitting}
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="e.g. git-github-road-to-gsoc"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-mono font-bold text-xs text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                  />
                </div>
                <p className="text-[11px] font-mono text-gray-500">
                  Public URL preview: <span className="text-[#6C5CE7] font-bold">/events/{slug || 'your-slug'}</span>
                </p>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Short Description (For Cards & Banners) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  disabled={isSubmitting}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A concise 1-2 sentence hook explaining what attendees will build or learn..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Full Description & Agenda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  disabled={isSubmitting}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of the workshop schedule, guest speakers, hardware toolkits, prerequisites..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-medium text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: EVENT LOGISTICS */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#6C5CE7]" />
              </div>
              <h2 className="text-lg font-black text-[#121316] tracking-tight">
                2. Schedule & Logistics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={eventType}
                  disabled={isSubmitting}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                >
                  <option value="workshop">Workshop</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="tech_talk">Tech Talk</option>
                  <option value="competition">Competition</option>
                  <option value="experience">Experience</option>
                </select>
              </div>

              {/* Venue */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Venue / Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. ATC 5.0 Maker Studio / Lab 302"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  disabled={isSubmitting}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  End Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  disabled={isSubmitting}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PUBLICATION & REGISTRATION SETTINGS */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#FFF9DB] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#121316]" />
              </div>
              <h2 className="text-lg font-black text-[#121316] tracking-tight">
                3. Display & Registration
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Publication Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Initial Status
                </label>
                <select
                  value={status}
                  disabled={isSubmitting}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                >
                  <option value="upcoming">Upcoming (Visible on Website)</option>
                  <option value="draft">Draft (Admin-Only Preview)</option>
                  <option value="ongoing">Ongoing (Live Now)</option>
                  <option value="completed">Completed (Archived)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Accent Theme Color
                </label>
                <div className="flex items-center gap-2">
                  {colorPalette.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setAccentColor(p.color)}
                      className={`w-9 h-9 rounded-xl border-2 border-[#121316] shadow-pop-sm transition-transform cursor-pointer ${
                        accentColor === p.color ? 'scale-110 ring-2 ring-[#121316]' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: p.color }}
                      title={p.label}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-9 h-9 rounded-xl border-2 border-[#121316] bg-transparent cursor-pointer"
                    title="Custom Color"
                  />
                </div>
              </div>

              {/* Registration Capacity Limit */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Max Attendee Limit (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  disabled={isSubmitting}
                  value={registrationLimit}
                  onChange={(e) => setRegistrationLimit(e.target.value)}
                  placeholder="e.g. 100 (leave empty for unlimited)"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                />
              </div>

              {/* Registration Deadline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                  Registration Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  disabled={isSubmitting}
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
                />
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="pt-4 border-t border-[#121316]/10 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-sm text-[#121316]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-2 border-[#121316] accent-[#6C5CE7] cursor-pointer"
                />
                <span>★ Feature on Website Homepage</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-sm text-[#121316]">
                <input
                  type="checkbox"
                  checked={registrationEnabled}
                  onChange={(e) => setRegistrationEnabled(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-2 border-[#121316] accent-[#2ED573] cursor-pointer"
                />
                <span>Enable Student Registrations</span>
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              to="/admin/events"
              className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm text-[#121316] transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !title || !startDate || !venue}
              className="px-8 py-3.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] disabled:opacity-60 disabled:cursor-not-allowed font-mono text-xs font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2 text-[#121316] cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Appwrite Database...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save & Publish Event</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AdminCreateEventPage;
