import React from 'react';
import {
  Mail,
  Phone,
  Globe,
  UploadCloud,
  AlertCircle,
  Calendar,
  Clock,
  ChevronDown,
  Info,
} from 'lucide-react';
import { FormFieldDefinition } from '../../../types/customForm.types';

interface PublicFieldRendererProps {
  field: FormFieldDefinition;
  index: number;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}

export const PublicFieldRenderer: React.FC<PublicFieldRendererProps> = ({
  field,
  index,
  value,
  error,
  onChange,
}) => {
  const inputId = `field_input_${field.id}`;
  const errorId = `field_error_${field.id}`;
  const descId = `field_desc_${field.id}`;

  const handleCheckboxToggle = (option: string) => {
    const current = Array.isArray(value) ? value : [];
    const exists = current.includes(option);
    const updated = exists ? current.filter((o: string) => o !== option) : [...current, option];
    onChange(updated);
  };

  return (
    <div
      id={`field_container_${field.id}`}
      className={`p-5 sm:p-6 rounded-[28px] bg-[#FAF7F0] border-3 border-[#121316] transition-all space-y-3 ${
        error
          ? 'ring-3 ring-[#FF4757] bg-[#FFF8F8] shadow-pop'
          : 'shadow-pop-xs focus-within:shadow-pop focus-within:bg-white'
      }`}
    >
      {/* Question Header & Label */}
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="block text-sm sm:text-base font-black text-[#121316] leading-snug cursor-pointer"
        >
          <span className="font-mono text-xs text-gray-500 mr-2">{index + 1}.</span>
          <span>{field.label}</span>
          {field.required && (
            <span
              className="text-[#FF4757] font-black ml-1.5"
              title="Required field"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>

        {/* Optional Question Help Text */}
        {field.description && (
          <p id={descId} className="text-xs font-bold text-gray-600 italic">
            {field.description}
          </p>
        )}
      </div>

      {/* Dynamic Field Inputs */}
      <div className="pt-1">
        
        {/* 1. Short Text Input */}
        {field.type === 'text' && (
          <input
            id={inputId}
            type="text"
            required={field.required}
            aria-required={field.required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : field.description ? descId : undefined}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'Type your response here...'}
            className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
          />
        )}

        {/* 2. Long Text / Textarea Input */}
        {field.type === 'textarea' && (
          <textarea
            id={inputId}
            rows={3}
            required={field.required}
            aria-required={field.required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : field.description ? descId : undefined}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'Type your detailed response here...'}
            className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all resize-none"
          />
        )}

        {/* 3. Email Input */}
        {field.type === 'email' && (
          <div className="relative">
            <input
              id={inputId}
              type="email"
              required={field.required}
              aria-required={field.required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : field.description ? descId : undefined}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || 'alex@example.com'}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all font-mono"
            />
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}

        {/* 4. Number Input */}
        {field.type === 'number' && (
          <div className="space-y-1">
            <input
              id={inputId}
              type="number"
              min={field.min}
              max={field.max}
              required={field.required}
              aria-required={field.required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : field.description ? descId : undefined}
              value={value || ''}
              onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder={field.placeholder || 'e.g. 42'}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all font-mono"
            />
            {(field.min !== undefined || field.max !== undefined) && (
              <span className="font-mono text-[11px] text-gray-500 font-bold block pl-1">
                Accepted Range: [{field.min ?? 'No min'} to {field.max ?? 'No max'}]
              </span>
            )}
          </div>
        )}

        {/* 5. Website / URL Input */}
        {field.type === 'url' && (
          <div className="relative">
            <input
              id={inputId}
              type="url"
              required={field.required}
              aria-required={field.required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : field.description ? descId : undefined}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || 'https://github.com/username'}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all font-mono"
            />
            <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}

        {/* 6. Phone Number Input */}
        {field.type === 'phone' && (
          <div className="relative">
            <input
              id={inputId}
              type="tel"
              required={field.required}
              aria-required={field.required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : field.description ? descId : undefined}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || '+91 98765 43210'}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all font-mono"
            />
            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}

        {/* 7. Radio (Single Choice) */}
        {field.type === 'radio' && (
          <div className="space-y-2.5" role="radiogroup" aria-required={field.required}>
            {(field.options || ['Option 1', 'Option 2']).map((opt, oIdx) => {
              const isSelected = value === opt;
              return (
                <label
                  key={oIdx}
                  className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#E1DCFF] border-[#6C5CE7] shadow-pop-xs text-[#121316]'
                      : 'bg-white border-[#121316] hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    checked={isSelected}
                    onChange={() => onChange(opt)}
                    className="w-4 h-4 text-[#6C5CE7] accent-[#6C5CE7] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-black">{opt}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* 8. Checkbox (Multiple Choice) */}
        {field.type === 'checkbox' && (
          <div className="space-y-2.5" role="group" aria-required={field.required}>
            {(field.options || ['Option 1', 'Option 2']).map((opt, oIdx) => {
              const isChecked = Array.isArray(value) && value.includes(opt);
              return (
                <label
                  key={oIdx}
                  className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-[#E1DCFF] border-[#6C5CE7] shadow-pop-xs text-[#121316]'
                      : 'bg-white border-[#121316] hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxToggle(opt)}
                    className="w-4 h-4 text-[#6C5CE7] accent-[#6C5CE7] rounded cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-black">{opt}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* 9. Dropdown Select */}
        {field.type === 'select' && (
          <div className="relative">
            <select
              id={inputId}
              required={field.required}
              aria-required={field.required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : field.description ? descId : undefined}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] appearance-none cursor-pointer"
            >
              <option value="">{field.placeholder || 'Select an option...'}</option>
              {(field.options || []).map((opt, oIdx) => (
                <option key={oIdx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#121316]">
              <ChevronDown className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        )}

        {/* 10. Date Picker */}
        {field.type === 'date' && (
          <div className="relative">
            <input
              id={inputId}
              type="date"
              required={field.required}
              aria-required={field.required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : field.description ? descId : undefined}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer font-mono"
            />
          </div>
        )}

        {/* 11. Time Picker */}
        {field.type === 'time' && (
          <div className="relative">
            <input
              id={inputId}
              type="time"
              required={field.required}
              aria-required={field.required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : field.description ? descId : undefined}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer font-mono"
            />
          </div>
        )}

        {/* 12. Rating Scale */}
        {field.type === 'rating' && (
          <div className="space-y-2 pt-1" role="radiogroup" aria-required={field.required}>
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({
                length: (field.maxRating ?? 5) - (field.minRating ?? 1) + 1,
              }).map((_, rIdx) => {
                const score = (field.minRating ?? 1) + rIdx;
                const isSelected = value === score;
                return (
                  <button
                    key={rIdx}
                    type="button"
                    onClick={() => onChange(score)}
                    className={`w-11 h-11 rounded-2xl border-3 border-[#121316] font-mono text-sm font-black transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#FFE600] text-[#121316] shadow-pop scale-105'
                        : 'bg-white hover:bg-gray-100 text-gray-700 shadow-pop-xs'
                    }`}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gray-500 px-1">
              <span>Worst ({field.minRating ?? 1})</span>
              <span>Best ({field.maxRating ?? 5})</span>
            </div>
          </div>
        )}

        {/* 13. File Upload Notice */}
        {field.type === 'file' && (
          <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-[#121316] text-center space-y-2">
            <UploadCloud className="w-6 h-6 text-[#6C5CE7] mx-auto" />
            <div className="space-y-0.5">
              <span className="font-mono text-xs font-black text-[#121316] block">
                FILE UPLOAD PREVIEW
              </span>
              <p className="text-[11px] font-bold text-gray-500 max-w-sm mx-auto">
                Direct file storage will be enabled in Phase 9. If you have a document or portfolio, you may paste a public link in the notes below:
              </p>
            </div>
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://drive.google.com/... or portfolio link"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] font-mono"
            />
          </div>
        )}

      </div>

      {/* Field Inline Error Message */}
      {error && (
        <div id={errorId} className="flex items-center gap-2 text-xs font-black text-[#FF4757] pt-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default PublicFieldRenderer;
