import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Truck,
  CheckCircle2,
  BarChart3,
  Camera,
  AlertTriangle,
} from 'lucide-react';
import { HeroBackground } from '../components/hero/HeroBackground';
import { MarketPriceTicker } from '../components/hero/MarketPriceTicker';
import { MarketPriceExplorer } from '../components/market/MarketPriceExplorer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { Skeleton } from '../components/ui/Skeleton';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  // State for Market Benchmark Table & Ticker Selection
  const [selectedTickerItem, setSelectedTickerItem] = useState<{ commodity: string; market: string } | null>(null);

  // State for Interactive Component Showcase
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [activeUiTab, setActiveUiTab] = useState('buttons');
  const [inputVal, setInputVal] = useState('Bangalore Rural Farm');

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* =========================================================================
          1. HERO SECTION (Full-Bleed Misty Western Ghats Background)
         ========================================================================= */}
      <section className="relative isolate pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden min-h-screen flex flex-col justify-between">
        {/* Full-Bleed Misty Western Ghats Background with Tree & Falling Leaves */}
        <HeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
          {/* Editorial Value Proposition on Frosted Misty Glass Island */}
          <div className="max-w-3xl bg-white/92 backdrop-blur-2xl border border-emerald-900/10 p-8 sm:p-10 lg:p-12 rounded-3xl shadow-[0_20px_60px_rgba(11,42,29,0.22)] space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-lightSage/80 border border-forest-sage/60 text-forest text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-forest-fresh animate-pulse" />
              <span>Karnataka Market Decision-Support Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-darkCharcoal tracking-tight leading-[1.12]">
              Make every <br />
              <span className="text-surface-darkCharcoal">harvest count.</span>
            </h1>

            <p className="text-base sm:text-lg text-surface-charcoal/90 leading-relaxed max-w-xl font-medium">
              The highest mandi price doesn’t guarantee the highest profit. MandiWise calculates your <strong>true expected net earnings</strong> after real transport and handling costs so you always sell with confidence.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                size="lg"
                className="rounded-xl bg-forest hover:bg-forest-deep text-white shadow-lg shadow-forest/25"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/recommendations')}
              >
                Find the Best Mandi
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-xl bg-white/80 backdrop-blur-md hover:bg-white border-forest-sage/50 text-surface-charcoal hover:text-forest shadow-sm"
                onClick={() => navigate('/net-earnings-axiom')}
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

          {/* Live Market Price Ticker Ribbon */}
          <div className="mt-8 sm:mt-12">
            <MarketPriceTicker
              onSelectRecord={(rec) => {
                setSelectedTickerItem(rec);
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
      <section id="axiom" className="py-20 bg-[#F5F9F6] border-y border-emerald-900/10">
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
            <Card hoverLift className="border-forest-sage bg-white shadow-xs">
              <CardHeader>
                <div className="text-xs font-bold uppercase tracking-wider text-forest">Step 1</div>
                <CardTitle className="text-lg">Gross Revenue</CardTitle>
                <CardDescription className="font-mono text-xs text-forest-deep bg-forest-lightSage/40 p-2.5 rounded-lg border border-forest-sage/40">
                  Gross Revenue = (Quantity / 100) &times; Modal Price
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-surface-charcoal/80">
                Calculated from verified APMC modal price per quintal (1 quintal = 100 kg).
              </CardContent>
            </Card>

            <Card hoverLift className="border-amber-200 bg-white shadow-xs">
              <CardHeader>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Step 2</div>
                <CardTitle className="text-lg">Selling Expenses</CardTitle>
                <CardDescription className="font-mono text-xs text-amber-900 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                  Total Expenses = Freight Cost + Unloading + Fees
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-surface-charcoal/80">
                Vehicle hiring, distance fuel rate, toll charges, and mandi unloading fees.
              </CardContent>
            </Card>

            <Card hoverLift className="bg-gradient-to-br from-[#103E28] to-[#1E573A] border-emerald-600/40 text-white shadow-lg shadow-forest/20">
              <CardHeader>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Step 3 &bull; Result</div>
                <CardTitle className="text-lg text-white">Estimated Net Earnings</CardTitle>
                <CardDescription className="font-mono text-xs text-white bg-black/25 p-2.5 rounded-lg border border-white/20">
                  Net Earnings = Gross Revenue - Total Expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-white/90">
                The sole objective ranking metric used by MandiWise to recommend the best market.
              </CardContent>
            </Card>
          </div>

          {/* Real-World Concrete Example Comparison */}
          <div className="bg-white rounded-3xl border border-emerald-900/10 p-6 sm:p-8 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-muted mb-4">
              Concrete Example: 2,500 kg (25 Quintals) of Tomatoes from Kolar Taluk
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Closer Mandi */}
              <div className="bg-[#F8FAF7] p-5 rounded-2xl border-2 border-forest shadow-xs relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
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
              <div className="bg-[#F8FAF7] p-5 rounded-2xl border border-surface-border shadow-xs transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
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
                <div className="flex items-start gap-2 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg mt-3 border border-amber-200/60">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Farmer loses <strong>₹2,000 in net profit</strong> by traveling to Bangalore despite the ₹200 higher headline price.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. LIVE MARKET BENCHMARK EXPLORATION TABLE
         ========================================================================= */}
      <section className="py-20 bg-[#EDF5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarketPriceExplorer
            selectedMandiRecord={selectedTickerItem}
            onClearSelectedMandi={() => setSelectedTickerItem(null)}
          />
        </div>
      </section>

      {/* =========================================================================
          4. FEATURE CAPABILITIES GRID
         ========================================================================= */}
      <section id="features" className="py-20 bg-white border-b border-emerald-900/10">
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
            <Card hoverLift className="cursor-pointer border-emerald-900/10">
              <CardHeader>
                <div className="w-10 h-10 rounded-2xl bg-forest-lightSage flex items-center justify-center text-forest mb-2 shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <CardTitle>Mandi Recommender</CardTitle>
                <CardDescription>
                  Ranks all candidate markets by estimated net revenue after logistics costs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hoverLift className="cursor-pointer border-emerald-900/10">
              <CardHeader>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 mb-2 shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <CardTitle>Transport Cost Engine</CardTitle>
                <CardDescription>
                  Dynamic freight cost models based on road distance, vehicle capacity, and fuel rates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hoverLift className="cursor-pointer border-emerald-900/10">
              <CardHeader>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-2 shadow-xs">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <CardTitle>3-Tier Freshness</CardTitle>
                <CardDescription>
                  Explicit freshness tags (Fresh, Acceptable, Stale) so farmers never trade on outdated data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hoverLift className="cursor-pointer border-emerald-900/10">
              <CardHeader>
                <div className="w-10 h-10 rounded-2xl bg-forest-lightSage flex items-center justify-center text-forest mb-2 shadow-xs">
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
      <section id="design-system" className="py-20 bg-[#F5F9F6]">
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
              <Card hoverLift className="p-8 space-y-6 border-emerald-900/10 shadow-xs">
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
              <Card hoverLift className="p-8 space-y-5 border-emerald-900/10 shadow-xs">
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
              <Card hoverLift className="p-8 space-y-6 border-emerald-900/10 shadow-xs">
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
              <Card hoverLift className="p-8 space-y-6 border-emerald-900/10 shadow-xs">
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
