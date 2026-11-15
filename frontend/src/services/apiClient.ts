import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for unified error unwrapping
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(customMessage));
  }
);
