import React from 'react';
import { cn } from '../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
}

/**
 * Premium Card component with consistent padding and subtle styling.
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  isHoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-neutral-200/60 shadow-sm transition-all duration-300',
        isHoverable && 'hover:shadow-md hover:border-neutral-300/60',
        props.onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children?: React.ReactNode; title?: string; subtitle?: string; className?: string }> = ({
  children,
  title,
  subtitle,
  className = '',
}) => (
  <div className={cn('px-8 py-6 border-b border-neutral-100', className)}>
    {title && <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>}
    {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
    {children}
  </div>
);

export const CardContent: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={cn('px-8 py-6', className)}>{children}</div>;

export const CardFooter: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={cn('px-8 py-5 bg-neutral-50/50 border-t border-neutral-100 rounded-b-2xl', className)}>
    {children}
  </div>
);
