import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HeroBackground } from '../components/hero/HeroBackground';
import { Button } from '../components/ui/Button';

interface AuthPageProps {
  onSuccess?: () => void;
  onExploreGuest?: () => void;
  initialMode?: 'login' | 'register';
}

const KARNATAKA_DISTRICTS = [
  'Kolar',
  'Bengaluru Urban',
  'Bengaluru Rural',
  'Chikkaballapura',
  'Mysuru',
  'Mandya',
  'Hassan',
  'Tumakuru',
  'Belagavi',
  'Dharwad',
  'Shivamogga',
  'Davangere',
  'Ballari',
  'Kalaburagi',
  'Udupi',
  'Dakshina Kannada',
];

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  onExploreGuest,
  initialMode = 'login',
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState('Kolar');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      await login({ email: loginEmail, password: loginPassword });
      setSuccessMsg('Welcome back to MandiWise!');
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      await register({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        phoneNumber: regPhone || undefined,
        district: regDistrict,
      });
      setSuccessMsg('Account created successfully! Welcome to MandiWise.');
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0A261A]">
      {/* Cinematic Full-Bleed Misty Western Ghats Background */}
      <HeroBackground />

      {/* Top Floating Branding Ribbon */}
      <header className="relative z-10 w-full pt-6 pb-2 px-4 sm:px-6 flex justify-center">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#0A261A]/85 backdrop-blur-xl border border-emerald-400/30 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]">
            <Sprout className="w-4 h-4 text-emerald-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight">MandiWise</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/35">
              Karnataka
            </span>
          </div>
        </div>
      </header>

      {/* Main Centered Sign In / Registration Glass Container */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-[#0A261A]/95 backdrop-blur-2xl border border-emerald-400/35 shadow-[0_30px_70px_rgba(5,26,17,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.25)] rounded-3xl p-6 sm:p-8 text-white overflow-hidden"
        >
          {/* Card Title & Introduction */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {mode === 'login' ? 'Farmer Sign In' : 'Join MandiWise'}
            </h1>
            <p className="text-xs text-emerald-200/80 mt-1.5 leading-relaxed">
              {mode === 'login'
                ? 'Sign in to access real-time market prices & true net earnings'
                : 'Free agricultural decision-support designed for Karnataka farmers'}
            </p>
          </div>

          {/* Mode Toggle Switch */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                resetMessages();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                resetMessages();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Error & Success Notification Banners */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-emerald-100/90 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/15 focus:border-emerald-400 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-100/90 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/15 focus:border-emerald-400 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full mt-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign In to MandiWise</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-emerald-100/90 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Ramesh Gowda"
                    className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/15 focus:border-emerald-400 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-100/90 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/15 focus:border-emerald-400 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-emerald-100/90 mb-1">
                    Password (min 8)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 bg-black/30 border border-white/15 focus:border-emerald-400 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-100/90 mb-1">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2 bg-black/30 border border-white/15 focus:border-emerald-400 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-100/90 mb-1">
                  Primary Karnataka District
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#061B12] border border-white/15 focus:border-emerald-400 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors cursor-pointer"
                  >
                    {KARNATAKA_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist} className="bg-[#061B12] text-white">
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full mt-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Register as Karnataka Farmer</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          )}

          {/* Guest Mode Exploration Link */}
          {onExploreGuest && (
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={onExploreGuest}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
              >
                <span>Just exploring? Preview public market prices as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Trust Badges Footer */}
      <footer className="relative z-10 w-full pb-6 pt-2 px-4 sm:px-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-emerald-200/70">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AGMARKNET Official Records</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>True Net Profit Calculations</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Free for Karnataka Farmers</span>
        </div>
      </footer>
    </div>
  );
};
