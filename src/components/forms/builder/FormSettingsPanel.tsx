import React from 'react';
import {
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import { FormSettings } from '../../../types/customForm.types';
import { customFormService } from '../../../services/customFormService';

interface FormSettingsPanelProps {
  slug: string;
  settings: FormSettings;
  onUpdateSlug: (slug: string) => void;
  onUpdateSettings: (updated: Partial<FormSettings>) => void;
}

export const FormSettingsPanel: React.FC<FormSettingsPanelProps> = ({
  slug,
  settings,
  onUpdateSlug,
  onUpdateSettings,
}) => {
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = customFormService.generateSlug(raw);
    onUpdateSlug(sanitized);
  };

  return (
    <div className="bg-white rounded-[32px] border-4 border-[#121316] shadow-pop p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b-2 border-[#121316]/10 pb-3">
        <span className="w-7 h-7 rounded-xl bg-[#FFE600] border-2 border-[#121316] flex items-center justify-center font-black text-xs text-[#121316]">
          ⚙
        </span>
        <h3 className="font-black text-base text-[#121316] tracking-tight">
          FORM SETTINGS
        </h3>
      </div>

      <div className="space-y-4">
        
        {/* URL Slug Customizer */}
        <div className="space-y-1.5">
          <label className="block font-mono text-xs font-black uppercase text-[#121316]">
            Public URL Slug <span className="text-[#FF4757]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g. robotics-workshop"
              className="w-full pl-3.5 pr-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 pt-0.5 truncate">
            <LinkIcon className="w-3 h-3 text-[#6C5CE7] flex-shrink-0" />
            <span className="truncate">Public Link: /forms/{slug || 'form-slug'}</span>
          </div>
        </div>

        {/* Collect Respondent Email */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-mono text-xs font-black uppercase text-[#121316] block">
              Collect Email Address
            </span>
            <span className="text-[11px] font-bold text-gray-500 block">
              Identify respondents for notification and pass generation
            </span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ collectEmail: !settings.collectEmail })}
            className={`w-12 h-6 rounded-full border-2 border-[#121316] transition-colors p-0.5 flex items-center cursor-pointer flex-shrink-0 ml-3 ${
              settings.collectEmail ? 'bg-[#FFE600] justify-end' : 'bg-gray-200 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#121316]" />
          </button>
        </div>

        {/* Allow Multiple Submissions */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-mono text-xs font-black uppercase text-[#121316] block">
              Allow Multiple Responses
            </span>
            <span className="text-[11px] font-bold text-gray-500 block">
              When disabled, duplicate submissions with the same email/user are blocked
            </span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ allowMultipleResponses: !settings.allowMultipleResponses })}
            className={`w-12 h-6 rounded-full border-2 border-[#121316] transition-colors p-0.5 flex items-center cursor-pointer flex-shrink-0 ml-3 ${
              settings.allowMultipleResponses ? 'bg-[#FFE600] justify-end' : 'bg-gray-200 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#121316]" />
          </button>
        </div>

        {/* Require Login Toggle */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-black uppercase text-[#121316] block">
                Require ATC Student Login
              </span>
            </div>
            <span className="text-[11px] font-bold text-gray-500 block">
              Default is Public (No login required). Turn ON only for internal club surveys.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ requireLogin: !settings.requireLogin })}
            className={`w-12 h-6 rounded-full border-2 border-[#121316] transition-colors p-0.5 flex items-center cursor-pointer flex-shrink-0 ml-3 ${
              settings.requireLogin ? 'bg-[#FFE600] justify-end' : 'bg-gray-200 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#121316]" />
          </button>
        </div>

        {/* Custom Success Message */}
        <div className="space-y-1.5 pt-1">
          <label className="block font-mono text-xs font-black uppercase text-[#121316]">
            Submission Success Message
          </label>
          <textarea
            rows={3}
            value={settings.successMessage || ''}
            onChange={(e) => onUpdateSettings({ successMessage: e.target.value })}
            placeholder="e.g. Thanks for submitting! We will contact you soon."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none"
          />
        </div>

      </div>
    </div>
  );
};

export default FormSettingsPanel;
