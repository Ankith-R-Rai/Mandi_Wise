import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type BackgroundOption = 'option1' | 'option2' | 'option3' | 'option4';

export interface HeroBackgroundProps {
  option: BackgroundOption;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ option }) => {
  const shouldReduceMotion = useReducedMotion();

  // Floating ambient particles for Option 1 & Option 2
  const particles = [
    { startX: 15, delay: 0, duration: 9, size: 4 },
    { startX: 35, delay: 2, duration: 11, size: 6 },
    { startX: 55, delay: 4, duration: 8, size: 3 },
    { startX: 75, delay: 1, duration: 12, size: 5 },
    { startX: 90, delay: 3, duration: 10, size: 4 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none -z-10">
      {/* =========================================================================
          OPTION 1: Misty Western Ghats & Coastal Terraces (Cinematic Photo + Frosted Glass)
         ========================================================================= */}
      {option === 'option1' && (
        <motion.div
          key="option1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Photographic Western Ghats / Coastal Karnataka Farmland Landscape */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center sm:bg-[center_top] transition-transform duration-1000 scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=85')`,
            }}
          />

          {/* Frosted Glass Depth & Gradient Overlay (Ensures WCAG AAA Contrast) */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-transparent to-white/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/10 via-transparent to-surface-background" />

          {/* Atmospheric Morning Mist Band */}
          {!shouldReduceMotion && (
            <motion.div
              animate={{ x: ['-5%', '5%', '-5%'] }}
              transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
              className="absolute top-1/3 inset-x-0 h-40 bg-gradient-to-b from-white/0 via-white/30 to-white/0 blur-2xl"
            />
          )}
        </motion.div>
      )}

      {/* =========================================================================
          OPTION 2: Golden Hour Harvest Horizon (Warm Panoramic Sunrise)
         ========================================================================= */}
      {option === 'option2' && (
        <motion.div
          key="option2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#FFFDF5] via-[#FFF8E7] to-[#F5EEDB]"
        >
          {/* Sunburst Flare Glow */}
          <div className="absolute -top-32 right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-300/40 via-amber-200/20 to-transparent blur-3xl" />
          <div className="absolute top-20 left-[15%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-emerald-200/30 via-amber-100/30 to-transparent blur-3xl" />

          {/* Vector Sunrise Horizon Over Karnataka Farmland */}
          <svg
            className="absolute bottom-0 inset-x-0 w-full h-72 sm:h-96 opacity-80"
            viewBox="0 0 1440 380"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="opt2HillFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2A94C" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#C48E3A" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="opt2HillMid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#558C67" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#306443" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="opt2FieldFore" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2E6945" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1C452C" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Distant Hills */}
            <path d="M0,180 Q360,110 720,150 T1440,130 L1440,380 L0,380 Z" fill="url(#opt2HillFar)" />
            {/* Middle Farmlands */}
            <path d="M0,230 Q450,170 900,210 T1440,190 L1440,380 L0,380 Z" fill="url(#opt2HillMid)" />
            {/* Terrace Contours */}
            <path
              d="M0,270 Q400,220 800,260 T1440,240"
              stroke="#D99A32"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              fill="none"
              opacity="0.7"
            />
            {/* Foreground Fields */}
            <path d="M0,300 Q480,250 960,280 T1440,270 L1440,380 L0,380 Z" fill="url(#opt2FieldFore)" />
          </svg>

          {/* Floating Golden Dust Particles */}
          {!shouldReduceMotion &&
            particles.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ y: '100%', opacity: 0 }}
                animate={{
                  y: '-20%',
                  opacity: [0, 0.8, 0.8, 0],
                  x: [0, (idx % 2 === 0 ? 30 : -30), 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute rounded-full bg-amber-400 shadow-sm shadow-amber-300"
                style={{
                  left: `${p.startX}%`,
                  bottom: '10%',
                  width: p.size,
                  height: p.size,
                }}
              />
            ))}

          <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-transparent to-transparent" />
        </motion.div>
      )}

      {/* =========================================================================
          OPTION 3: Deep Emerald Topographic Contours (Modern Agritech / Stripe-Style)
         ========================================================================= */}
      {option === 'option3' && (
        <motion.div
          key="option3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0B2117] via-[#103022] to-[#1B4B36] text-white"
        >
          {/* Luminous Agritech Radial Glows */}
          <div className="absolute top-10 left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="absolute bottom-10 right-[15%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[130px]" />

          {/* Topographic Contour Lines SVG Canvas */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" stroke="#68C791" strokeWidth="1.2" strokeOpacity="0.5">
              <path d="M-100,200 C300,100 600,350 1000,220 C1200,160 1400,250 1600,200" />
              <path d="M-100,260 C320,160 620,400 1020,280 C1220,220 1420,310 1600,260" stroke="#E2A94C" strokeOpacity="0.4" />
              <path d="M-100,330 C340,230 640,460 1040,340 C1240,280 1440,370 1600,330" />
              <path d="M-100,410 C360,310 660,530 1060,410 C1260,350 1460,440 1600,410" stroke="#E2A94C" strokeOpacity="0.5" />
              <path d="M-100,500 C380,400 680,610 1080,490 C1280,430 1480,520 1600,500" strokeWidth="1.5" />
              <path d="M-100,600 C400,500 700,700 1100,580 C1300,520 1500,610 1600,600" stroke="#E2A94C" strokeOpacity="0.6" strokeDasharray="6 4" />
              <path d="M-100,710 C420,610 720,800 1120,680 C1320,620 1520,710 1600,710" />
            </g>
          </svg>

          {/* Frosted Layer to keep page text crisp */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2117]/90 via-[#0B2117]/80 to-[#103022]/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-transparent to-transparent" />
        </motion.div>
      )}

      {/* =========================================================================
          OPTION 4: Living Liquid Mesh & Organic Aurora (Apple-Style Living Glass)
         ========================================================================= */}
      {option === 'option4' && (
        <motion.div
          key="option4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full bg-[#F4F8F4] overflow-hidden"
        >
          {/* Animated Liquid Mesh Orbs */}
          {!shouldReduceMotion ? (
            <>
              <motion.div
                animate={{
                  x: [0, 60, -40, 0],
                  y: [0, -40, 50, 0],
                  scale: [1, 1.15, 0.95, 1],
                }}
                transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
                className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-forest-sage/50 via-forest/20 to-transparent blur-[90px]"
              />
              <motion.div
                animate={{
                  x: [0, -70, 50, 0],
                  y: [0, 60, -30, 0],
                  scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ repeat: Infinity, duration: 22, ease: 'easeInOut' }}
                className="absolute top-1/4 -right-20 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-accent-amberLight/70 via-accent-amber/20 to-transparent blur-[100px]"
              />
              <motion.div
                animate={{
                  x: [0, 40, -50, 0],
                  y: [0, -50, 40, 0],
                }}
                transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
                className="absolute -bottom-20 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-forest-fresh/25 via-emerald-200/30 to-transparent blur-[90px]"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-forest-lightSage via-white to-amber-50/50" />
          )}

          {/* Organic Noise Texture Overlay */}
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-transparent to-transparent" />
        </motion.div>
      )}
    </div>
  );
};
