import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { CommodityIcon } from '../ui/CommodityIcon';

interface WorkflowTransitionBannerProps {
  cropName: string;
  grade: string;
}

const RECOMMENDATION_SUPPORTED_CROPS = ['tomato', 'potato', 'onion'];

export const WorkflowTransitionBanner: React.FC<WorkflowTransitionBannerProps> = ({
  cropName,
  grade,
}) => {
  const navigate = useNavigate();
  const normalizedCrop = (cropName || '').toLowerCase().trim();
  const isSupportedInRecommendations = RECOMMENDATION_SUPPORTED_CROPS.some((c) => normalizedCrop.includes(c));

  const handleNavigateToRecommendations = () => {
    // Format standardized crop name: capitalize first letter
    const formattedCrop = cropName.charAt(0).toUpperCase() + cropName.slice(1).toLowerCase();
    navigate(`/recommendations?commodity=${encodeURIComponent(formattedCrop)}&grade=${encodeURIComponent(grade)}`);
  };

  const handleNavigateToTrends = () => {
    navigate('/trends');
  };

  if (isSupportedInRecommendations) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest via-forest-deep to-emerald-950 text-white p-6 sm:p-8 shadow-md">
        {/* Decorative soft glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold uppercase tracking-wider border border-emerald-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Step: Mandi Arbitrage Calculation</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Benchmark Market Returns for</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-white/10 text-emerald-300">
                <CommodityIcon commodity={cropName} size={20} />
                {cropName} ({grade})
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Grade-adjusted price benchmarking is active. Transfer this assessed grade directly into MandiWise's Recommendation Engine to calculate net profits after deducting transport and mandi cess across Karnataka APMCs.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNavigateToRecommendations}
            className="shrink-0 inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-forest-deep text-sm font-bold shadow-lg hover:bg-forest-lightSage transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calculator className="w-4 h-4 text-forest" />
            <span>Calculate Net Take-Home Earnings</span>
            <ArrowRight className="w-4 h-4 text-forest" />
          </button>
        </div>
      </div>
    );
  }

  // Expansion notice for crops outside current Phase 6 recommendation scope (Brinjal, Green Chilli)
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-darkCharcoal via-[#232F27] to-[#1A261E] text-white p-6 sm:p-8 border border-white/10 shadow-md">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold uppercase tracking-wider border border-amber-400/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Recommendation Engine Scope Expansion</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Visual Grading Active for</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-white/10 text-amber-300">
              <CommodityIcon commodity={cropName} size={18} />
              {cropName} ({grade})
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            AgriVision computer vision and AGMARK heuristic grading are fully enabled for {cropName}. Full APMC transport and arbitrage optimization for this crop is currently rolling out across remaining Karnataka mandis.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNavigateToTrends}
          className="shrink-0 inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/20 text-xs font-bold transition-all"
        >
          <TrendingUp className="w-4 h-4 text-amber-300" />
          <span>Explore Market Trends</span>
        </button>
      </div>
    </div>
  );
};
