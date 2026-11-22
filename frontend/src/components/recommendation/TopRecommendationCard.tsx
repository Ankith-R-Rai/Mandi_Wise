import React from 'react';
import { Award, TrendingUp, Truck, MapPin, ArrowUpRight, Calculator, CheckCircle2 } from 'lucide-react';
import { MandiCandidate } from '../../types/recommendation';
import { CommodityIcon } from '../ui/CommodityIcon';

interface TopRecommendationCardProps {
  candidate: MandiCandidate;
  commodityName: string;
  rationale: string;
  onAuditClick: (candidate: MandiCandidate) => void;
}

export const TopRecommendationCard: React.FC<TopRecommendationCardProps> = ({
  candidate,
  commodityName,
  rationale,
  onAuditClick,
}) => {
  const { breakdown } = candidate;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#F7FAF7] to-forest-lightSage/40 border-2 border-forest/40 p-6 sm:p-8 shadow-[0_12px_45px_rgba(11,42,29,0.08)] transition-all">
      {/* Decorative soft green background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-forest-fresh/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Pill & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest text-white text-xs font-bold tracking-wide uppercase shadow-sm">
          <Award className="w-4 h-4 text-emerald-200" />
          Optimal Net Profit Pick
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-muted bg-white/80 px-3 py-1 rounded-full border border-emerald-900/10">
          <span className="flex items-center gap-1.5 font-bold text-surface-darkCharcoal">
            <CommodityIcon commodity={commodityName} size={16} />
            {commodityName}
          </span>
          <span>•</span>
          <span>Official AGMARKNET Verified</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Mandi Details & Net Figure */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-surface-muted text-xs mb-1 font-medium">
              <MapPin className="w-4 h-4 text-forest" />
              <span>{candidate.district}, Karnataka</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-darkCharcoal tracking-tight">
              {candidate.marketName} APMC
            </h2>
          </div>

          {/* Large Net Earnings Callout */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-900/15 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-surface-muted block font-bold">
              Estimated Net Take-Home Earnings
            </span>
            <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-forest font-mono tracking-tight">
                ₹{breakdown.netEarnings.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-forest-fresh">
                (₹{breakdown.netRatePerKg}/kg net)
              </span>
            </div>

            {candidate.netAdvantageVsNearest && candidate.netAdvantageVsNearest > 0 ? (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-forest text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-forest" />
                +₹{candidate.netAdvantageVsNearest.toLocaleString()} more profit than nearest mandi
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest-lightSage/50 text-forest text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                Closest market with highest net take-home
              </div>
            )}
          </div>

          {/* Rationale explanation */}
          <p className="text-xs sm:text-sm text-surface-charcoal leading-relaxed bg-[#F8FAF7] p-3.5 rounded-xl border border-emerald-900/10">
            {rationale}
          </p>
        </div>

        {/* Right Side: Key Metric Chips & Action */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-xs">
              <span className="text-xs text-surface-muted block mb-0.5 font-medium">Modal Price</span>
              <span className="text-lg font-bold text-surface-darkCharcoal font-mono">
                ₹{candidate.modalPrice.toLocaleString()}
              </span>
              <span className="text-[11px] text-surface-muted block">/ quintal</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-xs">
              <span className="text-xs text-surface-muted block mb-0.5 font-medium">Highway Distance</span>
              <span className="text-lg font-bold text-amber-700 font-mono">
                {breakdown.roadDistanceKm} km
              </span>
              <span className="text-[11px] text-surface-muted block flex items-center gap-1">
                <Truck className="w-3 h-3 text-amber-600" /> Transit Route
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-xs">
              <span className="text-xs text-surface-muted block mb-0.5 font-medium">Transport Cost</span>
              <span className="text-lg font-bold text-surface-charcoal font-mono">
                ₹{breakdown.transportCost.toLocaleString()}
              </span>
              <span className="text-[11px] text-surface-muted block font-mono">
                (₹{breakdown.costPerKm}/km)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-xs">
              <span className="text-xs text-surface-muted block mb-0.5 font-medium">Selling Expenses</span>
              <span className="text-lg font-bold text-surface-charcoal font-mono">
                ₹{breakdown.totalDeductions.toLocaleString()}
              </span>
              <span className="text-[11px] text-surface-muted block">Cess, labor &amp; transit</span>
            </div>
          </div>

          <button
            onClick={() => onAuditClick(candidate)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-forest hover:bg-forest-deep text-white font-bold text-sm transition-all shadow-md shadow-forest/20 active:scale-[0.99] cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-200" />
            <span>Audit Full Calculation Waterfall</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
