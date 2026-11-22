import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sprout, ArrowRight, Globe, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';

export interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection, onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'KN'>('EN');
  const [activeNav, setActiveNav] = useState<string>('benchmarks');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      setAuthModalMode(mode);
      setAuthModalOpen(true);
    }
  };

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
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      {/* Misty Ghats Smoked Liquid Glass Pill Bar */}
      <div className="relative bg-[#0A261A]/85 backdrop-blur-2xl border border-emerald-400/30 rounded-full shadow-[0_18px_45px_rgba(5,26,17,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.6)] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo (Tagline removed per user request) */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-600/90 flex items-center justify-center text-white shadow-[0_0_16px_rgba(16,185,129,0.45)] border border-emerald-400/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-tight leading-none group-hover:text-emerald-300 transition-colors drop-shadow-sm">
              MandiWise
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/35 shadow-xs">
              Karnataka
            </span>
          </div>
        </div>

        {/* Centered Desktop Navigation with Sliding Liquid Pill */}
        <nav className="hidden md:flex items-center gap-1 relative bg-black/30 p-1 rounded-full border border-white/10 backdrop-blur-md">
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
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                )}
              >
                {/* Active Pill Spring Transition with Emerald Glass Glow */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-emerald-600/55 rounded-full border border-emerald-400/50 shadow-[0_0_18px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}

                {/* Hover Pill Preview */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}

                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions Harmonized with Misty Ghats & Harvest Amber */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Language Switcher Pill */}
          <button
            onClick={() => setCurrentLang(currentLang === 'EN' ? 'KN' : 'EN')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-all duration-200 shadow-xs cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 opacity-80" />
            <span>{currentLang === 'EN' ? 'KN' : 'EN'}</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/25 shadow-xs"
            onClick={() => handleNavClick('design-system')}
          >
            UI Kit
          </Button>

          {/* User Profile or Sign In CTA */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-400/35 rounded-full px-3 py-1 text-xs shadow-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                <UserIcon className="w-3 h-3" />
              </div>
              <span className="font-semibold text-white max-w-[110px] truncate">
                {user.fullName.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="text-white/60 hover:text-red-300 transition-colors ml-1 p-0.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/25 shadow-xs"
              onClick={() => handleOpenAuth('login')}
              leftIcon={<LogIn className="w-3.5 h-3.5" />}
            >
              Sign In
            </Button>
          )}

          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold border-0 shadow-lg shadow-amber-500/30"
            onClick={() => handleNavClick('benchmarks')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5 text-slate-950 font-bold" />}
          >
            Find Mandi
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setCurrentLang(currentLang === 'EN' ? 'KN' : 'EN')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20 bg-white/10 text-white"
          >
            {currentLang === 'EN' ? 'ಕನ್ನಡ' : 'EN'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-1.5 text-white/90 hover:bg-white/10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Smoked Liquid Glass Island) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="md:hidden mt-2 p-4 bg-[#0A261A]/95 backdrop-blur-2xl border border-emerald-400/30 rounded-3xl shadow-2xl space-y-2"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left py-2.5 px-3 text-sm font-semibold text-white/90 hover:bg-emerald-600/30 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            
            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/10 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                    <span>{user.fullName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center rounded-xl bg-white/10 text-white border-white/20"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuth('login');
                  }}
                  leftIcon={<LogIn className="w-3.5 h-3.5" />}
                >
                  Sign In / Join
                </Button>
              )}

              <Button
                size="sm"
                className="w-full justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold border-0"
                onClick={() => handleNavClick('benchmarks')}
              >
                Find Best Mandi
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* Auth Modal (Rendered outside header to guarantee full viewport bounds) */}
    <AuthModal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      defaultMode={authModalMode}
    />
  </>
);
};
