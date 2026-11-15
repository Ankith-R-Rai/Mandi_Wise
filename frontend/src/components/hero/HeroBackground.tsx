import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Organic Leaf SVG Component with realistic leaf shape and veins
const LeafSvg: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg viewBox="0 0 32 32" className={className || 'w-full h-full'} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 2 C24 7 28 17 21 26 C13 29 6 22 4 14 C10 12 14 8 16 2 Z"
      fill={color}
    />
    <path d="M16 4 Q14 15 8 25" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 12 Q18 10 21 11" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M12 17 Q17 16 19 18" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

export const HeroBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // 16 Falling Leaves that blow from the tree's canopy and drift across the sky
  const leaves = [
    { id: 1, startX: 78, startY: 18, size: 24, duration: 10, delay: 0, color: '#34D399', sway: -180 },
    { id: 2, startX: 82, startY: 22, size: 28, duration: 12, delay: 2, color: '#F59E0B', sway: -220 },
    { id: 3, startX: 74, startY: 15, size: 20, duration: 9, delay: 1, color: '#10B981', sway: -160 },
    { id: 4, startX: 86, startY: 25, size: 26, duration: 13, delay: 3.5, color: '#FBBF24', sway: -250 },
    { id: 5, startX: 79, startY: 28, size: 22, duration: 11, delay: 0.5, color: '#6EE7B7', sway: -200 },
    { id: 6, startX: 85, startY: 19, size: 30, duration: 14, delay: 4, color: '#D97706', sway: -270 },
    { id: 7, startX: 72, startY: 24, size: 18, duration: 8.5, delay: 1.8, color: '#059669', sway: -150 },
    { id: 8, startX: 88, startY: 30, size: 26, duration: 12.5, delay: 5, color: '#FBBF24', sway: -240 },
    { id: 9, startX: 76, startY: 16, size: 22, duration: 10.5, delay: 2.8, color: '#34D399', sway: -190 },
    { id: 10, startX: 83, startY: 26, size: 25, duration: 11.5, delay: 4.2, color: '#F59E0B', sway: -210 },
    { id: 11, startX: 90, startY: 21, size: 20, duration: 13.5, delay: 0.8, color: '#10B981', sway: -260 },
    { id: 12, startX: 75, startY: 32, size: 22, duration: 10, delay: 6, color: '#D97706', sway: -170 },
    { id: 13, startX: 80, startY: 20, size: 28, duration: 12, delay: 3, color: '#34D399', sway: -230 },
    { id: 14, startX: 87, startY: 27, size: 24, duration: 11, delay: 5.5, color: '#6EE7B7', sway: -240 },
    { id: 15, startX: 70, startY: 20, size: 18, duration: 9.5, delay: 7, color: '#4ADE80', sway: -140 },
    { id: 16, startX: 84, startY: 14, size: 24, duration: 13, delay: 6.5, color: '#F59E0B', sway: -220 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* Base Western Ghats Landscape Gradient */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0F3523] via-[#1A5035] to-[#2B7750]" />

      {/* High-Resolution Landscape Photo Layer (Ghats & Misty Terraces) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-65 mix-blend-screen"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2600&q=85')`,
        }}
      />

      {/* Majestic Mountain Ridges & Agricultural Terraces SVG Canvas */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skySunriseGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#34D399" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#065F46" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="mountainRidgeFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#255A41" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#133E2B" stopOpacity="0.98" />
          </linearGradient>

          <linearGradient id="terraceSlopeMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#357D58" />
            <stop offset="100%" stopColor="#15422D" />
          </linearGradient>

          <linearGradient id="foregroundTerrace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A9C6F" />
            <stop offset="100%" stopColor="#081F15" />
          </linearGradient>

          {/* Tree Shading Gradients */}
          <linearGradient id="treeTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F241A" />
            <stop offset="50%" stopColor="#1A3B2B" />
            <stop offset="100%" stopColor="#091A12" />
          </linearGradient>

          <linearGradient id="treeCanopyGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          <linearGradient id="treeCanopyGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#042F2C" />
          </linearGradient>
        </defs>

        {/* Morning Sun Ray Burst on Horizon */}
        <circle cx="1120" cy="160" r="380" fill="url(#skySunriseGlow)" />

        {/* Distant Ghat Mountain Ridges */}
        <path d="M0,320 Q280,160 560,250 T1120,210 T1440,270 L1440,900 L0,900 Z" fill="url(#mountainRidgeFar)" />

        {/* Middle Terraced Foothills */}
        <path d="M0,450 Q360,340 760,410 T1440,370 L1440,900 L0,900 Z" fill="url(#terraceSlopeMid)" />

        {/* Glowing Agricultural Contour Terrace Lines */}
        <path d="M0,520 Q400,440 850,500 T1440,460" stroke="#86EFAC" strokeWidth="3" fill="none" opacity="0.75" strokeDasharray="10 8" />
        <path d="M0,600 Q450,530 920,580 T1440,540" stroke="#FBBF24" strokeWidth="2.5" fill="none" opacity="0.65" strokeDasharray="8 6" />

        {/* Foreground Agricultural Fields */}
        <path d="M0,640 Q420,580 880,640 T1440,600 L1440,900 L0,900 Z" fill="url(#foregroundTerrace)" opacity="0.95" />

        {/* =====================================================================
            MAJESTIC COUNTRYSIDE TREE (Banyan / Neem Tree on the Hillside)
           ===================================================================== */}
        <g id="karnatakaCountrysideTree" className="drop-shadow-2xl">
          {/* Main Tree Trunk & Thick Knotted Roots */}
          <path
            d="M 1180,680 
               Q 1175,560 1170,440 
               Q 1165,360 1150,300 
               Q 1140,260 1130,220
               L 1145,220
               Q 1160,260 1175,320
               Q 1190,390 1200,480
               Q 1210,580 1230,680
               Z"
            fill="url(#treeTrunkGrad)"
          />
          {/* Left Branch Spanning Across */}
          <path
            d="M 1165,340 
               Q 1110,310 1060,280 
               Q 1020,260 980,250
               L 985,242
               Q 1030,252 1075,272
               Q 1120,295 1168,328
               Z"
            fill="url(#treeTrunkGrad)"
          />
          {/* Right Branch Spanning Out */}
          <path
            d="M 1185,350 
               Q 1240,310 1290,270 
               Q 1330,240 1370,220
               L 1375,228
               Q 1332,248 1285,282
               Q 1235,320 1180,360
               Z"
            fill="url(#treeTrunkGrad)"
          />
          {/* Center Upward Branches */}
          <path
            d="M 1145,230 Q 1125,180 1105,140 L 1115,138 Q 1133,175 1152,222 Z"
            fill="url(#treeTrunkGrad)"
          />
          <path
            d="M 1160,240 Q 1190,190 1220,150 L 1228,155 Q 1198,198 1168,245 Z"
            fill="url(#treeTrunkGrad)"
          />

          {/* Lush Layered Foliage Canopy Clusters */}
          {/* Back Deep Canopy Layers */}
          <circle cx="1020" cy="240" r="95" fill="#0D3B26" opacity="0.9" />
          <circle cx="1120" cy="180" r="110" fill="#0D3B26" opacity="0.95" />
          <circle cx="1240" cy="200" r="105" fill="#0F422C" opacity="0.9" />
          <circle cx="1320" cy="240" r="90" fill="#0B3320" opacity="0.9" />

          {/* Middle Lush Emerald Canopy Clusters */}
          <circle cx="980" cy="220" r="80" fill="url(#treeCanopyGrad2)" opacity="0.92" />
          <circle cx="1070" cy="160" r="100" fill="url(#treeCanopyGrad2)" opacity="0.95" />
          <circle cx="1180" cy="140" r="115" fill="url(#treeCanopyGrad1)" opacity="0.96" />
          <circle cx="1280" cy="170" r="95" fill="url(#treeCanopyGrad2)" opacity="0.94" />
          <circle cx="1350" cy="220" r="75" fill="url(#treeCanopyGrad1)" opacity="0.92" />

          {/* Foreground Sunlit Leaves Highlights */}
          <circle cx="1030" cy="190" r="65" fill="#22C55E" opacity="0.45" />
          <circle cx="1140" cy="130" r="75" fill="#4ADE80" opacity="0.4" />
          <circle cx="1220" cy="140" r="70" fill="#34D399" opacity="0.45" />
          <circle cx="1300" cy="180" r="60" fill="#22C55E" opacity="0.35" />
        </g>
      </svg>

      {/* Atmospheric Morning Mist Band across the valley */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ x: ['-8%', '8%', '-8%'] }}
          transition={{ repeat: Infinity, duration: 24, ease: 'easeInOut' }}
          className="absolute top-1/4 inset-x-0 h-44 bg-gradient-to-b from-transparent via-white/18 to-transparent blur-2xl pointer-events-none"
        />
      )}

      {/* =========================================================================
          WIND FLOW LINES & FALLING LEAVES SIMULATION
         ========================================================================= */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10">
          {/* Animated Wind Currents Sweeping from Right (Tree) to Left */}
          <svg
            className="absolute inset-0 w-full h-full opacity-45"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M1600,190 C1200,230 800,170 400,210 C200,230 0,180 -200,200"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="2"
              strokeDasharray="14 18"
              fill="none"
              animate={{ strokeDashoffset: [0, 240] }}
              transition={{ repeat: Infinity, duration: 11, ease: 'linear' }}
            />
            <motion.path
              d="M1600,310 C1300,270 900,340 500,290 C300,270 100,310 -200,280"
              stroke="rgba(245, 158, 11, 0.5)"
              strokeWidth="2.2"
              strokeDasharray="16 20"
              fill="none"
              animate={{ strokeDashoffset: [0, 260] }}
              transition={{ repeat: Infinity, duration: 13, ease: 'linear' }}
            />
            <motion.path
              d="M1600,480 C1250,520 850,440 450,500 C250,530 50,470 -200,490"
              stroke="rgba(52, 211, 153, 0.45)"
              strokeWidth="1.8"
              strokeDasharray="12 16"
              fill="none"
              animate={{ strokeDashoffset: [0, 220] }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            />
          </svg>

          {/* Leaves visibly blowing from the tree canopy across the screen */}
          {leaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              initial={{
                y: `${leaf.startY}%`,
                x: 0,
                rotateZ: 0,
                rotateX: 0,
                opacity: 0,
              }}
              animate={{
                y: [`${leaf.startY}%`, '115%'],
                x: [0, leaf.sway * 0.3, leaf.sway * 0.7, leaf.sway, leaf.sway * 1.2],
                rotateZ: [0, 180, 360, 540],
                rotateX: [0, 90, 180, 360],
                opacity: [0, 0.95, 0.95, 0],
              }}
              transition={{
                duration: leaf.duration,
                delay: leaf.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute pointer-events-none drop-shadow-md"
              style={{
                left: `${leaf.startX}%`,
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
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface-background via-surface-background/50 to-transparent z-10 pointer-events-none" />
    </div>
  );
};
