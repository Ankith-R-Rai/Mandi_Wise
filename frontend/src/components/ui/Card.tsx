import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
  hoverLift?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverLift = false, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          hoverLift
            ? { y: -3, boxShadow: '0 10px 25px -5px rgba(31, 81, 56, 0.08)' }
            : undefined
        }
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden transition-all duration-200',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-5 pb-3 flex flex-col gap-1', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn('text-base font-semibold text-surface-darkCharcoal tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs text-surface-muted leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-5 pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'p-5 pt-3 bg-surface-background/50 border-t border-surface-border flex items-center justify-between',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
