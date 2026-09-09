import React from 'react';
import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  Globe,
  Phone,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Calendar,
  Clock,
  Star,
  UploadCloud,
  Plus,
  Sparkles,
} from 'lucide-react';
import { FormFieldType } from '../../../types/customForm.types';

interface FieldTypeItem {
  type: FormFieldType;
  label: string;
  category: 'text' | 'choice' | 'data' | 'media';
  icon: React.ReactNode;
  hint: string;
  defaultLabel: string;
  defaultPlaceholder?: string;
  defaultOptions?: string[];
}

const FIELD_PALETTE_ITEMS: FieldTypeItem[] = [
  // Text & Input
  {
    type: 'text',
    label: 'Short Text',
    category: 'text',
    icon: <Type className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Single-line text for names, titles, short responses',
    defaultLabel: 'Untitled Question',
    defaultPlaceholder: 'Your answer...',
  },
  {
    type: 'textarea',
    label: 'Long Text',
    category: 'text',
    icon: <AlignLeft className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Multi-line text for feedback, bios, essay questions',
    defaultLabel: 'Detailed Response',
    defaultPlaceholder: 'Type your response here...',
  },
  {
    type: 'email',
    label: 'Email Address',
    category: 'text',
    icon: <Mail className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Email field with automatic format validation',
    defaultLabel: 'Email Address',
    defaultPlaceholder: 'alex@example.com',
  },
  {
    type: 'number',
    label: 'Number',
    category: 'text',
    icon: <Hash className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Numeric input with optional min/max boundaries',
    defaultLabel: 'Numeric Value',
    defaultPlaceholder: '42',
  },
  {
    type: 'url',
    label: 'Website / URL',
    category: 'text',
    icon: <Globe className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Link or portfolio URL with web validation',
    defaultLabel: 'Website / Portfolio Link',
    defaultPlaceholder: 'https://github.com/username',
  },
  {
    type: 'phone',
    label: 'Phone Number',
    category: 'text',
    icon: <Phone className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Phone or WhatsApp contact number',
    defaultLabel: 'Phone / WhatsApp Number',
    defaultPlaceholder: '+91 98765 43210',
  },

  // Options & Choices
  {
    type: 'radio',
    label: 'Single Choice',
    category: 'choice',
    icon: <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Radio buttons for mutually exclusive options',
    defaultLabel: 'Choose one option',
    defaultOptions: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    type: 'checkbox',
    label: 'Multiple Choice',
    category: 'choice',
    icon: <CheckSquare className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Checkboxes allowing multiple selections',
    defaultLabel: 'Select all that apply',
    defaultOptions: ['Choice A', 'Choice B', 'Choice C'],
  },
  {
    type: 'select',
    label: 'Dropdown Select',
    category: 'choice',
    icon: <ChevronDown className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Compact dropdown picker for longer option lists',
    defaultLabel: 'Select an option from list',
    defaultOptions: ['Option 1', 'Option 2', 'Option 3'],
  },

  // Date, Time & Rating
  {
    type: 'date',
    label: 'Date Picker',
    category: 'data',
    icon: <Calendar className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Calendar date picker',
    defaultLabel: 'Select Date',
  },
  {
    type: 'time',
    label: 'Time Picker',
    category: 'data',
    icon: <Clock className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Time selector for scheduling',
    defaultLabel: 'Preferred Time',
  },
  {
    type: 'rating',
    label: 'Rating Scale',
    category: 'data',
    icon: <Star className="w-4 h-4 stroke-[2.5]" />,
    hint: '1 to 5 (or 1 to 10) interactive star/score scale',
    defaultLabel: 'Rate your experience (1 to 5)',
  },

  // Files
  {
    type: 'file',
    label: 'File Upload',
    category: 'media',
    icon: <UploadCloud className="w-4 h-4 stroke-[2.5]" />,
    hint: 'Attachment upload configuration (PDF, Docs, Images)',
    defaultLabel: 'Upload Document / Resume',
  },
];

interface FieldPaletteProps {
  onAddField: (
    type: FormFieldType,
    defaults: { label: string; placeholder?: string; options?: string[] }
  ) => void;
}

export const FieldPalette: React.FC<FieldPaletteProps> = ({ onAddField }) => {
  return (
    <div className="bg-white rounded-[32px] border-4 border-[#121316] shadow-pop p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between border-b-2 border-[#121316]/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-[#FFE600] border-2 border-[#121316] flex items-center justify-center font-black text-xs">
            +
          </span>
          <h3 className="font-black text-base text-[#121316] tracking-tight">
            FIELD PALETTE
          </h3>
        </div>
        <span className="font-mono text-[10px] font-black uppercase text-gray-400">
          CLICK TO ADD
        </span>
      </div>

      {/* Field List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
        {FIELD_PALETTE_ITEMS.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() =>
              onAddField(item.type, {
                label: item.defaultLabel,
                placeholder: item.defaultPlaceholder,
                options: item.defaultOptions,
              })
            }
            className="w-full text-left p-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] shadow-pop-xs hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-white border-2 border-[#121316] flex items-center justify-center text-[#121316] group-hover:scale-110 transition-transform flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-grow min-w-0">
              <div className="font-black text-xs text-[#121316] group-hover:text-[#121316] flex items-center justify-between">
                <span>{item.label}</span>
                <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity stroke-[3]" />
              </div>
              <p className="text-[11px] font-bold text-gray-500 group-hover:text-gray-800 truncate mt-0.5">
                {item.hint}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FieldPalette;
