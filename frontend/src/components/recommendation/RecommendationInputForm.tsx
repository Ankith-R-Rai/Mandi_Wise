import React, { useState, useEffect } from 'react';
import { CommodityIcon } from '../ui/CommodityIcon';
import { DistrictOption, VehicleOption, VehicleType } from '../../types/recommendation';
import { MapPin, Truck, Scale, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';

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
      className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Produce &amp; Transit Parameters</span>
          </h3>
          <p className="text-xs text-slate-400">
            Specify your harvest volume and origin to compute realistic take-home net profits.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Row 1: Commodity Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
          Select Agricultural Commodity
        </label>
        <div className="grid grid-cols-3 gap-3">
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
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="mb-1.5">
                  <CommodityIcon commodity={item.id} size={28} />
                </div>
                <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Quantity & Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="quantity-input" className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              Produce Volume
            </label>
            <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => handleUnitToggle('kg')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  unit === 'kg' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Kilograms (kg)
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('quintal')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  unit === 'quintal' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
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
              step={unit === 'quintal' ? 0.5 : 10}
              value={quantityValue}
              onChange={(e) => setQuantityValue(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 font-mono text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g. 1500"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono">
              = {effectiveQuantityKg.toLocaleString()} kg ({((effectiveQuantityKg) / 100).toFixed(1)} q)
            </span>
          </div>
        </div>

        {/* Origin Location / District */}
        <div className="space-y-2">
          <label htmlFor="origin-district-select" className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Origin Farm District (Karnataka)
          </label>
          <select
            id="origin-district-select"
            value={originDistrict}
            onChange={(e) => setOriginDistrict(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {districts.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Vehicle Selection */}
      <div className="space-y-2">
        <label htmlFor="vehicle-type-select" className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-emerald-400" />
          Transport Vehicle Selection
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedVehicle('AUTO')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedVehicle === 'AUTO'
                ? 'bg-emerald-500/15 border-emerald-500/50'
                : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
            }`}
          >
            <span className="text-xs font-bold text-slate-100 block">Auto Recommended</span>
            <span className="text-[11px] text-emerald-400 block">Best fit for {effectiveQuantityKg} kg</span>
          </button>

          {vehicles.map((v) => {
            const isSelected = selectedVehicle === v.type;
            return (
              <button
                key={v.type}
                type="button"
                onClick={() => setSelectedVehicle(v.type)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                }`}
              >
                <span className="text-xs font-bold text-slate-100 block truncate">{v.name}</span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  ₹{v.defaultCostPerKm}/km (up to {v.maxCapacityKg} kg)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional: Custom Rate Per KM Override */}
      <div className="pt-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="custom-rate-toggle"
            checked={showCustomRate}
            onChange={(e) => setShowCustomRate(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-400"
          />
          <label htmlFor="custom-rate-toggle" className="text-xs text-slate-300 cursor-pointer select-none">
            I have a negotiated transporter rate per km
          </label>
        </div>

        {showCustomRate && (
          <div className="mt-2 pl-6 max-w-xs">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
              <input
                type="number"
                min={5}
                max={200}
                step={0.5}
                value={customCostPerKm || ''}
                onChange={(e) => setCustomCostPerKm(parseFloat(e.target.value) || undefined)}
                placeholder="e.g. 22.0"
                className="w-full pl-7 pr-14 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">/ km</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || effectiveQuantityKg <= 0}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
      >
        <Sparkles className="w-4 h-4" />
        <span>{isLoading ? 'Calculating Optimal APMC Returns...' : 'Calculate Best Net Take-Home Mandi'}</span>
      </button>
    </form>
  );
};
