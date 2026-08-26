import React from 'react';
import { PlayfulButton } from '../components/ui/PlayfulButton';
import { ArrowLeft, Rocket, Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  subtitle: string;
  nextUp?: boolean;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({ title, subtitle, nextUp = false }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center paper-pattern">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600] border-3 border-[#121316] shadow-pop font-black text-xs uppercase tracking-wider">
          <Construction className="w-4 h-4" />
          Page Scaffolded
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#121316] tracking-tight">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
          {subtitle}
        </p>

        {nextUp && (
          <div className="p-4 rounded-2xl bg-[#EBE8FC] border-3 border-[#121316] shadow-pop text-sm font-bold text-[#6C5CE7] flex items-center justify-center gap-2">
            <span>✨</span> Next up in our page-by-page build sequence!
          </div>
        )}

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <PlayfulButton to="/" variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </PlayfulButton>
          <PlayfulButton to="/join" variant="secondary" size="md" icon={<Rocket className="w-4 h-4" />}>
            Join the Squad
          </PlayfulButton>
        </div>
      </div>
    </div>
  );
};
