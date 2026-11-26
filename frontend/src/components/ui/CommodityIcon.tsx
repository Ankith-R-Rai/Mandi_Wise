import React from 'react';
import { Sprout } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CommodityIconProps {
  commodity: string;
  size?: number;
  className?: string;
}

/**
 * Standardized SVG Commodity Icon component.
 * Strict project rule: NO Unicode/OS emojis anywhere. Always use crisp SVG vector icons.
 */
export const CommodityIcon: React.FC<CommodityIconProps> = ({
  commodity,
  size = 16,
  className,
}) => {
  const norm = (commodity || '').toLowerCase().trim();

  if (norm.includes('tomato')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('inline-block shrink-0', className)}
        aria-label="Tomato"
      >
        {/* Tomato Body */}
        <circle cx="12" cy="13.5" r="7.5" fill="#EF4444" />
        {/* Soft specular sheen */}
        <ellipse cx="9.5" cy="11.5" rx="2" ry="3.5" transform="rotate(-25 9.5 11.5)" fill="#FCA5A5" opacity="0.45" />
        {/* Stem and Calyx */}
        <path
          d="M12 6V3.5M12 6C10 5.2 8.5 5.8 7.5 7M12 6C14 5.2 15.5 5.8 16.5 7M12 6C11 7.2 10.2 8.5 10 9M12 6C13 7.2 13.8 8.5 14 9"
          stroke="#059669"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (norm.includes('onion')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('inline-block shrink-0', className)}
        aria-label="Onion"
      >
        {/* Onion Bulb Body */}
        <path
          d="M12 4.5C8.8 7.5 6 10.5 6 14.2C6 17.5 8.7 20 12 20C15.3 20 18 17.5 18 14.2C18 10.5 15.2 7.5 12 4.5Z"
          fill="#A855F7"
        />
        {/* Inner bulb tonal layer */}
        <path
          d="M12 4.5C10.2 7.5 8.5 10.5 8.5 14.2C8.5 16.8 10 19 12 19.5C14 19 15.5 16.8 15.5 14.2C15.5 10.5 13.8 7.5 12 4.5Z"
          fill="#C084FC"
          opacity="0.4"
        />
        {/* Root threads */}
        <path
          d="M11 20.5V22M12 20.5V22.5M13 20.5V22"
          stroke="#7E22CE"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Green top shoot */}
        <path
          d="M12 4.5C12 3 13 2 14.2 1.8"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (norm.includes('potato')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('inline-block shrink-0', className)}
        aria-label="Potato"
      >
        {/* Organic Oblong Potato */}
        <path
          d="M7.5 6C11.5 4.8 16.5 5.5 18.8 8.2C21 11 20.5 15.2 18.2 17.8C15.8 20.2 10.2 20.2 6.8 18.2C3.5 16.2 3.2 11.5 4.8 8.5C5.8 6.8 6.5 6.2 7.5 6Z"
          fill="#D97706"
        />
        {/* Highlight contour */}
        <path
          d="M8.5 8C11.5 7 14.5 7.5 16.5 9.5"
          stroke="#FCD34D"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Potato eyes / dimples */}
        <circle cx="8" cy="11.5" r="0.75" fill="#78350F" />
        <circle cx="14" cy="13.5" r="0.75" fill="#78350F" />
        <circle cx="10.5" cy="16" r="0.75" fill="#78350F" />
      </svg>
    );
  }

  if (norm.includes('brinjal') || norm.includes('eggplant')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('inline-block shrink-0', className)}
        aria-label="Brinjal"
      >
        {/* Brinjal Body */}
        <path
          d="M12 7C8.5 7 7 11 7 15C7 19 9.5 21 12 21C14.5 21 17 19 17 15C17 11 15.5 7 12 7Z"
          fill="#581C87"
        />
        <path
          d="M10 11C9.2 12.5 9.2 15 10 17"
          stroke="#C084FC"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Calyx & Stem */}
        <path
          d="M12 3V6M12 6C10 5.5 8 6.5 8 8C9.5 8.5 11 7.5 12 6ZM12 6C14 5.5 16 6.5 16 8C14.5 8.5 13 7.5 12 6Z"
          fill="#15803D"
          stroke="#15803D"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (norm.includes('chilli') || norm.includes('chili')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('inline-block shrink-0', className)}
        aria-label="Chilli"
      >
        {/* Curved Chilli Pod */}
        <path
          d="M13 7C16 9 17 14 15 18C13.5 20.5 11 21 10 20.5C9.2 20 9.5 18 10.5 15C11.5 12 12 8 13 7Z"
          fill="#16A34A"
        />
        {/* Stem */}
        <path
          d="M13 7C13.5 5 15 4 16 3"
          stroke="#15803D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Fallback agricultural crop icon
  return <Sprout size={size} className={cn('text-forest-fresh shrink-0', className)} />;
};
