import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sprout, Globe, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';

export interface NavbarProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'KN'>('EN');
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
    { label: 'Recommendations', path: '/recommendations' },
    { label: 'Market Prices', path: '/market-prices' },
    { label: 'Price Trends', path: '/price-trends' },
    { label: 'Net Earnings Axiom', path: '/net-earnings-axiom' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        {/* Misty Ghats Smoked Liquid Glass Pill Bar */}
        <div className="relative bg-[#0A261A]/85 backdrop-blur-2xl border border-emerald-400/30 rounded-full shadow-[0_18px_45px_rgba(5,26,17,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.6)] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600/90 flex items-center justify-center text-white shadow-[0_0_16px_rgba(16,185,129,0.45)] border border-emerald-400/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-none">
                Mandi<span className="text-emerald-400">Wise</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const isHovered = hoveredNav === link.path;

              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  onMouseEnter={() => setHoveredNav(link.path)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={cn(
                    'relative px-4 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 select-none cursor-pointer',
                    isActive ? 'text-white' : 'text-white/70 hover:text-white'
                  )}
                >
                  {/* Active Pill Spring Transition with Emerald Glass Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-emerald-600/60 rounded-full border border-emerald-400/50 shadow-[0_0_18px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] -z-10"
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

          {/* Right Actions */}
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

            {/* User Profile or Sign In CTA */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-400/35 rounded-full px-3 py-1 text-xs shadow-xs">
                <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <UserIcon className="w-3 h-3" />
                </div>
                <span className="font-semibold text-white/90 max-w-[100px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-white/60 hover:text-red-300 transition-colors ml-1 p-0.5 rounded cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="rounded-full shadow-[0_0_18px_rgba(16,185,129,0.35)] px-4 text-xs font-bold"
                onClick={() => handleOpenAuth('login')}
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCurrentLang(currentLang === 'EN' ? 'KN' : 'EN')}
              className="text-xs font-semibold px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white/90"
            >
              {currentLang === 'EN' ? 'KN' : 'EN'}
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

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="md:hidden mt-2 p-4 bg-[#0A261A]/95 backdrop-blur-2xl border border-emerald-400/30 rounded-3xl shadow-2xl space-y-2"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={cn(
                      'w-full text-left py-2.5 px-3.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer',
                      isActive
                        ? 'bg-emerald-600/50 text-white font-bold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {link.label}
                  </button>
                );
              })}
              
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
                    variant="primary"
                    size="sm"
                    className="w-full rounded-xl"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleOpenAuth('login');
                    }}
                  >
                    <LogIn className="w-3.5 h-3.5 mr-1" />
                    Sign In to MandiWise
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating Auth Modal fallback */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </>
  );
};
