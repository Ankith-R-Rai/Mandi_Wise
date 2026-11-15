import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = 'md',
}) => {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Card Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={cn(
              'relative w-full bg-white rounded-2xl border border-surface-border shadow-xl z-10 overflow-hidden',
              maxWidthMap[maxWidth],
              className
            )}
          >
            {/* Header */}
            {title ? (
              <div className="flex items-center justify-between p-5 pb-3 border-b border-surface-border">
                <div>
                  <h3 className="text-base font-semibold text-surface-darkCharcoal tracking-tight">
                    {title}
                  </h3>
                  {description ? (
                    <p className="text-xs text-surface-muted mt-0.5">{description}</p>
                  ) : null}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-1.5 rounded-lg text-surface-muted hover:text-surface-charcoal hover:bg-surface-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {/* Body */}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};
