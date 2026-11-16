export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  emailVerified: boolean;
  roles: string[];
}

export interface Farm {
  id: string;
  farmName?: string;
  district: string;
  taluk?: string;
  village?: string;
  landArea?: number;
  landAreaUnit?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  preferredLanguage: string;
  district?: string;
  taluk?: string;
  village?: string;
  createdAt: string;
  farms: Farm[];
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  roles: string[];
  farmerProfileId?: string;
  district?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  district?: string;
  preferredLanguage?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface FarmerProfileRequest {
  preferredLanguage?: string;
  district?: string;
  taluk?: string;
  village?: string;
}

export interface FarmRequest {
  farmName?: string;
  district: string;
  taluk?: string;
  village?: string;
  landArea?: number;
  landAreaUnit?: string;
  latitude?: number;
  longitude?: number;
}
