import React, { useState } from 'react';
import { Menu, X, Sprout, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'KN'>('EN');

  const navLinks = [
    { label: 'Market Prices', id: 'benchmarks' },
    { label: 'Net Earnings Axiom', id: 'axiom' },
    { label: 'Features', id: 'features' },
    { label: 'Design System Showcase', id: 'design-system' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection?.(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-5 h-5 text-forest-sage" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-surface-darkCharcoal tracking-tight flex items-center gap-1.5 leading-none">
              MandiWise
              <span className="text-[10px] uppercase font-bold tracking-widest text-forest bg-forest-lightSage px-1.5 py-0.5 rounded">
                Karnataka
              </span>
            </span>
            <span className="text-[11px] font-medium text-surface-muted mt-0.5">
              ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ನಿರ್ಧಾರ ಸಹಾಯಕ
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-xs font-medium text-surface-charcoal hover:text-forest transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-md px-1 py-0.5"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher Pill */}
          <button
            onClick={() => setCurrentLang(currentLang === 'EN' ? 'KN' : 'EN')}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-surface-border text-surface-charcoal hover:bg-forest-lightSage transition-colors"
            title="Toggle Language"
          >
            {currentLang === 'EN' ? '🌐 ಕನ್ನಡ (KN)' : '🌐 English (EN)'}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavClick('design-system')}
          >
            UI Kit
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNavClick('benchmarks')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Find Best Mandi
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setCurrentLang(currentLang === 'EN' ? 'KN' : 'EN')}
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-surface-border text-surface-charcoal"
          >
            {currentLang === 'EN' ? 'ಕನ್ನಡ' : 'EN'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-1.5 text-surface-charcoal hover:bg-surface-background rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen ? (
        <div className="md:hidden border-b border-surface-border bg-white px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="w-full text-left py-2 px-3 text-sm font-medium text-surface-charcoal hover:bg-forest-lightSage hover:text-forest rounded-lg"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center"
              onClick={() => handleNavClick('benchmarks')}
            >
              Find Best Mandi
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
};
