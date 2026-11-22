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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-emerald-900/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-surface-charcoal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-900/10 bg-[#F5F9F6]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-forest-lightSage text-forest border border-forest-sage">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-surface-darkCharcoal flex items-center gap-2">
                {candidate.marketName} APMC
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-surface-muted border border-emerald-900/10 font-medium">
                  {candidate.district}
                </span>
              </h3>
              <p className="text-xs text-surface-muted">
                Transparent Financial Calculation Breakdown &amp; Cost Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-surface-muted hover:text-surface-darkCharcoal hover:bg-forest-lightSage/50 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F9FAF8] border border-emerald-900/10">
            <div>
              <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block">Quantity</span>
              <span className="text-base font-bold text-surface-darkCharcoal">
                {breakdown.quantityKg.toLocaleString()} kg
              </span>
              <span className="text-xs text-surface-muted block font-mono">
                ({breakdown.quantityQuintals} q)
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block">Modal Price</span>
              <span className="text-base font-bold text-surface-darkCharcoal">
                ₹{breakdown.modalPricePerQuintal.toLocaleString()}
              </span>
              <span className="text-xs text-surface-muted block font-mono">/ quintal</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block">Highway Distance</span>
              <span className="text-base font-bold text-amber-700">
                {breakdown.roadDistanceKm} km
              </span>
              <span className="text-xs text-surface-muted block font-mono">road transit</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block">Net Return</span>
              <span className="text-base font-extrabold text-forest">
                ₹{breakdown.netEarnings.toLocaleString()}
              </span>
              <span className="text-xs text-forest-fresh block font-mono font-semibold">
                (₹{breakdown.netRatePerKg}/kg)
              </span>
            </div>
          </div>

          {/* Step-by-Step Waterfall */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-muted flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-forest" />
              Financial Waterfall Calculation
            </h4>

            {/* Step 1: Gross Revenue */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-forest-lightSage text-forest">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-surface-darkCharcoal block">1. Gross Expected Revenue</span>
                  <span className="text-xs text-surface-muted">
                    {breakdown.quantityQuintals} quintals × ₹{breakdown.modalPricePerQuintal}/quintal
                  </span>
                </div>
              </div>
              <span className="text-base font-extrabold text-forest font-mono">
                +₹{breakdown.grossRevenue.toLocaleString()}
              </span>
            </div>

            {/* Step 2: Transport Cost */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9FAF8] border border-emerald-900/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-surface-darkCharcoal block">2. Estimated Transportation</span>
                  <span className="text-xs text-surface-muted">
                    {breakdown.roadDistanceKm} km × ₹{breakdown.costPerKm}/km (Highway route)
                  </span>
                </div>
              </div>
              <span className="text-base font-bold text-amber-800 font-mono">
                -₹{breakdown.transportCost.toLocaleString()}
              </span>
            </div>

            {/* Step 3: APMC Market Cess */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9FAF8] border border-emerald-900/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-surface-darkCharcoal block">3. Karnataka APMC Market Cess</span>
                  <span className="text-xs text-surface-muted">
                    Statutory 1.5% fee on gross revenue
                  </span>
                </div>
              </div>
              <span className="text-base font-bold text-blue-800 font-mono">
                -₹{breakdown.mandiCess.toLocaleString()}
              </span>
            </div>

            {/* Step 4: Loading & Handling */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9FAF8] border border-emerald-900/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-surface-darkCharcoal block">4. Mandi Unloading &amp; Handling</span>
                  <span className="text-xs text-surface-muted">
                    {breakdown.quantityQuintals} quintals × ₹15.00/quintal APMC labor rate
                  </span>
                </div>
              </div>
              <span className="text-base font-bold text-surface-charcoal font-mono">
                -₹{breakdown.handlingCharge.toLocaleString()}
              </span>
            </div>

            {/* Step 5: Spoilage Buffer (if any) */}
            {breakdown.spoilageAllowance > 0 && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-surface-darkCharcoal block">5. Long-Distance Transit Spoilage Buffer</span>
                    <span className="text-xs text-rose-600">
                      1.5% perishable risk cushion (transit &gt; 100 km)
                    </span>
                  </div>
                </div>
                <span className="text-base font-bold text-rose-700 font-mono">
                  -₹{breakdown.spoilageAllowance.toLocaleString()}
                </span>
              </div>
            )}

            {/* Total Deductions Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-surface-muted border-t border-emerald-900/10">
              <span>Total Estimated Selling Deductions:</span>
              <span className="font-mono text-surface-darkCharcoal text-sm">
                ₹{breakdown.totalDeductions.toLocaleString()}
              </span>
            </div>

            {/* Final Net Take-Home */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-forest text-white shadow-lg shadow-forest/20">
              <div>
                <span className="text-base font-extrabold text-white block">Final Estimated Net Take-Home</span>
                <span className="text-xs text-emerald-200/80 flex items-center gap-1.5 mt-0.5">
                  Gross Revenue <ArrowRight className="w-3.5 h-3.5" /> Total Selling Deductions
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block tracking-tight">
                  ₹{breakdown.netEarnings.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-emerald-200">
                  {breakdown.profitMarginPercent}% Net Margin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-emerald-900/10 bg-[#F5F9F6]">
          <p className="text-[11px] text-surface-muted leading-tight">
            Note: Figures represent automated decision estimates and do not guarantee final spot auction bids.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-surface-darkCharcoal bg-white hover:bg-forest-lightSage border border-emerald-900/15 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
