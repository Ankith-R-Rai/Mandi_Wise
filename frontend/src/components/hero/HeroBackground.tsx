import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type BackgroundOption = 'option1' | 'option2' | 'option3' | 'option4';

export interface HeroBackgroundProps {
  option: BackgroundOption;
}

// Organic Leaf SVG Component
const LeafSvg: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 32 32" className={className || 'w-full h-full'} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Leaf Body */}
    <path
      d="M16 2 C24 7 28 17 21 26 C13 29 6 22 4 14 C10 12 14 8 16 2 Z"
      fill={color}
    />
    {/* Leaf Stem & Veins */}
    <path d="M16 4 Q14 15 8 25" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 12 Q18 10 21 11" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M12 17 Q17 16 19 18" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ option }) => {
  const shouldReduceMotion = useReducedMotion();

  // 14 Organic Falling Leaves with Wind Physics
  const leaves = [
    { id: 1, left: 6, size: 24, duration: 9, delay: 0, color: '#34D399', sway: 50 },
    { id: 2, left: 15, size: 30, duration: 11, delay: 2.5, color: '#F59E0B', sway: -60 },
    { id: 3, left: 24, size: 20, duration: 8.5, delay: 1, color: '#10B981', sway: 70 },
    { id: 4, left: 33, size: 26, duration: 12, delay: 4, color: '#FBBF24', sway: -55 },
    { id: 5, left: 42, size: 22, duration: 10, delay: 0.5, color: '#6EE7B7', sway: 65 },
    { id: 6, left: 52, size: 32, duration: 13, delay: 3, color: '#D97706', sway: -75 },
    { id: 7, left: 61, size: 18, duration: 8, delay: 2, color: '#059669', sway: 45 },
    { id: 8, left: 70, size: 28, duration: 11.5, delay: 5, color: '#FBBF24', sway: -60 },
    { id: 9, left: 79, size: 22, duration: 9.5, delay: 1.5, color: '#34D399', sway: 55 },
    { id: 10, left: 88, size: 26, duration: 12.5, delay: 3.5, color: '#F59E0B', sway: -65 },
    { id: 11, left: 95, size: 20, duration: 10.5, delay: 0.8, color: '#10B981', sway: 40 },
    { id: 12, left: 12, size: 22, duration: 14, delay: 6, color: '#D97706', sway: -50 },
    { id: 13, left: 48, size: 28, duration: 9, delay: 4.5, color: '#34D399', sway: 60 },
    { id: 14, left: 82, size: 24, duration: 11, delay: 2, color: '#6EE7B7', sway: -45 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* =========================================================================
          OPTION 1: Misty Western Ghats & Coastal Terraces (Vivid Green Farmland Landscape)
         ========================================================================= */}
      {option === 'option1' && (
        <motion.div
          key="option1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#133E29] via-[#1E573A] to-[#2B7750]"
        >
          {/* Western Ghats Farmland Photo Overlay */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-65 mix-blend-screen"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2600&q=85')`,
            }}
          />

          {/* Majestic Layered Western Ghats Mountains SVG Art */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="opt1SkyLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#15803D" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="opt1MountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1B4332" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="opt1TerracesMid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#40916C" />
                <stop offset="100%" stopColor="#1B4332" />
              </linearGradient>
              <linearGradient id="opt1ForegroundFields" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#52B788" />
                <stop offset="100%" stopColor="#081C15" />
              </linearGradient>
            </defs>

            {/* Morning Sun Ray Burst on Horizon */}
            <circle cx="1080" cy="180" r="320" fill="url(#opt1SkyLight)" />

            {/* Distant Ghat Peaks */}
            <path d="M0,320 Q280,160 560,250 T1120,210 T1440,270 L1440,900 L0,900 Z" fill="url(#opt1MountainFar)" />
            {/* Middle Terraced Foothills */}
            <path d="M0,450 Q360,340 760,410 T1440,370 L1440,900 L0,900 Z" fill="url(#opt1TerracesMid)" />

            {/* Agricultural Terrace Curves with Glowing Edge Contours */}
            <path d="M0,520 Q400,440 850,500 T1440,460" stroke="#86EFAC" strokeWidth="3" fill="none" opacity="0.75" strokeDasharray="10 8" />
            <path d="M0,600 Q450,530 920,580 T1440,540" stroke="#FBBF24" strokeWidth="2.5" fill="none" opacity="0.65" strokeDasharray="8 6" />

            {/* Foreground Agricultural Fields */}
            <path d="M0,620 Q420,560 880,620 T1440,580 L1440,900 L0,900 Z" fill="url(#opt1ForegroundFields)" opacity="0.9" />
          </svg>

          {/* Morning Sunlight Glow */}
          <div className="absolute top-10 right-1/4 w-[600px] h-[500px] rounded-full bg-gradient-to-b from-amber-300/35 via-emerald-300/20 to-transparent blur-[120px]" />
        </motion.div>
      )}

      {/* =========================================================================
          OPTION 2: Golden Hour Harvest Horizon (Warm Glowing Sunrise)
         ========================================================================= */}
      {option === 'option2' && (
        <motion.div
          key="option2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#78350F] via-[#B45309] to-[#064E3B]"
        >
          {/* Intense Morning Sun Flare */}
          <div className="absolute -top-32 right-[-5%] w-[850px] h-[850px] rounded-full bg-gradient-to-br from-amber-300/60 via-amber-500/40 to-transparent blur-[140px]" />
          <div className="absolute top-20 left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-500/35 via-amber-400/30 to-transparent blur-[130px]" />

          {/* High-Resolution Landscape Sunset/Sunrise Photo Overlay */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center mix-blend-screen opacity-55"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2600&q=85')`,
            }}
          />

          {/* Panoramic Golden Horizon Valley SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="opt2SunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="opt2Ridge" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1B4D3E" />
                <stop offset="100%" stopColor="#0B1E13" />
              </linearGradient>
            </defs>

            {/* Sun Rays Streaming Down */}
            <polygon points="1200,-50 1440,500 800,900" fill="url(#opt2SunGlow)" opacity="0.35" />
            <polygon points="1200,-50 1300,750 600,900" fill="url(#opt2SunGlow)" opacity="0.3" />

            {/* Terraced Hill Slopes */}
            <path d="M0,380 Q320,260 700,320 T1440,290 L1440,900 L0,900 Z" fill="#2E4A35" opacity="0.85" />
            <path d="M0,480 Q400,390 850,450 T1440,410 L1440,900 L0,900 Z" fill="url(#opt2Ridge)" />

            {/* Glowing Golden Harvest Contours */}
            <path d="M0,540 Q380,470 800,520 T1440,480" stroke="#FDE68A" strokeWidth="3" fill="none" opacity="0.85" strokeDasharray="10 8" />
            <path d="M0,620 Q440,550 920,600 T1440,560" stroke="#F59E0B" strokeWidth="2.5" fill="none" opacity="0.75" strokeDasharray="8 6" />
          </svg>
        </motion.div>
      )}

      {/* =========================================================================
          OPTION 3: Deep Emerald Topographic Matrix (Modern Agritech Terminal)
         ========================================================================= */}
      {option === 'option3' && (
        <motion.div
          key="option3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#02130A] via-[#052616] to-[#0A3D24]"
        >
          {/* Luminous Neon Radial Nodes */}
          <div className="absolute top-10 left-[20%] w-[650px] h-[650px] rounded-full bg-emerald-500/25 blur-[140px]" />
          <div className="absolute bottom-10 right-[15%] w-[700px] h-[700px] rounded-full bg-amber-500/25 blur-[150px]" />

          {/* High-Density Topographic Elevation Map Canvas */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" strokeWidth="2">
              <path d="M-100,180 C300,80 600,340 1000,190 C1200,130 1400,240 1600,180" stroke="#F59E0B" strokeOpacity="0.85" />
              <path d="M-100,250 C320,150 620,400 1020,260 C1220,190 1420,300 1600,250" stroke="#10B981" strokeOpacity="0.7" strokeDasharray="8 6" />
              <path d="M-100,340 C340,220 640,470 1040,330 C1240,260 1440,380 1600,340" stroke="#34D399" strokeOpacity="0.85" />
              <path d="M-100,430 C360,300 660,550 1060,420 C1260,340 1460,450 1600,430" stroke="#FBBF24" strokeOpacity="0.9" strokeWidth="2.5" />
              <path d="M-100,530 C380,390 680,630 1080,510 C1280,430 1480,530 1600,530" stroke="#10B981" strokeOpacity="0.75" strokeDasharray="10 8" />
              <path d="M-100,640 C400,490 700,720 1100,600 C1300,520 1500,630 1600,640" stroke="#6EE7B7" strokeOpacity="0.8" />
              <path d="M-100,750 C420,600 720,820 1120,700 C1320,620 1520,730 1600,750" stroke="#F59E0B" strokeOpacity="0.85" strokeWidth="3" />
            </g>

            {/* Radar concentric circular elevation rings */}
            <circle cx="1150" cy="300" r="180" fill="none" stroke="#10B981" strokeOpacity="0.35" strokeDasharray="6 6" />
            <circle cx="1150" cy="300" r="110" fill="none" stroke="#F59E0B" strokeOpacity="0.45" strokeDasharray="4 4" />
            <circle cx="1150" cy="300" r="40" fill="none" stroke="#34D399" strokeOpacity="0.7" />
          </svg>
        </motion.div>
      )}

      {/* =========================================================================
          OPTION 4: Living Fluid Aurora Mesh (Apple-Style Vibrant Glass)
         ========================================================================= */}
      {option === 'option4' && (
        <motion.div
          key="option4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full bg-[#041F14] overflow-hidden"
        >
          {/* Saturated Living Mesh Orbs */}
          {!shouldReduceMotion ? (
            <>
              <motion.div
                animate={{
                  x: [0, 90, -70, 0],
                  y: [0, -70, 80, 0],
                  scale: [1, 1.3, 0.9, 1],
                }}
                transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
                className="absolute -top-20 -left-20 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-emerald-500/60 via-teal-500/40 to-transparent blur-[120px]"
              />
              <motion.div
                animate={{
                  x: [0, -100, 80, 0],
                  y: [0, 90, -60, 0],
                  scale: [1, 1.35, 0.85, 1],
                }}
                transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
                className="absolute top-1/4 -right-20 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-amber-500/60 via-orange-500/40 to-transparent blur-[130px]"
              />
              <motion.div
                animate={{
                  x: [0, 70, -80, 0],
                  y: [0, -80, 70, 0],
                }}
                transition={{ repeat: Infinity, duration: 17, ease: 'easeInOut' }}
                className="absolute -bottom-20 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-green-400/50 via-emerald-600/45 to-transparent blur-[120px]"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#B45309]" />
          )}

          {/* Organic Noise Texture Overlay for High-End Glass Look */}
          <div
            className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      )}

      {/* =========================================================================
          WIND & FALLING LEAVES SIMULATION LAYER (Active on all backgrounds)
         ========================================================================= */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10">
          {/* Animated Gentle Wind Breeze Flow Lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-45"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M-200,220 C200,180 600,260 1000,210 C1200,190 1400,240 1800,200"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.8"
              strokeDasharray="12 16"
              fill="none"
              animate={{ strokeDashoffset: [0, -200] }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            />
            <motion.path
              d="M-200,380 C300,340 700,420 1100,370 C1300,350 1500,400 1800,360"
              stroke="rgba(245, 158, 11, 0.45)"
              strokeWidth="2"
              strokeDasharray="14 18"
              fill="none"
              animate={{ strokeDashoffset: [0, -240] }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            />
            <motion.path
              d="M-200,560 C250,520 650,600 1050,540 C1250,520 1450,570 1800,530"
              stroke="rgba(52, 211, 153, 0.4)"
              strokeWidth="1.8"
              strokeDasharray="16 20"
              fill="none"
              animate={{ strokeDashoffset: [0, -220] }}
              transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
            />
          </svg>

          {/* Falling and Swirling Organic Leaves */}
          {leaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              initial={{
                y: '-10%',
                x: 0,
                rotateZ: 0,
                rotateX: 0,
                opacity: 0,
              }}
              animate={{
                y: ['-10%', '115%'],
                x: [0, leaf.sway, -leaf.sway * 0.5, leaf.sway * 0.8, 0],
                rotateZ: [0, 180, 360, 540],
                rotateX: [0, 90, 180, 360],
                opacity: [0, 0.9, 0.9, 0],
              }}
              transition={{
                duration: leaf.duration,
                delay: leaf.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute pointer-events-none drop-shadow-md"
              style={{
                left: `${leaf.left}%`,
                width: leaf.size,
                height: leaf.size,
              }}
            >
              <LeafSvg color={leaf.color} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Gentle Bottom Blend Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface-background via-surface-background/50 to-transparent z-10 pointer-events-none" />
    </div>
  );
};
