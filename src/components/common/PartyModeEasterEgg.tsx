import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Music, Flame, X } from 'lucide-react';

export const PartyModeEasterEgg: React.FC = () => {
  const [partyActive, setPartyActive] = useState(false);
  const [keyBuffer, setKeyBuffer] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const newBuffer = (keyBuffer + e.key.toLowerCase()).slice(-8);
      setKeyBuffer(newBuffer);

      if (newBuffer.includes('atc') || newBuffer.includes('party')) {
        triggerPartyMode();
        setKeyBuffer('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyBuffer]);

  const triggerPartyMode = () => {
    setPartyActive(true);

    // Blast confetti in waves
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573', '#00D2D3'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    setTimeout(() => {
      setPartyActive(false);
    }, 5000);
  };

  if (!partyActive) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-auto select-none">
      <div className="px-6 py-3 rounded-full bg-[#FFE600] border-4 border-[#121316] shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-3">
        <span className="text-2xl animate-spin">🪩</span>
        <div className="space-y-0.5 text-center">
          <span className="font-mono font-black text-xs uppercase text-[#FF4757] block animate-pulse">
            ★ SECRET EASTER EGG UNLOCKED ★
          </span>
          <span className="font-black text-base text-[#121316]">
            ATC PARTY MODE ACTIVATED! 🚀🎉
          </span>
        </div>
        <button
          onClick={() => setPartyActive(false)}
          className="p-1 rounded-full bg-white border-2 border-[#121316] text-[#121316] hover:bg-[#FF6B6B] hover:text-white transition-colors"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
