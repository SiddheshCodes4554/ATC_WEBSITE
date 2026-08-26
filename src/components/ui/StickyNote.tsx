import React from 'react';

interface StickyNoteProps {
  children: React.ReactNode;
  color?: 'yellow' | 'pink' | 'purple' | 'green' | 'blue' | 'orange';
  rotation?: string; // e.g. "-rotate-2", "rotate-3"
  className?: string;
  tape?: boolean;
  title?: string;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  children,
  color = 'yellow',
  rotation = '-rotate-2',
  className = '',
  tape = true,
  title,
}) => {
  const colorMap = {
    yellow: 'bg-[#FFF385] text-[#121316]',
    pink: 'bg-[#FFD1E3] text-[#121316]',
    purple: 'bg-[#E1DCFF] text-[#121316]',
    green: 'bg-[#D4F8E8] text-[#121316]',
    blue: 'bg-[#D6EEFF] text-[#121316]',
    orange: 'bg-[#FFE2C9] text-[#121316]',
  };

  return (
    <div className={`relative p-5 rounded-2xl border-3 border-[#121316] shadow-pop transition-transform duration-200 hover:rotate-0 hover:scale-105 ${colorMap[color]} ${rotation} ${className}`}>
      {tape && (
        <div className="tape-strip pointer-events-none" />
      )}
      {title && (
        <h4 className="font-hand font-bold text-xl tracking-tight mb-2 text-[#121316] flex items-center gap-1.5">
          <span>📌</span> {title}
        </h4>
      )}
      <div className="font-hand text-lg sm:text-xl leading-snug">
        {children}
      </div>
    </div>
  );
};
