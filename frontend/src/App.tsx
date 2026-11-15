import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Footer } from './components/layout/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-background text-surface-charcoal">
      <Navbar />
      <main className="flex-1">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}
