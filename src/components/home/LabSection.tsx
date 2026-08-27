import React from 'react';
import { ArrowUpRight, Crosshair, Sparkles, MapPin, Zap } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { Link } from 'react-router-dom';

export const LabSection: React.FC = () => {
  return (
    <section className="relative min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] text-white border-b-4 border-[#121316] overflow-hidden flex flex-col justify-between select-none">
      
      {/* 1. Full Background Lab Image (Vibrant & Well-lit with subtle legibility gradients) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/atc-lab-5.0.jpg"
          alt="ATC Lab 5.0 Physical Build Space - NIAT Pune"
          className="w-full h-full object-cover object-center"
        />

        {/* Subtle, soft contrast overlays (keeps the photo vivid without being too dark) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/40" />
      </div>

      {/* 2. Top Header HUD Bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 flex flex-wrap items-start justify-between gap-4">
        
        {/* Top Left: ATC Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600] text-[#121316] border-2 sm:border-3 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#121316]" />
          <span>ADVANCED TECH CLUB • NIAT PUNE</span>
        </div>

        {/* Top Center: Focus Statement (Desktop) */}
        <div className="hidden lg:block space-y-1 font-mono text-xs">
          <span className="px-2 py-0.5 rounded bg-[#FFE600] text-[#121316] font-black uppercase text-[10px] inline-block">
            FOCUS
          </span>
          <div className="text-gray-200 font-bold tracking-wider leading-snug">
            <div>BUILD</div>
            <div>TEST</div>
            <div>ITERATE</div>
          </div>
        </div>

        {/* Top Right: Lab 5.0 Coordinates & Crosshair */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-yellow-400 tracking-widest uppercase bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10">
          <span>ATC LAB 5.0</span>
          <Crosshair className="w-3.5 h-3.5 text-[#FFE600]" />
        </div>

      </div>

      {/* 3. Middle Stage: Hero Typography & Spatial Text Overlays */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 my-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Huge "OUR BUILD SPACE." Typography & Description */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-0 leading-none">
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase drop-shadow-md">
                OUR
              </h2>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#FFE600] uppercase drop-shadow-md">
                BUILD
              </h2>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-baseline">
                <span>SPACE</span>
                <span className="text-[#FFE600]">.</span>
              </h2>
            </div>

            <p className="text-base sm:text-xl font-bold text-gray-100 max-w-md leading-relaxed drop-shadow">
              Where ideas take shape and innovation begins.
            </p>

            {/* Interactive Explore CTA Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <PlayfulButton
                to="/lab-access"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
              >
                Book Lab Slot
              </PlayfulButton>

              <Link
                to="/lab"
                className="px-5 py-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border-2 border-white/20 text-xs font-mono font-bold text-white shadow-pop-sm transition-all hover:scale-105"
              >
                <span>Explore Lab 5.0 ↗</span>
              </Link>
            </div>
          </div>

          {/* Right Floating Annotation: Every Tool Has a Purpose */}
          <div className="lg:col-span-6 hidden lg:flex justify-end pr-10">
            <div className="font-mono text-xs text-right space-y-1 bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <p className="text-yellow-400 font-black tracking-widest uppercase">
                EVERY TOOL
              </p>
              <p className="text-gray-200 font-bold tracking-wider uppercase">
                HAS A PURPOSE.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Footer HUD Bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        
        {/* Bottom Left: Equipped & Built for Builders */}
        <div className="font-mono text-xs space-y-1 bg-black/40 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 max-w-xs">
          <div className="text-gray-300 font-bold tracking-wider uppercase">
            EQUIPPED.
          </div>
          <div className="text-gray-300 font-bold tracking-wider uppercase">
            ORGANISED.
          </div>
          <div className="text-yellow-400 font-black tracking-wider uppercase">
            BUILT FOR BUILDERS.
          </div>
          <div className="w-8 h-1 bg-[#FFE600] rounded-full mt-1" />
        </div>

        {/* Mobile-only Focus & Tool Callout */}
        <div className="block lg:hidden font-mono text-xs space-y-1 bg-black/40 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
          <div className="text-yellow-400 font-black uppercase">
            EVERY TOOL HAS A PURPOSE.
          </div>
          <div className="text-gray-300 font-bold">
            CLEAN SPACE. CLEAR MIND. BETTER BUILDS.
          </div>
        </div>

        {/* Bottom Right: Clean Space, Clear Mind (Desktop) */}
        <div className="hidden lg:block font-mono text-xs text-right space-y-1 bg-black/40 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
          <div className="text-gray-300 font-bold tracking-wider uppercase">
            CLEAN SPACE.
          </div>
          <div className="text-gray-300 font-bold tracking-wider uppercase">
            CLEAR MIND.
          </div>
          <div className="text-yellow-400 font-black tracking-wider uppercase">
            BETTER BUILDS.
          </div>
        </div>

      </div>

    </section>
  );
};

export default LabSection;
