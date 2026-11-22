import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Footer } from './components/layout/Footer';
import { Sprout } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [guestMode, setGuestMode] = useState(false);

  // Display tranquil loader while verifying stored JWT session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A261A] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600/80 animate-pulse flex items-center justify-center border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <span className="text-xs font-semibold text-emerald-200/80 tracking-widest uppercase">
            Loading MandiWise...
          </span>
        </div>
      </div>
    );
  }

  // If unauthenticated and hasn't selected guest preview, display AuthPage FIRST
  if (!isAuthenticated && !guestMode) {
    return (
      <AuthPage
        onSuccess={() => setGuestMode(false)}
        onExploreGuest={() => setGuestMode(true)}
      />
    );
  }

  // Render full application / dashboard
  return (
    <div className="min-h-screen flex flex-col bg-surface-background text-surface-charcoal">
      <Navbar onOpenAuth={() => setGuestMode(false)} />
      <main className="flex-1">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
