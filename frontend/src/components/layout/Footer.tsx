import React from 'react';
import { Sprout, ShieldCheck, Database, MapPin } from 'lucide-react';
import { CommodityIcon } from '../ui/CommodityIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#18231D] text-white pt-14 pb-8 border-t border-[#26312B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#2C3A32]">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-fresh flex items-center justify-center text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">MandiWise</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Karnataka’s agricultural market decision-support platform. Helping farmers maximize true net earnings through price transparency and logistics intelligence.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-forest-sage">
              <MapPin className="w-3.5 h-3.5 text-forest-fresh" />
              <span>Dedicated to Karnataka APMC Networks</span>
            </div>
          </div>

          {/* Supported Commodities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-sage mb-3">
              Baseline Commodities
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <CommodityIcon commodity="Tomato" size={14} />
                <span>Tomato (Hybrid & Local)</span>
              </li>
              <li className="flex items-center gap-2">
                <CommodityIcon commodity="Onion" size={14} />
                <span>Onion (Red & Bellary)</span>
              </li>
              <li className="flex items-center gap-2">
                <CommodityIcon commodity="Potato" size={14} />
                <span>Potato (Jyoti & Local)</span>
              </li>
            </ul>
          </div>

          {/* Primary APMC Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-sage mb-3">
              Monitored APMC Mandis
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>Kolar APMC (Tomato Capital)</li>
              <li>Bengaluru Yeshwanthpur APMC</li>
              <li>Hubli Amaragol APMC</li>
              <li>Belagavi Border APMC</li>
              <li>Mysuru Bandipalya APMC</li>
              <li>Davanagere Central APMC</li>
            </ul>
          </div>

          {/* Transparency & Data Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-sage mb-3">
              Data Governance
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <Database className="w-4 h-4 text-forest-fresh shrink-0 mt-0.5" />
                <span>Verified AGMARKNET & data.gov.in official reporting network.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-fresh shrink-0 mt-0.5" />
                <span>Zero synthetic price interpolation. Traceable observation dates.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advisory & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="max-w-3xl leading-relaxed text-[11px]">
            <strong className="text-gray-300">Important Disclaimer:</strong> Estimated net earnings are analytical projections calculated using official APMC modal price records and estimated distance-based transport expenses. Actual realization at the mandi depends on farm-gate grading, market arrivals, and prevailing statutory commissions.
          </p>
          <div className="text-[11px] shrink-0 text-gray-400">
            &copy; 2026 MandiWise. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
