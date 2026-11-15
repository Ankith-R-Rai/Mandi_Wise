import React from 'react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-surface-border',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-forest-lightSage flex items-center justify-center text-forest mb-3">
        {icon || (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </div>

      <h4 className="text-sm font-semibold text-surface-darkCharcoal mb-1">{title}</h4>
      <p className="text-xs text-surface-muted max-w-sm mb-4 leading-relaxed">
        {description}
      </p>

      {action ? <div>{action}</div> : null}
    </div>
  );
};
