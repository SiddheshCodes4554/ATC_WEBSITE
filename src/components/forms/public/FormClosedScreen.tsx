import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface FormClosedScreenProps {
  formTitle: string;
}

export const FormClosedScreen: React.FC<FormClosedScreenProps> = ({ formTitle }) => {
  return (
    <div className="max-w-xl mx-auto p-8 sm:p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-6 relative animate-fadeIn select-none">
      <div className="tape-strip pointer-events-none bg-[#FF4757]" />

      <div className="w-16 h-16 rounded-2xl bg-[#FFE5E5] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
        <Lock className="w-8 h-8 text-[#FF4757] stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE5E5] text-[#FF4757] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs">
          SUBMISSIONS CLOSED
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
          {formTitle || 'Form Closed'}
        </h2>

        <p className="text-sm font-bold text-gray-600 max-w-md mx-auto leading-relaxed">
          This form is no longer accepting responses or the submission deadline has passed. Thank you for your interest.
        </p>
      </div>

      <div className="pt-4 border-t-2 border-[#121316]/10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/events"
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-gray-200 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs transition-all flex items-center justify-center gap-2"
        >
          <span>View Upcoming Events</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop transition-all flex items-center justify-center gap-2"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default FormClosedScreen;
