import { motion } from 'motion/react';
import { Sprout, CheckCircle2, TrendingUp, ShieldCheck, Database } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12">
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-8 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-surface-darkCharcoal">
              MandiWise <span className="text-sm font-normal text-forest font-sans">ಮಂಡಿವೈಸ್</span>
            </h1>
            <p className="text-xs text-surface-muted">Agricultural Market Decision Support Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-lightSage border border-forest-sage text-forest text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse"></span>
          Phase 1: Environment Baseline
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto my-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-surface rounded-2xl p-8 sm:p-10 border border-surface-border shadow-sm"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-forest-lightSage text-forest text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            Infrastructure Verification
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-surface-darkCharcoal tracking-tight mb-4">
            React + TypeScript + Tailwind Baseline Active
          </h2>

          <p className="text-surface-charcoal/80 leading-relaxed mb-8">
            The frontend development environment is established with the approved nature-inspired color palette,
            Motion for React animations, TanStack Query server state, and responsive layout foundations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-border">
            <div className="p-4 rounded-xl bg-surface-background border border-surface-border">
              <div className="flex items-center gap-2 text-forest mb-1 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                Frontend Stack
              </div>
              <p className="text-xs text-surface-muted">React 18, Vite, Tailwind CSS, Motion</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-background border border-surface-border">
              <div className="flex items-center gap-2 text-forest mb-1 font-semibold text-sm">
                <Database className="w-4 h-4 text-semantic-info" />
                Cloud Database
              </div>
              <p className="text-xs text-surface-muted">Supabase PostgreSQL (ap-south-1)</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-background border border-surface-border">
              <div className="flex items-center gap-2 text-forest mb-1 font-semibold text-sm">
                <TrendingUp className="w-4 h-4 text-semantic-warning" />
                Decision Engine
              </div>
              <p className="text-xs text-surface-muted">Spring Boot Net Earnings Ranker</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="max-w-6xl w-full mx-auto pt-8 border-t border-surface-border text-center text-xs text-surface-muted">
        MandiWise &copy; 2026 &bull; Initial Geographic Scope: Karnataka, India
      </footer>
    </div>
  );
}
