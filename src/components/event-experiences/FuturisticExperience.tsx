import React, { useState } from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { DynamicRegistrationFormSection } from './DynamicRegistrationFormSection';
import { 
  Cpu, 
  Layers, 
  Boxes, 
  Radio, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Share2, 
  Check, 
  ShieldCheck, 
  Zap, 
  Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventGalleryRenderer } from '../event-gallery/EventGalleryRenderer';
import { OptimizedImage } from '../common/OptimizedImage';

export const FuturisticExperience: React.FC<EventExperienceProps> = (props) => {
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

  const [activeBlock, setActiveBlock] = useState<number>(1);

  const blocks = [
    { num: '#001', hash: '0x8f3c...b21', label: 'Genesis Block', status: 'VALIDATED' },
    { num: '#002', hash: '0x4a1d...e99', label: 'Smart Contract', status: 'DEPLOYED' },
    { num: '#003', hash: '0x9c2e...77a', label: 'Consensus Node', status: 'BROADCASTING' },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-gray-100 pb-24 select-none relative overflow-hidden">
      
      {/* Futuristic Animated Perspective Grid & Cyber Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#00d2d312_1.5px,transparent_1.5px)] [background-size:32px_32px] pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 to-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Cyber Navigation Bar */}
      <div className="bg-[#080D1A]/85 backdrop-blur-xl border-b border-cyan-500/30 py-3.5 sticky top-20 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO GRID</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>MAINNET SYNC 100%</span>
            </div>

            <button
              onClick={handleShare}
              className="px-4 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Payload Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Broadcast Event</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOLOGRAPHIC HERO SECTION */}
      {/* ========================================================================= */}
      <section className="pt-10 sm:pt-16 pb-12 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <div className="space-y-6">
          
          {/* Cyber Status Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-black tracking-wider uppercase">
              ◈ {event.eventType || 'DECENTRALIZED WORKSHOP'}
            </span>

            <span className="px-3.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/40 font-mono text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              NODE ACTIVE
            </span>
          </div>

          {/* Heading with Neon Glow */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.06] drop-shadow-[0_0_25px_rgba(0,210,211,0.25)]">
              {event.title}
            </h1>

            {event.shortDescription && (
              <p className="text-lg sm:text-2xl font-bold text-cyan-200/90 leading-relaxed font-sans max-w-3xl">
                {event.shortDescription}
              </p>
            )}
          </div>

          {/* Futuristic Telemetry HUD Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono">
            <div className="p-4 rounded-2xl bg-[#091022]/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(0,210,211,0.1)] space-y-1">
              <span className="text-[10px] text-cyan-400/70 uppercase block">EXECUTION TIMESTAMP</span>
              <span className="text-xs sm:text-sm font-black text-white">{formatDate(event.startDate)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#091022]/80 backdrop-blur-md border border-purple-500/30 shadow-[0_0_15px_rgba(108,92,231,0.1)] space-y-1">
              <span className="text-[10px] text-purple-400/70 uppercase block">SPATIAL SECTOR</span>
              <span className="text-xs sm:text-sm font-black text-white">{event.venue || 'NIAT Lab 5.0, Pune'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#091022]/80 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_15px_rgba(46,213,115,0.1)] space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase block">PROTOCOL STATUS</span>
              <span className="text-xs sm:text-sm font-black text-emerald-300">100% Student Subsidized</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* COVER IMAGE VIEW */}
      {/* ========================================================================= */}
      {coverUrl && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(0,210,211,0.2)] max-h-[500px] bg-[#070C1B] flex items-center justify-center relative">
            <OptimizedImage
              src={coverUrl}
              alt={event.title}
              className="w-full max-h-[500px] object-contain mx-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 px-3.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/40 text-xs text-cyan-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>OFFICIAL_EVENT_BANNER.RAW // 4K</span>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* PROTOCOL BRIEFING + INTERACTIVE BLOCKCHAIN VISUALIZER */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mission & Interactive Blockchain Nodes */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Protocol Description Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#091022]/80 backdrop-blur-md border border-cyan-500/30 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-mono text-cyan-400">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold uppercase tracking-wider">PROTOCOL SPECIFICATION</span>
                </div>
                <span>v5.0-MAINNET</span>
              </div>

              <div className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                {event.description || event.shortDescription || 'Deep dive into decentralized systems, cryptography, and smart contracts.'}
              </div>
            </div>

            {/* Interactive Block Visualizer */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#091022]/80 backdrop-blur-md border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-purple-300">
                  <Boxes className="w-4 h-4" />
                  <span className="font-bold uppercase">Distributed Node Visualizer</span>
                </div>
                <span className="text-gray-400">Click node to inspect</span>
              </div>

              {/* 3 Interactive Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {blocks.map((b, idx) => (
                  <div
                    key={b.num}
                    onClick={() => setActiveBlock(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      activeBlock === idx
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,210,211,0.3)] scale-105'
                        : 'bg-black/40 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-cyan-400 block">{b.num}</span>
                    <h4 className="font-bold text-sm text-white">{b.label}</h4>
                    <span className="text-[10px] font-mono text-gray-400 block truncate">{b.hash}</span>
                  </div>
                ))}
              </div>

              {/* Active Block Inspector */}
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 font-mono text-xs text-cyan-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span>SELECTED: {blocks[activeBlock].label}</span>
                  <span className="text-emerald-400 font-bold">{blocks[activeBlock].status}</span>
                </div>
                <p className="text-gray-400 text-[11px]">
                  Cryptographic state verified on NIAT Lab 5.0 compute cluster.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Cyber Registration Form */}
          <div className="lg:col-span-5">
            <DynamicRegistrationFormSection
              theme="futuristic"
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

      {/* Futuristic Cyber Event Gallery */}
      {props.galleryImages && props.galleryImages.length > 0 && (
        <EventGalleryRenderer
          images={props.galleryImages}
          visualTheme="futuristic"
          isCompleted={event.status === 'completed'}
        />
      )}

    </div>
  );
};
