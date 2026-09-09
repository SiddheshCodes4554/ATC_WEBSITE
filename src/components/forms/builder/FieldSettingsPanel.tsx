import React from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  AlertCircle,
  Hash,
  Star,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';
import { FormFieldDefinition, FormFieldType } from '../../../types/customForm.types';

interface FieldSettingsPanelProps {
  field: FormFieldDefinition | null;
  onUpdateField: (updated: Partial<FormFieldDefinition>) => void;
  onClose?: () => void;
}

export const FieldSettingsPanel: React.FC<FieldSettingsPanelProps> = ({
  field,
  onUpdateField,
  onClose,
}) => {
  if (!field) {
    return (
      <div className="bg-white rounded-[32px] border-4 border-[#121316] shadow-pop p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] mx-auto flex items-center justify-center text-gray-400">
          <Sliders className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h4 className="font-black text-sm text-[#121316]">NO FIELD SELECTED</h4>
        <p className="text-xs font-bold text-gray-500">
          Click any field in the canvas to inspect and configure its settings.
        </p>
      </div>
    );
  }

  const isChoiceField = ['radio', 'checkbox', 'select'].includes(field.type);

  // Option Handlers
  const handleAddOption = () => {
    const currentOptions = field.options || [];
    const newOptionName = `Option ${currentOptions.length + 1}`;
    onUpdateField({ options: [...currentOptions, newOptionName] });
  };

  const handleUpdateOption = (index: number, value: string) => {
    const currentOptions = [...(field.options || [])];
    currentOptions[index] = value;
    onUpdateField({ options: currentOptions });
  };

  const handleDeleteOption = (index: number) => {
    const currentOptions = (field.options || []).filter((_, i) => i !== index);
    onUpdateField({ options: currentOptions });
  };

  return (
    <div className="bg-white rounded-[32px] border-4 border-[#121316] shadow-pop p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#121316]/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-[#E1DCFF] border-2 border-[#121316] flex items-center justify-center font-black text-xs text-[#6C5CE7]">
            ⚙
          </span>
          <h3 className="font-black text-base text-[#121316] tracking-tight">
            FIELD CONFIGURATION
          </h3>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 border border-[#121316] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        
        {/* Field Type Selector */}
        <div className="space-y-1.5">
          <label className="block font-mono text-xs font-black uppercase text-[#121316]">
            Question Type
          </label>
          <select
            value={field.type}
            onChange={(e) => {
              const newType = e.target.value as FormFieldType;
              const updates: Partial<FormFieldDefinition> = { type: newType };
              if (['radio', 'checkbox', 'select'].includes(newType) && (!field.options || field.options.length === 0)) {
                updates.options = ['Option 1', 'Option 2', 'Option 3'];
              }
              onUpdateField(updates);
            }}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer"
          >
            <optgroup label="Text & Input">
              <option value="text">Short Text</option>
              <option value="textarea">Long Text / Paragraph</option>
              <option value="email">Email Address</option>
              <option value="number">Number</option>
              <option value="url">Website / URL</option>
              <option value="phone">Phone Number</option>
            </optgroup>
            <optgroup label="Options & Choices">
              <option value="radio">Single Choice (Radio)</option>
              <option value="checkbox">Multiple Choice (Checkbox)</option>
              <option value="select">Dropdown Select</option>
            </optgroup>
            <optgroup label="Date & Rating">
              <option value="date">Date Picker</option>
              <option value="time">Time Picker</option>
              <option value="rating">Rating Scale</option>
            </optgroup>
            <optgroup label="Files">
              <option value="file">File Upload</option>
            </optgroup>
          </select>
        </div>

        {/* Question Label */}
        <div className="space-y-1.5">
          <label className="block font-mono text-xs font-black uppercase text-[#121316]">
            Question Label <span className="text-[#FF4757]">*</span>
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdateField({ label: e.target.value })}
            placeholder="Enter question title..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
          />
        </div>

        {/* Description / Help Text */}
        <div className="space-y-1.5">
          <label className="block font-mono text-xs font-black uppercase text-[#121316]">
            Description / Help Text
          </label>
          <textarea
            rows={2}
            value={field.description || ''}
            onChange={(e) => onUpdateField({ description: e.target.value })}
            placeholder="Add optional hints, instructions, or format guidelines..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none"
          />
        </div>

        {/* Placeholder (for text, textarea, email, number, url, phone) */}
        {['text', 'textarea', 'email', 'number', 'url', 'phone'].includes(field.type) && (
          <div className="space-y-1.5">
            <label className="block font-mono text-xs font-black uppercase text-[#121316]">
              Input Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => onUpdateField({ placeholder: e.target.value })}
              placeholder="e.g. Type your response..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            />
          </div>
        )}

        {/* Required Field Toggle */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-black uppercase text-[#121316] block">
              Required Field
            </span>
            <span className="text-[11px] font-bold text-gray-500">
              Respondent must answer this question
            </span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateField({ required: !field.required })}
            className={`w-12 h-6 rounded-full border-2 border-[#121316] transition-colors p-0.5 flex items-center cursor-pointer ${
              field.required ? 'bg-[#FFE600] justify-end' : 'bg-gray-200 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#121316]" />
          </button>
        </div>

        {/* Options Editor for Choice Fields */}
        {isChoiceField && (
          <div className="space-y-2.5 pt-2 border-t-2 border-[#121316]/10">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs font-black uppercase text-[#121316]">
                Choices / Options ({(field.options || []).length})
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="px-2.5 py-1 rounded-xl bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-[10px] font-black uppercase border border-[#121316] shadow-pop-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
                <span>Add Choice</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(field.options || []).map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-gray-400 w-4 text-center">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleUpdateOption(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-grow px-3 py-1.5 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  />
                  <button
                    type="button"
                    disabled={(field.options || []).length <= 1}
                    onClick={() => handleDeleteOption(idx)}
                    className="p-1.5 rounded-xl bg-white hover:bg-[#FFE5E5] disabled:opacity-30 disabled:cursor-not-allowed border border-[#121316] text-gray-500 hover:text-[#FF4757] transition-all cursor-pointer flex-shrink-0"
                    title="Delete choice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {(field.options || []).length === 0 && (
              <div className="p-3 rounded-xl bg-[#FFE5E5] border border-[#FF4757] text-[#FF4757] text-[11px] font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Add at least one option to this question.</span>
              </div>
            )}
          </div>
        )}

        {/* Number Specific Settings (Min & Max) */}
        {field.type === 'number' && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-[#121316]/10">
            <div className="space-y-1">
              <label className="block font-mono text-[10px] font-black uppercase text-[#121316]">
                Minimum Value
              </label>
              <input
                type="number"
                value={field.min ?? ''}
                onChange={(e) =>
                  onUpdateField({
                    min: e.target.value === '' ? undefined : Number(e.target.value),
                  })
                }
                placeholder="No min"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-mono text-[10px] font-black uppercase text-[#121316]">
                Maximum Value
              </label>
              <input
                type="number"
                value={field.max ?? ''}
                onChange={(e) =>
                  onUpdateField({
                    max: e.target.value === '' ? undefined : Number(e.target.value),
                  })
                }
                placeholder="No max"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
          </div>
        )}

        {/* Rating Specific Settings */}
        {field.type === 'rating' && (
          <div className="space-y-2 pt-2 border-t-2 border-[#121316]/10">
            <label className="block font-mono text-xs font-black uppercase text-[#121316]">
              Rating Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-gray-500 font-bold block">
                  Scale Min
                </span>
                <select
                  value={field.minRating ?? 1}
                  onChange={(e) => onUpdateField({ minRating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] cursor-pointer"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] text-gray-500 font-bold block">
                  Scale Max
                </span>
                <select
                  value={field.maxRating ?? 5}
                  onChange={(e) => onUpdateField({ maxRating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] cursor-pointer"
                >
                  <option value={5}>5 Stars / Points</option>
                  <option value={10}>10 Points Scale</option>
                </select>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FieldSettingsPanel;
