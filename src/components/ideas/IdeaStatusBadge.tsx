import React from 'react';
import { ProjectIdeaStatus } from '../../types/projectIdea.types';
import { Clock, CheckCircle2, AlertTriangle, XCircle, Send, FileEdit } from 'lucide-react';

interface IdeaStatusBadgeProps {
  status: ProjectIdeaStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const IdeaStatusBadge: React.FC<IdeaStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const config = {
    draft: {
      label: 'DRAFT',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-400',
      icon: <FileEdit className="w-3.5 h-3.5 text-gray-600" />,
    },
    submitted: {
      label: 'SUBMITTED',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-900',
      borderColor: 'border-blue-400',
      icon: <Send className="w-3.5 h-3.5 text-blue-700" />,
    },
    under_review: {
      label: 'UNDER REVIEW',
      bgColor: 'bg-[#FFF9DB]',
      textColor: 'text-amber-900',
      borderColor: 'border-amber-400',
      icon: <Clock className="w-3.5 h-3.5 text-amber-700" />,
    },
    approved: {
      label: 'APPROVED',
      bgColor: 'bg-[#E8F8F0]',
      textColor: 'text-emerald-900',
      borderColor: 'border-emerald-500',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
    },
    changes_requested: {
      label: 'CHANGES REQUESTED',
      bgColor: 'bg-[#FFF2E2]',
      textColor: 'text-orange-950',
      borderColor: 'border-orange-400',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-700" />,
    },
    rejected: {
      label: 'NOT APPROVED',
      bgColor: 'bg-[#FFEBEB]',
      textColor: 'text-rose-950',
      borderColor: 'border-rose-400',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-700" />,
    },
  }[status] || {
    label: status.toUpperCase(),
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-400',
    icon: <Clock className="w-3.5 h-3.5" />,
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-1 text-[10px]',
    lg: 'px-3.5 py-1.5 text-xs font-black',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-black border-2 border-[#121316] ${config.bgColor} ${config.textColor} ${sizeClasses} shadow-pop-sm select-none`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
