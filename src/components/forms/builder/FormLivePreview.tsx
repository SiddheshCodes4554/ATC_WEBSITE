import React, { useState } from 'react';
import {
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCw,
  Mail,
  Phone,
  Globe,
  UploadCloud,
  Star,
  ChevronDown,
} from 'lucide-react';
import { FormFieldDefinition, FormSettings } from '../../../types/customForm.types';

interface FormLivePreviewProps {
  title: string;
  description?: string;
  fields: FormFieldDefinition[];
  settings: FormSettings;
}

export const FormLivePreview: React.FC<FormLivePreviewProps> = ({
  title,
  description,
  fields,
  settings,
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [previewSubmitted, setPreviewSubmitted] = useState<boolean>(false);
  const [previewErrors, setPreviewErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    if (previewErrors[fieldId]) {
      setPreviewErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handleCheckboxToggle = (fieldId: string, option: string) => {
    const current = (answers[fieldId] || []) as string[];
    const exists = current.includes(option);
    const updated = exists ? current.filter((o) => o !== option) : [...current, option];
    handleInputChange(fieldId, updated);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      const val = answers[field.id];
      const isProvided =
        val !== undefined &&
        val !== null &&
        val !== '' &&
        !(Array.isArray(val) && val.length === 0);

      if (field.required && !isProvided) {
        errors[field.id] = `"${field.label}" is required.`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setPreviewErrors(errors);
      return;
    }

    setPreviewErrors({});
    setPreviewSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setPreviewErrors({});
    setPreviewSubmitted(false);
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Preview Notice */}
      <div className="p-3.5 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-between text-xs font-black text-[#121316]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 stroke-[2.5]" />
          <span>LIVE PREVIEW MODE — Submissions in this mode are simulations and are not stored.</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer transition-all"
        >
          <RotateCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Preview Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-10 relative">
        <div className="tape-strip pointer-events-none bg-[#6C5CE7]" />

        {previewSubmitted ? (
          /* Simulated Success Screen */
          <div className="text-center py-10 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border-2 border-[#121316] font-mono text-xs font-black uppercase">
                SUBMISSION RECEIVED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#121316]">
                Thank You!
              </h3>
              <p className="text-sm font-bold text-gray-600 max-w-md mx-auto">
                {settings.successMessage || 'Thanks for submitting your response!'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm transition-all cursor-pointer"
            >
              Submit Another Simulation
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSimulateSubmit} className="space-y-6">
            {/* Header */}
            <div className="border-b-3 border-[#121316] pb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFE600] text-[#121316] border border-[#121316] font-mono text-[10px] font-black uppercase">
                ATC ROBOTICS LAB
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                {title || 'Untitled Form'}
              </h2>
              {description && (
                <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>

            {/* Fields List */}
            {fields.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-bold text-sm">
                No questions added to this form yet. Use the field palette to add questions.
              </div>
            ) : (
              <div className="space-y-5">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-5 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-xs space-y-2"
                  >
                    {/* Question Title & Label */}
                    <div className="flex items-start justify-between gap-2">
                      <label className="block text-sm font-black text-[#121316]">
                        <span className="font-mono text-xs text-gray-500 mr-1.5">
                          {idx + 1}.
                        </span>
                        {field.label || `Question #${idx + 1}`}
                        {field.required && (
                          <span className="text-[#FF4757] font-black ml-1">*</span>
                        )}
                      </label>
                    </div>

                    {/* Question Help Text */}
                    {field.description && (
                      <p className="text-xs font-bold text-gray-500 italic">
                        {field.description}
                      </p>
                    )}

                    {/* Field Input Components */}
                    <div className="pt-1">
                      {field.type === 'text' && (
                        <input
                          type="text"
                          value={answers[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || 'Your answer'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                        />
                      )}

                      {field.type === 'textarea' && (
                        <textarea
                          rows={3}
                          value={answers[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || 'Your response...'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none"
                        />
                      )}

                      {field.type === 'email' && (
                        <div className="relative">
                          <input
                            type="email"
                            value={answers[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder || 'name@example.com'}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                          />
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      )}

                      {field.type === 'number' && (
                        <input
                          type="number"
                          min={field.min}
                          max={field.max}
                          value={answers[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || 'Enter number'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                        />
                      )}

                      {field.type === 'url' && (
                        <div className="relative">
                          <input
                            type="url"
                            value={answers[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder || 'https://example.com'}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                          />
                          <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      )}

                      {field.type === 'phone' && (
                        <div className="relative">
                          <input
                            type="tel"
                            value={answers[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder || '+91 98765 43210'}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                          />
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      )}

                      {field.type === 'radio' && (
                        <div className="space-y-2">
                          {(field.options || ['Option 1', 'Option 2']).map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border-2 border-[#121316] cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <input
                                type="radio"
                                name={field.id}
                                value={opt}
                                checked={answers[field.id] === opt}
                                onChange={() => handleInputChange(field.id, opt)}
                                className="w-4 h-4 text-[#6C5CE7] accent-[#6C5CE7]"
                              />
                              <span className="text-xs font-bold text-[#121316]">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {field.type === 'checkbox' && (
                        <div className="space-y-2">
                          {(field.options || ['Choice 1', 'Choice 2']).map((opt, oIdx) => {
                            const selected = ((answers[field.id] || []) as string[]).includes(opt);
                            return (
                              <label
                                key={oIdx}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border-2 border-[#121316] cursor-pointer hover:bg-gray-50 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => handleCheckboxToggle(field.id, opt)}
                                  className="w-4 h-4 text-[#6C5CE7] accent-[#6C5CE7] rounded"
                                />
                                <span className="text-xs font-bold text-[#121316]">{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {field.type === 'select' && (
                        <select
                          value={answers[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer"
                        >
                          <option value="">Select an option...</option>
                          {(field.options || []).map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === 'date' && (
                        <input
                          type="date"
                          value={answers[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer"
                        />
                      )}

                      {field.type === 'time' && (
                        <input
                          type="time"
                          value={answers[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer"
                        />
                      )}

                      {field.type === 'rating' && (
                        <div className="flex items-center gap-2 pt-1">
                          {Array.from({
                            length: (field.maxRating ?? 5) - (field.minRating ?? 1) + 1,
                          }).map((_, rIdx) => {
                            const score = (field.minRating ?? 1) + rIdx;
                            const isSelected = answers[field.id] === score;
                            return (
                              <button
                                key={rIdx}
                                type="button"
                                onClick={() => handleInputChange(field.id, score)}
                                className={`w-9 h-9 rounded-xl border-2 border-[#121316] font-mono text-xs font-black transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#FFE600] text-[#121316] shadow-pop-xs scale-105'
                                    : 'bg-white hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {score}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {field.type === 'file' && (
                        <div className="p-4 rounded-xl bg-white border-2 border-dashed border-[#121316] text-center space-y-1">
                          <UploadCloud className="w-5 h-5 text-[#6C5CE7] mx-auto" />
                          <span className="font-mono text-xs font-bold text-gray-700 block">
                            Attach File (Simulation)
                          </span>
                          <span className="text-[10px] text-gray-400">
                            PDF, Word, or Image up to 10 MB
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Inline Field Error */}
                    {previewErrors[field.id] && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF4757] pt-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{previewErrors[field.id]}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-black text-base border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer uppercase font-mono"
                  >
                    SUBMIT FORM (SIMULATION)
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default FormLivePreview;
