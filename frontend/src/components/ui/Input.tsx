import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-surface-charcoal tracking-wide"
          >
            {label}
          </label>
        ) : null}

        <div className="relative flex items-center">
          {leftIcon ? (
            <span className="absolute left-3 text-surface-muted pointer-events-none flex items-center">
              {leftIcon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg bg-white px-3.5 py-2 text-sm text-surface-charcoal placeholder:text-surface-muted',
              'border border-surface-border transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest',
              'disabled:bg-surface-background disabled:text-surface-muted disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              error ? 'border-semantic-error focus:ring-semantic-error focus:border-semantic-error' : '',
              className
            )}
            {...props}
          />

          {rightIcon ? (
            <span className="absolute right-3 text-surface-muted pointer-events-none flex items-center">
              {rightIcon}
            </span>
          ) : null}
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

Input.displayName = 'Input';
