import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  TrendingUp,
  Truck,
  CheckCircle2,
  Sparkles,
  Search,
  BarChart3,
  Camera,
  HelpCircle,
  Scale,
} from 'lucide-react';
import { HeroBackground, type BackgroundOption } from '../components/hero/HeroBackground';
import { MarketPriceTicker } from '../components/hero/MarketPriceTicker';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { Skeleton } from '../components/ui/Skeleton';
import { Tooltip } from '../components/ui/Tooltip';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/Table';
import {
  CANONICAL_MANDI_RECORDS,
  type CanonicalPriceRecord,
} from '../data/canonicalMandiData';
import { cn } from '../utils/cn';

export const LandingPage: React.FC = () => {
  // State for Background Option Switcher (Preview 4 Options Live)
  const [bgOption, setBgOption] = useState<BackgroundOption>('option1');

  // State for Market Benchmark Table
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<CanonicalPriceRecord | null>(null);

  // State for Interactive Component Showcase
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [activeUiTab, setActiveUiTab] = useState('buttons');
  const [inputVal, setInputVal] = useState('Bangalore Rural Farm');

  // Filter canonical data
  const filteredRecords = CANONICAL_MANDI_RECORDS.filter((r) => {
    const matchesCommodity =
      selectedCommodity === 'All' || r.commodity.toLowerCase() === selectedCommodity.toLowerCase();
    const matchesSearch =
      r.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.commodity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCommodity && matchesSearch;
  });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* =========================================================================
          1. HERO SECTION (Full-Bleed Screen Background with 4 Live Options)
         ========================================================================= */}
      <section className="relative isolate pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden min-h-screen flex flex-col justify-between">
        {/* Full-Bleed Dynamic Background */}
        <HeroBackground option={bgOption} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
          
          {/* Live Background Switcher Pill (High-Contrast Smoked Glass Dock) */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-[#06180F]/90 backdrop-blur-2xl border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.3)] rounded-full">
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="hidden sm:inline">Background Theme:</span>
                <span className="sm:hidden">Theme:</span>
              </div>
              {[
                { id: 'option1', label: '1. Misty Ghats (Photo)' },
                { id: 'option2', label: '2. Golden Horizon' },
                { id: 'option3', label: '3. Emerald Topo' },
                { id: 'option4', label: '4. Living Mesh' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBgOption(opt.id as BackgroundOption)}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer select-none',
                    bgOption === opt.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30 scale-105'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Value Proposition on Frosted Glass Island */}
            <div className="lg:col-span-6 bg-white/90 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 lg:p-9 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-lightSage/70 border border-forest-sage/60 text-forest text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-forest-fresh animate-pulse" />
                <span>Karnataka Market Decision-Support Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-darkCharcoal tracking-tight leading-[1.12]">
                Make every <br />
                <span className="text-forest">harvest count.</span>
              </h1>

              <p className="text-base sm:text-lg text-surface-charcoal/90 leading-relaxed max-w-xl font-medium">
                The highest mandi price doesn’t guarantee the highest profit. MandiWise calculates your <strong>true expected net earnings</strong> after real transport and handling costs so you always sell with confidence.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  className="rounded-xl shadow-lg shadow-forest/20"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    const el = document.getElementById('benchmarks');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Find the Best Mandi
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl bg-white/85 backdrop-blur-md hover:bg-white border-white/80 shadow-sm"
                  onClick={() => {
                    const el = document.getElementById('axiom');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Net Earnings Axiom
                </Button>
              </div>

              {/* Trust Badge Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-surface-charcoal">
                <div className="flex items-center gap-1.5 bg-forest-lightSage/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-forest-sage/40 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-forest-fresh" />
                  <span>AGMARKNET Official Records</span>
                </div>
                <div className="flex items-center gap-1.5 bg-forest-lightSage/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-forest-sage/40 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-forest-fresh" />
                  <span>Standardized INR / Quintal</span>
                </div>
                <div className="flex items-center gap-1.5 bg-forest-lightSage/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-forest-sage/40 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-forest-fresh" />
                  <span>Zero Price Hallucination</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Liquid Glass Net Earnings Preview Card */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Glow effect behind card */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-forest/30 via-accent-amber/20 to-emerald-400/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />

                <Card
                  hoverLift
                  className="relative bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(31,81,56,0.15)] rounded-3xl p-6 sm:p-7 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-surface-border/70 mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-forest-lightSage flex items-center justify-center text-forest shadow-xs">
                        <Scale className="w-5 h-5 text-forest" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-surface-darkCharcoal leading-tight">
                          True Net Earnings Preview
                        </h3>
                        <p className="text-xs text-surface-muted">
                          Kolar Taluk Farmer &bull; 25 Quintals Tomato
                        </p>
                      </div>
                    </div>
                    <Badge variant="fresh" size="sm">Live Comparison</Badge>
                  </div>

                  {/* Comparison Row: Kolar vs Yeshwanthpur */}
                  <div className="space-y-3.5">
                    {/* Option A: Kolar Local */}
                    <div className="p-4 rounded-2xl bg-forest-lightSage/50 border-2 border-forest/80 shadow-xs transition-all duration-200 hover:scale-[1.01]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📍</span>
                          <span className="font-bold text-sm text-surface-darkCharcoal">
                            Kolar APMC (12 km)
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-forest bg-white px-2.5 py-0.5 rounded-full border border-forest/30">
                          Recommended
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-surface-muted block text-[10px]">Headline Modal</span>
                          <span className="font-bold text-surface-charcoal">₹2,200/q</span>
                        </div>
                        <div>
                          <span className="text-surface-muted block text-[10px]">Transport Cost</span>
                          <span className="font-semibold text-semantic-error">-₹1,200</span>
                        </div>
                        <div className="text-right">
                          <span className="text-surface-muted block text-[10px]">Net Take-Home</span>
                          <span className="font-extrabold text-forest text-sm">₹53,800</span>
                        </div>
                      </div>
                    </div>

                    {/* Option B: Yeshwanthpur Distant */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-surface-border shadow-xs transition-all duration-200 hover:scale-[1.01]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🏙️</span>
                          <span className="font-semibold text-sm text-surface-darkCharcoal">
                            Yeshwanthpur APMC (88 km)
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          ₹200 Higher Price
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-surface-muted block text-[10px]">Headline Modal</span>
                          <span className="font-semibold text-semantic-success">₹2,400/q</span>
                        </div>
                        <div>
                          <span className="text-surface-muted block text-[10px]">Freight & Toll</span>
                          <span className="font-semibold text-semantic-error">-₹8,200</span>
                        </div>
                        <div className="text-right">
                          <span className="text-surface-muted block text-[10px]">Net Take-Home</span>
                          <span className="font-bold text-surface-darkCharcoal text-sm">₹51,800</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Callout Banner */}
                  <div className="mt-4 p-3 bg-accent-amberLight/60 border border-accent-amber/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-amber-900 font-medium">
                      Selling locally yields <strong>+₹2,000 more net profit</strong> despite the lower headline rate.
                    </span>
                    <Tooltip text="MandiWise protects your wallet from hidden logistics deductions.">
                      <HelpCircle className="w-4 h-4 text-amber-700 cursor-pointer shrink-0 ml-2" />
                    </Tooltip>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Live Market Price Ticker Ribbon */}
          <div className="mt-8 sm:mt-12">
            <MarketPriceTicker
              onSelectRecord={(rec) => {
                setSelectedRecord(rec);
                const el = document.getElementById('benchmarks');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. NET EARNINGS AXIOM & FORMULA BREAKDOWN
         ========================================================================= */}
      <section id="axiom" className="py-16 bg-white border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="fresh" size="md" className="mb-2">
              The MandiWise Axiom
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-darkCharcoal tracking-tight">
              Higher headline price does not mean higher profit
            </h2>
            <p className="text-sm text-surface-muted mt-2">
              Transport expenses and transit spoilage can easily erase price premiums at distant markets.
            </p>
          </div>

          {/* Mathematical Formula Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card hoverLift className="border-forest-sage bg-forest-lightSage/30">
              <CardHeader>
                <div className="text-xs font-bold uppercase tracking-wider text-forest">Step 1</div>
                <CardTitle className="text-lg">Gross Revenue</CardTitle>
                <CardDescription className="font-mono text-xs text-forest-deep bg-white/70 p-2 rounded border border-forest-sage/40">
                  Gross Revenue = (Quantity / 100) &times; Modal Price
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-surface-charcoal/80">
                Calculated from verified APMC modal price per quintal (1 quintal = 100 kg).
              </CardContent>
            </Card>

            <Card hoverLift className="border-amber-200 bg-amber-50/40">
              <CardHeader>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Step 2</div>
                <CardTitle className="text-lg">Selling Expenses</CardTitle>
                <CardDescription className="font-mono text-xs text-amber-900 bg-white/70 p-2 rounded border border-amber-200">
                  Total Expenses = Freight Cost + Unloading + Fees
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-surface-charcoal/80">
                Vehicle hiring, distance fuel rate, toll charges, and mandi unloading fees.
              </CardContent>
            </Card>

            <Card hoverLift className="border-forest bg-forest text-white">
              <CardHeader>
                <div className="text-xs font-bold uppercase tracking-wider text-forest-sage">Step 3 &bull; Result</div>
                <CardTitle className="text-lg text-white">Estimated Net Earnings</CardTitle>
                <CardDescription className="font-mono text-xs text-white bg-forest-deep p-2 rounded border border-forest-fresh/40">
                  Net Earnings = Gross Revenue - Total Expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-white/90">
                The sole objective ranking metric used by MandiWise to recommend the best market.
              </CardContent>
            </Card>
          </div>

          {/* Real-World Concrete Example Comparison */}
          <div className="bg-surface-background rounded-2xl border border-surface-border p-6 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-muted mb-4">
              Concrete Example: 2,500 kg (25 Quintals) of Tomatoes from Kolar Taluk
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Closer Mandi */}
              <div className="bg-white p-5 rounded-2xl border-2 border-forest shadow-sm relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                <span className="absolute -top-3 right-4 bg-forest text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                  Recommended Choice
                </span>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-surface-darkCharcoal">Kolar APMC (Local)</h4>
                  <Badge variant="fresh">12 km away</Badge>
                </div>
                <div className="space-y-1.5 text-xs text-surface-charcoal">
                  <div className="flex justify-between">
                    <span>Mandi Modal Price:</span>
                    <span className="font-semibold">₹2,200 / quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Revenue (25 q &times; ₹2,200):</span>
                    <span className="font-semibold">₹55,000</span>
                  </div>
                  <div className="flex justify-between text-semantic-error">
                    <span>Transport &amp; Loading Cost:</span>
                    <span>- ₹1,200</span>
                  </div>
                  <div className="pt-2 border-t border-surface-border flex justify-between font-bold text-sm text-forest">
                    <span>Net Take-Home:</span>
                    <span>₹53,800</span>
                  </div>
                </div>
              </div>

              {/* Option 2: Distant Terminal Mandi */}
              <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-surface-darkCharcoal">
                    Bengaluru Yeshwanthpur (Distant)
                  </h4>
                  <Badge variant="neutral">88 km away</Badge>
                </div>
                <div className="space-y-1.5 text-xs text-surface-charcoal">
                  <div className="flex justify-between">
                    <span>Mandi Modal Price (Higher):</span>
                    <span className="font-semibold text-semantic-success">₹2,400 / quintal (+₹200)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Revenue (25 q &times; ₹2,400):</span>
                    <span className="font-semibold">₹60,000</span>
                  </div>
                  <div className="flex justify-between text-semantic-error">
                    <span>Transport, Toll &amp; Unloading:</span>
                    <span>- ₹8,200</span>
                  </div>
                  <div className="pt-2 border-t border-surface-border flex justify-between font-bold text-sm text-surface-muted">
                    <span>Net Take-Home:</span>
                    <span className="text-surface-darkCharcoal">₹51,800</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded mt-3">
                  ⚠️ Farmer loses <strong>₹2,000 in net profit</strong> by traveling to Bangalore despite the ₹200 higher headline price.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. LIVE MARKET BENCHMARK EXPLORATION TABLE
         ========================================================================= */}
      <section id="benchmarks" className="py-16 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <Badge variant="info" size="sm" className="mb-2">
                Phase 2 Verified Data
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-surface-darkCharcoal tracking-tight">
                Karnataka APMC Price Benchmarks
              </h2>
              <p className="text-xs sm:text-sm text-surface-muted mt-1">
                Authentic prices recorded across 6 major agricultural trade corridors.
              </p>
            </div>

            {/* Commodity Filter Tabs with Hover Animation */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-surface-border shadow-xs">
              {['All', 'Tomato', 'Onion', 'Potato'].map((comm) => (
                <button
                  key={comm}
                  onClick={() => setSelectedCommodity(comm)}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none',
                    selectedCommodity === comm
                      ? 'bg-forest text-white shadow-sm shadow-forest/20 scale-105'
                      : 'text-surface-charcoal hover:bg-forest-lightSage hover:text-forest'
                  )}
                >
                  {comm === 'Tomato' ? '🍅 Tomato' : comm === 'Onion' ? '🧅 Onion' : comm === 'Potato' ? '🥔 Potato' : 'All Crops'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Filter Controls */}
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search market (e.g. Kolar, Yeshwanthpur, Hubli) or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="text-xs font-medium text-surface-muted self-center">
              Showing {filteredRecords.length} verified records
            </div>
          </div>

          {/* Selected Ticker Highlight Banner */}
          {selectedRecord && (
            <div className="mb-4 p-3.5 bg-forest-lightSage border border-forest-sage rounded-2xl flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">📌</span>
                <span className="text-forest-deep">
                  Filtered by ticker selection: <strong>{selectedRecord.commodity} ({selectedRecord.variety})</strong> at <strong>{selectedRecord.market}</strong> &bull; Modal Price: <strong>{formatCurrency(selectedRecord.modal_price)}/quintal</strong>
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setSearchQuery('');
                  setSelectedCommodity('All');
                }}
                className="font-semibold text-forest underline hover:text-forest-deep cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Table Container */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity &amp; Variety</TableHead>
                <TableHead>APMC Market</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Min Price</TableHead>
                <TableHead className="text-right">Max Price</TableHead>
                <TableHead className="text-right">Modal Price</TableHead>
                <TableHead className="text-center">Observed Date</TableHead>
                <TableHead className="text-center">Freshness</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((item, idx) => (
                <TableRow key={`${item.commodity}-${item.market}-${idx}`}>
                  <TableCell className="font-semibold text-surface-darkCharcoal">
                    {item.commodity === 'Tomato' ? '🍅' : item.commodity === 'Onion' ? '🧅' : '🥔'} {item.commodity}{' '}
                    <span className="text-xs font-normal text-surface-muted">({item.variety})</span>
                  </TableCell>
                  <TableCell className="font-medium text-forest">{item.market}</TableCell>
                  <TableCell className="text-surface-muted">{item.district}</TableCell>
                  <TableCell className="text-right text-surface-charcoal">
                    {formatCurrency(item.min_price)}
                  </TableCell>
                  <TableCell className="text-right text-surface-charcoal">
                    {formatCurrency(item.max_price)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-forest text-sm">
                    {formatCurrency(item.modal_price)}
                    <span className="text-[10px] font-normal text-surface-muted ml-0.5">/q</span>
                  </TableCell>
                  <TableCell className="text-center text-xs text-surface-muted">
                    {item.observation_date}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        item.freshness_status === 'FRESH'
                          ? 'fresh'
                          : item.freshness_status === 'ACCEPTABLE'
                          ? 'acceptable'
                          : 'stale'
                      }
                      size="sm"
                    >
                      {item.freshness_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURE CAPABILITIES GRID
         ========================================================================= */}
      <section id="features" className="py-16 bg-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-darkCharcoal tracking-tight">
              Designed for Agricultural Precision
            </h2>
            <p className="text-sm text-surface-muted mt-2">
              Every feature aligns with farmer profitability and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverLift className="cursor-pointer">
              <CardHeader>
                <div className="w-10 h-10 rounded-2xl bg-forest-lightSage flex items-center justify-center text-forest mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <CardTitle>Mandi Recommender</CardTitle>
                <CardDescription>
                  Ranks all candidate markets by estimated net revenue after logistics costs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hoverLift className="cursor-pointer">
              <CardHeader>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 mb-2">
                  <Truck className="w-5 h-5" />
                </div>
                <CardTitle>Transport Cost Engine</CardTitle>
                <CardDescription>
                  Dynamic freight cost models based on road distance, vehicle capacity, and fuel rates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hoverLift className="cursor-pointer">
              <CardHeader>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-2">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <CardTitle>3-Tier Freshness</CardTitle>
                <CardDescription>
                  Explicit freshness tags (Fresh, Acceptable, Stale) so farmers never trade on outdated data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hoverLift className="cursor-pointer">
              <CardHeader>
                <div className="w-10 h-10 rounded-2xl bg-forest-lightSage flex items-center justify-center text-forest mb-2">
                  <Camera className="w-5 h-5" />
                </div>
                <CardTitle>Quality Vision (Phase 5)</CardTitle>
                <CardDescription>
                  Fast AI image assessment of produce quality directly on mobile camera.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. INTERACTIVE UI COMPONENT SHOWCASE (Phase 3 Living Styleguide)
         ========================================================================= */}
      <section id="design-system" className="py-16 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="neutral" size="sm" className="mb-2">
              Phase 3 Deliverables
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-darkCharcoal tracking-tight">
              Design System &amp; Component Playground
            </h2>
            <p className="text-sm text-surface-muted mt-2">
              Test all 11 atomic primitives built for MandiWise with rich hover interactions.
            </p>
          </div>

          {/* Component Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs
              tabs={[
                { id: 'buttons', label: 'Buttons' },
                { id: 'inputs', label: 'Form Controls' },
                { id: 'badges', label: 'Badges & Statuses' },
                { id: 'feedback', label: 'Dialogs & Skeletons' },
              ]}
              activeTab={activeUiTab}
              onTabChange={setActiveUiTab}
            />
          </div>

          {/* Interactive Playground Cards */}
          <div className="max-w-4xl mx-auto">
            {activeUiTab === 'buttons' && (
              <Card hoverLift className="p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-surface-darkCharcoal mb-3 uppercase tracking-wider">
                    Button Variants with Magnetic Hover &amp; Spring Physics
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Primary Action</Button>
                    <Button variant="secondary">Secondary Amber</Button>
                    <Button variant="outline">Outline Neutral</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="danger">Danger Button</Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-border">
                  <h3 className="text-sm font-bold text-surface-darkCharcoal mb-3 uppercase tracking-wider">
                    Button Sizes &amp; Icons
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm" variant="primary">Small</Button>
                    <Button size="md" variant="primary">Medium</Button>
                    <Button size="lg" variant="primary">Large</Button>
                    <Button
                      variant="primary"
                      isLoading={isButtonLoading}
                      onClick={() => {
                        setIsButtonLoading(true);
                        setTimeout(() => setIsButtonLoading(false), 2000);
                      }}
                    >
                      {isButtonLoading ? 'Simulating...' : 'Click for Loading State'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeUiTab === 'inputs' && (
              <Card hoverLift className="p-8 space-y-5">
                <h3 className="text-sm font-bold text-surface-darkCharcoal uppercase tracking-wider">
                  Accessible Form Inputs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Farm / Village Location"
                    placeholder="e.g. Chintamani, Kolar"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    helperText="Used to calculate distance to APMC markets"
                  />
                  <Select
                    label="Target Commodity"
                    options={[
                      { value: 'tomato', label: 'Tomato (High Spoilage)' },
                      { value: 'onion', label: 'Onion (Moderate Shelf Life)' },
                      { value: 'potato', label: 'Potato (Long Shelf Life)' },
                    ]}
                    helperText="Shelf-life affects holding decision"
                  />
                </div>
              </Card>
            )}

            {activeUiTab === 'badges' && (
              <Card hoverLift className="p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-surface-darkCharcoal mb-3 uppercase tracking-wider">
                    Semantic Status Badges
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="success">Success / Verified</Badge>
                    <Badge variant="warning">Warning / Delayed</Badge>
                    <Badge variant="error">High Spoilage Risk</Badge>
                    <Badge variant="info">AGMARKNET Sourced</Badge>
                    <Badge variant="neutral">Draft Record</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-border">
                  <h3 className="text-sm font-bold text-surface-darkCharcoal mb-3 uppercase tracking-wider">
                    Mandi Data Freshness Badges
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="fresh">Fresh (&le; 7 Days)</Badge>
                    <Badge variant="acceptable">Acceptable (8-30 Days)</Badge>
                    <Badge variant="stale">Stale (&gt; 30 Days)</Badge>
                  </div>
                </div>
              </Card>
            )}

            {activeUiTab === 'feedback' && (
              <Card hoverLift className="p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-surface-darkCharcoal mb-3 uppercase tracking-wider">
                    Interactive Accessible Modal Dialog
                  </h3>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Open Interactive Dialog
                  </Button>
                </div>

                <div className="pt-4 border-t border-surface-border">
                  <h3 className="text-sm font-bold text-surface-darkCharcoal mb-3 uppercase tracking-wider">
                    Skeleton Shimmer Placeholders
                  </h3>
                  <div className="space-y-2 max-w-sm">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Modal Primitive Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="MandiWise Recommendation Engine"
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-charcoal leading-relaxed">
            MandiWise optimizes strictly for <strong>net take-home revenue</strong>.
            Before advising any farmer to travel to a terminal market, our algorithms factor in:
          </p>
          <ul className="list-disc pl-5 text-xs text-surface-muted space-y-1.5">
            <li>Truck freight charges (distance &times; fuel rate)</li>
            <li>Market entrance fees, weighing, and unbagging cess</li>
            <li>Transit spoilage risk based on commodity perishability</li>
          </ul>
          <div className="flex justify-end gap-2 pt-4 border-t border-surface-border">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
