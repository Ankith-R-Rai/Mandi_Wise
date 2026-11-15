import canonicalRecords from './canonicalMandiData.json';

export interface CanonicalPriceRecord {
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
  observation_date: string;
  freshness_status: 'FRESH' | 'ACCEPTABLE' | 'STALE';
  source: string;
  is_valid: boolean;
  validation_notes: string[];
}

export const CANONICAL_MANDI_RECORDS: CanonicalPriceRecord[] = canonicalRecords as CanonicalPriceRecord[];

export const SUPPORTED_COMMODITIES = ['Tomato', 'Onion', 'Potato'] as const;

export const SUPPORTED_MARKETS = [
  'Kolar',
  'Bengaluru (Yeshwanthpur)',
  'Hubli (Amaragol)',
  'Belagavi',
  'Mysuru (Bandipalya)',
  'Davanagere',
] as const;
