import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, RefreshCw } from 'lucide-react';

export type EmptyStateIllustrationType =
  | 'robot'
  | 'circuit'
  | 'workbench'
  | 'storage'
  | 'search'
  | 'calendar'
  | 'ideas';

export interface ATCEmptyStateProps {
  type?: EmptyStateIllustrationType;
  title: string;
  description?: string;
  actionText?: string;
  actionLabel?: string;
  actionTo?: string;
  actionHref?: string;
  onActionClick?: () => void;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  secondaryActionText?: string;
  onSecondaryActionClick?: () => void;
  className?: string;
}

// 1. Robot Module Illustration (Idle / Waiting)
export const EmptyRobotIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Antenna */}
    <path d="M60 26 L60 12" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="10" r="5" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
    {/* Ears */}
    <rect x="18" y="44" width="8" height="18" rx="4" fill="#54A0FF" stroke="#121316" strokeWidth="2.5" />
    <rect x="94" y="44" width="8" height="18" rx="4" fill="#54A0FF" stroke="#121316" strokeWidth="2.5" />
    {/* Head Box */}
    <rect x="24" y="26" width="72" height="54" rx="14" fill="#F0EBFF" stroke="#121316" strokeWidth="3.5" />
    {/* Screen */}
    <rect x="34" y="36" width="52" height="34" rx="8" fill="#121316" />
    {/* Closed / Sleepy Eyes */}
    <path d="M 43 54 Q 48 48 53 54" stroke="#48DBFB" strokeWidth="3" strokeLinecap="round" />
    <path d="M 67 54 Q 72 48 77 54" stroke="#48DBFB" strokeWidth="3" strokeLinecap="round" />
    {/* Neck */}
    <rect x="52" y="80" width="16" height="8" rx="2" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    {/* Body Base */}
    <path d="M 30 96 C 30 88 90 88 90 96 L 96 112 L 24 112 Z" fill="#FFE600" stroke="#121316" strokeWidth="3" />
    {/* Tech Screws */}
    <circle cx="36" cy="104" r="2" fill="#121316" />
    <circle cx="84" cy="104" r="2" fill="#121316" />
  </svg>
);

// 2. Disconnected Circuit Module
export const EmptyCircuitIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* PCB Backing */}
    <rect x="18" y="20" width="84" height="80" rx="12" fill="#0B0F19" stroke="#121316" strokeWidth="3.5" />
    {/* Traces */}
    <path d="M 30 40 L 50 40 L 50 70 L 70 70" stroke="#00D2D3" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 90 40 L 75 40 L 75 55" stroke="#FFE600" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 40 85 L 60 85" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" />
    {/* Broken / Open Node */}
    <circle cx="30" cy="40" r="4" fill="#00D2D3" stroke="#121316" strokeWidth="2" />
    <circle cx="70" cy="70" r="4" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <circle cx="90" cy="40" r="4" fill="#FF6B6B" stroke="#121316" strokeWidth="2" />
    {/* Big Resistor / Chip */}
    <rect x="52" y="32" width="16" height="24" rx="4" fill="#2C3E50" stroke="#FFFFFF" strokeWidth="2" />
    {/* Spark / Error */}
    <path d="M 75 52 L 85 45 L 80 58 L 92 50" stroke="#FFE600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 3. Clean Workbench / Calibration Rig
export const EmptyWorkbenchIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Workbench Surface */}
    <rect x="14" y="62" width="92" height="12" rx="4" fill="#FFE600" stroke="#121316" strokeWidth="3" />
    {/* Legs */}
    <line x1="26" y1="74" x2="26" y2="106" stroke="#121316" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="94" y1="74" x2="94" y2="106" stroke="#121316" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="26" y1="92" x2="94" y2="92" stroke="#121316" strokeWidth="2.5" />
    {/* Oscilloscope on bench */}
    <rect x="28" y="30" width="36" height="32" rx="6" fill="#6C5CE7" stroke="#121316" strokeWidth="3" />
    <rect x="34" y="36" width="24" height="16" rx="3" fill="#121316" />
    <path d="M 36 44 Q 42 38 46 44 T 56 44" stroke="#2ED573" strokeWidth="2" fill="none" />
    <circle cx="36" cy="56" r="2" fill="#FFE600" />
    <circle cx="44" cy="56" r="2" fill="#FFE600" />
    <circle cx="52" cy="56" r="2" fill="#FFE600" />
    {/* Soldering Iron Stand */}
    <path d="M 74 62 L 86 36" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
    <circle cx="88" cy="34" r="3" fill="#FF4757" />
  </svg>
);

// 4. Empty Storage Bin / Inventory Drawer
export const EmptyStorageIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Bin Box */}
    <path d="M 22 42 L 98 42 L 88 100 L 32 100 Z" fill="#FAF7F0" stroke="#121316" strokeWidth="3.5" />
    {/* Front Handle Cutout */}
    <rect x="46" y="52" width="28" height="10" rx="5" fill="#121316" />
    {/* Flaps */}
    <polygon points="16,42 22,28 60,28 54,42" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
    <polygon points="104,42 98,28 60,28 66,42" fill="#FFD32A" stroke="#121316" strokeWidth="2.5" />
    {/* Empty Wind Lines */}
    <path d="M 40 76 Q 60 72 75 78" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" />
    <path d="M 46 86 Q 62 82 70 86" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 5. Search Radar / Scope
export const EmptySearchIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="52" cy="52" r="34" fill="#E1DCFF" stroke="#121316" strokeWidth="3.5" />
    <circle cx="52" cy="52" r="22" fill="#F0EBFF" stroke="#121316" strokeWidth="2" strokeDasharray="4 3" />
    <circle cx="52" cy="52" r="10" fill="#6C5CE7" stroke="#121316" strokeWidth="2" />
    {/* Handle */}
    <path d="M 76 76 L 102 102" stroke="#121316" strokeWidth="6" strokeLinecap="round" />
    <path d="M 76 76 L 102 102" stroke="#FFE600" strokeWidth="3" strokeLinecap="round" />
    {/* Question Marker in lens */}
    <circle cx="52" cy="52" r="3" fill="#FFE600" />
  </svg>
);

// 6. Calendar Schedule Pad
export const EmptyCalendarIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Calendar Pad */}
    <rect x="22" y="24" width="76" height="76" rx="14" fill="#FFFFFF" stroke="#121316" strokeWidth="3.5" />
    {/* Header Strip */}
    <path d="M 22 38 C 22 30 30 24 38 24 L 82 24 C 90 24 98 30 98 38 L 98 44 L 22 44 Z" fill="#FF4757" stroke="#121316" strokeWidth="3" />
    {/* Rings */}
    <rect x="36" y="16" width="6" height="14" rx="3" fill="#121316" />
    <rect x="78" y="16" width="6" height="14" rx="3" fill="#121316" />
    {/* Empty Check Grid */}
    <rect x="34" y="54" width="12" height="12" rx="3" fill="#FAF7F0" stroke="#121316" strokeWidth="2" />
    <rect x="54" y="54" width="12" height="12" rx="3" fill="#FAF7F0" stroke="#121316" strokeWidth="2" />
    <rect x="74" y="54" width="12" height="12" rx="3" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <rect x="34" y="74" width="12" height="12" rx="3" fill="#FAF7F0" stroke="#121316" strokeWidth="2" />
    <rect x="54" y="74" width="12" height="12" rx="3" fill="#FAF7F0" stroke="#121316" strokeWidth="2" />
    <rect x="74" y="74" width="12" height="12" rx="3" fill="#FAF7F0" stroke="#121316" strokeWidth="2" />
  </svg>
);

// 7. Lightbulb / Innovation Blueprint
export const EmptyIdeasIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Glow Arc */}
    <path d="M 30 35 A 32 32 0 0 1 90 35" stroke="#FFE600" strokeWidth="3" strokeDasharray="5 5" fill="none" />
    {/* Bulb Glass */}
    <path
      d="M 40 50 C 35 40 40 24 60 24 C 80 24 85 40 80 50 C 75 58 72 64 72 72 L 48 72 C 48 64 45 58 40 50 Z"
      fill="#FFE600"
      stroke="#121316"
      strokeWidth="3.5"
    />
    {/* Filament Core */}
    <path d="M 52 50 L 60 38 L 68 50" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Metal Base */}
    <rect x="50" y="72" width="20" height="6" fill="#121316" rx="2" />
    <rect x="52" y="78" width="16" height="6" fill="#121316" rx="2" />
    <path d="M 54 84 C 54 88 66 88 66 84 Z" fill="#6C5CE7" stroke="#121316" strokeWidth="2" />
  </svg>
);

export const ATCEmptyState: React.FC<ATCEmptyStateProps> = ({
  type = 'robot',
  title,
  description,
  actionText,
  actionLabel,
  actionTo,
  actionHref,
  onActionClick,
  onAction,
  actionIcon,
  secondaryActionText,
  onSecondaryActionClick,
  className = '',
}) => {
  const resolvedActionText = actionLabel || actionText;
  const resolvedActionTo = actionHref || actionTo;
  const resolvedOnAction = onAction || onActionClick;

  const renderIllustration = () => {
    switch (type) {
      case 'circuit':
        return <EmptyCircuitIllustration />;
      case 'workbench':
        return <EmptyWorkbenchIllustration />;
      case 'storage':
        return <EmptyStorageIllustration />;
      case 'search':
        return <EmptySearchIllustration />;
      case 'calendar':
        return <EmptyCalendarIllustration />;
      case 'ideas':
        return <EmptyIdeasIllustration />;
      case 'robot':
      default:
        return <EmptyRobotIllustration />;
    }
  };

  return (
    <div
      className={`p-8 sm:p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop text-center space-y-4 paper-pattern select-none ${className}`}
    >
      {/* Handcrafted Illustration */}
      <div className="flex items-center justify-center p-2">
        {renderIllustration()}
      </div>

      {/* Text Copy */}
      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight uppercase">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {(resolvedActionText || secondaryActionText) && (
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          {resolvedActionText && (
            resolvedActionTo ? (
              <Link
                to={resolvedActionTo}
                className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs sm:text-sm font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{resolvedActionText}</span>
                {actionIcon || <ArrowRight className="w-4 h-4 stroke-[3]" />}
              </Link>
            ) : (
              <button
                type="button"
                onClick={resolvedOnAction}
                className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs sm:text-sm font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{resolvedActionText}</span>
                {actionIcon || <Plus className="w-4 h-4 stroke-[3]" />}
              </button>
            )
          )}

          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryActionClick}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-bold border-2 border-[#121316] shadow-pop-xs transition-all cursor-pointer"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ATCEmptyState;
