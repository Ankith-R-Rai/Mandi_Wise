import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { Scale, AlertCircle, Info, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export const RecommendationStudio: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [response, setResponse] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCalculatedTime, setLastCalculatedTime] = useState<string | null>(null);

  // Modal audit state
  const [selectedAuditCandidate, setSelectedAuditCandidate] = useState<MandiCandidate | null>(null);

  // Results ref to scroll to on new calculation
  const resultsRef = useRef<HTMLDivElement>(null);

  // Fetch initial reference data and run initial baseline recommendation
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

          // Initial baseline calculation
          const initialRes = await recommendationService.compareAndRecommend({
            commodityName: 'Tomato',
            quantityKg: 1500,
            originDistrict: 'Bengaluru Urban',
          });

          setResponse(initialRes);
          setLastCalculatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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

        // Add a deliberate brief delay if network is instant so the user clearly sees the calculation happening
        const startTime = Date.now();
        const res = await recommendationService.compareAndRecommend(params);
        const elapsed = Date.now() - startTime;
        if (elapsed < 400) {
          await new Promise((r) => setTimeout(r, 400 - elapsed));
        }

        setResponse(res);
        setLastCalculatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

        // Smoothly scroll down to results so user sees the change immediately
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (err: any) {
        setError(err.message || 'Failed to generate market recommendations.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <div className="w-full space-y-8 animate-fade-in text-surface-charcoal">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-emerald-900/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-lightSage border border-forest-sage text-forest text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs">
            <Scale className="w-4 h-4" />
            Decision-Support Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-darkCharcoal tracking-tight">
            Karnataka Mandi Recommendation &amp; Comparison
          </h1>
          <p className="text-sm sm:text-base text-surface-muted mt-1.5 max-w-2xl">
            Evaluate true take-home earnings by factoring real road distances, freight transport models, statutory APMC cess, and mandi handling charges.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-surface-charcoal bg-white p-3.5 rounded-2xl border border-emerald-900/10 shadow-xs self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-forest-fresh shrink-0" />
          <span className="font-semibold">Spring Boot Financial Calculation Standard</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Calculation Error</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <RecommendationInputForm
        districts={districts}
        vehicles={vehicles}
        isLoading={isLoading || isInitializing}
        defaultDistrict="Bengaluru Urban"
        onSubmit={handleCalculate}
      />

      {/* Explicit Loading Overlay / Card */}
      {isLoading && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white/95 backdrop-blur-md border border-forest-sage text-center space-y-4 shadow-lg animate-pulse">
          <div className="w-14 h-14 mx-auto rounded-full bg-forest-lightSage flex items-center justify-center text-forest">
            <Loader2 className="w-7 h-7 animate-spin text-forest" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-surface-darkCharcoal">
              Analyzing Karnataka APMC Markets...
            </h3>
            <p className="text-xs sm:text-sm text-surface-muted mt-1">
              Calculating highway distances, vehicle freight rates, and net take-home earnings across candidate mandis.
            </p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {!isLoading && response && (
        <div ref={resultsRef} className="space-y-8 scroll-mt-24 transition-all">
          {/* Real-time Calculation Confirmation Banner */}
          {lastCalculatedTime && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-forest-lightSage/70 border border-forest-sage shadow-xs animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-forest text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-forest block">
                    Calculated Just Now at {lastCalculatedTime}
                  </span>
                  <span className="text-[11px] text-surface-charcoal">
                    Evaluated {response.totalCandidatesEvaluated} APMC markets for {response.quantityKg.toLocaleString()} kg of {response.commodityName} from {response.originDistrict}.
                  </span>
                </div>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-forest bg-white px-3 py-1 rounded-full border border-forest-sage">
                <Sparkles className="w-3.5 h-3.5" />
                Updated Live
              </div>
            </div>
          )}

          {/* Top Recommendation Spotlight */}
          {response.topRecommendation && (
            <TopRecommendationCard
              candidate={response.topRecommendation}
              commodityName={response.commodityName}
              rationale={response.recommendationRationale}
              onAuditClick={(c) => setSelectedAuditCandidate(c)}
            />
          )}

          {/* Candidate Ranking Table */}
          <MandiComparisonTable
            candidates={response.candidateRankings}
            onAuditClick={(c) => setSelectedAuditCandidate(c)}
          />

          {/* Disclaimer Note */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-emerald-900/10 text-surface-muted text-xs leading-relaxed shadow-xs">
            <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-surface-darkCharcoal">Agricultural Market Transparency Disclosure: </span>
              {response.disclaimer}
            </div>
          </div>
        </div>
      )}

      {/* Modal Calculation Waterfall */}
      <CalculationAuditModal
        candidate={selectedAuditCandidate}
        onClose={() => setSelectedAuditCandidate(null)}
      />
    </div>
  );
};
