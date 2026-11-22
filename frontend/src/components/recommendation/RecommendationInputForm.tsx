import React, { useState, useEffect } from 'react';
import { CommodityIcon } from '../ui/CommodityIcon';
import { DistrictOption, VehicleOption, VehicleType } from '../../types/recommendation';
import { MapPin, Truck, Scale, Sparkles, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

interface RecommendationInputFormProps {
  districts: DistrictOption[];
  vehicles: VehicleOption[];
  isLoading: boolean;
  defaultDistrict?: string;
  onSubmit: (params: {
    commodityName: string;
    quantityKg: number;
    originDistrict: string;
    vehicleType?: VehicleType;
    customCostPerKm?: number;
  }) => void;
}

export const RecommendationInputForm: React.FC<RecommendationInputFormProps> = ({
  districts,
  vehicles,
  isLoading,
  defaultDistrict,
  onSubmit,
}) => {
  const [commodity, setCommodity] = useState<string>('Tomato');
  const [unit, setUnit] = useState<'kg' | 'quintal'>('kg');
  const [quantityValue, setQuantityValue] = useState<number>(1500);
  const [originDistrict, setOriginDistrict] = useState<string>('Bengaluru Urban');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | 'AUTO'>('AUTO');
  const [showCustomRate, setShowCustomRate] = useState<boolean>(false);
  const [customCostPerKm, setCustomCostPerKm] = useState<number | undefined>(undefined);

  // Set default district when available
  useEffect(() => {
    if (defaultDistrict && districts.some((d) => d.name.toLowerCase() === defaultDistrict.toLowerCase())) {
      setOriginDistrict(defaultDistrict);
    }
  }, [defaultDistrict, districts]);

  // Derived quantity in KG
  const effectiveQuantityKg = unit === 'quintal' ? quantityValue * 100 : quantityValue;

  const handleUnitToggle = (newUnit: 'kg' | 'quintal') => {
    if (newUnit === unit) return;
    if (newUnit === 'quintal') {
      setQuantityValue(Math.max(1, Math.round(quantityValue / 100)));
    } else {
      setQuantityValue(quantityValue * 100);
    }
    setUnit(newUnit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveQuantityKg <= 0) return;

    onSubmit({
      commodityName: commodity,
      quantityKg: effectiveQuantityKg,
      originDistrict,
      vehicleType: selectedVehicle === 'AUTO' ? undefined : selectedVehicle,
      customCostPerKm: showCustomRate && customCostPerKm && customCostPerKm > 0 ? customCostPerKm : undefined,
    });
  };

  const handleReset = () => {
    setCommodity('Tomato');
    setUnit('kg');
    setQuantityValue(1500);
    setOriginDistrict(defaultDistrict || 'Bengaluru Urban');
    setSelectedVehicle('AUTO');
    setShowCustomRate(false);
    setCustomCostPerKm(undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-emerald-900/10 shadow-[0_10px_35px_rgba(11,42,29,0.06)] space-y-6 text-surface-charcoal"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-surface-darkCharcoal flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-forest" />
            <span>Produce &amp; Transit Parameters</span>
          </h3>
          <p className="text-xs sm:text-sm text-surface-muted mt-0.5">
            Specify your harvest volume, origin farm district, and transport method.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-surface-muted hover:text-forest flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-forest-lightSage/40 transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Row 1: Commodity Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-surface-muted block">
          1. Select Agricultural Commodity
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'Tomato', label: 'Tomato', sub: 'Perishable Produce' },
            { id: 'Onion', label: 'Onion', sub: 'Storable Bulb' },
            { id: 'Potato', label: 'Potato', sub: 'Tuber Crop' },
          ].map((item) => {
            const isSelected = commodity === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCommodity(item.id)}
                className={`relative flex items-center sm:flex-col sm:justify-center p-3.5 sm:p-4 rounded-2xl border text-left sm:text-center transition-all ${
                  isSelected
                    ? 'bg-forest-lightSage/70 border-forest shadow-xs'
                    : 'bg-[#F9FAF8] border-emerald-900/10 hover:bg-white hover:border-forest/40'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="mr-3 sm:mr-0 sm:mb-2 shrink-0">
                  <CommodityIcon commodity={item.id} size={32} />
                </div>
                <div>
                  <span className={`text-sm font-bold block ${isSelected ? 'text-forest' : 'text-surface-darkCharcoal'}`}>
                    {item.label}
                  </span>
                  <span className="text-[11px] text-surface-muted block leading-tight">
                    {item.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Quantity & Origin District */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quantity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="quantity-input" className="text-xs font-bold uppercase tracking-wider text-surface-muted flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-forest" />
              2. Produce Volume
            </label>
            <div className="flex items-center rounded-xl bg-[#EDF5F0] p-1 border border-emerald-900/10 text-xs">
              <button
                type="button"
                onClick={() => handleUnitToggle('kg')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  unit === 'kg'
                    ? 'bg-forest text-white shadow-xs'
                    : 'text-surface-muted hover:text-surface-darkCharcoal'
                }`}
              >
                Kilograms (kg)
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('quintal')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  unit === 'quintal'
                    ? 'bg-forest text-white shadow-xs'
                    : 'text-surface-muted hover:text-surface-darkCharcoal'
                }`}
              >
                Quintals (q)
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              id="quantity-input"
              type="number"
              min={1}
              step="any"
              value={quantityValue}
              onChange={(e) => setQuantityValue(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full px-4 py-3 rounded-2xl bg-[#F9FAF8] border border-emerald-900/15 text-surface-darkCharcoal font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-all shadow-inner"
              placeholder="e.g. 1500"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-surface-muted font-mono bg-white px-2 py-0.5 rounded-md border border-emerald-900/10">
              = {effectiveQuantityKg.toLocaleString()} kg ({((effectiveQuantityKg) / 100).toFixed(1)} q)
            </span>
          </div>
        </div>

        {/* Origin District */}
        <div className="space-y-2">
          <label htmlFor="origin-district-select" className="text-xs font-bold uppercase tracking-wider text-surface-muted flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-forest" />
            3. Origin Farm District (Karnataka)
          </label>
          <div className="relative">
            <select
              id="origin-district-select"
              value={originDistrict}
              onChange={(e) => setOriginDistrict(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#F9FAF8] border border-emerald-900/15 text-surface-darkCharcoal text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-all shadow-inner appearance-none pr-10"
            >
              {districts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-muted">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Vehicle Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-surface-muted flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-forest" />
          4. Transport Vehicle Selection
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setSelectedVehicle('AUTO')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedVehicle === 'AUTO'
                ? 'bg-forest-lightSage/70 border-forest shadow-xs'
                : 'bg-[#F9FAF8] border-emerald-900/10 hover:bg-white hover:border-forest/40'
            }`}
          >
            <span className="text-xs font-bold text-surface-darkCharcoal block">Auto Recommended</span>
            <span className="text-[11px] text-forest font-semibold block mt-0.5">Best fit for {effectiveQuantityKg} kg</span>
          </button>

          {vehicles.map((v) => {
            const isSelected = selectedVehicle === v.type;
            return (
              <button
                key={v.type}
                type="button"
                onClick={() => setSelectedVehicle(v.type)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-forest-lightSage/70 border-forest shadow-xs'
                    : 'bg-[#F9FAF8] border-emerald-900/10 hover:bg-white hover:border-forest/40'
                }`}
              >
                <span className="text-xs font-bold text-surface-darkCharcoal block truncate">{v.name}</span>
                <span className="text-[11px] text-surface-muted block font-mono mt-0.5">
                  ₹{v.defaultCostPerKm}/km (up to {v.maxCapacityKg} kg)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional: Custom Rate Per KM Override */}
      <div className="pt-1">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="custom-rate-toggle"
            checked={showCustomRate}
            onChange={(e) => setShowCustomRate(e.target.checked)}
            className="w-4 h-4 rounded border-emerald-900/20 text-forest focus:ring-forest cursor-pointer"
          />
          <label htmlFor="custom-rate-toggle" className="text-xs font-medium text-surface-charcoal cursor-pointer select-none">
            I have a negotiated transporter rate per km (custom override)
          </label>
        </div>

        {showCustomRate && (
          <div className="mt-3 pl-6 max-w-xs">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-surface-muted">₹</span>
              <input
                type="number"
                min={5}
                max={200}
                step="any"
                value={customCostPerKm || ''}
                onChange={(e) => setCustomCostPerKm(parseFloat(e.target.value) || undefined)}
                placeholder="e.g. 20.0"
                className="w-full pl-8 pr-14 py-2 rounded-xl bg-[#F9FAF8] border border-emerald-900/20 text-surface-darkCharcoal text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-forest"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-surface-muted">/ km</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || effectiveQuantityKg <= 0}
        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-forest hover:bg-forest-deep disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-lg shadow-forest/20 active:scale-[0.99] cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-emerald-200" />
        <span>{isLoading ? 'Calculating Optimal APMC Returns...' : 'Calculate Best Net Take-Home Mandi'}</span>
      </button>
    </form>
  );
};
