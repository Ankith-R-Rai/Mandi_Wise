import { apiClient } from './apiClient';
import type { Commodity, Market, MarketPrice, MarketSummary, MarketPriceFilter } from '../types/market';
import { CANONICAL_MANDI_RECORDS, type CanonicalPriceRecord } from '../data/canonicalMandiData';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Fallback mapper from static canonical JSON to MarketPrice model
function fallbackMapCanonical(): MarketPrice[] {
  return CANONICAL_MANDI_RECORDS.map((rec: CanonicalPriceRecord, idx: number) => ({
    id: `local-fallback-${idx}`,
    commodityId: rec.commodity.toLowerCase(),
    commodityName: rec.commodity,
    marketId: rec.market.toLowerCase().replace(/\s+/g, '-'),
    marketName: rec.market,
    district: rec.district,
    state: rec.state,
    variety: rec.variety,
    minPrice: rec.min_price,
    maxPrice: rec.max_price,
    modalPrice: rec.modal_price,
    priceUnit: rec.unit,
    observationDate: rec.observation_date,
    source: rec.source,
    freshnessStatus: rec.freshness_status,
    validationStatus: 'VALIDATED',
  }));
}

export const marketService = {
  async getCommodities(): Promise<Commodity[]> {
    try {
      const response = await apiClient.get<ApiResponse<Commodity[]>>('/market/commodities');
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to retrieve commodities');
    } catch (err) {
      console.warn('Backend /market/commodities unavailable, using static fallback:', err);
      return [
        { id: 'tomato', name: 'Tomato', normalizedName: 'tomato', kannadaName: 'ಟೊಮೆಟೊ', category: 'Vegetable', standardUnit: 'QUINTAL', active: true },
        { id: 'onion', name: 'Onion', normalizedName: 'onion', kannadaName: 'ಈರುಳ್ಳಿ', category: 'Vegetable', standardUnit: 'QUINTAL', active: true },
        { id: 'potato', name: 'Potato', normalizedName: 'potato', kannadaName: 'ಆಲೂಗಡ್ಡೆ', category: 'Vegetable', standardUnit: 'QUINTAL', active: true },
      ];
    }
  },

  async getMandis(district?: string): Promise<Market[]> {
    try {
      const params = district ? { district } : {};
      const response = await apiClient.get<ApiResponse<Market[]>>('/market/mandis', { params });
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to retrieve mandis');
    } catch (err) {
      console.warn('Backend /market/mandis unavailable, using fallback:', err);
      const allPrices = fallbackMapCanonical();
      const marketMap = new Map<string, Market>();
      for (const p of allPrices) {
        if (!district || p.district.toLowerCase() === district.toLowerCase()) {
          if (!marketMap.has(p.marketName)) {
            marketMap.set(p.marketName, {
              id: p.marketId,
              name: p.marketName,
              normalizedName: p.marketName.toLowerCase(),
              district: p.district,
              state: p.state,
              active: true,
            });
          }
        }
      }
      return Array.from(marketMap.values());
    }
  },

  async getDistricts(): Promise<string[]> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/market/districts');
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to retrieve districts');
    } catch (err) {
      console.warn('Backend /market/districts unavailable, using fallback:', err);
      const allPrices = fallbackMapCanonical();
      const districts = Array.from(new Set(allPrices.map((p) => p.district))).sort();
      return districts;
    }
  },

  async getPrices(filter?: MarketPriceFilter): Promise<MarketPrice[]> {
    try {
      const params: Record<string, string> = {};
      if (filter?.commodity) params.commodity = filter.commodity;
      if (filter?.district) params.district = filter.district;
      if (filter?.mandi) params.mandi = filter.mandi;
      if (filter?.date) params.date = filter.date;
      if (filter?.freshness) params.freshness = filter.freshness;

      const response = await apiClient.get<ApiResponse<MarketPrice[]>>('/market/prices', { params });
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to retrieve market prices');
    } catch (err) {
      console.warn('Backend /market/prices unavailable, using local canonical fallback:', err);
      let list = fallbackMapCanonical();
      if (filter?.commodity) {
        const comm = filter.commodity.toLowerCase();
        list = list.filter((p) => p.commodityName.toLowerCase() === comm || p.commodityId === comm);
      }
      if (filter?.district) {
        const dist = filter.district.toLowerCase();
        list = list.filter((p) => p.district.toLowerCase() === dist);
      }
      if (filter?.mandi) {
        const mandi = filter.mandi.toLowerCase();
        list = list.filter((p) => p.marketName.toLowerCase().includes(mandi));
      }
      if (filter?.freshness) {
        list = list.filter((p) => p.freshnessStatus === filter.freshness);
      }
      return list;
    }
  },

  async getSummary(): Promise<MarketSummary> {
    try {
      const response = await apiClient.get<ApiResponse<MarketSummary>>('/market/summary');
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to retrieve market summary');
    } catch (err) {
      console.warn('Backend /market/summary unavailable, using fallback:', err);
      const prices = fallbackMapCanonical();
      const distinctMarkets = new Set(prices.map((p) => p.marketName)).size;
      const distinctCommodities = new Set(prices.map((p) => p.commodityName)).size;
      return {
        totalCommodities: distinctCommodities,
        totalMarkets: distinctMarkets,
        totalObservations: prices.length,
        latestObservationDate: prices[0]?.observationDate,
        oldestObservationDate: prices[prices.length - 1]?.observationDate,
      };
    }
  },
};
