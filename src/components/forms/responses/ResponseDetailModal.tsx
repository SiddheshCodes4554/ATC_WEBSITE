import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  Clock,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Calendar,
  Star,
  FileText,
  Tag,
  Shield,
  Layers,
} from 'lucide-react';
import { CustomForm, CustomFormResponse, FormFieldDefinition } from '../../../types/customForm.types';
import { ScrewHead } from '../../visual';

interface ResponseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: CustomFormResponse | null;
  form: CustomForm | null;
  responseIndex?: number;
  onDeleteRequest: (response: CustomFormResponse) => void;
}

export const ResponseDetailModal: React.FC<ResponseDetailModalProps> = ({
  isOpen,
  onClose,
  response,
  form,
  responseIndex,
  onDeleteRequest,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !response || !form) return null;

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Format Timestamp
  const formatTimestamp = (isoDate?: string) => {
    if (!isoDate) return 'N/A';
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return isoDate;
    }
  };

  // Format individual field answer
  const renderAnswerValue = (field: FormFieldDefinition, rawValue: unknown) => {
    const isUnanswered =
      rawValue === undefined ||
      rawValue === null ||
      rawValue === '' ||
      (Array.isArray(rawValue) && rawValue.length === 0);

    if (isUnanswered) {
      return (
        <span className="text-xs font-bold text-gray-400 italic">
          (No response provided)
        </span>
      );
    }

    switch (field.type) {
      case 'email': {
        const emailStr = String(rawValue);
        return (
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${emailStr}`}
              className="font-mono text-xs sm:text-sm font-bold text-[#6C5CE7] hover:underline flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{emailStr}</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopy(emailStr, `email_${field.id}`)}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
              title="Copy email"
            >
              {copiedKey === `email_${field.id}` ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        );
      }

      case 'url': {
        const urlStr = String(rawValue);
        const safeUrl = urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`;
        return (
          <div className="flex items-center gap-2">
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs sm:text-sm font-bold text-[#6C5CE7] hover:underline flex items-center gap-1.5 max-w-sm truncate"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{urlStr}</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopy(safeUrl, `url_${field.id}`)}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer flex-shrink-0"
              title="Copy URL"
            >
              {copiedKey === `url_${field.id}` ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        );
      }

      case 'phone': {
        const phoneStr = String(rawValue);
        return (
          <div className="flex items-center gap-2">
            <a
              href={`tel:${phoneStr}`}
              className="font-mono text-xs sm:text-sm font-bold text-gray-800 hover:text-[#6C5CE7] flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>{phoneStr}</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopy(phoneStr, `phone_${field.id}`)}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
              title="Copy phone"
            >
              {copiedKey === `phone_${field.id}` ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        );
      }

      case 'checkbox': {
        if (!Array.isArray(rawValue)) return <span>{String(rawValue)}</span>;
        return (
          <div className="flex flex-wrap gap-1.5">
            {rawValue.map((opt, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-[#E1DCFF] text-[#121316] border border-[#121316] font-mono text-xs font-black"
              >
                {String(opt)}
              </span>
            ))}
          </div>
        );
      }

      case 'radio':
      case 'select': {
        return (
          <span className="inline-block px-3 py-1 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs sm:text-sm font-black text-[#121316] shadow-pop-xs">
            {String(rawValue)}
          </span>
        );
      }

      case 'number': {
        return (
          <span className="inline-block font-mono text-xs sm:text-sm font-black px-3 py-1 rounded-xl bg-white border border-[#121316] text-[#121316]">
            {Number(rawValue)}
          </span>
        );
      }

      case 'rating': {
        const rating = Number(rawValue);
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFE600] text-[#121316] border-2 border-[#121316] font-mono text-xs font-black shadow-pop-xs">
            <Star className="w-3.5 h-3.5 fill-[#121316]" />
            <span>
              {rating} / {field.maxRating ?? 5}
            </span>
          </div>
        );
      }

      case 'textarea': {
        const textStr = String(rawValue);
        return (
          <div className="space-y-1.5">
            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] leading-relaxed whitespace-pre-line break-words max-h-60 overflow-y-auto">
              {textStr}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(textStr, `textarea_${field.id}`)}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-gray-500 hover:text-[#121316] cursor-pointer"
            >
              {copiedKey === `textarea_${field.id}` ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-600">Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy answer text</span>
                </>
              )}
            </button>
          </div>
        );
      }

      case 'date':
      case 'time': {
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black px-3 py-1 rounded-xl bg-[#FAF7F0] border border-[#121316] text-[#121316]">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>{String(rawValue)}</span>
          </span>
        );
      }

      default:
        return (
          <span className="text-xs sm:text-sm font-bold text-[#121316] break-words">
            {String(rawValue)}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[36px] border-4 border-[#121316] shadow-pop-xl flex flex-col relative overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <ScrewHead className="absolute top-4 left-4 w-3.5 h-3.5" rotation={45} />
        <ScrewHead className="absolute top-4 right-4 w-3.5 h-3.5" rotation={135} />

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b-3 border-[#121316] bg-[#FAF7F0] space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                <Layers className="w-3 h-3" />
                <span>
                  RESPONSE #{responseIndex ? String(responseIndex).padStart(2, '0') : response.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight line-clamp-1">
                {form.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-white hover:bg-gray-100 text-[#121316] border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all cursor-pointer"
              title="Close panel"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Submission Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs pt-1">
            {/* Timestamp */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#121316] text-gray-700 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>{formatTimestamp(response.submittedAt || response.createdAt)}</span>
            </div>

            {/* Respondent Identity */}
            {response.respondentEmail ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#D4F8E8] border border-[#121316] text-emerald-950 font-black">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>{response.respondentEmail}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF9DB] border border-[#121316] text-amber-900 font-black">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>ANONYMOUS RESPONDENT</span>
              </div>
            )}

            {/* User Session ID if authenticated */}
            {response.userId && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E1DCFF] border border-[#121316] text-[#6C5CE7] font-black text-[10px]">
                <Shield className="w-3 h-3" />
                <span>ATC STUDENT</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Questions & Answers (Scrollable Body) */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 flex-grow divide-y-2 divide-gray-100">
          {form.fields && form.fields.length > 0 ? (
            form.fields.map((field, idx) => {
              const answerVal = response.answers?.[field.id];
              return (
                <div key={field.id} className={idx === 0 ? 'space-y-2' : 'pt-5 space-y-2'}>
                  {/* Field Label & Type Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs sm:text-sm font-black text-[#121316] leading-snug">
                      <span className="font-mono text-gray-400 mr-2">{idx + 1}.</span>
                      <span>{field.label}</span>
                      {field.required && (
                        <span className="text-[#FF4757] font-black ml-1">*</span>
                      )}
                    </label>

                    <span className="px-2 py-0.5 rounded-lg bg-[#FAF7F0] border border-gray-300 font-mono text-[9px] font-black uppercase text-gray-500">
                      {field.type}
                    </span>
                  </div>

                  {/* Rendered Answer */}
                  <div className="pl-5 pt-0.5">
                    {renderAnswerValue(field, answerVal)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 font-bold text-xs">
              No field definitions found for this form.
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 sm:p-6 border-t-3 border-[#121316] bg-[#FAF7F0] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDeleteRequest(response)}
            className="px-4 py-2.5 rounded-2xl bg-[#FFE5E5] hover:bg-[#FFD2D2] text-[#FF4757] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            <span>Delete Response</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop hover:shadow-pop-md transition-all cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseDetailModal;
