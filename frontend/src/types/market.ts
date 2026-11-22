export interface Commodity {
  id: string;
  name: string;
  normalizedName: string;
  kannadaName?: string;
  category?: string;
  standardUnit: string;
  active: boolean;
}

export interface Market {
  id: string;
  name: string;
  normalizedName: string;
  district: string;
  state: string;
  stateCode?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  active: boolean;
}

export interface MarketPrice {
  id: string;
  commodityId: string;
  commodityName: string;
  kannadaCommodityName?: string;
  marketId: string;
  marketName: string;
  district: string;
  state: string;
  variety?: string;
  minPrice?: number;
  maxPrice?: number;
  modalPrice: number;
  priceUnit: string;
  arrivalsTonnes?: number;
  observationDate: string;
  source: string;
  freshnessStatus: 'FRESH' | 'ACCEPTABLE' | 'STALE';
  validationStatus: 'VALIDATED' | 'FLAGGED' | 'REJECTED';
}

export interface MarketSummary {
  totalCommodities: number;
  totalMarkets: number;
  totalObservations: number;
  latestObservationDate?: string;
  oldestObservationDate?: string;
}

export interface MarketPriceFilter {
  commodity?: string;
  district?: string;
  mandi?: string;
  date?: string;
  freshness?: 'FRESH' | 'ACCEPTABLE' | 'STALE';
}
