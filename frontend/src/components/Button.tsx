import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * Premium Button component with motion feedback and multiple variants.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm border border-transparent transition-all duration-200',
      secondary:
        'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-transparent transition-all duration-200',
      outline:
        'bg-transparent border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200',
      ghost:
        'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-100 transition-all duration-200',
    };

    const sizes = {
      xs: 'px-3 py-1.5 text-[11px] h-8',
      sm: 'px-4 py-2 text-sm h-9',
      md: 'px-6 py-2.5 text-base h-11',
      lg: 'px-8 py-3.5 text-lg h-14',
      icon: 'p-2 h-10 w-10',
    };

    const isDisabled = disabled || isLoading;

    const { onAnimationStart, onDragStart, onDragEnd, onDrag, ...safeProps } = props as any;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={!isDisabled ? { y: -2, scale: 1.02, filter: 'brightness(1.05)' } : {}}
        whileTap={!isDisabled ? { scale: 0.98, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 whitespace-nowrap cursor-pointer',
          variants[variant],
          sizes[size],
          isDisabled && 'opacity-50 cursor-not-allowed grayscale-[0.5]',
          className
        )}
        {...safeProps}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <motion.div
              className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            {children && <span>Loading...</span>}
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
