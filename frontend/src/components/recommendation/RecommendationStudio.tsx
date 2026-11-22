import React, { useState, useEffect, useCallback } from 'react';
import { recommendationService } from '../../services/recommendationService';
import {
  DistrictOption,
  MandiCandidate,
  RecommendationResponse,
  VehicleOption,
  VehicleType,
} from '../../types/recommendation';
import { RecommendationInputForm } from './RecommendationInputForm';
import { TopRecommendationCard } from './TopRecommendationCard';
import { MandiComparisonTable } from './MandiComparisonTable';
import { CalculationAuditModal } from './CalculationAuditModal';
import { Scale, AlertCircle, Info, ShieldCheck } from 'lucide-react';

export const RecommendationStudio: React.FC = () => {

  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [response, setResponse] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal audit state
  const [selectedAuditCandidate, setSelectedAuditCandidate] = useState<MandiCandidate | null>(null);

  // Fetch initial reference data and run initial recommendation
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        setIsInitializing(true);
        const [districtsData, vehiclesData] = await Promise.all([
          recommendationService.getDistricts(),
          recommendationService.getVehicles(),
        ]);

        if (isMounted) {
          setDistricts(districtsData);
          setVehicles(vehiclesData);

          // Initial default calculation
          const initialDistrict = 'Bengaluru Urban';
          const initialRes = await recommendationService.compareAndRecommend({
            commodityName: 'Tomato',
            quantityKg: 1500,
            originDistrict: initialDistrict,
          });

          setResponse(initialRes);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Unable to load recommendation data from backend.');
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCalculate = useCallback(
    async (params: {
      commodityName: string;
      quantityKg: number;
      originDistrict: string;
      vehicleType?: VehicleType;
      customCostPerKm?: number;
    }) => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await recommendationService.compareAndRecommend(params);
        setResponse(res);
      } catch (err: any) {
        setError(err.message || 'Failed to generate market recommendations.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <section id="recommendation-studio" className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" />
            Decision-Support Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Karnataka Mandi Recommendation &amp; Comparison
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Evaluate true take-home earnings by factoring real road distances, transporter freight rates, APMC cess, and mandi handling charges.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Centralized Spring Boot Financial Calculation Standard</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Calculation Error</p>
            <p className="text-xs text-rose-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Input Form + Results */}
      <div className="space-y-8">
        <RecommendationInputForm
          districts={districts}
          vehicles={vehicles}
          isLoading={isLoading || isInitializing}
          defaultDistrict="Bengaluru Urban"
          onSubmit={handleCalculate}
        />

        {/* Top Recommendation Spotlight */}
        {response?.topRecommendation && (
          <TopRecommendationCard
            candidate={response.topRecommendation}
            commodityName={response.commodityName}
            rationale={response.recommendationRationale}
            onAuditClick={(c) => setSelectedAuditCandidate(c)}
          />
        )}

        {/* Candidate Ranking Table */}
        {response && (
          <MandiComparisonTable
            candidates={response.candidateRankings}
            onAuditClick={(c) => setSelectedAuditCandidate(c)}
          />
        )}

        {/* Disclaimer Note */}
        {response && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-400 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Agricultural Market Transparency Disclosure: </span>
              {response.disclaimer}
            </div>
          </div>
        )}
      </div>

      {/* Modal Calculation Waterfall */}
      <CalculationAuditModal
        candidate={selectedAuditCandidate}
        onClose={() => setSelectedAuditCandidate(null)}
      />
    </section>
  );
};
