import React, { useState } from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { DynamicRegistrationFormSection } from './DynamicRegistrationFormSection';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Share2, 
  Check, 
  AlertTriangle, 
  Heart, 
  Star, 
  Laugh, 
  Zap, 
  Trophy, 
  Lightbulb, 
  ArrowUpRight 
} from 'lucide-react';
import { SparkleDoodle, PlanetDoodle, SpiralScribble } from '../doodles/DoodleSvgs';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const PlayfulExperience: React.FC<EventExperienceProps> = (props) => {
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

  // Chaotic Runaway Button Easter Egg for Worst UI / Playful Experience
  const [btnPos, setBtnPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);

  const handleRunaway = () => {
    const randomX = Math.floor((Math.random() - 0.5) * 200);
    const randomY = Math.floor((Math.random() - 0.5) * 120);
    setBtnPos({ x: randomX, y: randomY });
    setClickCount((prev) => prev + 1);

    if (clickCount >= 3) {
      confetti({ particleCount: 30, spread: 60 });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] paper-pattern pb-24 select-none relative overflow-hidden">
      
      {/* Decorative Doodles Background */}
      <div className="absolute top-12 left-8 opacity-40 pointer-events-none hidden md:block animate-wiggle">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>
      <div className="absolute top-20 right-12 opacity-40 pointer-events-none hidden md:block animate-float-slow">
        <PlanetDoodle className="w-16 h-16" />
      </div>
      <div className="absolute top-96 left-6 opacity-30 pointer-events-none hidden lg:block">
        <SpiralScribble className="w-14 h-14" color="#FFE600" />
      </div>

      {/* Top Navigation & Breadcrumb */}
      <div className="bg-white/85 backdrop-blur-md border-b-3 border-[#121316] py-3.5 sticky top-20 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#121316] hover:text-[#6C5CE7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 shadow-pop-sm transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2ED573]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Event</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PLAYFUL HERO SECTION WITH STICKERS & ASYMMETRIC ROTATED BADGES */}
      {/* ========================================================================= */}
      <section className="pt-10 sm:pt-14 pb-12 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <div className="space-y-6">
          
          {/* Top Pill Tags Row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-[#FF6B6B] text-white border-3 border-[#121316] shadow-pop-sm font-mono text-xs sm:text-sm font-black uppercase rotate-[-2deg]">
              🎪 {event.eventType || 'PLAYFUL SPRINT'}
            </span>

            <span className="px-3.5 py-1.5 rounded-full bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase rotate-[1.5deg]">
              {event.status === 'completed' ? 'COMPLETED CHAPTER ✓' : 'UPCOMING PLAYGROUND ⚡'}
            </span>

            {event.featured && (
              <span className="px-3.5 py-1.5 rounded-full bg-[#6C5CE7] text-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase">
                ★ FEATURED FLAGSHIP
              </span>
            )}
          </div>

          {/* Large Comic Heading with Accent Shapes */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121316] tracking-tight leading-[1.04]">
              {event.title}{' '}
              <span className="relative inline-block px-3 py-1 bg-[#FFE600] rounded-2xl border-4 border-[#121316] shadow-pop rotate-[-2deg]">
                ⚡
                <Sparkles className="w-6 h-6 text-[#FF6B6B] absolute -top-3 -right-3 animate-pulse" />
              </span>
            </h1>

            {event.shortDescription && (
              <p className="text-xl sm:text-2xl font-black text-[#6C5CE7] font-display">
                "{event.shortDescription}"
              </p>
            )}
          </div>

          {/* Info Quick Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3 rotate-[-1deg]">
              <div className="w-10 h-10 rounded-xl bg-[#FFE600] border-2 border-[#121316] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#121316]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">DATE & TIME</span>
                <span className="text-xs sm:text-sm font-black text-[#121316]">{formatDate(event.startDate)}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3 rotate-[1deg]">
              <div className="w-10 h-10 rounded-xl bg-[#A29BFE] border-2 border-[#121316] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#121316]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">LOCATION</span>
                <span className="text-xs sm:text-sm font-black text-[#121316]">{event.venue || 'NIAT Lab 5.0, Pune'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3 rotate-[-1deg]">
              <div className="w-10 h-10 rounded-xl bg-[#FF7675] border-2 border-[#121316] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">COMMUNITY</span>
                <span className="text-xs sm:text-sm font-black text-[#121316]">100% Free for Students</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* COVER IMAGE WITH POLAROID TAPE / VIBRANT FRAME */}
      {/* ========================================================================= */}
      {coverUrl && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
          <div className="relative p-3 sm:p-5 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl rotate-[0.5deg]">
            {/* Washi tape on top corners */}
            <div className="absolute -top-3.5 left-10 w-24 h-7 bg-[#FFE600] border-2 border-[#121316] opacity-90 rotate-[-4deg] z-20 shadow-sm" />
            <div className="absolute -top-3.5 right-10 w-24 h-7 bg-[#FF6B6B] border-2 border-[#121316] opacity-90 rotate-[3deg] z-20 shadow-sm" />

            <div className="rounded-[28px] overflow-hidden border-2 border-[#121316] max-h-[460px]">
              <img
                src={coverUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT & REGISTRATION SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Cols: Narrative & Playful Easter Egg */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* About Story Box */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-[#121316]/10">
                <span className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
                <span className="w-3 h-3 rounded-full bg-[#FFE600]" />
                <span className="w-3 h-3 rounded-full bg-[#2ED573]" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-gray-500 ml-2">
                  EVENT BRIEFING
                </span>
              </div>

              <div className="prose prose-sm sm:prose font-bold text-gray-800 leading-relaxed whitespace-pre-line">
                {event.description || event.shortDescription || 'Get ready for an energetic and unforgettable student sprint at NIAT Pune!'}
              </div>
            </div>

            {/* Playful Interactive "Worst UI" Easter Egg Box */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-[#FFF080] border-4 border-[#121316] shadow-pop-lg space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laugh className="w-5 h-5 text-[#FF4757]" />
                  <span className="font-mono text-xs font-black uppercase text-[#121316]">
                    INTERACTIVE CHAOS WIDGET
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-[#FF4757] text-white px-2.5 py-0.5 rounded-full border border-[#121316]">
                  Clicks: {clickCount}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-gray-800">
                Try clicking this runaway button to test your reaction speed:
              </p>

              <div className="py-6 flex items-center justify-center relative min-h-[90px]">
                <button
                  type="button"
                  onMouseEnter={handleRunaway}
                  onClick={handleRunaway}
                  style={{
                    transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="px-6 py-3 rounded-full bg-[#FF4757] hover:bg-red-600 text-white font-mono text-xs font-black border-3 border-[#121316] shadow-pop-sm cursor-pointer select-none"
                >
                  {clickCount > 0 ? `⚠️ CANNOT CLICK ME (${clickCount})` : '🎯 CLICK ME IF YOU CAN'}
                </button>
              </div>
            </div>

            {/* Highlights Sticky Stickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop-sm rotate-[-1.5deg] space-y-1">
                <div className="text-2xl">🍕</div>
                <h4 className="font-black text-sm text-[#121316]">Pizzas & Late Night Hacking</h4>
                <p className="text-xs font-bold text-gray-700">Fuel for curious builders and crazy weekend ideas.</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#D6EEFF] border-3 border-[#121316] shadow-pop-sm rotate-[1.5deg] space-y-1">
                <div className="text-2xl">🏆</div>
                <h4 className="font-black text-sm text-[#121316]">Certificates & Podium Swag</h4>
                <p className="text-xs font-bold text-gray-700">Official certificates signed by ATC faculty coordinators.</p>
              </div>
            </div>

          </div>

          {/* Right 5 Cols: Dynamic Registration Form */}
          <div className="lg:col-span-5">
            <DynamicRegistrationFormSection
              theme="playful"
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
