import React from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface PlayfulButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'purple' | 'coral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withConfetti?: boolean;
  icon?: React.ReactNode;
}

export const PlayfulButton: React.FC<PlayfulButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  withConfetti = false,
  icon,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (withConfetti) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { x, y },
        colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#48DBFB', '#2ED573'],
      });
    }
    if (onClick) onClick();
  };

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs sm:text-sm font-bold gap-1.5',
    md: 'px-5 py-2.5 text-sm sm:text-base font-bold gap-2',
    lg: 'px-7 py-3.5 text-base sm:text-lg font-extrabold gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-[#FFD32A] hover:bg-[#FFE600] text-[#121316] border-2 sm:border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:shadow-pop-hover',
    secondary: 'bg-[#FAF7F0] hover:bg-white text-[#121316] border-2 sm:border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:shadow-pop-hover',
    dark: 'bg-[#121316] hover:bg-[#22252e] text-[#FFE600] border-2 sm:border-3 border-[#121316] shadow-pop-yellow hover:shadow-pop-lg',
    purple: 'bg-[#6C5CE7] hover:bg-[#5846E2] text-white border-2 sm:border-3 border-[#121316] shadow-pop hover:shadow-pop-lg',
    coral: 'bg-[#FF6B6B] hover:bg-[#FF5252] text-white border-2 sm:border-3 border-[#121316] shadow-pop hover:shadow-pop-lg',
    outline: 'bg-transparent hover:bg-[#121316]/5 text-[#121316] border-2 sm:border-3 border-[#121316] shadow-pop-sm hover:shadow-pop',
  };

  const baseClasses = `group inline-flex items-center justify-center rounded-full transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] select-none cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={handleClick}>
        <span>{children}</span>
        {icon && <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">{icon}</span>}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses} onClick={handleClick}>
        <span>{children}</span>
        {icon && <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">{icon}</span>}
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={baseClasses}>
      <span>{children}</span>
      {icon && <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">{icon}</span>}
    </button>
  );
};
