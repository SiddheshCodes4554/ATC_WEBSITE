import React, { useState } from 'react';
import { Sparkles, GitBranch, GitPullRequest, Blocks, AlertTriangle, HelpCircle, Lock, Unlock, ArrowUpRight } from 'lucide-react';
import { SparkleDoodle, LoopyArrow } from '../doodles/DoodleSvgs';
import { Link } from 'react-router-dom';

export const JourneySection: React.FC = () => {
  const [secretRevealed, setSecretRevealed] = useState(false);

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute top-8 left-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#6C5CE7" />
      </div>
      <div className="absolute top-12 right-16 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#FF793F" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
              OUR JOURNEY SO FAR
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFE600" />
            </div>
          </div>

          <p className="mt-4 text-base sm:text-xl text-gray-700 max-w-xl font-medium">
            Milestones, experiments, and chaotic triumphs from our first year:
          </p>
        </div>

        {/* 4 Distinct Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* ============================================================== */}
          {/* Card 01: Worst UI/UX Hackathon (Chaotic & Funny) */}
          {/* ============================================================== */}
          <div className="relative p-6 rounded-[28px] bg-[#FFF080] border-4 border-[#121316] shadow-pop-lg flex flex-col justify-between rotate-[-1.5deg] hover:rotate-0 transition-transform duration-200 group">
            {/* Funny Warning Sticker */}
            <div className="absolute -top-4 -right-2 bg-[#FF6B6B] text-white px-3 py-1 rounded-full border-2 border-[#121316] font-mono font-black text-[10px] uppercase shadow-pop-sm flex items-center gap-1 animate-wiggle">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-300" />
              <span>DO NOT CLICK</span>
            </div>

            <div>
              {/* Event Number & Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-black text-2xl text-[#121316] bg-white px-2.5 py-0.5 rounded-lg border-2 border-[#121316]">
                  01
                </span>
                <span className="text-[11px] font-mono font-bold bg-[#FF7675] text-white px-2 py-0.5 rounded-full border border-[#121316]">
                  HACKATHON
                </span>
              </div>

              {/* Title & Comic Subtitle */}
              <div className="space-y-2 mb-4">
                <h3 className="text-xl sm:text-2xl font-black text-[#121316] leading-tight font-display tracking-tight">
                  Worst UI/UX<br />
                  <span className="text-[#FF4757] underline decoration-wavy decoration-2">
                    Hackathon
                  </span>
                </h3>
                <p className="text-sm font-bold text-gray-800 leading-snug">
                  Break every UX rule possible. Chaotic buttons, inverted scrolling, and pure creative madness.
                </p>
              </div>

              {/* Chaotic UI Elements Doodle */}
              <div className="p-3 bg-white rounded-xl border-2 border-[#121316] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-red-500">Error 418: Teapot</span>
                  <span className="px-1.5 py-0.5 bg-yellow-200 rounded text-[9px] line-through">Cancel</span>
                </div>
                <button 
                  type="button"
                  className="w-full py-1 bg-red-400 text-white font-bold rounded border border-[#121316] shadow-pop-sm text-[10px] transform hover:translate-x-2 transition-transform"
                >
                  ⚠️ DON'T PRESS HERE
                </button>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="mt-5 pt-3 border-t-2 border-[#121316]/20 flex items-center justify-between text-xs font-mono font-bold text-gray-700">
              <span>📅 13 Dec 2025</span>
              <span className="text-emerald-700 font-extrabold">Completed ✓</span>
            </div>
          </div>


          {/* ============================================================== */}
          {/* Card 02: Git & GitHub: Road to GSoC (Branching & Contributions) */}
          {/* ============================================================== */}
          <div className="relative p-6 rounded-[28px] bg-[#E1F5FE] border-4 border-[#121316] shadow-pop-lg flex flex-col justify-between rotate-[1deg] hover:rotate-0 transition-transform duration-200 group">
            <div>
              {/* Event Number & Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-black text-2xl text-[#121316] bg-white px-2.5 py-0.5 rounded-lg border-2 border-[#121316]">
                  02
                </span>
                <span className="text-[11px] font-mono font-bold bg-[#0288D1] text-white px-2 py-0.5 rounded-full border border-[#121316]">
                  OPEN SOURCE
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2 mb-4">
                <h3 className="text-xl sm:text-2xl font-black text-[#121316] leading-tight font-display tracking-tight">
                  Git & GitHub:<br />
                  <span className="text-[#0288D1]">Road to GSoC</span>
                </h3>
                <p className="text-sm font-bold text-gray-800 leading-snug">
                  Learn. Contribute. Build in public. From your first commit to winning Google Summer of Code.
                </p>
              </div>

              {/* Git Graph Visual Doodle */}
              <div className="p-3 bg-[#121316] text-white rounded-xl border-2 border-[#121316] space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>git checkout -b feat/gsoc</span>
                </div>
                {/* Commit Matrix dots */}
                <div className="flex gap-1.5 items-center pt-1">
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="w-3 h-3 rounded bg-emerald-400" />
                  <span className="w-3 h-3 rounded bg-emerald-600" />
                  <span className="w-3 h-3 rounded bg-emerald-300" />
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-[10px] text-gray-400 ml-1">+142 PRs</span>
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="mt-5 pt-3 border-t-2 border-[#121316]/20 flex items-center justify-between text-xs font-mono font-bold text-gray-700">
              <span>📅 7 Feb 2026</span>
              <span className="text-emerald-700 font-extrabold">Completed ✓</span>
            </div>
          </div>


          {/* ============================================================== */}
          {/* Card 03: MST Blockchain Workshop (Connected Block Nodes) */}
          {/* ============================================================== */}
          <div className="relative p-6 rounded-[28px] bg-[#E8F5E9] border-4 border-[#121316] shadow-pop-lg flex flex-col justify-between rotate-[-1deg] hover:rotate-0 transition-transform duration-200 group">
            <div>
              {/* Event Number & Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-black text-2xl text-[#121316] bg-white px-2.5 py-0.5 rounded-lg border-2 border-[#121316]">
                  03
                </span>
                <span className="text-[11px] font-mono font-bold bg-[#388E3C] text-white px-2 py-0.5 rounded-full border border-[#121316]">
                  WEB3 & SYSTEMS
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2 mb-4">
                <h3 className="text-xl sm:text-2xl font-black text-[#121316] leading-tight font-display tracking-tight">
                  MST Blockchain<br />
                  <span className="text-[#2E7D32]">Workshop</span>
                </h3>
                <p className="text-sm font-bold text-gray-800 leading-snug">
                  Exploring decentralized technology. Smart contracts, Solidity, cryptographic hashes & consensus.
                </p>
              </div>

              {/* Isometric Connected Blocks Visual */}
              <div className="p-3 bg-white rounded-xl border-2 border-[#121316] flex items-center justify-center gap-2">
                <div className="p-2 rounded bg-emerald-100 border border-[#121316] text-center font-mono text-[10px] font-bold">
                  <span>#001</span>
                </div>
                <span className="font-bold text-gray-400">→</span>
                <div className="p-2 rounded bg-emerald-200 border border-[#121316] text-center font-mono text-[10px] font-bold">
                  <span>#002</span>
                </div>
                <span className="font-bold text-gray-400">→</span>
                <div className="p-2 rounded bg-emerald-300 border border-[#121316] text-center font-mono text-[10px] font-bold">
                  <span>#003</span>
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="mt-5 pt-3 border-t-2 border-[#121316]/20 flex items-center justify-between text-xs font-mono font-bold text-gray-700">
              <span>📅 27 Feb 2026</span>
              <span className="text-emerald-700 font-extrabold">Completed ✓</span>
            </div>
          </div>


          {/* ============================================================== */}
          {/* Card 04: ??? Something exciting is coming soon (Mysterious) */}
          {/* ============================================================== */}
          <div 
            onClick={() => setSecretRevealed(!secretRevealed)}
            className="relative p-6 rounded-[28px] bg-[#121316] text-white border-4 border-[#121316] shadow-pop-purple flex flex-col justify-between rotate-[1.5deg] hover:rotate-0 transition-all duration-200 cursor-pointer group hover:scale-105"
            title="Click to reveal secret teaser!"
          >
            {/* Mystery Pill */}
            <div className="absolute -top-3.5 right-4 bg-[#6C5CE7] text-white px-3 py-0.5 rounded-full border-2 border-white/40 font-mono text-[10px] font-bold uppercase tracking-wider">
              {secretRevealed ? 'REVEALED 🔓' : 'CLASSIFIED 🔒'}
            </div>

            <div>
              {/* Event Number */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-black text-2xl text-[#FFE600] bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/20">
                  04
                </span>
                <span className="text-[11px] font-mono font-bold bg-[#FFE600] text-[#121316] px-2 py-0.5 rounded-full">
                  NEXT EVENT
                </span>
              </div>

              {/* Mystery Title */}
              <div className="space-y-2 mb-4">
                <h3 className="text-2xl sm:text-3xl font-black text-[#FFE600] leading-tight font-display tracking-tight flex items-center gap-2">
                  <span>NEXT EVENT</span>
                  {secretRevealed ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-purple-300" />}
                </h3>
                
                {secretRevealed ? (
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-xs font-mono text-purple-200 space-y-1 animate-pulse">
                    <p className="font-bold text-yellow-300">🚀 NEXT FLAGSHIP SPRINT</p>
                    <p>Hands-on Autonomous Robotics, AI & IoT Challenge at NIAT Pune!</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-300 leading-snug">
                    Something exciting is coming next. Click to preview the upcoming sprint.
                  </p>
                )}
              </div>

              {/* Glitch decoder box */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/15 text-center text-xs font-mono text-purple-300">
                {secretRevealed ? 'ACCESS GRANTED • NIAT LAB 5.0' : 'CLICK TO CRACK CODE ⚡'}
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="mt-5 pt-3 border-t-2 border-white/15 flex items-center justify-between text-xs font-mono text-yellow-400">
              <span>📅 Next Event: Coming Soon</span>
              <span className="underline">Stay Tuned →</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
