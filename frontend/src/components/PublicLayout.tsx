import React from 'react';
import { motion } from 'framer-motion';

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Public layout for landing pages, auth pages, etc.
 * Provides a clean, minimalist backdrop for public content.
 */
export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white selection:bg-neutral-900 selection:text-white">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {children}
      </motion.main>
    </div>
  );
};
