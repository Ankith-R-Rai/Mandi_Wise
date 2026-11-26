import { apiClient } from './apiClient';
import type {
  QualityAnalysisResponse,
  SupportedCrop,
  SupportedCropsResponse,
  VisionServiceStatus,
} from '../types/quality';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
}

export const qualityService = {
  /**
   * Analyzes an uploaded crop image with computer vision heuristics and AGMARK grading
   */
  async analyzeImage(file: File, vegetableHint?: string): Promise<QualityAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (vegetableHint && vegetableHint.trim()) {
      formData.append('vegetableHint', vegetableHint.trim());
    }

    const response = await apiClient.post<ApiResponse<QualityAnalysisResponse>>(
      '/quality/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 20000,
      }
    );
    return response.data.data;
  },

  /**
   * Retrieves the catalog of supported crops for quality grading
   */
  async getSupportedCrops(): Promise<SupportedCrop[]> {
    const response = await apiClient.get<ApiResponse<SupportedCropsResponse>>('/quality/supported-crops');
    return response.data.data.supported_vegetables;
  },

  /**
   * Checks the health and operational status of the vision service
   */
  async checkStatus(): Promise<VisionServiceStatus> {
    const response = await apiClient.get<ApiResponse<VisionServiceStatus>>('/quality/status');
    return response.data.data;
  },
};
