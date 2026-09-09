import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, RotateCw, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FormSuccessScreenProps {
  formTitle: string;
  successMessage?: string;
  allowMultipleResponses?: boolean;
  onSubmitAnother?: () => void;
}

export const FormSuccessScreen: React.FC<FormSuccessScreenProps> = ({
  formTitle,
  successMessage,
  allowMultipleResponses = true,
  onSubmitAnother,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#FFE600', '#6C5CE7', '#2ED573', '#FF4757'],
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-6 relative animate-fadeIn select-none">
      <div className="tape-strip pointer-events-none bg-[#FFE600]" />

      <div className="w-16 h-16 rounded-2xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-700 stroke-[2.5]" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs">
          <Sparkles className="w-3.5 h-3.5" />
          RESPONSE RECORDED
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
          Submission Complete!
        </h2>

        <p className="text-sm sm:text-base font-bold text-gray-700 max-w-lg mx-auto leading-relaxed whitespace-pre-line">
          {successMessage || 'Thank you for submitting your response to ATC Robotics Lab.'}
        </p>
      </div>

      <div className="pt-4 border-t-2 border-[#121316]/10 flex flex-col sm:flex-row items-center justify-center gap-3">
        {allowMultipleResponses && onSubmitAnother && (
          <button
            type="button"
            onClick={onSubmitAnother}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF7F0] hover:bg-gray-200 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className="w-4 h-4 stroke-[2.5]" />
            <span>Submit Another Response</span>
          </button>
        )}

        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Explore ATC Website</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
};

export default FormSuccessScreen;
