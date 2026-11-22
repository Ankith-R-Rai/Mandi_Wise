import React, { useMemo, useState } from 'react';
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { exportHistoricalPricesToCsv, type CsvExportRow } from '../../utils/csvExport';
import type { MarketTrendSeries } from '../../types/trends';

export interface HistoricalDataTableProps {
  series: MarketTrendSeries[];
  commodityName: string;
  priceUnit?: string;
}

export const HistoricalDataTable: React.FC<HistoricalDataTableProps> = ({
  series,
  commodityName,
  priceUnit = 'INR_PER_QUINTAL',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterMarket, setSelectedFilterMarket] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Flatten all series into table rows
  const allRows: CsvExportRow[] = useMemo(() => {
    const list: CsvExportRow[] = [];
    series.forEach((s) => {
      s.dataPoints.forEach((pt) => {
        list.push({
          date: pt.observationDate,
          mandi: s.marketName,
          district: s.district,
          commodity: commodityName,
          modalPrice: pt.modalPrice,
          minPrice: pt.minPrice,
          maxPrice: pt.maxPrice,
          unit: priceUnit,
          freshness: pt.freshnessStatus,
        });
      });
    });

    // Sort by date descending
    list.sort((a, b) => b.date.localeCompare(a.date));
    return list;
  }, [series, commodityName, priceUnit]);

  // Available markets for filter dropdown
  const marketOptions = useMemo(() => {
    const unique = Array.from(new Set(series.map((s) => s.marketName)));
    return unique.sort();
  }, [series]);

  // Filtered rows based on search and market filter
  const filteredRows = useMemo(() => {
    return allRows.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.mandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.date.includes(searchQuery);

      const matchesMarket =
        selectedFilterMarket === 'ALL' || r.mandi === selectedFilterMarket;

      return matchesSearch && matchesMarket;
    });
  }, [allRows, searchQuery, selectedFilterMarket]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage]);

  const handleExportCsv = () => {
    const filename = `mandiwise_${commodityName.toLowerCase()}_trends_${new Date().toISOString().split('T')[0]}.csv`;
    exportHistoricalPricesToCsv(filteredRows, filename);
  };

  return (
    <Card className="p-5 sm:p-6 bg-white/95 rounded-2xl border border-forest-sage/30 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-surface-darkCharcoal tracking-tight">
            Historical Clearing Records
          </h3>
          <p className="text-xs text-surface-muted mt-0.5">
            Showing {filteredRows.length} recorded market trading days
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by date, mandi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs bg-forest-lightSage/30 border border-forest-sage/40 rounded-xl focus:outline-none focus:border-forest text-surface-charcoal placeholder:text-surface-muted w-44"
            />
          </div>

          {/* Market Filter */}
          <select
            value={selectedFilterMarket}
            onChange={(e) => {
              setSelectedFilterMarket(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-forest-lightSage/30 border border-forest-sage/40 rounded-xl focus:outline-none focus:border-forest text-surface-charcoal font-medium"
          >
            <option value="ALL">All APMC Mandis</option>
            {marketOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Export CSV Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="rounded-xl border-forest-sage/40 hover:bg-forest-lightSage/50 text-forest text-xs font-bold gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-forest-sage/20 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-forest-lightSage/40 border-b border-forest-sage/20 text-surface-muted font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">APMC Mandi</th>
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3 text-right">Modal Rate</th>
              <th className="py-2.5 px-3 text-right">Min - Max Spread</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-sage/10 text-surface-charcoal">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-surface-muted text-xs">
                  No historical records found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr key={`${row.mandi}-${row.date}-${idx}`} className="hover:bg-forest-lightSage/20 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-surface-darkCharcoal whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-forest whitespace-nowrap">
                    {row.mandi}
                  </td>
                  <td className="py-2.5 px-3 text-surface-muted whitespace-nowrap">
                    {row.district}
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-surface-darkCharcoal whitespace-nowrap">
                    ₹{row.modalPrice.toLocaleString()}
                    <span className="text-[10px] text-surface-muted font-normal ml-0.5">/q</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-surface-muted whitespace-nowrap font-mono text-[11px]">
                    ₹{row.minPrice} - ₹{row.maxPrice}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        row.freshness === 'FRESH'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.freshness === 'ACCEPTABLE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {row.freshness}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-2 text-xs text-surface-muted">
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-forest-sage/30 hover:bg-forest-lightSage/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-forest-sage/30 hover:bg-forest-lightSage/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};
