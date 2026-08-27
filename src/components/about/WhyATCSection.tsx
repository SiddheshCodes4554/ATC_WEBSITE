import React from 'react';
import { ArrowUpRight, Sparkles, ArrowDown, Heart, Flame } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { SparkleDoodle, LoopyArrow, SpiralScribble } from '../doodles/DoodleSvgs';

export const WhyATCSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'CURIOUS',
      desc: 'You ask "how does this work?" or "can we build this?" with zero prior tech background required.',
      emoji: '👀',
      color: 'bg-[#FFF9DB]',
      accentColor: 'text-[#D48806]',
    },
    {
      step: '02',
      title: 'LEARN',
      desc: 'Join peer sessions, reverse engineer open repos, master terminal tools, and grasp system design.',
      emoji: '📚',
      color: 'bg-[#E3FAEE]',
      accentColor: 'text-[#10AC84]',
    },
    {
      step: '03',
      title: 'EXPERIMENT',
      desc: 'Write messy code, fry microcontrollers, iterate fast, and fail forward in a judgment-free lab.',
      emoji: '⚡',
      color: 'bg-[#FFEBF2]',
      accentColor: 'text-[#FF6B6B]',
    },
    {
      step: '04',
      title: 'BUILD',
      desc: 'Team up with fellow students to engineer real robots, AI vision apps, and open-source packages.',
      emoji: '🛠️',
      color: 'bg-[#F0EBFF]',
      accentColor: 'text-[#6C5CE7]',
    },
    {
      step: '05',
      title: 'CREATE IMPACT',
      desc: 'Deploy campus hardware, present at national hackathons, mentor incoming juniors, and lead the future.',
      emoji: '🚀',
      color: 'bg-[#FFE600]',
      accentColor: 'text-[#121316]',
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute top-10 left-10 opacity-50 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FFD32A" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-40 pointer-events-none hidden md:block">
        <SpiralScribble className="w-14 h-14" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Philosophy */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#FFE600] border-3 border-[#121316] shadow-pop font-mono font-black text-xs uppercase tracking-wider text-[#121316]">
            <span>💡</span> WHY ATC?
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121316] tracking-tight leading-tight">
            You don’t need to be an expert to start.<br />
            <span className="text-[#FF6B6B] underline decoration-wavy decoration-3">
              You just need curiosity.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-gray-700 font-medium leading-relaxed">
            Every breakthrough prototype in our lab started with someone asking a naive question. Here is how any student evolves inside ATC:
          </p>
        </div>

        {/* Vertical / Flow Steps Ladder */}
        <div className="max-w-4xl mx-auto space-y-4 relative">
          {steps.map((step, idx) => (
            <div key={step.title} className="relative">
              
              {/* Step Card */}
              <div className={`p-6 sm:p-7 rounded-[28px] border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${step.color}`}>
                
                <div className="flex items-center gap-4">
                  {/* Emoji & Step Number */}
                  <div className="w-14 h-14 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center justify-center text-2xl flex-shrink-0">
                    {step.emoji}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-gray-500">
                        STAGE {step.step}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-bold text-gray-800 leading-snug sm:max-w-md">
                  {step.desc}
                </p>

              </div>

              {/* Connecting Down Arrow between cards */}
              {idx < steps.length - 1 && (
                <div className="flex justify-center my-2 text-[#121316]">
                  <ArrowDown className="w-6 h-6 animate-bounce" strokeWidth={3} />
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Closing Callout & Primary CTA */}
        <div className="mt-16 text-center space-y-6 max-w-2xl mx-auto">
          <div className="p-8 rounded-[32px] bg-[#6C5CE7] border-4 border-[#121316] shadow-pop-lg text-white space-y-4">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              The next builder could be you. 🚀
            </h3>
            <p className="text-purple-100 text-sm sm:text-base font-medium">
              Join hundreds of fellow NIAT Pune creators, engineers, and tinkerers building the future.
            </p>
            <div className="pt-2">
              <PlayfulButton
                to="/join"
                variant="primary"
                size="lg"
                withConfetti
                icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
              >
                Join the Community
              </PlayfulButton>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
