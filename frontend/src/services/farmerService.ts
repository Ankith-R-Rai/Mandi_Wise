import { apiClient } from './apiClient';
import type { Farm, FarmRequest, FarmerProfile, FarmerProfileRequest } from '../types/auth';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export const farmerService = {
  async getProfile(): Promise<FarmerProfile> {
    const response = await apiClient.get<ApiResponse<FarmerProfile>>('/farmers/profile');
    return response.data.data;
  },

  async updateProfile(request: FarmerProfileRequest): Promise<FarmerProfile> {
    const response = await apiClient.put<ApiResponse<FarmerProfile>>('/farmers/profile', request);
    return response.data.data;
  },

  async getFarms(): Promise<Farm[]> {
    const response = await apiClient.get<ApiResponse<Farm[]>>('/farmers/farms');
    return response.data.data;
  },

  async createFarm(request: FarmRequest): Promise<Farm> {
    const response = await apiClient.post<ApiResponse<Farm>>('/farmers/farms', request);
    return response.data.data;
  },
};
