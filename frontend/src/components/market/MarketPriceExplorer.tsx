import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Building2,
  MapPin,
  TrendingUp,
  Sparkles,
  Clock,
  AlertCircle,
  RefreshCw,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { CommodityIcon } from '../ui/CommodityIcon';
import { Badge } from '../ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { marketService } from '../../services/marketService';
import type { MarketPrice, Commodity, MarketSummary } from '../../types/market';
import { cn } from '../../utils/cn';

interface MarketPriceExplorerProps {
  selectedMandiRecord?: { commodity: string; market: string } | null;
  onClearSelectedMandi?: () => void;
  className?: string;
}

export const MarketPriceExplorer: React.FC<MarketPriceExplorerProps> = ({
  selectedMandiRecord,
  onClearSelectedMandi,
  className,
}) => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedFreshness, setSelectedFreshness] = useState<string>('All');
  const [searchMandi, setSearchMandi] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price_desc' | 'price_asc' | 'date_desc' | 'name_asc'>('price_desc');

  // Load initial datasets
  const loadMarketData = async () => {
    try {
      const [fetchedPrices, fetchedCommodities, fetchedDistricts, fetchedSummary] = await Promise.all([
        marketService.getPrices(),
        marketService.getCommodities(),
        marketService.getDistricts(),
        marketService.getSummary(),
      ]);
      setPrices(fetchedPrices);
      setCommodities(fetchedCommodities);
      setDistricts(fetchedDistricts);
      setSummary(fetchedSummary);
    } catch (err) {
      console.error('Failed to load market data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, []);

  // Sync external selection from Hero ticker
  useEffect(() => {
    if (selectedMandiRecord) {
      setSelectedCommodity(selectedMandiRecord.commodity);
      setSearchMandi(selectedMandiRecord.market);
    }
  }, [selectedMandiRecord]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadMarketData();
  };

  const handleResetFilters = () => {
    setSelectedCommodity('All');
    setSelectedDistrict('All');
    setSelectedFreshness('All');
    setSearchMandi('');
    setSortBy('price_desc');
    if (onClearSelectedMandi) onClearSelectedMandi();
  };

  // Filtered & Sorted Records
  const filteredPrices = useMemo(() => {
    return prices
      .filter((item) => {
        const matchesCommodity =
          selectedCommodity === 'All' ||
          item.commodityName.toLowerCase() === selectedCommodity.toLowerCase();

        const matchesDistrict =
          selectedDistrict === 'All' ||
          item.district.toLowerCase() === selectedDistrict.toLowerCase();

        const matchesFreshness =
          selectedFreshness === 'All' || item.freshnessStatus === selectedFreshness;

        const matchesSearch =
          !searchMandi ||
          item.marketName.toLowerCase().includes(searchMandi.toLowerCase()) ||
          item.district.toLowerCase().includes(searchMandi.toLowerCase()) ||
          item.commodityName.toLowerCase().includes(searchMandi.toLowerCase());

        return matchesCommodity && matchesDistrict && matchesFreshness && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc') return b.modalPrice - a.modalPrice;
        if (sortBy === 'price_asc') return a.modalPrice - b.modalPrice;
        if (sortBy === 'date_desc') return b.observationDate.localeCompare(a.observationDate);
        if (sortBy === 'name_asc') return a.marketName.localeCompare(b.marketName);
        return 0;
      });
  }, [prices, selectedCommodity, selectedDistrict, selectedFreshness, searchMandi, sortBy]);

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className={cn('w-full space-y-6', className)} id="benchmarks">
      {/* Header & Stats Banner */}
      <div className="bg-white/80 backdrop-blur-md border border-emerald-900/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-lightSage text-forest font-semibold text-xs mb-3 border border-forest-sage/40">
              <Building2 className="w-3.5 h-3.5 text-forest" />
              <span>Phase 5: Canonical Market Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-darkCharcoal tracking-tight">
              Karnataka APMC Market Explorer
            </h2>
            <p className="text-sm text-surface-muted mt-1 max-w-xl">
              Live validated price observations directly sourced from verified Karnataka agricultural marketing committees.
            </p>
          </div>

          {/* Aggregate Market Summary Pills */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-forest-lightSage/50 border border-forest-sage/40 rounded-xl px-4 py-2.5 text-left">
                <span className="text-[11px] font-medium text-surface-muted uppercase tracking-wider block">
                  APMC Markets
                </span>
                <span className="text-xl font-bold text-forest">
                  {summary.totalMarkets} <span className="text-xs font-normal text-surface-muted">Active</span>
                </span>
              </div>
              <div className="bg-forest-lightSage/50 border border-forest-sage/40 rounded-xl px-4 py-2.5 text-left">
                <span className="text-[11px] font-medium text-surface-muted uppercase tracking-wider block">
                  Commodities
                </span>
                <span className="text-xl font-bold text-forest">
                  {summary.totalCommodities} <span className="text-xs font-normal text-surface-muted">Crops</span>
                </span>
              </div>
              <div className="bg-forest-lightSage/50 border border-forest-sage/40 rounded-xl px-4 py-2.5 text-left col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-surface-muted uppercase tracking-wider block">
                  Latest Feed
                </span>
                <span className="text-sm font-bold text-forest flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-forest" />
                  {summary.latestObservationDate || 'Today'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Ticker Highlight Banner */}
        {selectedMandiRecord && (
          <div className="mt-5 p-3.5 bg-forest-lightSage/80 border border-forest-sage rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-forest-sage/50 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-forest-deep" />
              </div>
              <span className="text-forest-deep">
                Active Filter from Ticker: <strong>{selectedMandiRecord.commodity}</strong> at{' '}
                <strong>{selectedMandiRecord.market}</strong>
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-forest hover:text-forest-deep font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white/95 backdrop-blur-md border border-emerald-900/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Commodity Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCommodity('All')}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none',
                selectedCommodity === 'All'
                  ? 'bg-forest text-white shadow-xs'
                  : 'bg-forest-lightSage/60 text-surface-charcoal hover:bg-forest-lightSage'
              )}
            >
              All Crops
            </button>
            {commodities.map((comm) => (
              <button
                key={comm.id}
                onClick={() => setSelectedCommodity(comm.name)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none',
                  selectedCommodity.toLowerCase() === comm.name.toLowerCase()
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-forest-lightSage/60 text-surface-charcoal hover:bg-forest-lightSage'
                )}
              >
                <CommodityIcon commodity={comm.name} size={15} />
                <span>{comm.name}</span>
                {comm.kannadaName && (
                  <span className="text-[10px] opacity-75 font-normal">({comm.kannadaName})</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs text-forest hover:text-forest-deep font-medium cursor-pointer"
            title="Refresh market prices"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search, District, Freshness, Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Mandi */}
          <div className="relative">
            <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search APMC or District..."
              value={searchMandi}
              onChange={(e) => setSearchMandi(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-forest-lightSage/30 border border-surface-border rounded-xl text-xs text-surface-darkCharcoal placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-all"
            />
          </div>

          {/* District Dropdown */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-forest-lightSage/30 border border-surface-border rounded-xl text-xs text-surface-darkCharcoal focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Karnataka Districts</option>
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist} District
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-surface-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Freshness Filter */}
          <div className="relative">
            <Sparkles className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedFreshness}
              onChange={(e) => setSelectedFreshness(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-forest-lightSage/30 border border-surface-border rounded-xl text-xs text-surface-darkCharcoal focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Observation Windows</option>
              <option value="FRESH">Fresh (within 7 days)</option>
              <option value="ACCEPTABLE">Acceptable (8 - 30 days)</option>
              <option value="STALE">Historical (&gt; 30 days)</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-surface-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-9 pr-8 py-2 bg-forest-lightSage/30 border border-surface-border rounded-xl text-xs text-surface-darkCharcoal focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="price_desc">Modal Price: High to Low</option>
              <option value="price_asc">Modal Price: Low to High</option>
              <option value="date_desc">Observed Date: Newest</option>
              <option value="name_asc">Mandi Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Market Price Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-forest animate-spin mx-auto" />
            <p className="text-sm font-medium text-surface-charcoal">Loading Karnataka APMC market prices...</p>
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-surface-muted mx-auto" />
            <p className="text-sm font-semibold text-surface-darkCharcoal">No market observations found</p>
            <p className="text-xs text-surface-muted">Try clearing some of your search filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-forest text-white rounded-xl text-xs font-semibold hover:bg-forest-deep transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Commodity</TableHead>
                  <TableHead>APMC Market</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead className="text-right">Price Range (Min - Max)</TableHead>
                  <TableHead className="text-right">Modal Benchmark</TableHead>
                  <TableHead className="text-center">Observation Date</TableHead>
                  <TableHead className="text-center">Data Freshness</TableHead>
                  <TableHead className="text-center">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.map((item) => (
                  <TableRow key={item.id} className="hover:bg-forest-lightSage/30 transition-colors">
                    {/* Commodity */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-forest-lightSage flex items-center justify-center shrink-0 border border-forest-sage/40">
                          <CommodityIcon commodity={item.commodityName} size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-surface-darkCharcoal text-xs block">
                            {item.commodityName}
                          </span>
                          <span className="text-[11px] text-surface-muted block">
                            {item.variety || 'Standard'} {item.kannadaCommodityName && `• ${item.kannadaCommodityName}`}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Mandi Name */}
                    <TableCell>
                      <div className="font-semibold text-forest text-xs flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-forest-sage shrink-0" />
                        <span>{item.marketName}</span>
                      </div>
                    </TableCell>

                    {/* District */}
                    <TableCell>
                      <span className="text-xs text-surface-charcoal flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-surface-muted shrink-0" />
                        {item.district}
                      </span>
                    </TableCell>

                    {/* Min - Max Range */}
                    <TableCell className="text-right text-xs text-surface-charcoal font-medium">
                      <span>{formatCurrency(item.minPrice)}</span>
                      <span className="text-surface-muted mx-1">–</span>
                      <span>{formatCurrency(item.maxPrice)}</span>
                    </TableCell>

                    {/* Modal Price */}
                    <TableCell className="text-right">
                      <div className="font-bold text-forest text-sm flex items-center justify-end gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-forest-fresh" />
                        <span>{formatCurrency(item.modalPrice)}</span>
                      </div>
                      <span className="text-[10px] text-surface-muted">per quintal</span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-center text-xs text-surface-muted font-medium">
                      <div className="inline-flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-surface-muted" />
                        <span>{item.observationDate}</span>
                      </div>
                    </TableCell>

                    {/* Freshness Badge */}
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          item.freshnessStatus === 'FRESH'
                            ? 'fresh'
                            : item.freshnessStatus === 'ACCEPTABLE'
                            ? 'acceptable'
                            : 'stale'
                        }
                        size="sm"
                      >
                        {item.freshnessStatus === 'FRESH' ? (
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Fresh
                          </span>
                        ) : item.freshnessStatus === 'ACCEPTABLE' ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Acceptable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> Stale
                          </span>
                        )}
                      </Badge>
                    </TableCell>

                    {/* Source */}
                    <TableCell className="text-center">
                      <span className="text-[10px] uppercase font-semibold text-surface-muted tracking-wider bg-forest-lightSage/50 px-2 py-0.5 rounded-md border border-forest-sage/30">
                        {item.source}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Table Footer with Record Count */}
        <div className="px-6 py-3 bg-forest-lightSage/20 border-t border-surface-border flex items-center justify-between text-xs text-surface-muted">
          <span>
            Showing <strong>{filteredPrices.length}</strong> of <strong>{prices.length}</strong> mandi price observations
          </span>
          <span className="text-[11px] font-medium text-forest">
            Authoritative source: Karnataka APMC Agmarknet &amp; Open Data
          </span>
        </div>
      </div>
    </div>
  );
};
