import React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonColor = 'primary' | 'neutral' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'info';
export type ButtonVariant = 'solid' | 'outline' | 'dash' | 'soft' | 'ghost' | 'glass';
type ButtonLegacyVariant = ButtonColor | `${ButtonColor}-dash` | ButtonVariant;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: ButtonVariant | ButtonLegacyVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  prefixIcon?: React.ComponentType<{ className?: string }>;
  suffixIcon?: React.ComponentType<{ className?: string }>;
  shape?: 'square' | 'circle';
  iconClassName?: string;
  asChild?: boolean;
}

const buttonColors: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    // solid: 'bg-[var(--primary-color)] text-primary-foreground hover:brightness-80 active:brightness-70 shadow-sm rounded-lg shadow-[inset_0px_-3px_rgba(0,0,0,0.43)]',
    solid: 'bg-[var(--primary-color)] text-primary-foreground hover:brightness-80 active:brightness-70 shadow-sm rounded-lg',
    outline: 'border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-primary-foreground',
    dash: 'border-2 border-dashed border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-primary-foreground',
    soft: 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/20 active:bg-[var(--primary-color)]/30',
    ghost: 'text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 active:bg-[var(--primary-color)]/20',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 text-zinc-700 dark:text-zinc-300',
  },
  neutral: {
    solid: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-700',
    outline: 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:border-zinc-500',
    dash: 'border-2 border-dashed border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:border-zinc-500',
    soft: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:active:bg-zinc-600',
    ghost: 'text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:active:bg-zinc-600',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 text-zinc-700 dark:text-zinc-300',
  },
  secondary: {
    solid: 'bg-[var(--secondary-color)] text-white hover:brightness-80 active:brightness-70 shadow-sm',
    outline: 'border border-[var(--secondary-color)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-white',
    dash: 'border-2 border-dashed border-[var(--secondary-color)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-white',
    soft: 'bg-[var(--secondary-color)]/10 text-[var(--secondary-color)] hover:bg-[var(--secondary-color)]/20 active:bg-[var(--secondary-color)]/30',
    ghost: 'text-[var(--secondary-color)] hover:bg-[var(--secondary-color)]/10 active:bg-[var(--secondary-color)]/20',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 text-zinc-700 dark:text-zinc-300',
  },
  success: {
    solid: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-sm',
    outline: 'border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white',
    dash: 'border-2 border-dashed border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white',
    soft: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 active:bg-emerald-500/30',
    ghost: 'text-emerald-600 hover:bg-emerald-500/10 active:bg-emerald-500/20',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    solid: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm',
    outline: 'border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white',
    dash: 'border-2 border-dashed border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white',
    soft: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 active:bg-amber-500/30',
    ghost: 'text-amber-600 hover:bg-amber-500/10 active:bg-amber-500/20',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 text-amber-600 dark:text-amber-400',
  },
  error: {
    solid: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
    outline: 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
    dash: 'border-2 border-dashed border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
    soft: 'bg-red-600/10 text-red-600 hover:bg-red-600/20 active:bg-red-600/30',
    ghost: 'text-red-600 hover:bg-red-600/10 active:bg-red-600/20',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 text-red-600 dark:text-red-400',
  },
  danger: {
    solid: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-md',
    outline: 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
    dash: 'border-2 border-dashed border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
    soft: 'bg-red-500/10 text-red-600 hover:bg-red-500/20 active:bg-red-500/30',
    ghost: 'text-red-600 hover:bg-red-500/10 active:bg-red-500/20',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 text-red-600 dark:text-red-400',
  },
  info: {
    solid: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    dash: 'border-2 border-dashed border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    soft: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 active:bg-blue-500/30',
    ghost: 'text-blue-600 hover:bg-blue-500/10 active:bg-blue-500/20',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 text-blue-600 dark:text-blue-400',
  },
};

const buttonSizes = {
  xs: 'h-6 px-2 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
  xl: 'h-14 px-8 text-xl',
};

const iconClasses = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
};

const iconMargins = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
};

const shapeClasses = {
  square: 'rounded-md aspect-square px-0 shadow-none',
  circle: 'rounded-full aspect-square px-0 shadow-none',
};

const LoadingSpinner = ({ size }: { size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) => {
  const spinnerSize = iconClasses[size];
  return <Loader2 className={cn(spinnerSize, 'animate-spin')} />;
};

function getButtonStyle(color: ButtonColor, variant: ButtonVariant | undefined): string {
  const v = variant || 'solid';
  if (['solid', 'outline', 'dash', 'soft', 'ghost', 'glass'].includes(v)) {
    return buttonColors[color][v as ButtonVariant];
  }
  return buttonColors[color].solid;
}

const baseClasses = 'inline-flex relative items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

export function Button({
  color: propColor,
  variant: propVariant,
  size = 'md',
  shape,
  className,
  children,
  loading = false,
  disabled,
  icon,
  prefixIcon,
  suffixIcon,
  iconClassName,
  asChild = false,
  ...props
}: ButtonProps) {
  const PrefixIcon = icon || prefixIcon;
  const SuffixIcon = suffixIcon as React.ComponentType<{ className?: string }> | undefined;
  const iconCn = cn(iconClasses[size], iconClassName);
  const contentGap = iconMargins[size];

  let finalColor: ButtonColor = 'neutral';
  let finalVariant: ButtonVariant = 'solid';

  if (propColor) {
    finalColor = propColor;
    if (propVariant) {
      if (['solid', 'outline', 'dash', 'soft', 'ghost', 'glass'].includes(propVariant)) {
        finalVariant = propVariant as ButtonVariant;
      } else {
        finalVariant = 'solid';
      }
    }
  } else if (propVariant) {
    if (propVariant.includes('-dash')) {
      const colorPart = propVariant.replace('-dash', '') as ButtonColor;
      finalColor = buttonColors[colorPart] ? colorPart : 'neutral';
      finalVariant = 'dash';
    } else if (['solid', 'outline', 'ghost', 'glass'].includes(propVariant)) {
      finalVariant = propVariant as ButtonVariant;
    } else {
      const colorPart = propVariant as ButtonColor;
      finalColor = buttonColors[colorPart] ? colorPart : 'neutral';
      finalVariant = 'solid';
    }
  }

  const variantClass = getButtonStyle(finalColor, finalVariant);
  const sharedClassName = cn(
    baseClasses,
    variantClass,
    buttonSizes[size],
    shape && shapeClasses[shape],
    !shape && 'rounded-md',
    (PrefixIcon || SuffixIcon) && contentGap,
    className
  );

  if (asChild) {
    return (
      <Slot
        className={sharedClassName}
        {...props}
      >
        {loading && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <LoadingSpinner size={size} />
        </span>}
        {PrefixIcon && React.createElement(PrefixIcon, { className: cn(iconCn, loading && 'opacity-0') })}
        <Slottable>{children}</Slottable>
        {SuffixIcon && React.createElement(SuffixIcon, { className: cn(iconCn, loading && 'opacity-0') })}
      </Slot>
    );
  }

  return (
    <button
      className={sharedClassName}
      disabled={disabled || loading}
      {...props}
    >

      {loading && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadingSpinner size={size} />
      </span>}
      <span className={cn(
        'flex items-center',
        (PrefixIcon || SuffixIcon) && contentGap,
        loading ? 'opacity-0' : 'opacity-100'
      )}>
        {PrefixIcon && React.createElement(PrefixIcon, { className: iconCn })}
        {children}
        {SuffixIcon && React.createElement(SuffixIcon, { className: iconCn })}
      </span>
    </button>
  );
}
