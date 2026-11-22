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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/50 p-6 sm:p-8 shadow-xl">
      {/* Decorative emerald background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Pill & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
          <Award className="w-4 h-4 text-emerald-400" />
          Optimal Net Profit Pick
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <CommodityIcon commodity={commodityName} size={16} />
            {commodityName}
          </span>
          <span>•</span>
          <span>AGMARKNET Verified</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Mandi Details & Net Figure */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{candidate.district}, Karnataka</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {candidate.marketName} APMC
            </h2>
          </div>

          {/* Large Net Earnings Callout */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs uppercase tracking-wider text-slate-400 block font-medium">
              Estimated Net Take-Home Earnings
            </span>
            <div className="flex flex-wrap items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                ₹{breakdown.netEarnings.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-emerald-300">
                (₹{breakdown.netRatePerKg}/kg net)
              </span>
            </div>

            {candidate.netAdvantageVsNearest && candidate.netAdvantageVsNearest > 0 ? (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                +₹{candidate.netAdvantageVsNearest.toLocaleString()} more profit than nearest mandi
              </div>
            ) : (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Shortest distance with peak return
              </div>
            )}
          </div>

          {/* Rationale explanation */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800">
            {rationale}
          </p>
        </div>

        {/* Right Side: Key Metric Chips & Action */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-0.5">Modal Price</span>
              <span className="text-lg font-bold text-slate-100 font-mono">
                ₹{candidate.modalPrice.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block">/ quintal</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-0.5">Est. Highway Distance</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                {breakdown.roadDistanceKm} km
              </span>
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Truck className="w-3 h-3" /> Road Transit
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-0.5">Transport Expense</span>
              <span className="text-lg font-bold text-slate-200 font-mono">
                ₹{breakdown.transportCost.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                (₹{breakdown.costPerKm}/km)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-0.5">Total Selling Fees</span>
              <span className="text-lg font-bold text-slate-200 font-mono">
                ₹{breakdown.totalDeductions.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block">Cess, handling &amp; transit</span>
            </div>
          </div>

          <button
            onClick={() => onAuditClick(candidate)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
          >
            <Calculator className="w-4 h-4" />
            <span>Audit Full Calculation Waterfall</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
