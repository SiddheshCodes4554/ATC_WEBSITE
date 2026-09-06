import React from 'react';

export type IconModuleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconModuleVariant =
  | 'yellow'
  | 'purple'
  | 'green'
  | 'coral'
  | 'blue'
  | 'white'
  | 'dark'
  | 'cream'
  | 'ghost';

export interface IconModuleProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  size?: IconModuleSize;
  variant?: IconModuleVariant;
  shape?: 'square' | 'rounded' | 'circle' | 'pill';
  withBorder?: boolean;
  withShadow?: boolean;
  hoverEffect?: 'rotate' | 'bounce' | 'wiggle' | 'scale' | 'none';
  className?: string;
  badge?: React.ReactNode;
  ariaLabel?: string;
}

const sizeStyles: Record<IconModuleSize, { box: string; iconSize: string }> = {
  xs: { box: 'w-6 h-6 rounded-lg text-xs', iconSize: '[&>svg]:w-3 [&>svg]:h-3 [&>svg]:stroke-[2.5]' },
  sm: { box: 'w-8 h-8 rounded-xl text-sm', iconSize: '[&>svg]:w-4 [&>svg]:h-4 [&>svg]:stroke-[2.5]' },
  md: { box: 'w-10 h-10 rounded-2xl text-base', iconSize: '[&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[2.5]' },
  lg: { box: 'w-12 h-12 rounded-2xl text-lg', iconSize: '[&>svg]:w-6 [&>svg]:h-6 [&>svg]:stroke-[2.5]' },
  xl: { box: 'w-16 h-16 rounded-3xl text-2xl', iconSize: '[&>svg]:w-8 [&>svg]:h-8 [&>svg]:stroke-[2.5]' },
};

const variantStyles: Record<IconModuleVariant, string> = {
  yellow: 'bg-[#FFE600] text-[#121316] border-[#121316]',
  purple: 'bg-[#6C5CE7] text-white border-[#121316]',
  green: 'bg-[#2ED573] text-[#121316] border-[#121316]',
  coral: 'bg-[#FF4757] text-white border-[#121316]',
  blue: 'bg-[#54A0FF] text-[#121316] border-[#121316]',
  white: 'bg-white text-[#121316] border-[#121316]',
  dark: 'bg-[#121316] text-[#FFE600] border-[#121316]',
  cream: 'bg-[#FAF7F0] text-[#121316] border-[#121316]',
  ghost: 'bg-transparent text-[#121316] border-transparent',
};

const hoverStyles = {
  rotate: 'group-hover:rotate-6 group-hover:scale-105 transition-transform duration-200',
  bounce: 'group-hover:-translate-y-1 transition-transform duration-200',
  wiggle: 'group-hover:animate-wiggle',
  scale: 'group-hover:scale-110 transition-transform duration-200',
  none: '',
};

export const IconModule: React.FC<IconModuleProps> = ({
  icon,
  size = 'md',
  variant = 'yellow',
  shape = 'rounded',
  withBorder = true,
  withShadow = true,
  hoverEffect = 'rotate',
  className = '',
  badge,
  ariaLabel,
  ...props
}) => {
  const { box, iconSize } = sizeStyles[size];
  const variantClass = variantStyles[variant];

  const shapeClass =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'square'
      ? 'rounded-md'
      : shape === 'pill'
      ? 'rounded-full px-3 w-auto'
      : '';

  const borderClass = withBorder && variant !== 'ghost' ? 'border-2' : '';
  const shadowClass =
    withShadow && variant !== 'ghost'
      ? size === 'xs' || size === 'sm'
        ? 'shadow-pop-xs'
        : size === 'xl'
        ? 'shadow-pop'
        : 'shadow-pop-sm'
      : '';

  const hoverClass = hoverEffect ? hoverStyles[hoverEffect] : '';

  return (
    <div
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? 'false' : 'true'}
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${box} ${shapeClass} ${variantClass} ${borderClass} ${shadowClass} ${hoverClass} ${iconSize} ${className}`}
      {...props}
    >
      {icon}

      {/* Optional corner indicator or micro-badge */}
      {badge && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center z-10">
          {badge}
        </span>
      )}
    </div>
  );
};

export default IconModule;
