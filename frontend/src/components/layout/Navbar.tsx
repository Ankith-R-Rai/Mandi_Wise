import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sprout, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'KN'>('EN');
  const [activeNav, setActiveNav] = useState<string>('benchmarks');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const navLinks = [
    { label: 'Market Prices', id: 'benchmarks' },
    { label: 'Net Earnings Axiom', id: 'axiom' },
    { label: 'Features', id: 'features' },
    { label: 'UI Playground', id: 'design-system' },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    onNavigateSection?.(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      {/* Liquid Glass Pill Bar */}
      <div className="relative bg-white/80 backdrop-blur-2xl border border-white/60 rounded-full shadow-[0_12px_40px_rgba(31,81,56,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo (Tagline removed per user request) */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-forest/30">
            <Sprout className="w-5 h-5 text-forest-sage" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-surface-darkCharcoal tracking-tight leading-none group-hover:text-forest transition-colors">
              MandiWise
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest bg-forest-lightSage px-2 py-0.5 rounded-full border border-forest-sage/40">
              Karnataka
            </span>
          </div>
        </div>

        {/* Centered Desktop Navigation with Sliding Liquid Pill */}
        <nav className="hidden md:flex items-center gap-1 relative bg-surface-background/70 p-1 rounded-full border border-surface-border/60 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            const isHovered = hoveredNav === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                onMouseEnter={() => setHoveredNav(link.id)}
                onMouseLeave={() => setHoveredNav(null)}
                className={cn(
                  'relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 select-none cursor-pointer',
                  isActive ? 'text-forest' : 'text-surface-charcoal/80 hover:text-forest'
                )}
              >
                {/* Active Pill Spring Transition */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-surface-border/70 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}

                {/* Hover Pill Preview */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 bg-forest-lightSage/60 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}

                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Language Switcher Pill */}
          <button
            onClick={() => setCurrentLang(currentLang === 'EN' ? 'KN' : 'EN')}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-surface-border/80 bg-white/70 text-surface-charcoal hover:bg-forest-lightSage hover:text-forest hover:border-forest-sage transition-all duration-200 shadow-xs cursor-pointer"
            title="Toggle Language"
          >
            {currentLang === 'EN' ? '🌐 KN' : '🌐 EN'}
          </button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => handleNavClick('design-system')}
          >
            UI Kit
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="rounded-full shadow-sm hover:shadow-forest/25"
            onClick={() => handleNavClick('benchmarks')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Find Mandi
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setCurrentLang(currentLang === 'EN' ? 'KN' : 'EN')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-surface-border bg-white/80 text-surface-charcoal"
          >
            {currentLang === 'EN' ? 'ಕನ್ನಡ' : 'EN'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-1.5 text-surface-charcoal hover:bg-surface-background rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Liquid Glass Island) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="md:hidden mt-2 p-4 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-xl space-y-2"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left py-2.5 px-3 text-sm font-semibold text-surface-charcoal hover:bg-forest-lightSage hover:text-forest rounded-xl transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center rounded-xl"
                onClick={() => handleNavClick('benchmarks')}
              >
                Find Best Mandi
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
