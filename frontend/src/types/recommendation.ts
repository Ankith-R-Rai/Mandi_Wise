export type VehicleType = 'MINI_TRUCK' | 'MEDIUM_TRUCK' | 'HEAVY_TRUCK';

export interface VehicleOption {
  type: VehicleType;
  name: string;
  maxCapacityKg: number;
  defaultCostPerKm: number;
  baseMinimumCharge: number;
}

export interface DistrictOption {
  name: string;
  latitude: number;
  longitude: number;
}

export interface CalculationBreakdown {
  quantityKg: number;
  quantityQuintals: number;
  modalPricePerQuintal: number;
  grossRevenue: number;
  roadDistanceKm: number;
  costPerKm: number;
  transportCost: number;
  mandiCess: number;
  handlingCharge: number;
  spoilageAllowance: number;
  totalDeductions: number;
  netEarnings: number;
  profitMarginPercent: number;
  netRatePerKg: number;
}

export interface MandiCandidate {
  marketId: string;
  marketName: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  priceUnit: string;
  observationDate: string;
  freshnessStatus: 'FRESH' | 'ACCEPTABLE' | 'STALE';
  breakdown: CalculationBreakdown;
  rank: number;
  isTopRecommendation: boolean;
  isNearestMarket: boolean;
  netAdvantageVsNearest: number;
}

export interface RecommendationRequest {
  commodityId?: string;
  commodityName?: string;
  quantityKg: number;
  originDistrict: string;
  vehicleType?: VehicleType;
  customCostPerKm?: number;
}

export interface RecommendationResponse {
  commodityName: string;
  quantityKg: number;
  quantityQuintals: number;
  originDistrict: string;
  vehicleType: VehicleType;
  vehicleDisplayName: string;
  totalCandidatesEvaluated: number;
  topRecommendation: MandiCandidate | null;
  nearestMarket: MandiCandidate | null;
  candidateRankings: MandiCandidate[];
  recommendationRationale: string;
  disclaimer: string;
}
