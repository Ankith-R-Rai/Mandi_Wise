import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NetEarningsAxiomPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F5F9F6] pt-28 pb-20 text-surface-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="fresh" size="md">
            The MandiWise Axiom
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-darkCharcoal tracking-tight">
            Higher headline price does not mean higher profit
          </h1>
          <p className="text-sm sm:text-base text-surface-muted max-w-2xl mx-auto leading-relaxed">
            Transport freight expenses, long-distance transit spoilage, and APMC cess can easily erase price premiums at distant markets.
          </p>
        </div>

        {/* Mathematical Formula Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverLift className="border-forest-sage bg-white shadow-xs rounded-3xl">
            <CardHeader>
              <div className="text-xs font-bold uppercase tracking-wider text-forest">Step 1</div>
              <CardTitle className="text-xl">Gross Revenue</CardTitle>
              <CardDescription className="font-mono text-xs text-forest-deep bg-forest-lightSage/40 p-3 rounded-xl border border-forest-sage/40">
                Gross Revenue = (Quantity in kg / 100) &times; Modal Price
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-surface-charcoal/80 leading-relaxed">
              Calculated directly from verified APMC modal price per quintal (1 quintal = 100 kg).
            </CardContent>
          </Card>

          <Card hoverLift className="border-amber-200 bg-white shadow-xs rounded-3xl">
            <CardHeader>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Step 2</div>
              <CardTitle className="text-xl">Selling Expenses</CardTitle>
              <CardDescription className="font-mono text-xs text-amber-900 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                Total Expenses = Freight Cost + Cess + Unloading
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-surface-charcoal/80 leading-relaxed">
              Vehicle hiring per km, fuel costs, 1.5% APMC market cess, and mandi handling charges.
            </CardContent>
          </Card>

          <Card hoverLift className="bg-gradient-to-br from-[#103E28] to-[#1E573A] border-emerald-600/40 text-white shadow-lg shadow-forest/20 rounded-3xl">
            <CardHeader>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Step 3 &bull; Result</div>
              <CardTitle className="text-xl text-white">Estimated Net Earnings</CardTitle>
              <CardDescription className="font-mono text-xs text-white bg-black/25 p-3 rounded-xl border border-white/20">
                Net Earnings = Gross Revenue - Total Expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-white/90 leading-relaxed">
              The sole objective ranking metric used by MandiWise to recommend where you should sell your harvest.
            </CardContent>
          </Card>
        </div>

        {/* Real-World Concrete Example Comparison */}
        <div className="bg-white rounded-3xl border border-emerald-900/10 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-emerald-900/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-forest block mb-1">
              Real-World Case Study
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-surface-darkCharcoal">
              Harvest: 2,500 kg (25 Quintals) of Tomatoes from Kolar Taluk
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Closer Mandi */}
            <div className="bg-[#F8FAF7] p-6 rounded-3xl border-2 border-forest shadow-xs relative">
              <span className="absolute -top-3 right-6 bg-forest text-white text-[11px] font-bold px-3.5 py-0.5 rounded-full shadow-xs">
                Recommended Choice
              </span>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-surface-darkCharcoal">Kolar APMC (Local)</h4>
                <Badge variant="fresh">12 km road transit</Badge>
              </div>
              <div className="space-y-2 text-sm text-surface-charcoal">
                <div className="flex justify-between">
                  <span>Mandi Modal Price:</span>
                  <span className="font-bold">₹2,200 / quintal</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Revenue (25 q &times; ₹2,200):</span>
                  <span className="font-bold">₹55,000</span>
                </div>
                <div className="flex justify-between text-rose-700 font-medium">
                  <span>Transport &amp; Loading Cost:</span>
                  <span>- ₹1,200</span>
                </div>
                <div className="pt-3 border-t border-emerald-900/10 flex justify-between font-extrabold text-base text-forest">
                  <span>Net Take-Home:</span>
                  <span>₹53,800</span>
                </div>
              </div>
            </div>

            {/* Option 2: Distant Terminal Mandi */}
            <div className="bg-[#F8FAF7] p-6 rounded-3xl border border-emerald-900/15 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-surface-darkCharcoal">
                  Bengaluru Yeshwanthpur (Distant)
                </h4>
                <Badge variant="neutral">88 km road transit</Badge>
              </div>
              <div className="space-y-2 text-sm text-surface-charcoal">
                <div className="flex justify-between">
                  <span>Mandi Modal Price (Higher):</span>
                  <span className="font-bold text-emerald-700">₹2,400 / quintal (+₹200)</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Revenue (25 q &times; ₹2,400):</span>
                  <span className="font-bold">₹60,000</span>
                </div>
                <div className="flex justify-between text-rose-700 font-medium">
                  <span>Transport, Toll &amp; Handling:</span>
                  <span>- ₹8,200</span>
                </div>
                <div className="pt-3 border-t border-emerald-900/10 flex justify-between font-extrabold text-base text-surface-darkCharcoal">
                  <span>Net Take-Home:</span>
                  <span>₹51,800</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-amber-900 bg-amber-50 p-3 rounded-2xl mt-4 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  The farmer loses <strong>₹2,000 in net profit</strong> by traveling to Bangalore, despite the ₹200 higher headline price.
                </span>
              </div>
            </div>
          </div>

          {/* CTA to Recommendation Studio */}
          <div className="pt-4 flex justify-center">
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-forest hover:bg-forest-deep text-white font-bold text-sm shadow-lg shadow-forest/20 transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Calculate Your Produce Net Returns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
