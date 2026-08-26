import React, { useState } from 'react';
import { AlertTriangle, X, RefreshCw, Volume2, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorstUIUXHeroCover: React.FC = () => {
  // Runaway button state
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(99);

  const handleRunawayHover = () => {
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 100;
    setBtnPos({ x: randomX, y: randomY });
  };

  const handleRunawayClick = () => {
    setClickCount((prev) => prev + 1);
    confetti({
      particleCount: 50,
      spread: 70,
      colors: ['#FF6B6B', '#FFE600', '#6C5CE7', '#2ED573'],
    });
  };

  return (
    <div className="relative w-full rounded-[36px] bg-[#FFF080] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-10 overflow-hidden select-none">
      
      {/* Decorative Background Chaos Doodles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#FF6B6B]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#6C5CE7]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Ticker */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b-3 border-[#121316]/20">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#FF4757] text-white font-mono font-black text-xs rounded-full border-2 border-[#121316] shadow-pop-sm uppercase animate-pulse">
            ⚠️ SYSTEM ERROR 418
          </span>
          <span className="text-xs font-mono font-bold text-[#121316] hidden sm:inline">
            INTENTIONALLY CURSED INTERFACES
          </span>
        </div>
        <span className="text-xs font-mono bg-white px-2.5 py-1 rounded-md border-2 border-[#121316] font-extrabold text-[#121316]">
          COMIC SANS VIBE • 100% BUGGY
        </span>
      </div>

      {/* Main Chaotic Interactive Collage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Windows 93 Cursed Error Dialog & Runaway Button */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Windows 93 Dialog Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-lg space-y-4">
            {/* Header bar */}
            <div className="flex items-center justify-between bg-[#FF7675] text-white px-3 py-1.5 rounded-lg border-2 border-[#121316] font-mono text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-300" />
                CRITICAL_FAILURE.EXE
              </span>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded bg-yellow-300 border border-[#121316]" />
                <span className="w-3 h-3 rounded bg-red-600 border border-[#121316]" />
              </div>
            </div>

            {/* Message Body */}
            <div className="flex items-start gap-3">
              <div className="text-3xl animate-bounce">💥</div>
              <div className="space-y-1">
                <h4 className="font-black text-sm sm:text-base text-[#121316] font-mono">
                  Error: User attempted to click normal button.
                </h4>
                <p className="text-xs text-gray-700 font-bold">
                  The button has panicked and escaped. Please pursue with your mouse at 60fps.
                </p>
              </div>
            </div>

            {/* Runaway Button Playground */}
            <div className="relative h-20 bg-[#FAF7F0] rounded-xl border-2 border-dashed border-[#121316]/40 flex items-center justify-center overflow-hidden p-2">
              <button
                type="button"
                onMouseEnter={handleRunawayHover}
                onClick={handleRunawayClick}
                style={{
                  transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="px-5 py-2 rounded-xl bg-[#2ED573] hover:bg-[#10AC84] text-[#121316] font-black text-xs sm:text-sm border-2 border-[#121316] shadow-pop cursor-pointer select-none active:scale-95 whitespace-nowrap"
              >
                {clickCount > 0 ? `Caught me! (${clickCount}) 🏆` : '👉 CLICK ME IF YOU CAN'}
              </button>
            </div>
          </div>

          {/* Backward Progress Bar Widget */}
          <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-[#121316]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                DOWNLOADING MORE RAM...
              </span>
              <span className="text-[#FF4757] font-black">{progress}% (Decreasing)</span>
            </div>

            <div className="w-full bg-gray-200 h-4 rounded-full border-2 border-[#121316] overflow-hidden p-0.5">
              <div 
                className="bg-[#FF6B6B] h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-[10px] font-mono text-gray-500 text-right">
              Estimated time remaining: -42 minutes
            </p>
          </div>

        </div>

        {/* Right Column: Confusing Dropdowns & Volume by Shouting */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Cursed Volume Slider */}
          <div className="p-4 rounded-2xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#121316]">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#6C5CE7]" />
                DECIBEL VOLUME
              </span>
              <span className="px-2 py-0.5 bg-[#FFE600] rounded border border-[#121316] text-[10px]">
                SHOUT TO RAISE
              </span>
            </div>

            {/* Volume steps */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setVolume(lvl)}
                  className={`flex-1 h-8 rounded border border-[#121316] font-mono text-[10px] font-black transition-all ${
                    lvl <= volume ? 'bg-[#FF6B6B] text-white shadow-pop-sm -translate-y-0.5' : 'bg-white text-gray-400'
                  }`}
                >
                  {lvl * 10}dB
                </button>
              ))}
            </div>
            <p className="text-[11px] font-hand font-bold text-[#121316]">
              "If you whisper, the song slows down to 0.25x speed."
            </p>
          </div>

          {/* Cursed Confusing Select Dropdown */}
          <div className="p-4 rounded-2xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop space-y-2">
            <label className="text-xs font-mono font-black text-[#121316] block">
              SELECT YOUR AGE (RANDOM SORT):
            </label>
            <select className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-bold focus:outline-none">
              <option>94 Years Old</option>
              <option>3 Months</option>
              <option>19 Years Old (Maybe)</option>
              <option>404 Age Not Found</option>
              <option>Infinity</option>
            </select>
          </div>

          {/* Comic Sticker */}
          <div className="p-3 bg-[#FFD9E8] rounded-xl border-2 border-[#121316] shadow-pop-sm text-center font-hand font-bold text-sm sm:text-base rotate-2">
            <span>🎨 Designed by sadists, loved by hackers.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
