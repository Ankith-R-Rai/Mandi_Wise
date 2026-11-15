import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, id, disabled, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-surface-charcoal tracking-wide"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-lg bg-white px-3.5 py-2 pr-10 text-sm text-surface-charcoal',
              'border border-surface-border transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest',
              'disabled:bg-surface-background disabled:text-surface-muted disabled:cursor-not-allowed cursor-pointer',
              error ? 'border-semantic-error focus:ring-semantic-error' : '',
              className
            )}
            {...props}
          >
            {children ? (
              children
            ) : (
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            )}
          </select>

          {/* Custom Chevron SVG */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-muted">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error ? (
          <p className="text-xs text-semantic-error font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-surface-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
