import { apiClient } from './apiClient';
import {
  DistrictOption,
  RecommendationRequest,
  RecommendationResponse,
  VehicleOption,
} from '../types/recommendation';

export const recommendationService = {
  /**
   * Fetches supported Karnataka districts with coordinates
   */
  async getDistricts(): Promise<DistrictOption[]> {
    const response = await apiClient.get<DistrictOption[]>('/recommendations/districts');
    return response.data;
  },

  /**
   * Fetches available vehicle transport profiles and default rates
   */
  async getVehicles(): Promise<VehicleOption[]> {
    const response = await apiClient.get<VehicleOption[]>('/recommendations/vehicles');
    return response.data;
  },

  /**
   * Executes authoritative net revenue comparison across candidate APMC mandis
   */
  async compareAndRecommend(request: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await apiClient.post<RecommendationResponse>('/recommendations/compare', request);
    return response.data;
  },
};
