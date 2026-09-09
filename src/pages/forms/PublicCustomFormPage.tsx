import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText } from 'lucide-react';

export const PublicCustomFormPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();

  return (
    <div className="min-h-[85vh] bg-[#FAF7F0] py-14 px-4 sm:px-6 lg:px-8 paper-pattern select-none flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto space-y-6">
        <div className="p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-5 relative">
          <div className="tape-strip pointer-events-none bg-[#FFE600]" />

          <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8 text-[#121316] stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs">
              ATC PUBLIC FORM
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
              {slug ? slug.replace(/-/g, ' ').toUpperCase() : 'PUBLIC FORM'}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-gray-600">
              The public dynamic form renderer and submission pipeline will be completed in Phase 5 & 6.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              Back to ATC Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCustomFormPage;
