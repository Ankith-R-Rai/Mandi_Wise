import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'fresh'
  | 'acceptable'
  | 'stale';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
  success: {
    bg: 'bg-green-50',
    text: 'text-semantic-success',
    border: 'border-green-200',
    dotColor: 'bg-semantic-success',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-semantic-error',
    border: 'border-red-200',
    dotColor: 'bg-semantic-error',
  },
  info: {
    bg: 'bg-sky-50',
    text: 'text-semantic-info',
    border: 'border-sky-200',
    dotColor: 'bg-semantic-info',
  },
  neutral: {
    bg: 'bg-surface-background',
    text: 'text-surface-charcoal',
    border: 'border-surface-border',
    dotColor: 'bg-surface-muted',
  },
  fresh: {
    bg: 'bg-[#EAF6EE]',
    text: 'text-[#1F5138]',
    border: 'border-[#B7E1C7]',
    dotColor: 'bg-[#1F5138]',
  },
  acceptable: {
    bg: 'bg-[#FEF8EC]',
    text: 'text-[#996300]',
    border: 'border-[#FDE0B2]',
    dotColor: 'bg-[#D99A32]',
  },
  stale: {
    bg: 'bg-[#F3F4F3]',
    text: 'text-[#68736B]',
    border: 'border-[#D9DFDB]',
    dotColor: 'bg-[#87918A]',
  },
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1.5',
  md: 'text-xs px-2.5 py-1 gap-2',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = true,
  className,
  children,
  ...props
}) => {
  const current = badgeVariants[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border tracking-wide select-none',
        current.bg,
        current.text,
        current.border,
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {dot ? (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', current.dotColor)}
          aria-hidden="true"
        />
      ) : null}
      <span>{children}</span>
    </span>
  );
};
