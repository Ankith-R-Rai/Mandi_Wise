import { apiClient } from './apiClient';
import type { PriceTrendResponse, PriceTrendStats, TrendQueryParams } from '../types/trends';

export const trendsService = {
  async getHistoricalTrends(params: TrendQueryParams = {}): Promise<PriceTrendResponse> {
    const query = new URLSearchParams();
    if (params.commodity) query.set('commodity', params.commodity);
    if (params.range) query.set('range', params.range);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.markets && params.markets.length > 0) {
      params.markets.forEach((m) => query.append('markets', m));
    }

    const response = await apiClient.get<{ success: boolean; data: PriceTrendResponse }>(
      `/market/trends?${query.toString()}`
    );
    return response.data.data;
  },

  async getTrendStats(params: TrendQueryParams = {}): Promise<Record<string, PriceTrendStats>> {
    const query = new URLSearchParams();
    if (params.commodity) query.set('commodity', params.commodity);
    if (params.range) query.set('range', params.range);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.markets && params.markets.length > 0) {
      params.markets.forEach((m) => query.append('markets', m));
    }

    const response = await apiClient.get<{ success: boolean; data: Record<string, PriceTrendStats> }>(
      `/market/trends/stats?${query.toString()}`
    );
    return response.data.data;
  },
};
