import React from 'react';
import { MessageSquare, Quote, Heart } from 'lucide-react';
import { EventQuote } from '../../data/eventsData';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

interface EventQuotesSectionProps {
  quotes: EventQuote[];
}

export const EventQuotesSection: React.FC<EventQuotesSectionProps> = ({ quotes }) => {
  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <MessageSquare className="w-5 h-5 text-[#6C5CE7]" />
              UNFILTERED REACTIONS
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFE600" />
            </div>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
            Memorable Participant Quotes 💬
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            What builders, judges, and mentors had to say right after the clock ran out:
          </p>
        </div>

        {/* Quotes Speech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {quotes.map((q, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-[36px] border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col justify-between ${
                q.color
              } ${q.rotation} hover:rotate-0 hover:-translate-y-1`}
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#121316] opacity-60" />
                <p className="text-lg sm:text-xl font-hand font-bold text-[#121316] text-2xl leading-snug">
                  "{q.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-[#121316]/20 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-[#121316] font-display">
                    {q.author}
                  </h4>
                  <p className="text-xs font-mono font-bold text-gray-600">
                    {q.role}
                  </p>
                </div>
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
