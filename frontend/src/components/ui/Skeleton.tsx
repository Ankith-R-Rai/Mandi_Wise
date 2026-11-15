import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  className,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    card: 'h-32 w-full rounded-xl',
    circle: 'h-10 w-10 rounded-full',
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-surface-border/70',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
