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
  Laugh,
  Trophy,
  Code2,
  Terminal,
  Cpu,
  Layers,
  Blocks,
  Copy,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Flame,
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

  // Infer Event Topic for Bespoke Interactive Elements
  const slug = (event.slug || '').toLowerCase();
  const title = (event.title || '').toLowerCase();

  const isWorstUi = slug.includes('worst-ui') || slug.includes('ui-ux') || title.includes('worst ui');
  const isGitGsoc = slug.includes('git') || slug.includes('gsoc') || slug.includes('github') || title.includes('git') || title.includes('gsoc');
  const isBlockchain = slug.includes('blockchain') || slug.includes('mst') || slug.includes('web3') || title.includes('blockchain');

  // Chaotic Runaway Button Easter Egg (Worst UI)
  const [btnPos, setBtnPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);

  const handleRunaway = () => {
    const randomX = Math.floor((Math.random() - 0.5) * 220);
    const randomY = Math.floor((Math.random() - 0.5) * 120);
    setBtnPos({ x: randomX, y: randomY });
    setClickCount((prev) => prev + 1);

    if (clickCount >= 3) {
      confetti({ particleCount: 35, spread: 60, colors: ['#FFE600', '#FF6B6B', '#6C5CE7'] });
    }
  };

  // Terminal Snippet Copy State (Git & GitHub)
  const [copiedCmd, setCopiedCmd] = useState(false);
  const gitCommandSnippet = 'git clone https://github.com/atc-club/open-source-roadmap.git\ncd open-source-roadmap\ngit checkout -b feature/my-first-gsoc-pr';

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(gitCommandSnippet);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  // Web3 Interactive Simulator State (Blockchain)
  const [isMining, setIsMining] = useState(false);
  const [minedBlock, setMinedBlock] = useState<number | null>(null);

  const handleMineBlock = () => {
    setIsMining(true);
    setTimeout(() => {
      setIsMining(false);
      setMinedBlock(Math.floor(100000 + Math.random() * 900000));
      confetti({ particleCount: 40, spread: 70, colors: ['#FFE600', '#2ED573', '#6C5CE7'] });
    }, 1200);
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

      {/* TOP NAVIGATION & SHARE BAR (Static, well-spaced, never overlaps hero content) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
        <div className="p-3 sm:p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back to Events</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#2ED573] stroke-[3]" />
                <span className="text-[#2ED573]">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 stroke-[2.5]" />
                <span>Share Event</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PLAYFUL HERO SECTION WITH STICKERS & ROTATED BADGES                       */}
      {/* ========================================================================= */}
      <section className="pt-4 sm:pt-6 pb-10 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <div className="space-y-6">
          {/* Top Pill Tags Row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-[#FF6B6B] text-white border-3 border-[#121316] shadow-pop-sm font-mono text-xs sm:text-sm font-black uppercase rotate-[-1.5deg]">
              🎪 {event.eventType || 'ATC EXPERIENCE'}
            </span>

            <span className="px-3.5 py-1.5 rounded-full bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase rotate-[1deg]">
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
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121316] tracking-tight leading-[1.1]">
              {event.title}{' '}
              <span className="relative inline-block px-3 py-1 bg-[#FFE600] rounded-2xl border-3 border-[#121316] shadow-pop rotate-[-2deg] align-middle">
                ⚡
                <Sparkles className="w-5 h-5 text-[#FF6B6B] absolute -top-2.5 -right-2.5 animate-pulse" />
              </span>
            </h1>

            {event.shortDescription && (
              <p className="text-lg sm:text-xl font-bold text-gray-700 leading-relaxed max-w-3xl">
                {event.shortDescription}
              </p>
            )}
          </div>

          {/* Info Quick Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3 rotate-[-1deg]">
              <div className="w-10 h-10 rounded-xl bg-[#FFE600] border-2 border-[#121316] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#121316]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono font-black text-gray-500 uppercase block">
                  DATE & TIME
                </span>
                <span className="text-xs sm:text-sm font-black text-[#121316] truncate block">
                  {formatDate(event.startDate)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3 rotate-[1deg]">
              <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] text-white border-2 border-[#121316] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono font-black text-gray-500 uppercase block">
                  LOCATION
                </span>
                <span className="text-xs sm:text-sm font-black text-[#121316] truncate block">
                  {event.venue || 'NIAT Lab 5.0, Pune'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3 rotate-[-1deg]">
              <div className="w-10 h-10 rounded-xl bg-[#2ED573] border-2 border-[#121316] flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#121316]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black text-gray-500 uppercase block">
                  STUDENT ACCESS
                </span>
                <span className="text-xs sm:text-sm font-black text-[#121316]">
                  100% Free Entry
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* COVER IMAGE WITH POLAROID TAPE / VIBRANT FRAME                            */}
      {/* ========================================================================= */}
      {coverUrl && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="relative p-3 sm:p-4 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl rotate-[0.5deg]">
            {/* Washi tape accents */}
            <div className="absolute -top-3.5 left-10 w-24 h-7 bg-[#FFE600] border-2 border-[#121316] opacity-90 rotate-[-4deg] z-20 shadow-sm" />
            <div className="absolute -top-3.5 right-10 w-24 h-7 bg-[#FF6B6B] border-2 border-[#121316] opacity-90 rotate-[3deg] z-20 shadow-sm" />

            <div className="rounded-[26px] overflow-hidden border-2 border-[#121316] max-h-[460px] bg-gray-100">
              <img
                src={coverUrl}
                alt={event.title}
                className="w-full h-full object-cover max-h-[460px]"
              />
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT & REGISTRATION SECTION                                       */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Narrative & Bespoke Interactive Widgets */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. About Story Box */}
            <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-[#121316]/10">
                <span className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
                <span className="w-3 h-3 rounded-full bg-[#FFE600]" />
                <span className="w-3 h-3 rounded-full bg-[#2ED573]" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#121316] ml-2">
                  EVENT BRIEFING & DETAILS
                </span>
              </div>

              <div className="prose prose-sm sm:prose font-medium text-gray-800 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {event.description ||
                  event.shortDescription ||
                  'Get ready for an energetic and unforgettable student sprint at NIAT Pune!'}
              </div>
            </div>

            {/* 2. BESPOKE INTERACTIVE ELEMENTS BASED ON EVENT TOPIC */}

            {/* CASE A: WORST UI/UX HACKATHON -> RUNAWAY BUTTON EASTER EGG */}
            {isWorstUi && (
              <div className="p-6 sm:p-8 rounded-[36px] bg-[#FFF080] border-4 border-[#121316] shadow-pop-lg space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Laugh className="w-5 h-5 text-[#FF4757]" />
                    <span className="font-mono text-xs font-black uppercase text-[#121316]">
                      INTERACTIVE CHAOS WIDGET
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black bg-[#FF4757] text-white px-2.5 py-0.5 rounded-full border border-[#121316]">
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
                    className="px-6 py-3 rounded-full bg-[#FF4757] hover:bg-red-600 text-white font-mono text-xs font-black border-3 border-[#121316] shadow-pop-sm cursor-pointer select-none active:scale-95"
                  >
                    {clickCount > 0
                      ? `⚠️ CANNOT CLICK ME (${clickCount})`
                      : '🎯 CLICK ME IF YOU CAN'}
                  </button>
                </div>
              </div>
            )}

            {/* CASE B: GIT & GITHUB -> INTERACTIVE PLAYFUL TERMINAL */}
            {isGitGsoc && (
              <div className="p-6 sm:p-8 rounded-[36px] bg-[#121316] text-white border-4 border-[#121316] shadow-pop-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF4757]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFE600]" />
                    <div className="w-3 h-3 rounded-full bg-[#2ED573]" />
                    <span className="font-mono text-xs font-bold text-gray-400 ml-2">
                      terminal ~ bash
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCmd}
                    className="px-3 py-1 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2ED573]" />
                        <span className="text-[#2ED573]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy snippet</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="font-mono text-xs text-[#2ED573] space-y-1.5 overflow-x-auto py-2">
                  <p className="text-gray-400"># Clone the workshop repository & create branch:</p>
                  <p>$ git clone https://github.com/atc-club/open-source-roadmap.git</p>
                  <p>$ cd open-source-roadmap</p>
                  <p>$ git checkout -b feature/my-first-gsoc-pr</p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-xl bg-gray-800 text-[#FFE600] font-mono text-[11px] font-bold border border-gray-700">
                    ⚡ Git CLI
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-gray-800 text-[#2ED573] font-mono text-[11px] font-bold border border-gray-700">
                    ★ GSoC 2026 Ready
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-gray-800 text-[#6C5CE7] font-mono text-[11px] font-bold border border-gray-700">
                    📦 Pull Requests
                  </span>
                </div>
              </div>
            )}

            {/* CASE C: BLOCKCHAIN WORKSHOP -> WEB3 SMART CONTRACT TESTER */}
            {isBlockchain && (
              <div className="p-6 sm:p-8 rounded-[36px] bg-[#6C5CE7] text-white border-4 border-[#121316] shadow-pop-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Blocks className="w-5 h-5 text-[#FFE600]" />
                    <span className="font-mono text-xs font-black uppercase">
                      WEB3 PROTOCOL LAB
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#FFE600] text-[#121316] px-2.5 py-0.5 rounded-full border border-[#121316]">
                    Solidity & Hardhat
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-purple-100">
                  Simulate deploying the workshop verification smart contract on testnet:
                </p>

                <div className="p-4 rounded-2xl bg-[#5848CA] border-2 border-purple-400/40 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-purple-200">
                    <span>Network: Sepolia Testnet</span>
                    <span>Gas: ~0.0021 ETH</span>
                  </div>
                  {minedBlock && (
                    <div className="text-[#2ED573] font-bold">
                      ✓ Block #{minedBlock} Confirmed! Contract 0x7f2...a9d deployed.
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleMineBlock}
                  disabled={isMining}
                  className="w-full py-3 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Cpu className="w-4 h-4 stroke-[3]" />
                  <span>
                    {isMining ? 'Mining Block on Testnet...' : 'Deploy Smart Contract'}
                  </span>
                </button>
              </div>
            )}

            {/* 3. HIGHLIGHTS & PERKS STICKERS (Website Palette) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop-sm rotate-[-1.5deg] space-y-1">
                <div className="text-2xl">🍕</div>
                <h4 className="font-black text-sm text-[#121316]">
                  Refreshments & Community
                </h4>
                <p className="text-xs font-bold text-gray-700">
                  Fuel for curious student builders and creative weekend thinkers.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop-sm rotate-[1.5deg] space-y-1">
                <div className="text-2xl">🏆</div>
                <h4 className="font-black text-sm text-[#121316]">
                  Verified Digital Passes & Certs
                </h4>
                <p className="text-xs font-bold text-gray-700">
                  Instant QR access badge and verifiable student certificates.
                </p>
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

export default PlayfulExperience;
