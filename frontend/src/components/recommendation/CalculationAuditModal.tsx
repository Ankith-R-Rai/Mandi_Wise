import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calculator, Truck, Receipt, Scale, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { MandiCandidate } from '../../types/recommendation';

interface CalculationAuditModalProps {
  candidate: MandiCandidate | null;
  onClose: () => void;
}

export const CalculationAuditModal: React.FC<CalculationAuditModalProps> = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const { breakdown } = candidate;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                {candidate.marketName} APMC
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-normal">
                  {candidate.district}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Transparent Financial Calculation Breakdown & Cost Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Quantity</span>
              <span className="text-base font-semibold text-slate-200">
                {breakdown.quantityKg.toLocaleString()} kg
              </span>
              <span className="text-xs text-slate-400 block font-mono">
                ({breakdown.quantityQuintals} q)
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Modal Price</span>
              <span className="text-base font-semibold text-slate-200">
                ₹{breakdown.modalPricePerQuintal.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 block font-mono">/ quintal</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Road Distance</span>
              <span className="text-base font-semibold text-amber-400">
                {breakdown.roadDistanceKm} km
              </span>
              <span className="text-xs text-slate-400 block font-mono">est. transit</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Take-Home</span>
              <span className="text-base font-bold text-emerald-400">
                ₹{breakdown.netEarnings.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-400/80 block font-mono">
                (₹{breakdown.netRatePerKg}/kg)
              </span>
            </div>
          </div>

          {/* Step-by-Step Waterfall */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Financial Waterfall Calculation
            </h4>

            {/* Step 1: Gross Revenue */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-200 block">1. Gross Expected Revenue</span>
                  <span className="text-xs text-slate-400">
                    {breakdown.quantityQuintals} quintals × ₹{breakdown.modalPricePerQuintal}/quintal
                  </span>
                </div>
              </div>
              <span className="text-base font-bold text-emerald-400 font-mono">
                +₹{breakdown.grossRevenue.toLocaleString()}
              </span>
            </div>

            {/* Step 2: Transport Cost */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-200 block">2. Estimated Transportation</span>
                  <span className="text-xs text-slate-400">
                    {breakdown.roadDistanceKm} km × ₹{breakdown.costPerKm}/km (Highway route)
                  </span>
                </div>
              </div>
              <span className="text-base font-medium text-amber-400 font-mono">
                -₹{breakdown.transportCost.toLocaleString()}
              </span>
            </div>

            {/* Step 3: APMC Market Cess */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-200 block">3. Karnataka APMC Market Cess</span>
                  <span className="text-xs text-slate-400">
                    Statutory 1.5% fee on gross revenue
                  </span>
                </div>
              </div>
              <span className="text-base font-medium text-indigo-400 font-mono">
                -₹{breakdown.mandiCess.toLocaleString()}
              </span>
            </div>

            {/* Step 4: Loading & Handling */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-500/10 text-slate-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-200 block">4. Mandi Unloading & Handling</span>
                  <span className="text-xs text-slate-400">
                    {breakdown.quantityQuintals} quintals × ₹15.00/quintal APMC labor rate
                  </span>
                </div>
              </div>
              <span className="text-base font-medium text-slate-300 font-mono">
                -₹{breakdown.handlingCharge.toLocaleString()}
              </span>
            </div>

            {/* Step 5: Spoilage Buffer (if any) */}
            {breakdown.spoilageAllowance > 0 && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-200 block">5. Long-Distance Transit Spoilage Buffer</span>
                    <span className="text-xs text-rose-300/80">
                      1.5% perishable risk cushion (transit &gt; 100 km)
                    </span>
                  </div>
                </div>
                <span className="text-base font-medium text-rose-400 font-mono">
                  -₹{breakdown.spoilageAllowance.toLocaleString()}
                </span>
              </div>
            )}

            {/* Total Deductions Bar */}
            <div className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-400 border-t border-slate-800">
              <span>Total Estimated Selling Expenses:</span>
              <span className="font-mono text-slate-300">
                ₹{breakdown.totalDeductions.toLocaleString()}
              </span>
            </div>

            {/* Final Net Take-Home */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 shadow-inner">
              <div>
                <span className="text-base font-bold text-emerald-300 block">Final Estimated Net Take-Home</span>
                <span className="text-xs text-emerald-400/80 flex items-center gap-1">
                  Gross Revenue <ArrowRight className="w-3 h-3" /> Total Selling Deductions
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-emerald-400 font-mono block">
                  ₹{breakdown.netEarnings.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-emerald-300">
                  {breakdown.profitMarginPercent}% Net Margin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-900/80">
          <p className="text-[11px] text-slate-500 leading-tight">
            Note: Figures represent automated decision estimates and do not guarantee final APMC auction bids.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
