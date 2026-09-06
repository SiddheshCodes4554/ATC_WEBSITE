import React from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Eye,
  ListOrdered,
  Lock,
  Unlock,
  Wrench,
  Ticket,
  Calendar,
  Layers,
  Check,
  FileEdit,
} from 'lucide-react';

export type ATCStatusType =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'changes_requested'
  | 'waitlisted'
  | 'available'
  | 'occupied'
  | 'maintenance'
  | 'registered'
  | 'checked_in'
  | 'cancelled'
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'draft'
  | 'submitted'
  | 'collected'
  | 'active'
  | 'inactive';

export interface ATCStatusBadgeProps {
  status: ATCStatusType | string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  queuePosition?: number | null;
  extraInfo?: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: React.ReactNode;
}

const statusConfigs: Record<string, StatusConfig> = {
  // Application & Review Statuses
  pending: {
    label: 'PENDING',
    bg: 'bg-[#F0EBFF]',
    text: 'text-[#6C5CE7]',
    border: 'border-[#121316]',
    icon: <Clock className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  under_review: {
    label: 'UNDER REVIEW',
    bg: 'bg-[#FFF9DB]',
    text: 'text-amber-800',
    border: 'border-[#121316]',
    icon: <Eye className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  approved: {
    label: 'APPROVED',
    bg: 'bg-[#D4F8E8]',
    text: 'text-emerald-800',
    border: 'border-[#121316]',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />,
  },
  rejected: {
    label: 'REJECTED',
    bg: 'bg-[#FFE5E5]',
    text: 'text-[#FF4757]',
    border: 'border-[#121316]',
    icon: <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  changes_requested: {
    label: 'CHANGES REQUESTED',
    bg: 'bg-[#FFF3E0]',
    text: 'text-[#E65100]',
    border: 'border-[#121316]',
    icon: <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  draft: {
    label: 'DRAFT',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-[#121316]',
    icon: <FileEdit className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  submitted: {
    label: 'SUBMITTED',
    bg: 'bg-[#E1DCFF]',
    text: 'text-[#6C5CE7]',
    border: 'border-[#121316]',
    icon: <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  collected: {
    label: 'COLLECTED',
    bg: 'bg-[#E1DCFF]',
    text: 'text-[#6C5CE7]',
    border: 'border-[#121316]',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#6C5CE7] stroke-[2.5]" />,
  },

  // Lab Access & Slot Statuses
  available: {
    label: 'AVAILABLE',
    bg: 'bg-[#D4F8E8]',
    text: 'text-emerald-800',
    border: 'border-[#121316]',
    icon: <Unlock className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />,
  },
  occupied: {
    label: 'OCCUPIED',
    bg: 'bg-[#FFE5E5]',
    text: 'text-[#FF4757]',
    border: 'border-[#121316]',
    icon: <Lock className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  maintenance: {
    label: 'MAINTENANCE',
    bg: 'bg-[#FFF3E0]',
    text: 'text-[#E65100]',
    border: 'border-[#121316]',
    icon: <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  waitlisted: {
    label: 'WAITLISTED',
    bg: 'bg-[#FFF3E0]',
    text: 'text-[#E65100]',
    border: 'border-[#121316]',
    icon: <ListOrdered className="w-3.5 h-3.5 stroke-[2.5]" />,
  },

  // Event Registration Statuses
  registered: {
    label: 'REGISTERED',
    bg: 'bg-[#2ED573]/20',
    text: 'text-[#121316]',
    border: 'border-[#121316]',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#2ED573] stroke-[2.5]" />,
  },
  checked_in: {
    label: 'CHECKED IN',
    bg: 'bg-[#E1DCFF]',
    text: 'text-[#6C5CE7]',
    border: 'border-[#121316]',
    icon: <Check className="w-3.5 h-3.5 text-[#6C5CE7] stroke-[3]" />,
  },
  cancelled: {
    label: 'CANCELLED',
    bg: 'bg-[#FFE5E5]',
    text: 'text-[#FF4757]',
    border: 'border-[#121316]',
    icon: <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />,
  },

  // Event Lifecycle Statuses
  upcoming: {
    label: 'UPCOMING',
    bg: 'bg-[#E1F5FE]',
    text: 'text-[#0288D1]',
    border: 'border-[#121316]',
    icon: <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  ongoing: {
    label: 'LIVE NOW',
    bg: 'bg-[#FFE600]',
    text: 'text-[#121316]',
    border: 'border-[#121316]',
    icon: <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
  completed: {
    label: 'COMPLETED',
    bg: 'bg-[#FFD1E3]',
    text: 'text-[#121316]',
    border: 'border-[#121316]',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />,
  },

  // General Statuses
  active: {
    label: 'ACTIVE',
    bg: 'bg-[#D4F8E8]',
    text: 'text-emerald-800',
    border: 'border-[#121316]',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />,
  },
  inactive: {
    label: 'INACTIVE',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-[#121316]',
    icon: <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />,
  },
};

export const ATCStatusBadge: React.FC<ATCStatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
  showIcon = true,
  queuePosition,
  extraInfo,
  className = '',
  pulse = false,
}) => {
  const normalizedKey = (status || 'pending').toLowerCase().trim();
  const config: StatusConfig = statusConfigs[normalizedKey] || {
    label: (status || 'STATUS').toUpperCase(),
    bg: 'bg-white',
    text: 'text-[#121316]',
    border: 'border-[#121316]',
    icon: <Layers className="w-3.5 h-3.5 stroke-[2.5]" />,
  };

  let displayLabel = label || config.label;
  if (normalizedKey === 'waitlisted' && queuePosition) {
    displayLabel = `${displayLabel} (#${queuePosition})`;
  }

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[9px] gap-1 font-mono',
    sm: 'px-2.5 py-1 text-[11px] gap-1.5 font-mono',
    md: 'px-3 py-1.5 text-xs gap-2 font-mono',
    lg: 'px-4 py-1.5 text-xs sm:text-sm gap-2 font-mono',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-black uppercase rounded-full border-2 shadow-pop-xs select-none transition-all ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {pulse && (
        <span className="w-2 h-2 rounded-full bg-current animate-ping mr-0.5" />
      )}
      {showIcon && config.icon}
      <span>{displayLabel}</span>
      {extraInfo && <span className="opacity-80 font-normal">{extraInfo}</span>}
    </span>
  );
};

export default ATCStatusBadge;
