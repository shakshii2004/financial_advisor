import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { onAnimationStart, onDragStart, onDragEnd, onDrag, ...safeProps } = props as any;

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 1,
        ease: 'easeInOut',
      }}
      className={cn('bg-neutral-200/60 rounded-md', className)}
      {...safeProps}
    />
  );
};
