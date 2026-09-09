import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Inbox, Sparkles } from 'lucide-react';

export const AdminFormResponsesPage: React.FC = () => {
  const { formId } = useParams<{ formId?: string }>();

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop flex items-center justify-center p-1.5 flex-shrink-0">
              <Inbox className="w-7 h-7 text-[#6C5CE7] stroke-[2.5]" />
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                FORM RESPONSES
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                SUBMISSION DATA VIEWER
              </h1>
            </div>
          </div>

          <Link
            to="/admin/forms"
            className="px-5 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-gray-200 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back to Forms</span>
          </Link>
        </div>

        <div className="p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#121316]" />
          </div>
          <h2 className="text-2xl font-black text-[#121316]">RESPONSE & ANALYTICS DASHBOARD</h2>
          <p className="text-sm font-bold text-gray-600 max-w-md mx-auto">
            Dynamic tabular response viewer, CSV export, and submission analytics will be implemented in Phase 7 & 8.
          </p>
          <div className="pt-4">
            <Link
              to="/admin/forms"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              Return to Forms Control Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFormResponsesPage;
