import React from 'react';

interface BadgePillProps {
  children: React.ReactNode;
  color?: 'yellow' | 'purple' | 'blue' | 'coral' | 'lime' | 'dark' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BadgePill: React.FC<BadgePillProps> = ({
  children,
  color = 'yellow',
  size = 'md',
  icon,
  className = '',
  onClick,
}) => {
  const colorMap = {
    yellow: 'bg-[#FFD32A] text-[#121316]',
    purple: 'bg-[#EBE8FC] text-[#6C5CE7]',
    blue: 'bg-[#E1F0FF] text-[#2E86DE]',
    coral: 'bg-[#FFE8E8] text-[#FF6B6B]',
    lime: 'bg-[#E3FAEE] text-[#10AC84]',
    dark: 'bg-[#121316] text-[#FFE600]',
    cream: 'bg-[#FAF7F0] text-[#121316]',
  };

  const sizeMap = {
    sm: 'px-2.5 py-0.5 text-xs font-bold gap-1',
    md: 'px-3.5 py-1 text-xs sm:text-sm font-extrabold gap-1.5',
    lg: 'px-5 py-2 text-sm sm:text-base font-extrabold gap-2',
  };

  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center rounded-full border-2 border-[#121316] shadow-pop-sm select-none transition-transform ${sizeMap[size]} ${colorMap[color]} ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};
