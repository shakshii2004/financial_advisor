import React from 'react';
import { motion } from 'framer-motion';

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Standard container for dashboard pages.
 * Provides consistent heading, spacing, and transition effects.
 */
export const DashboardShell: React.FC<DashboardShellProps> = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <div className="w-full pt-4 pb-10 md:pb-12 lg:pb-16">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed max-w-2xl">{subtitle}</p>
          )}
        </motion.div>
        
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="shrink-0"
          >
            {action}
          </motion.div>
        )}
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
