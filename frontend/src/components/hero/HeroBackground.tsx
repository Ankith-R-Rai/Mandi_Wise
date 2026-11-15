import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type BackgroundOption = 'option1' | 'option2' | 'option3' | 'option4';

export interface HeroBackgroundProps {
  option: BackgroundOption;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ option }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none -z-10">
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
          className="absolute inset-0 w-full h-full"
        >
          {/* High-Resolution Landscape Photo with Guaranteed Fallback */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(7, 30, 18, 0.35), rgba(7, 30, 18, 0.45)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2600&q=85')`,
              backgroundColor: '#1E4830',
            }}
          />

          {/* Rich Layered Western Ghats SVG Art (Always visible even if image is loading/offline) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="opt1Ghat1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2E6646" />
                <stop offset="100%" stopColor="#143D27" />
              </linearGradient>
              <linearGradient id="opt1Ghat2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1A4A30" />
                <stop offset="100%" stopColor="#0B2618" />
              </linearGradient>
            </defs>

            {/* Distant Ghat Peaks */}
            <path d="M0,320 Q240,180 520,260 T1040,220 T1440,280 L1440,900 L0,900 Z" fill="url(#opt1Ghat1)" />
            {/* Middle Terraced Foothills */}
            <path d="M0,450 Q360,340 720,400 T1440,360 L1440,900 L0,900 Z" fill="url(#opt1Ghat2)" />
            {/* Terrace Crop Contours */}
            <path d="M0,520 Q400,440 850,500 T1440,460" stroke="#72C793" strokeWidth="3" fill="none" opacity="0.6" strokeDasharray="8 6" />
            <path d="M0,600 Q450,530 920,580 T1440,540" stroke="#72C793" strokeWidth="3" fill="none" opacity="0.7" strokeDasharray="10 8" />
          </svg>

          {/* Morning Atmospheric Mist & Golden Sunrise Glow */}
          <div className="absolute top-0 right-1/4 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-amber-300/30 via-emerald-400/15 to-transparent blur-3xl pointer-events-none" />

          {/* Gentle Animated Mist Drift across hills */}
          {!shouldReduceMotion && (
            <motion.div
              animate={{ x: ['-10%', '10%', '-10%'] }}
              transition={{ repeat: Infinity, duration: 30, ease: 'easeInOut' }}
              className="absolute top-1/4 inset-x-0 h-48 bg-gradient-to-b from-transparent via-white/20 to-transparent blur-2xl pointer-events-none"
            />
          )}

          {/* Bottom vignette so content blends gracefully into page */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent" />
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
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1E1102] via-[#2F1D08] to-[#122A1C]"
        >
          {/* Intense Morning Sun Flare */}
          <div className="absolute -top-40 right-[-5%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber-400/50 via-amber-600/30 to-transparent blur-[140px]" />
          <div className="absolute top-20 left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-500/25 via-amber-400/20 to-transparent blur-[120px]" />

          {/* High-Resolution Landscape Sunset/Sunrise Photo Overlay */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center mix-blend-screen opacity-40"
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
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#B45309" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="opt2Ridge" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1C4B30" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0B1E13" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Sun Rays */}
            <polygon points="1100,-50 1440,400 900,900" fill="url(#opt2SunGlow)" opacity="0.3" />
            <polygon points="1100,-50 1300,700 700,900" fill="url(#opt2SunGlow)" opacity="0.25" />

            {/* Valley Terraces */}
            <path d="M0,380 Q320,260 700,320 T1440,290 L1440,900 L0,900 Z" fill="#2E4A35" opacity="0.75" />
            <path d="M0,480 Q400,390 850,450 T1440,410 L1440,900 L0,900 Z" fill="url(#opt2Ridge)" />
            {/* Glowing Golden Contour Lines */}
            <path d="M0,540 Q380,470 800,520 T1440,480" stroke="#F59E0B" strokeWidth="2.5" fill="none" opacity="0.8" strokeDasharray="8 6" />
            <path d="M0,620 Q440,550 920,600 T1440,560" stroke="#FBBF24" strokeWidth="2" fill="none" opacity="0.7" strokeDasharray="10 8" />
          </svg>

          {/* Floating Golden Dust / Pollen Motes */}
          {!shouldReduceMotion && (
            <div className="absolute inset-0 pointer-events-none">
              {[15, 32, 48, 65, 82, 94].map((leftPct, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: ['100vh', '-10vh'],
                    opacity: [0, 0.9, 0.9, 0],
                    x: [0, (i % 2 === 0 ? 35 : -35), 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 10 + (i * 2),
                    delay: i * 1.5,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#F59E0B]"
                  style={{ left: `${leftPct}%` }}
                />
              ))}
            </div>
          )}

          {/* Bottom vignette */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent" />
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
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#02130A] via-[#052113] to-[#0A331E]"
        >
          {/* Luminous Neon Radial Nodes */}
          <div className="absolute top-10 left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[130px]" />
          <div className="absolute bottom-10 right-[15%] w-[650px] h-[650px] rounded-full bg-amber-500/20 blur-[140px]" />

          {/* High-Density Topographic Elevation Map Canvas */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" strokeWidth="1.8">
              {/* Vibrant Gold Elevation Contours */}
              <path d="M-100,180 C300,80 600,340 1000,190 C1200,130 1400,240 1600,180" stroke="#F59E0B" strokeOpacity="0.75" />
              <path d="M-100,250 C320,150 620,400 1020,260 C1220,190 1420,300 1600,250" stroke="#10B981" strokeOpacity="0.6" strokeDasharray="8 6" />
              <path d="M-100,340 C340,220 640,470 1040,330 C1240,260 1440,380 1600,340" stroke="#34D399" strokeOpacity="0.8" />
              <path d="M-100,430 C360,300 660,550 1060,420 C1260,340 1460,450 1600,430" stroke="#F59E0B" strokeOpacity="0.85" strokeWidth="2.2" />
              <path d="M-100,530 C380,390 680,630 1080,510 C1280,430 1480,530 1600,530" stroke="#10B981" strokeOpacity="0.65" strokeDasharray="10 8" />
              <path d="M-100,640 C400,490 700,720 1100,600 C1300,520 1500,630 1600,640" stroke="#6EE7B7" strokeOpacity="0.7" />
              <path d="M-100,750 C420,600 720,820 1120,700 C1320,620 1520,730 1600,750" stroke="#F59E0B" strokeOpacity="0.8" strokeWidth="2.5" />
            </g>

            {/* Radar concentric circular elevation rings */}
            <circle cx="1150" cy="300" r="180" fill="none" stroke="#10B981" strokeOpacity="0.25" strokeDasharray="6 6" />
            <circle cx="1150" cy="300" r="110" fill="none" stroke="#F59E0B" strokeOpacity="0.35" strokeDasharray="4 4" />
            <circle cx="1150" cy="300" r="40" fill="none" stroke="#10B981" strokeOpacity="0.5" />
          </svg>

          {/* Bottom vignette */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent" />
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
          className="absolute inset-0 w-full h-full bg-[#081810] overflow-hidden"
        >
          {/* Saturated Living Mesh Orbs */}
          {!shouldReduceMotion ? (
            <>
              <motion.div
                animate={{
                  x: [0, 80, -60, 0],
                  y: [0, -60, 70, 0],
                  scale: [1, 1.25, 0.9, 1],
                }}
                transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
                className="absolute -top-20 -left-20 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-500/50 via-teal-600/30 to-transparent blur-[110px]"
              />
              <motion.div
                animate={{
                  x: [0, -90, 70, 0],
                  y: [0, 80, -50, 0],
                  scale: [1, 1.3, 0.85, 1],
                }}
                transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
                className="absolute top-1/4 -right-20 w-[750px] h-[750px] rounded-full bg-gradient-to-bl from-amber-500/50 via-orange-600/30 to-transparent blur-[120px]"
              />
              <motion.div
                animate={{
                  x: [0, 60, -70, 0],
                  y: [0, -70, 60, 0],
                }}
                transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
                className="absolute -bottom-20 left-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-green-400/40 via-emerald-600/35 to-transparent blur-[110px]"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#B45309]" />
          )}

          {/* Organic Noise Texture Overlay for High-End Glass Look */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Bottom vignette */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent" />
        </motion.div>
      )}
    </div>
  );
};
