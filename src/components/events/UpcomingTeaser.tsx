import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Send, Check, Bell, Lock, Radio } from 'lucide-react';
import { SparkleDoodle, RetroRobotMascot } from '../doodles/DoodleSvgs';
import { PlayfulButton } from '../ui/PlayfulButton';
import confetti from 'canvas-confetti';

export const UpcomingTeaser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNotified(true);
    confetti({
      particleCount: 60,
      spread: 80,
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
    });
    setTimeout(() => {
      setEmail('');
      setNotified(false);
    }, 4000);
  };

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-t-4 border-[#121316] overflow-hidden">
      
      {/* Background Twinkling Doodles */}
      <div className="absolute top-10 left-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FFE600" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-14 h-14" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-3 border-[#121316] shadow-pop font-mono font-black text-xs uppercase tracking-wider text-[#121316]">
            <Radio className="w-4 h-4 text-[#FF6B6B] animate-pulse" />
            WHAT’S NEXT?
          </div>
        </div>

        {/* Large Mysterious Card */}
        <div className="relative p-8 sm:p-14 lg:p-16 rounded-[44px] bg-[#121316] border-4 border-[#121316] shadow-pop-xl text-white overflow-hidden dots-pattern-dark">
          
          {/* Accent Badge in Top Right */}
          <div className="absolute -top-3 right-8 sm:right-16 rotate-6 bg-[#FFE600] text-[#121316] px-4 py-1.5 rounded-full border-3 border-[#121316] font-mono font-black text-xs sm:text-sm shadow-pop-sm flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#121316]" />
            <span>CLASSIFIED SPRINT 2026</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Column: Mysterious Title & Form */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              
              <div className="space-y-3">
                <span className="text-xs sm:text-sm font-mono font-bold text-yellow-300 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
                  ● UPCOMING ATC FLAGSHIP EVENT
                </span>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                  SOMETHING EXCITING<br />
                  <span className="text-[#FFE600] drop-shadow-[0_4px_16px_rgba(255,230,0,0.3)]">
                    IS ON THE WAY.
                  </span>
                </h2>
              </div>

              <p className="text-base sm:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl">
                We are cooking up our biggest hardware hackathon & autonomous combat robot arena yet at NIAT Pune. Be the first to grab early-bird builder passes.
              </p>

              {/* Get Notified Form */}
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="builder@niat.edu.in"
                  className="px-5 py-3.5 rounded-2xl bg-white text-[#121316] font-bold placeholder:text-gray-400 placeholder:font-normal border-3 border-[#121316] shadow-pop-sm focus:outline-none focus:ring-4 focus:ring-[#FFE600] flex-1 text-sm sm:text-base"
                  required
                />
                
                <button
                  type="submit"
                  disabled={notified}
                  className="px-7 py-3.5 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-black text-sm sm:text-base border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:shadow-pop-hover flex items-center justify-center gap-2 transition-all cursor-pointer select-none disabled:bg-emerald-400"
                >
                  {notified ? (
                    <>
                      <Check className="w-5 h-5 text-[#121316]" /> You're On The List!
                    </>
                  ) : (
                    <>
                      <span>Get notified</span>
                      <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                <span>⚡ Zero spam</span>
                <span>•</span>
                <span>Priority registration for NIAT students</span>
              </div>

            </div>

            {/* Right Column: Floating Mascot & Secret Box */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
              <div className="p-8 rounded-3xl bg-[#6C5CE7] border-4 border-[#121316] shadow-pop-lg flex flex-col items-center text-center space-y-3 animate-float-slow">
                <div className="text-4xl animate-bounce">🤖</div>
                <h4 className="font-mono font-black text-lg text-white">SECRET PROJECT "X"</h4>
                <p className="text-xs text-purple-200 font-medium">
                  Autonomous Rovers • 48-Hour Arena • ₹1,00,000+ Hardware Grant
                </p>
                <span className="px-3 py-1 bg-[#FFE600] text-[#121316] text-[10px] font-mono font-black rounded-md">
                  MAY 2026
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
