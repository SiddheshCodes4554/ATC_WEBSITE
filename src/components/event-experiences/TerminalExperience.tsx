import React, { useState } from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { DynamicRegistrationFormSection } from './DynamicRegistrationFormSection';
import { 
  Terminal, 
  GitBranch, 
  GitPullRequest, 
  GitCommit, 
  Code2, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Share2, 
  Check, 
  ChevronRight, 
  Copy, 
  FolderGit2, 
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TerminalExperience: React.FC<EventExperienceProps> = (props) => {
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

  const [activeBranch, setActiveBranch] = useState<'main' | 'feat/gsoc' | 'fix/merge-wars'>('feat/gsoc');
  const [copiedClone, setCopiedClone] = useState(false);

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone https://github.com/SiddheshCodes4554/ATC_WEBSITE.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-gray-200 font-mono pb-24 select-none relative overflow-hidden">
      
      {/* Background Matrix / Circuit Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#2ed57315_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation & Breadcrumb */}
      <div className="bg-[#0D1322]/90 backdrop-blur-md border-b-2 border-emerald-500/30 py-3.5 sticky top-20 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>cd ../events</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-gray-500">
              branch: <span className="text-emerald-400">{activeBranch}</span>
            </span>
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>git share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TERMINAL HERO SHELL WINDOW */}
      {/* ========================================================================= */}
      <section className="pt-10 sm:pt-14 pb-10 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <div className="rounded-[28px] bg-[#0C1220] border-3 border-emerald-500/40 shadow-[0_0_40px_rgba(46,213,115,0.15)] overflow-hidden">
          
          {/* macOS / Linux Terminal Titlebar */}
          <div className="px-5 py-3.5 bg-[#080D18] border-b-2 border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="text-xs font-mono text-gray-400 ml-3">
                atc-workspace — bash — 80x24
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
              ● REPO LIVE
            </span>
          </div>

          {/* Terminal Body */}
          <div className="p-6 sm:p-10 space-y-6">
            
            {/* Command Prompt Line */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-400 pb-2 border-b border-white/10">
              <span className="text-pink-400 font-black">guest@niat-atc</span>
              <span className="text-gray-500">:</span>
              <span className="text-cyan-400 font-bold">~/workshops</span>
              <span className="text-yellow-400">$</span>
              <span className="text-white font-bold">atc-cli inspect --event="{event.slug}"</span>
              <span className="w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
            </div>

            {/* Event Large Heading & Type */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase">
                <Code2 className="w-4 h-4" />
                <span>{event.eventType || 'OPEN SOURCE WORKSHOP'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {event.title}
              </h1>

              {event.shortDescription && (
                <p className="text-sm sm:text-lg text-emerald-200/80 leading-relaxed font-sans">
                  {event.shortDescription}
                </p>
              )}
            </div>

            {/* Metadata Specs Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase block">START_TIMESTAMP</span>
                <span className="text-xs sm:text-sm text-emerald-300 font-bold">{formatDate(event.startDate)}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase block">VENUE_COORDINATES</span>
                <span className="text-xs sm:text-sm text-emerald-300 font-bold">{event.venue || 'NIAT Lab 5.0, Pune'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase block">ACCESS_LEVEL</span>
                <span className="text-xs sm:text-sm text-emerald-300 font-bold">100% Free Open Source</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* COVER IMAGE OR REPO ARCHITECTURE VIEW */}
      {/* ========================================================================= */}
      {coverUrl && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="rounded-3xl overflow-hidden border-2 border-emerald-500/40 max-h-[420px] relative">
            <img src={coverUrl} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 px-3.5 py-1 rounded bg-black/80 backdrop-blur-md border border-emerald-500/40 text-xs text-emerald-400">
              <span>cover_asset.png • 1080p</span>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CONTENT + GIT GRAPH SPRINT + REGISTRATION */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Event Readme & Interactive Git Tree */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* README.md Terminal Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1220] border-2 border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-gray-400">
                <div className="flex items-center gap-2 text-emerald-400">
                  <FolderGit2 className="w-4 h-4" />
                  <span className="font-bold">README.md</span>
                </div>
                <span>master branch</span>
              </div>

              <div className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                {event.description || event.shortDescription || 'Hands-on interactive open source sprint designed for student builders.'}
              </div>
            </div>

            {/* Interactive Git Graph Simulator */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1220] border-2 border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <GitBranch className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase">Interactive Git Workflow</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setActiveBranch('main')}
                    className={`px-2.5 py-1 rounded border text-[11px] ${
                      activeBranch === 'main' ? 'bg-emerald-500 text-black border-emerald-400 font-bold' : 'border-white/20 text-gray-400'
                    }`}
                  >
                    main
                  </button>
                  <button
                    onClick={() => setActiveBranch('feat/gsoc')}
                    className={`px-2.5 py-1 rounded border text-[11px] ${
                      activeBranch === 'feat/gsoc' ? 'bg-emerald-500 text-black border-emerald-400 font-bold' : 'border-white/20 text-gray-400'
                    }`}
                  >
                    feat/gsoc
                  </button>
                </div>
              </div>

              {/* Commit Nodes Visualization */}
              <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0 animate-ping" />
                  <span className="text-pink-400 font-bold">commit 7f8b9a2</span>
                  <span className="text-gray-400 truncate">Initial workshop testbed scaffold</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span className="text-pink-400 font-bold">commit 3d4e5f6</span>
                  <span className="text-gray-400 truncate">Resolve upstream merge conflicts</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span className="text-pink-400 font-bold">commit 1a2b3c4</span>
                  <span className="text-gray-400 truncate">Merge pull request #42 into master</span>
                </div>
              </div>

              {/* Copy Clone Command Button */}
              <button
                onClick={handleCopyClone}
                className="w-full py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-emerald-500/40 text-xs text-emerald-400 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedClone ? 'Command Copied to Clipboard!' : 'Copy git clone command'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Dynamic Registration Form */}
          <div className="lg:col-span-5">
            <DynamicRegistrationFormSection
              theme="terminal"
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
