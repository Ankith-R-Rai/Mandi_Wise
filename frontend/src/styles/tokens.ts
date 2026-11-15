/**
 * MandiWise Design System Tokens
 * Source of truth: UI_UX_DESIGN_BRIEF.md
 */

export const colors = {
  forest: {
    DEFAULT: '#1F5138', // Primary brand color
    deep: '#163D2B',    // Dark emphasis
    fresh: '#3D8055',   // Secondary accent
    sage: '#DCE9DD',    // Soft surface
    lightSage: '#EFF5EF', // Section background
  },
  surface: {
    white: '#FFFFFF',
    background: '#F8FAF7', // Canvas off-white
    border: '#E8ECE8',     // Card & separator border
    muted: '#87918A',      // Secondary text
    charcoal: '#26312B',   // Primary text
    darkCharcoal: '#18231D', // Headings / strong emphasis
  },
  accent: {
    amber: '#D97706',      // Harvest amber for CTA / highlights
    amberLight: '#FEF3C7',
    warning: '#D99A32',
  },
  semantic: {
    success: '#23845B',
    warning: '#D99A32',
    error: '#C94C4C',
    info: '#3C78A5',
  },
  freshness: {
    fresh: {
      bg: '#EAF6EE',
      text: '#1F5138',
      border: '#B7E1C7',
      label: 'Fresh (≤ 7 days)',
    },
    acceptable: {
      bg: '#FEF8EC',
      text: '#996300',
      border: '#FDE0B2',
      label: 'Acceptable (8–30 days)',
    },
    stale: {
      bg: '#F3F4F3',
      text: '#68736B',
      border: '#D9DFDB',
      label: 'Archived / Stale (> 30 days)',
    },
  },
} as const;

export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const fonts = {
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  kannada: 'Noto Sans Kannada, Inter, system-ui, sans-serif',
} as const;
