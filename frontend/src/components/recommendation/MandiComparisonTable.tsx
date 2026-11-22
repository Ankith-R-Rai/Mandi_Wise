import React from 'react';
import { MandiCandidate } from '../../types/recommendation';
import { Award, Truck, Calculator, MapPin } from 'lucide-react';

interface MandiComparisonTableProps {
  candidates: MandiCandidate[];
  onAuditClick: (candidate: MandiCandidate) => void;
}

export const MandiComparisonTable: React.FC<MandiComparisonTableProps> = ({
  candidates,
  onAuditClick,
}) => {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-surface-darkCharcoal flex items-center gap-2">
            <span>Candidate APMC Mandi Comparison</span>
            <span className="text-xs px-3 py-1 rounded-full bg-forest-lightSage text-forest font-bold border border-forest-sage/60">
              {candidates.length} Markets Evaluated
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-surface-muted mt-0.5">
            Ranked by estimated net take-home earnings after deducting transport freight, statutory APMC cess, and mandi handling charges.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-emerald-900/10 bg-white/95 backdrop-blur-md shadow-[0_10px_35px_rgba(11,42,29,0.06)]">
        <table className="w-full text-left text-sm text-surface-charcoal">
          <thead className="bg-[#F5F9F6] text-[11px] uppercase tracking-wider text-surface-muted border-b border-emerald-900/10">
            <tr>
              <th scope="col" className="px-5 py-4 font-bold">Rank</th>
              <th scope="col" className="px-5 py-4 font-bold">APMC Mandi</th>
              <th scope="col" className="px-5 py-4 font-bold text-right">Modal Price</th>
              <th scope="col" className="px-5 py-4 font-bold text-right">Highway Distance</th>
              <th scope="col" className="px-5 py-4 font-bold text-right">Transport Cost</th>
              <th scope="col" className="px-5 py-4 font-bold text-right">Mandi Fees</th>
              <th scope="col" className="px-5 py-4 font-bold text-right">Gross Revenue</th>
              <th scope="col" className="px-5 py-4 font-bold text-right">Net Take-Home</th>
              <th scope="col" className="px-5 py-4 font-bold text-center">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/10">
            {candidates.map((c) => {
              const isFirst = c.rank === 1;
              return (
                <tr
                  key={c.marketId}
                  className={`transition-colors hover:bg-forest-lightSage/30 ${
                    isFirst ? 'bg-forest-lightSage/40 font-medium' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {isFirst ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-forest text-white shadow-xs">
                        <Award className="w-3.5 h-3.5 text-emerald-200" /> #1 Pick
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-surface-muted pl-2">
                        #{c.rank}
                      </span>
                    )}
                  </td>

                  {/* Market & District */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-bold text-surface-darkCharcoal">
                        <span>{c.marketName}</span>
                        {c.isNearestMarket && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                            Closest Mandi
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-surface-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-forest" />
                        {c.district}
                      </span>
                    </div>
                  </td>

                  {/* Modal Price */}
                  <td className="px-5 py-4 whitespace-nowrap text-right font-mono">
                    <span className="font-bold text-surface-darkCharcoal text-sm">
                      ₹{c.modalPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-surface-muted block">/ q</span>
                  </td>

                  {/* Road Distance */}
                  <td className="px-5 py-4 whitespace-nowrap text-right font-mono">
                    <span className="text-amber-800 font-bold text-sm">
                      {c.breakdown.roadDistanceKm} km
                    </span>
                    <span className="text-[11px] text-surface-muted block flex items-center justify-end gap-1">
                      <Truck className="w-3 h-3 text-amber-600" /> highway
                    </span>
                  </td>

                  {/* Transport Cost */}
                  <td className="px-5 py-4 whitespace-nowrap text-right font-mono text-surface-charcoal">
                    -₹{c.breakdown.transportCost.toLocaleString()}
                  </td>

                  {/* Mandi Fees (Cess + Handling + Spoilage) */}
                  <td className="px-5 py-4 whitespace-nowrap text-right font-mono text-surface-muted">
                    -₹{(c.breakdown.mandiCess + c.breakdown.handlingCharge + c.breakdown.spoilageAllowance).toLocaleString()}
                  </td>

                  {/* Gross Revenue */}
                  <td className="px-5 py-4 whitespace-nowrap text-right font-mono text-surface-charcoal">
                    ₹{c.breakdown.grossRevenue.toLocaleString()}
                  </td>

                  {/* Net Take-Home */}
                  <td className="px-5 py-4 whitespace-nowrap text-right font-mono">
                    <div className="flex flex-col items-end">
                      <span className={`text-base font-extrabold ${isFirst ? 'text-forest' : 'text-surface-darkCharcoal'}`}>
                        ₹{c.breakdown.netEarnings.toLocaleString()}
                      </span>
                      {c.netAdvantageVsNearest !== undefined && c.netAdvantageVsNearest !== 0 && (
                        <span
                          className={`text-[11px] font-semibold ${
                            c.netAdvantageVsNearest > 0
                              ? 'text-forest-fresh'
                              : 'text-surface-muted'
                          }`}
                        >
                          {c.netAdvantageVsNearest > 0 ? '+' : ''}₹{c.netAdvantageVsNearest.toLocaleString()} vs nearest
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Audit Action */}
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onAuditClick(c)}
                      className="p-2 rounded-xl text-surface-muted hover:text-forest hover:bg-forest-lightSage transition-colors cursor-pointer"
                      title="View step-by-step calculation audit"
                      aria-label={`Audit calculation for ${c.marketName}`}
                    >
                      <Calculator className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
