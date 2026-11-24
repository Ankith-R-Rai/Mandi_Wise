import { Link, useLocation } from "react-router-dom";
import { Sprout, Camera, IndianRupee, BarChart3, History, Database, Info, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: Sprout },
  { to: "/analyze", label: "Crop Analysis", icon: Camera },
  { to: "/predict-price", label: "Price Prediction", icon: IndianRupee },
  { to: "/markets", label: "Karnataka Mandis", icon: BarChart3 },
  { to: "/history", label: "History", icon: History },
  { to: "/models", label: "Datasets & Models", icon: Database },
  { to: "/about", label: "About", icon: Info },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-emerald-50/40 text-slate-800 flex flex-col">
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-emerald-900">AgriVision AI</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                MandiWise Ready
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition ${
                  pathname === to
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg border border-emerald-200">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <nav className="lg:hidden px-4 pb-3 grid grid-cols-2 gap-2">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  pathname === to ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">{children}</main>

      <footer className="bg-white border-t border-emerald-100 py-4 text-center text-xs text-slate-500">
        AgriVision AI — Visual Crop Grading &amp; AGMARKNET Market Intelligence (Karnataka Focus)
      </footer>
    </div>
  );
}
