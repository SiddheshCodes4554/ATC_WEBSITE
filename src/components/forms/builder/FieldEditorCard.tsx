import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Star,
  UploadCloud,
  AlignLeft,
  Type,
  Mail,
  Hash,
  Globe,
  Phone,
  Calendar,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { FormFieldDefinition, FormFieldType } from '../../../types/customForm.types';

interface FieldEditorCardProps {
  field: FormFieldDefinition;
  index: number;
  totalFields: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUpdateField: (updated: Partial<FormFieldDefinition>) => void;
}

const getFieldIcon = (type: FormFieldType) => {
  switch (type) {
    case 'text':
      return <Type className="w-3.5 h-3.5" />;
    case 'textarea':
      return <AlignLeft className="w-3.5 h-3.5" />;
    case 'email':
      return <Mail className="w-3.5 h-3.5" />;
    case 'number':
      return <Hash className="w-3.5 h-3.5" />;
    case 'url':
      return <Globe className="w-3.5 h-3.5" />;
    case 'phone':
      return <Phone className="w-3.5 h-3.5" />;
    case 'radio':
      return <CheckCircle2 className="w-3.5 h-3.5" />;
    case 'checkbox':
      return <CheckSquare className="w-3.5 h-3.5" />;
    case 'select':
      return <ChevronDown className="w-3.5 h-3.5" />;
    case 'date':
      return <Calendar className="w-3.5 h-3.5" />;
    case 'time':
      return <Clock className="w-3.5 h-3.5" />;
    case 'rating':
      return <Star className="w-3.5 h-3.5" />;
    case 'file':
      return <UploadCloud className="w-3.5 h-3.5" />;
  }
};

export const FieldEditorCard: React.FC<FieldEditorCardProps> = ({
  field,
  index,
  totalFields,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onUpdateField,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`p-5 sm:p-6 rounded-[28px] border-4 transition-all duration-150 cursor-pointer relative select-none ${
        isSelected
          ? 'bg-white border-[#121316] shadow-pop-lg ring-4 ring-[#E1DCFF]'
          : 'bg-white hover:bg-[#FAF7F0]/80 border-[#121316] shadow-pop'
      }`}
    >
      {/* Top Card Bar */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-[#121316]/10 pb-3 mb-4">
        
        {/* Field Index & Type Badge */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#121316] text-white font-mono text-xs font-black flex items-center justify-center">
            {index + 1}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[10px] font-black uppercase">
            {getFieldIcon(field.type)}
            <span>{field.type.replace('_', ' ')}</span>
          </span>
          {field.required && (
            <span className="px-2 py-0.5 rounded-full bg-[#FFE5E5] text-[#FF4757] border border-[#FF4757] font-mono text-[9px] font-black uppercase">
              ● REQUIRED
            </span>
          )}
        </div>

        {/* Action Controls: Move Up, Move Down, Duplicate, Delete */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed border border-[#121316] transition-all cursor-pointer"
            title="Move field up"
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            disabled={index === totalFields - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed border border-[#121316] transition-all cursor-pointer"
            title="Move field down"
          >
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-gray-200 border border-[#121316] transition-all cursor-pointer"
            title="Duplicate field"
          >
            <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#FFE5E5] text-gray-700 hover:text-[#FF4757] border border-[#121316] transition-all cursor-pointer"
            title="Delete field"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Field Main Content */}
      <div className="space-y-3">
        {/* Question Label */}
        <div className="flex items-baseline gap-1">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdateField({ label: e.target.value })}
            placeholder="Type question label..."
            className="font-black text-base sm:text-lg text-[#121316] bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-[#121316] focus:outline-none w-full py-0.5"
          />
          {field.required && <span className="text-[#FF4757] font-black text-lg">*</span>}
        </div>

        {/* Description / Help text preview */}
        {field.description && (
          <p className="text-xs font-bold text-gray-500 italic">
            {field.description}
          </p>
        )}

        {/* Dynamic Field Representation */}
        <div className="pt-1 pointer-events-none">
          {field.type === 'text' && (
            <div className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-gray-400 text-xs font-bold text-gray-400">
              {field.placeholder || 'Short answer text'}
            </div>
          )}

          {field.type === 'textarea' && (
            <div className="px-4 py-3 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-gray-400 text-xs font-bold text-gray-400 h-16">
              {field.placeholder || 'Long answer text / paragraph'}
            </div>
          )}

          {field.type === 'email' && (
            <div className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-gray-400 text-xs font-bold text-gray-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{field.placeholder || 'name@example.com'}</span>
            </div>
          )}

          {field.type === 'number' && (
            <div className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-gray-400 text-xs font-bold text-gray-400 flex items-center justify-between">
              <span>{field.placeholder || 'Numeric input'}</span>
              {(field.min !== undefined || field.max !== undefined) && (
                <span className="font-mono text-[10px] text-gray-500">
                  Range: [{field.min ?? '−∞'} to {field.max ?? '+∞'}]
                </span>
              )}
            </div>
          )}

          {field.type === 'url' && (
            <div className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-gray-400 text-xs font-bold text-gray-400 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>{field.placeholder || 'https://example.com'}</span>
            </div>
          )}

          {field.type === 'phone' && (
            <div className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-gray-400 text-xs font-bold text-gray-400 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{field.placeholder || '+91 98765 43210'}</span>
            </div>
          )}

          {field.type === 'radio' && (
            <div className="space-y-1.5 pl-1">
              {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map(
                (opt, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-gray-700">
                    <div className="w-4 h-4 rounded-full border-2 border-[#121316] bg-white flex items-center justify-center" />
                    <span>{opt}</span>
                  </div>
                )
              )}
            </div>
          )}

          {field.type === 'checkbox' && (
            <div className="space-y-1.5 pl-1">
              {(field.options && field.options.length > 0 ? field.options : ['Choice 1', 'Choice 2']).map(
                (opt, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-gray-700">
                    <div className="w-4 h-4 rounded-md border-2 border-[#121316] bg-white" />
                    <span>{opt}</span>
                  </div>
                )
              )}
            </div>
          )}

          {field.type === 'select' && (
            <div className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-gray-600 flex items-center justify-between">
              <span>{field.options && field.options.length > 0 ? `${field.options.length} options configured` : 'Select option'}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          )}

          {field.type === 'date' && (
            <div className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-gray-400 text-xs font-bold text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>YYYY-MM-DD</span>
            </div>
          )}

          {field.type === 'time' && (
            <div className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-gray-400 text-xs font-bold text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>HH:MM AM/PM</span>
            </div>
          )}

          {field.type === 'rating' && (
            <div className="flex items-center gap-2">
              {Array.from({ length: (field.maxRating ?? 5) - (field.minRating ?? 1) + 1 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-xl bg-[#FFF9DB] border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black text-[#121316]"
                >
                  {(field.minRating ?? 1) + idx}
                </div>
              ))}
            </div>
          )}

          {field.type === 'file' && (
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-dashed border-[#121316] flex items-center justify-center gap-2 text-xs font-bold text-gray-600">
              <UploadCloud className="w-4 h-4 text-[#6C5CE7]" />
              <span>Attachment Upload Box (PDF, Docs, Images)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldEditorCard;
