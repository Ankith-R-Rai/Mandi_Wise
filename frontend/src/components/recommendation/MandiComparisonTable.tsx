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
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Candidate APMC Mandi Comparison</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {candidates.length} Markets Evaluated
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Ranked by estimated net take-home earnings (after deducting transport, cess, and handling fees).
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-850 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-semibold">Rank</th>
              <th scope="col" className="px-4 py-3.5 font-semibold">APMC Mandi</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-right">Modal Price</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-right">Road Distance</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-right">Transport Cost</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-right">Mandi Fees</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-right">Gross Revenue</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-right">Net Take-Home</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-center">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {candidates.map((c) => {
              const isFirst = c.rank === 1;
              return (
                <tr
                  key={c.marketId}
                  className={`transition-colors hover:bg-slate-800/40 ${
                    isFirst ? 'bg-emerald-950/20 font-medium' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {isFirst ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Award className="w-3.5 h-3.5" /> #1 Pick
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 pl-2">
                        #{c.rank}
                      </span>
                    )}
                  </td>

                  {/* Market & District */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <span>{c.marketName}</span>
                        {c.isNearestMarket && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-normal">
                            Closest Mandi
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {c.district}
                      </span>
                    </div>
                  </td>

                  {/* Modal Price */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right font-mono">
                    <span className="font-semibold text-slate-100">
                      ₹{c.modalPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400 block">/ q</span>
                  </td>

                  {/* Road Distance */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right font-mono">
                    <span className="text-amber-400 font-semibold">
                      {c.breakdown.roadDistanceKm} km
                    </span>
                    <span className="text-[11px] text-slate-400 block flex items-center justify-end gap-1">
                      <Truck className="w-2.5 h-2.5" /> highway
                    </span>
                  </td>

                  {/* Transport Cost */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right font-mono text-slate-300">
                    -₹{c.breakdown.transportCost.toLocaleString()}
                  </td>

                  {/* Mandi Fees (Cess + Handling) */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right font-mono text-slate-400">
                    -₹{(c.breakdown.mandiCess + c.breakdown.handlingCharge + c.breakdown.spoilageAllowance).toLocaleString()}
                  </td>

                  {/* Gross Revenue */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right font-mono text-slate-300">
                    ₹{c.breakdown.grossRevenue.toLocaleString()}
                  </td>

                  {/* Net Take-Home */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right font-mono">
                    <div className="flex flex-col items-end">
                      <span className={`text-base font-bold ${isFirst ? 'text-emerald-400' : 'text-slate-100'}`}>
                        ₹{c.breakdown.netEarnings.toLocaleString()}
                      </span>
                      {c.netAdvantageVsNearest !== undefined && c.netAdvantageVsNearest !== 0 && (
                        <span
                          className={`text-[11px] ${
                            c.netAdvantageVsNearest > 0
                              ? 'text-emerald-400 font-medium'
                              : 'text-slate-400'
                          }`}
                        >
                          {c.netAdvantageVsNearest > 0 ? '+' : ''}₹{c.netAdvantageVsNearest.toLocaleString()} vs nearest
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Audit Action */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-center">
                    <button
                      onClick={() => onAuditClick(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
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
