# MandiWise — Phase 3: UI Foundation & Design System Specification

**Document Version:** 1.0.0  
**Status:** Under Review  
**Date:** November 15, 2026  
**Primary Platform:** Responsive Web Application (React 18 + TypeScript + Vite + Tailwind CSS)  
**Design Reference:** [UI_UX_DESIGN_BRIEF.md](../../Project_Info/ui_ux_design_brief.md)  

---

## 1. Intent & Purpose

MandiWise is an agricultural market intelligence and decision-support platform built for farmers in Karnataka, India. Its foundational axiom is that **the highest displayed mandi price does not guarantee the highest profit**; farmers must optimize for **estimated net earnings** ($\text{Gross Revenue} - \text{Total Selling Expenses}$).

To build farmer trust, the user interface must convey financial calculations with absolute clarity, calm authority, and accessibility. The visual identity avoids generic college project dashboard templates, childish cartoon farmers, or distracting stock photography. Instead, it embodies **Apple-inspired craftsmanship, Linear-grade information density, Stripe-grade tabular data presentation**, and an **original nature-inspired Karnataka visual identity**.

---

## 2. Goals, Non-Goals & Anti-Goals

### 2.1 Goals
1. **Design System & Token Architecture:** Establish tokens for color palette, typography, spacing, border radii, elevations, and focus states in Tailwind CSS and CSS variables.
2. **Reusable Atomic Component Library:** Author production-ready, accessible, reusable UI components in `frontend/src/components/ui/`:
   - `Button`: Primary, secondary, outline, ghost, danger; size variants (`sm`, `md`, `lg`); loading spinner; accessible focus-visible rings.
   - `Input`: Label, placeholder, helper text, error state, left/right icon slots.
   - `Select`: Accessible dropdown menu with consistent nature styling.
   - `Card`: Composable `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, with optional hover-lift effect.
   - `Badge`: Status badges (`success`, `warning`, `error`, `info`, `neutral`, `fresh`, `acceptable`, `stale`).
   - `Table`: Stripe-grade financial table with tabular numbers, column headers, and row hover states.
   - `Tabs`: Clean tab navigation with animated active indicator.
   - `Modal`: Accessible dialog with backdrop blur, focus management, Escape key listener, and scale-in animation.
   - `Tooltip`: Subtle hover tooltip for contextual help.
   - `Skeleton`: Shimmer pulse placeholders for cards, text lines, and tables.
   - `EmptyState`: Reusable empty state with custom agricultural SVG icon, title, description, and action button.
3. **Motion Design Foundation:** Configure `motion/react` (Framer Motion) animation variants, transition curves, and staggered entrance sequences, with strict support for `prefers-reduced-motion`.
4. **Cinematic Hero Section:** Implement an original, layered vector illustration of the Karnataka countryside (morning sky, Deccan/Western Ghats hills, agricultural terraces, distinctive banyan/neem tree, and subtle drifting leaf particles) combined with a live APMC price ticker ribbon.
5. **Interactive Landing Page & Component Showcase:** Build the public landing page with navigation header, hero, net earnings formula explanation, live market preview (using Phase 2 canonical data), feature grid, live interactive component showcase, and footer.
6. **Responsive Quality:** Ensure 60fps performance and zero layout breakage across Mobile (375px), Tablet (768px), Laptop (1024px), and Desktop (1440px+).

### 2.2 Non-Goals
- User authentication flows (JWT login/registration) — scheduled for Phase 4.
- Java Spring Boot recommendation calculation engine — scheduled for Phase 6.
- Computer vision quality assessment integration — scheduled for Phase 8.

### 2.3 Anti-Goals
- Generic SaaS templates or cartoonish agricultural clipart.
- Heavy 3D WebGL scenes that cause thermal throttling or battery drain on mobile phones.
- Intrusive animations that delay access to market prices or navigation.

---

## 3. Approaches Considered & User Selection

### Approach 1: Layered Editorial Vector Illustration + Framer Motion (SELECTED)
- **Visual Design:** Hand-crafted multi-layered SVG landscape (morning sky, rolling Western Ghats / Deccan hills, agricultural terraces, banyan tree with ambient drifting leaves).
- **Motion:** `motion/react` (Framer Motion) for smooth staggered text reveals, gentle leaf drifting, and animated price counters.
- **Performance:** Lightweight (<120 KB), instant 60fps rendering, zero GPU battery drain.
- **Selection:** Formally selected by the user in the interactive brainstorming companion.

### Approach 2: Heavy 3D WebGL / Three.js Canvas (REJECTED)
- **Trade-offs:** Adds ~1.8 MB+ to bundle size; high battery drain on rural mobile devices; risks looking like a video game rather than a financial decision tool.

### Approach 3: Minimalist CSS-Only Cards (REJECTED)
- **Trade-offs:** Lacks visual depth and fails the core requirement of `UI_UX_DESIGN_BRIEF.md`.

---

## 4. Technical Architecture & File Structure

```text
frontend/src/
├── assets/
│   └── (custom SVGs and brand assets)
├── components/
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Table.tsx
│   │   ├── Tabs.tsx
│   │   └── Tooltip.tsx
│   ├── hero/
│   │   ├── HeroIllustration.tsx
│   │   └── MarketPriceTicker.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── pages/
│   └── LandingPage.tsx
├── styles/
│   ├── motion.ts
│   └── tokens.ts
├── utils/
│   └── cn.ts
├── App.tsx
├── index.css
└── main.tsx
```

---

## 5. Component Design Specifications

### 5.1 Color Tokens & Contrast Standards
* **Brand Primary:** `#1F5138` (Forest Green), `#163D2B` (Deep Green), `#3D8055` (Fresh Green).
* **Surfaces:** `#FFFFFF` (Card White), `#F8FAF7` (Canvas Off-White), `#E8ECE8` (Subtle Border).
* **Typography:** `#26312B` (Charcoal Body), `#18231D` (Dark Charcoal Headings), `#87918A` (Muted Secondary).
* **Accents:** `#D97706` / `#D99A32` (Harvest Amber).
* **Freshness Semantics:**
  - Fresh ($\le 7$d): `#23845B` (Green Badge).
  - Acceptable ($8-30$d): `#D99A32` (Amber Badge).
  - Stale ($> 30$d): `#87918A` (Gray Badge).

### 5.2 Motion & Animation Design (`motion.ts`)
* **Spring Dynamics:** `stiffness: 400`, `damping: 30` for button tap feedback and tab selection pills.
* **Ease Curves:** `[0.16, 1, 0.3, 1]` (custom cubic bezier) for smooth entrance reveals.
* **Environmental Ambient Loop:** Leaves falling with a 12s infinite loop and subtle horizontal sway (`x: [0, 15, -15, 0]`, `y: [0, 80, 160, 240]`, `rotate: [0, 45, 90, 180]`).
* **Reduced Motion:** If `prefers-reduced-motion` is active, animations fall back to instantaneous transitions (`duration: 0.01s`).

---

## 6. Verification and Acceptance Gate

Before marking Phase 3 complete:
1. All 11 atomic UI components exist and render properly with their full variant matrices.
2. The landing page hero section displays the layered Karnataka countryside illustration with smooth environmental motion and the live market ticker.
3. Interactive component showcase allows testing button states, modal opening/closing, tab switching, and table filtering.
4. Mobile responsiveness verified across viewports (375px mobile, 768px tablet, 1280px desktop).
5. Frontend production build passes cleanly (`npm run build` with 0 TypeScript or Vite warnings/errors).
6. Full test suite passes across all repositories (Python, Java backend, and Frontend).
7. Living project documents updated in `Project_Tracking/`.
