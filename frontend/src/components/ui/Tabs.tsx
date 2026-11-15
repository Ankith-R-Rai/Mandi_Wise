import React, { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  layoutId?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  layoutId,
  className,
}) => {
  const generatedId = useId();
  const activeLayoutId = layoutId || `tab-pill-${generatedId}`;

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-surface-background border border-surface-border rounded-xl select-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-1',
              'flex items-center gap-2 z-10',
              isActive ? 'text-forest font-semibold' : 'text-surface-muted hover:text-surface-charcoal'
            )}
          >
            {isActive ? (
              <motion.div
                layoutId={activeLayoutId}
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-surface-border -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            ) : null}

            {tab.icon ? <span className="shrink-0">{tab.icon}</span> : null}
            <span>{tab.label}</span>

            {tab.badge !== undefined ? (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-semibold',
                  isActive
                    ? 'bg-forest-lightSage text-forest'
                    : 'bg-surface-border text-surface-muted'
                )}
              >
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
