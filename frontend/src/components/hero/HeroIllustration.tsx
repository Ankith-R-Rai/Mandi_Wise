import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';

export interface HeroIllustrationProps {
  className?: string;
}

export const HeroIllustration: React.FC<HeroIllustrationProps> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();

  // Floating leaf particle configurations
  const leaves = [
    { startX: 740, deltaX: 30, duration: 8, delay: 0, r: 3.5, color: '#D99A32' },
    { startX: 780, deltaX: -40, duration: 10, delay: 2, r: 2.8, color: '#3D8055' },
    { startX: 820, deltaX: 35, duration: 9, delay: 4, r: 3.2, color: '#D97706' },
    { startX: 760, deltaX: -25, duration: 11, delay: 1.5, r: 2.5, color: '#23845B' },
    { startX: 800, deltaX: 45, duration: 12, delay: 5, r: 3.0, color: '#DCE9DD' },
  ];

  return (
    <div
      className={cn(
        'relative w-full h-[340px] sm:h-[400px] md:h-[460px] lg:h-[500px] overflow-hidden rounded-2xl select-none',
        'border border-forest-sage/50 shadow-md',
        className
      )}
    >
      {/* Background Gradient: Morning Sky over Karnataka */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E2EEE5] via-[#DCE9DD] to-[#B8D7BF]" />

      {/* Atmospheric Morning Sun Ray Glow */}
      <div className="absolute top-[-40px] right-[10%] w-[260px] h-[260px] rounded-full bg-gradient-to-br from-amber-100/70 via-amber-200/30 to-transparent blur-2xl pointer-events-none" />

      {/* Main Layered Landscape SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyMist" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EFF5EF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DCE9DD" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="hillLayer1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#96BA9F" />
            <stop offset="100%" stopColor="#7EAA88" />
          </linearGradient>

          <linearGradient id="hillLayer2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A8E60" />
            <stop offset="100%" stopColor="#2F6D43" />
          </linearGradient>

          <linearGradient id="terraceFore" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#265B3F" />
            <stop offset="100%" stopColor="#163D2B" />
          </linearGradient>

          <linearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Morning Mist Horizon */}
        <rect x="0" y="200" width="1200" height="200" fill="url(#skyMist)" />

        {/* Layer 1: Distant Western Ghats / Deccan Plateaus */}
        <path
          d="M0,340 Q200,240 450,290 T900,260 T1200,310 L1200,600 L0,600 Z"
          fill="url(#hillLayer1)"
          opacity="0.65"
        />

        {/* Layer 2: Middle-ground Rolling Agricultural Terraces */}
        <path
          d="M0,390 Q300,310 600,360 T1200,340 L1200,600 L0,600 Z"
          fill="url(#hillLayer2)"
          opacity="0.85"
        />

        {/* Agricultural Contour Field Lines */}
        <path
          d="M50,420 Q350,370 700,410 T1150,380"
          stroke="#5EA876"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0,460 Q400,410 800,450 T1200,420"
          stroke="#5EA876"
          strokeWidth="3"
          strokeDasharray="8 6"
          fill="none"
          opacity="0.5"
        />

        {/* Layer 3: Foreground Fertile Farm Terrain */}
        <path
          d="M0,450 Q250,420 550,440 T1200,420 L1200,600 L0,600 Z"
          fill="url(#terraceFore)"
        />

        {/* Distinctive Karnataka Banyan / Neem Tree Silhouette */}
        <g id="banyan-tree">
          {/* Main Trunk and Roots */}
          <path
            d="M840,320 Q845,430 830,510 M840,320 Q850,430 870,510 M835,370 Q800,440 790,510"
            stroke="#122A1E"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />

          {/* Hanging Prop Roots */}
          <path d="M780,260 Q785,380 788,500" stroke="#122A1E" strokeWidth="3" opacity="0.75" />
          <path d="M890,260 Q885,380 882,500" stroke="#122A1E" strokeWidth="3.5" opacity="0.75" />

          {/* Canopy Foliage Clusters */}
          <ellipse cx="840" cy="230" rx="95" ry="60" fill="#163D2B" />
          <ellipse cx="770" cy="250" rx="75" ry="50" fill="#1F5138" />
          <ellipse cx="910" cy="240" rx="80" ry="52" fill="#1F5138" />
          <ellipse cx="840" cy="190" rx="70" ry="45" fill="#296345" />
          <ellipse cx="810" cy="230" rx="55" ry="38" fill="#3D8055" opacity="0.9" />
          <ellipse cx="880" cy="210" rx="50" ry="35" fill="#3D8055" opacity="0.85" />
        </g>

        {/* Small Rural Bull-Cart Path Contour */}
        <path
          d="M0,540 Q300,510 650,530 T1200,510"
          stroke="#8A7A60"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Animated Falling Leaves (Environmental Motion) */}
        {!shouldReduceMotion &&
          leaves.map((leaf, i) => (
            <motion.circle
              key={i}
              cx={leaf.startX}
              cy={240}
              r={leaf.r}
              fill={leaf.color}
              initial={{ y: 0, x: 0, opacity: 0 }}
              animate={{
                y: [0, 80, 160, 240],
                x: [0, leaf.deltaX, -leaf.deltaX / 2, leaf.deltaX],
                opacity: [0, 0.9, 0.8, 0],
              }}
              transition={{
                duration: leaf.duration,
                delay: leaf.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
      </svg>

      {/* Bottom Vignette Blur */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-deep/60 to-transparent pointer-events-none" />
    </div>
  );
};
