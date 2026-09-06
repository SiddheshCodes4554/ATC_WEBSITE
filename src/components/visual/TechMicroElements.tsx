import React from 'react';

// 1. Physical Screw Marker
export const ScrewHead: React.FC<{ className?: string; rotation?: number }> = ({
  className = 'w-3 h-3',
  rotation = 45,
}) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none opacity-40 hover:opacity-100 transition-opacity ${className}`}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <circle cx="8" cy="8" r="7" fill="#E4E7EB" stroke="#121316" strokeWidth="1.5" />
    <line x1="4" y1="8" x2="12" y2="8" stroke="#121316" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="4" x2="8" y2="12" stroke="#121316" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 2. Glowing Signal LED
export const SignalLed: React.FC<{
  color?: 'green' | 'amber' | 'red' | 'blue' | 'purple';
  pulse?: boolean;
  className?: string;
  label?: string;
}> = ({ color = 'green', pulse = true, className = '', label }) => {
  const colorMap = {
    green: 'bg-[#2ED573] shadow-[0_0_8px_#2ED573]',
    amber: 'bg-[#FFE600] shadow-[0_0_8px_#FFE600]',
    red: 'bg-[#FF4757] shadow-[0_0_8px_#FF4757]',
    blue: 'bg-[#54A0FF] shadow-[0_0_8px_#54A0FF]',
    purple: 'bg-[#6C5CE7] shadow-[0_0_8px_#6C5CE7]',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold ${className}`}>
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${colorMap[color].split(' ')[0]}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 border border-[#121316] ${colorMap[color]}`}
        />
      </span>
      {label && <span className="uppercase text-[#121316]">{label}</span>}
    </span>
  );
};

// 3. Circuit Corner Connector
export const CircuitCorner: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position = 'top-left', className = 'w-6 h-6' }) => {
  const rotMap = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none opacity-30 ${rotMap[position]} ${className}`}
    >
      <path d="M 2 22 L 2 6 C 2 3.8 3.8 2 6 2 L 22 2" stroke="#121316" strokeWidth="2.5" />
      <circle cx="6" cy="6" r="2.5" fill="#FFE600" stroke="#121316" strokeWidth="1.5" />
      <circle cx="18" cy="2" r="1.5" fill="#121316" />
    </svg>
  );
};

// 4. Tech Bracket Marker
export const TechBracket: React.FC<{
  side?: 'left' | 'right';
  className?: string;
}> = ({ side = 'left', className = 'h-5 w-2' }) => (
  <span
    aria-hidden="true"
    className={`font-mono font-black text-gray-400 select-none ${className}`}
  >
    {side === 'left' ? '[' : ']'}
  </span>
);
