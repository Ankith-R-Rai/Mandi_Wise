# Phase 3: UI Foundation & Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete MandiWise visual foundation, reusable atomic component library, motion system, and cinematic image-led Karnataka countryside landing page hero.

**Architecture:** Tailwind CSS token system and CSS variables define the nature-inspired palette and typography; modular React + TypeScript UI primitives in `components/ui/` provide accessible inputs, surfaces, and tables; `motion/react` provides physics-based springs and reduced-motion compliant transitions; and a multi-layered SVG Karnataka landscape hero anchors the landing page with ambient environmental motion and live APMC price ribbons.

**Tech Stack:** React 18, TypeScript 5.6, Vite 6, Tailwind CSS 3.4, Lucide React 0.468, Motion for React 11.14.

**Spec:** [Project_Tracking/specs/2026-11-15-phase-3-ui-foundation-design.md](../specs/2026-11-15-phase-3-ui-foundation-design.md)

## Global Constraints

- Palette: Forest Green `#1F5138`, Deep Green `#163D2B`, Fresh Green `#3D8055`, Sage Green `#DCE9DD`, Light Sage `#EFF5EF`, Off-white `#F8FAF7`, White `#FFFFFF`, Charcoal `#26312B`, Dark Charcoal `#18231D`, Light Grey `#E8ECE8`, Medium Grey `#87918A`, Amber Accent `#D97706`.
- Typography: Inter (primary latin) + Noto Sans Kannada (Kannada headings/regional text).
- Pricing unit standard: Always display as `₹X,XXX / quintal` with observation date and verified source attribution.
- Freshness tiers: Fresh ($\le 7$d) in Green, Acceptable ($8-30$d) in Amber, Stale ($> 30$d) in Muted Grey.
- Motion: Must respect `prefers-reduced-motion` with instant fallbacks.
- Zero extra heavy external libraries (no heavy 3D WebGL scenes).

## Review Focus

1. Mobile responsiveness down to 375px: ensuring no horizontal overflow or clipped text in the hero and tables.
2. Reduced-motion compliance: testing that setting `prefers-reduced-motion: reduce` prevents leaf floating and transitions.
3. Accessible focus-visible states: ensuring interactive buttons, inputs, tabs, and modals have clear focus rings.
4. Color contrast compliance: ensuring text on Forest Green and Sage surfaces passes WCAG AA standards.
5. Numerical data precision: formatting all rupee amounts using Indian numbering formatting (`en-IN`).

---

### Task 1: Design Tokens, Typography, and Motion Foundation

**Files:**
- Create: `frontend/src/utils/cn.ts`
- Create: `frontend/src/styles/tokens.ts`
- Create: `frontend/src/styles/motion.ts`
- Create: `frontend/src/utils/cn.test.mjs`
- Modify: `frontend/src/index.css`

**Interfaces:**
- Produces:
  - `cn(...classes: (string | boolean | undefined | null)[]): string`
  - `tokens`: Color palette, radii, elevations, and typography font stack constants
  - `motion`: `springTransition`, `fadeTransition`, `staggerContainer`, `cardHoverVariants`, `leafVariants`

- [ ] **Step 1: Write failing test for `cn` class utility**

```javascript
// frontend/src/utils/cn.test.mjs
import assert from 'node:assert/strict';
import { cn } from './cn.js';

assert.equal(cn('px-4', 'py-2', false && 'hidden', true && 'text-forest'), 'px-4 py-2 text-forest');
assert.equal(cn('base', undefined, null, 'active'), 'base active');
console.log('PASS: cn utility test');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node frontend/src/utils/cn.test.mjs`
Expected: FAIL with "Cannot find module './cn.js'"

- [ ] **Step 3: Implement `cn.ts`, `tokens.ts`, and `motion.ts`**

Implement zero-dependency conditional class merger `cn(...)` in `frontend/src/utils/cn.ts`.  
Define design tokens in `frontend/src/styles/tokens.ts`.  
Configure Framer Motion curves, springs, and reduced-motion fallback variants in `frontend/src/styles/motion.ts`.  
Update `frontend/src/index.css` with smooth scrolling and custom scrollbar styling in forest green.

- [ ] **Step 4: Verify test and TypeScript build pass**

Run: `cd frontend; npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/utils frontend/src/styles frontend/src/index.css
git commit -m "feat(phase-3): add design tokens, motion foundation, and cn utility"
```

---

### Task 2: Core Form & Interaction Primitives (`Button`, `Input`, `Select`, `Badge`, `Tooltip`)

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`
- Create: `frontend/src/components/ui/Input.tsx`
- Create: `frontend/src/components/ui/Select.tsx`
- Create: `frontend/src/components/ui/Badge.tsx`
- Create: `frontend/src/components/ui/Tooltip.tsx`

**Interfaces:**
- Consumes: `cn` from `frontend/src/utils/cn`, `tokens` from `frontend/src/styles/tokens`, `motion`
- Produces:
  - `<Button variant="primary"|"secondary"|"outline"|"ghost"|"danger" size="sm"|"md"|"lg" isLoading? disabled?>`
  - `<Input label? error? helperText? leftIcon? rightIcon? ...>`
  - `<Select label? error? options=[{label, value}] ...>`
  - `<Badge variant="success"|"warning"|"error"|"info"|"neutral"|"fresh"|"acceptable"|"stale">`
  - `<Tooltip text position="top"|"bottom"|"left"|"right">`

- [ ] **Step 1: Write failing test / type check for Button and Input components**

Create test file or verify with `tsc --noEmit` before implementation.
Run: `cd frontend; npx tsc --noEmit`
Expected: FAIL if imports from non-existent components are referenced.

- [ ] **Step 2: Implement UI form primitives**

Implement `Button.tsx` with tap spring animation using `motion/react`, accessible focus-visible ring (`focus-visible:ring-2 focus-visible:ring-forest`), and loading spinner state.  
Implement `Input.tsx` and `Select.tsx` with floating or clean top label, helper text, and error states.  
Implement `Badge.tsx` supporting semantic states and agricultural freshness tiers (Fresh, Acceptable, Stale).  
Implement `Tooltip.tsx` with hover fade animation.

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd frontend; npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ui/Button.tsx frontend/src/components/ui/Input.tsx frontend/src/components/ui/Select.tsx frontend/src/components/ui/Badge.tsx frontend/src/components/ui/Tooltip.tsx
git commit -m "feat(phase-3): implement core form and interaction UI primitives"
```

---

### Task 3: Layout, Surface & Data Presentation Primitives (`Card`, `Table`, `Tabs`, `Modal`, `Skeleton`, `EmptyState`)

**Files:**
- Create: `frontend/src/components/ui/Card.tsx`
- Create: `frontend/src/components/ui/Table.tsx`
- Create: `frontend/src/components/ui/Tabs.tsx`
- Create: `frontend/src/components/ui/Modal.tsx`
- Create: `frontend/src/components/ui/Skeleton.tsx`
- Create: `frontend/src/components/ui/EmptyState.tsx`

**Interfaces:**
- Consumes: `cn`, `Button`, `Badge`, `motion`
- Produces:
  - `<Card hoverLift?>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`
  - `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableHead>`, `<TableCell>`
  - `<Tabs tabs=[{id, label, icon?}] activeTab onTabChange>`
  - `<Modal isOpen onClose title? description?>`
  - `<Skeleton className variant="text"|"card"|"circle">`
  - `<EmptyState icon? title description action?>`

- [ ] **Step 1: Write failing type check / import validation**

Run: `cd frontend; npx tsc --noEmit`
Expected: PASS once files are created.

- [ ] **Step 2: Implement surface and presentation primitives**

Implement `Card.tsx` with nature surface styling, subtle `#E8ECE8` border, and optional Framer Motion hover elevation.  
Implement `Table.tsx` with Stripe-grade typography, tabular numerals, clean padding, and row hover transitions.  
Implement `Tabs.tsx` with animated active pill indicator using `motion.div layoutId`.  
Implement `Modal.tsx` with backdrop blur, focus trap, escape key listener, and scale-in spring animation.  
Implement `Skeleton.tsx` with shimmer pulse animation for loading states.  
Implement `EmptyState.tsx` with custom agricultural SVG icon, title, description, and action button.

- [ ] **Step 3: Run TypeScript type check**

Run: `cd frontend; npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ui/Card.tsx frontend/src/components/ui/Table.tsx frontend/src/components/ui/Tabs.tsx frontend/src/components/ui/Modal.tsx frontend/src/components/ui/Skeleton.tsx frontend/src/components/ui/EmptyState.tsx
git commit -m "feat(phase-3): implement surface, table, modal, and skeleton UI primitives"
```

---

### Task 4: Hero Layered Countryside Vector Illustration & Live APMC Price Ticker

**Files:**
- Create: `frontend/src/components/hero/HeroIllustration.tsx`
- Create: `frontend/src/components/hero/MarketPriceTicker.tsx`

**Interfaces:**
- Consumes: `motion/react`, `Badge`, Phase 2 canonical data (`Tomato`, `Onion`, `Potato` across Kolar, Bengaluru, Hubli, Belagavi, Mysuru, Davanagere)
- Produces:
  - `<HeroIllustration className? reducedMotion?>`
  - `<MarketPriceTicker records? onSelectMarket?>`

- [ ] **Step 1: Verify canonical dataset availability**

Check: `data/canonical_karnataka_mandi_data.json` exists.

- [ ] **Step 2: Implement `HeroIllustration.tsx`**

Author layered SVG landscape capturing early morning Karnataka countryside:
- Sky gradient (`#E8F0EA` to `#B7D3BC`) with morning sunlight rays.
- Distant Western Ghats / Deccan hills with subtle parallax depth.
- Stepped green terrace fields with agricultural pathways.
- Iconic Karnataka banyan / neem tree silhouette.
- Ambient falling leaves animated with continuous Framer Motion loop (respecting reduced-motion).

- [ ] **Step 3: Implement `MarketPriceTicker.tsx`**

Implement horizontal auto-scrolling ribbon displaying live benchmarks from canonical Karnataka data with freshness badges (`FRESH`, `ACCEPTABLE`), formatted rupee amounts, and market names.

- [ ] **Step 4: Verify TypeScript build**

Run: `cd frontend; npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/hero
git commit -m "feat(phase-3): implement layered Karnataka hero illustration and market price ticker"
```

---

### Task 5: Navigation Header, Footer & Landing Page Integration with Live Component Showcase

**Files:**
- Create: `frontend/src/components/layout/Navbar.tsx`
- Create: `frontend/src/components/layout/Footer.tsx`
- Create: `frontend/src/pages/LandingPage.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Consumes: All UI components from Task 2 & 3, HeroIllustration, MarketPriceTicker, Navbar, Footer
- Produces: Full interactive landing page with hero, net earnings formula breakdown, market benchmark table, interactive component showcase, and footer.

- [ ] **Step 1: Implement `Navbar.tsx` and `Footer.tsx`**

Build responsive navigation header with MandiWise logo, navigation links ("Market Prices", "Find Best Mandi", "Price Trends", "Design System"), Kannada language toggle badge, and CTA buttons.  
Build footer with quick links, agricultural data attribution (AGMARKNET & data.gov.in), and copyright notice.

- [ ] **Step 2: Implement `LandingPage.tsx`**

Assemble the complete public landing page:
1. Hero section with headline *"Make every harvest count."*, supporting copy, dual CTAs ("Find Best Mandi", "Explore Market Prices"), HeroIllustration, and MarketPriceTicker.
2. Net Earnings Formula section explaining $\text{Gross Revenue} - \text{Transport} = \text{Net Earnings}$ with visual comparison cards.
3. Market Benchmark Table displaying canonical prices for Tomato, Onion, and Potato across Kolar, Bengaluru, Hubli, Belagavi, Mysuru, and Davanagere with search & filter controls.
4. Interactive Design System Showcase allowing users to test all buttons, input fields, open modals, switch tabs, and trigger loading skeletons.
5. Trust & Transparency section emphasizing verified observation dates and zero price fabrication.

- [ ] **Step 3: Connect `LandingPage` in `App.tsx`**

Mount `LandingPage` inside `frontend/src/App.tsx`.

- [ ] **Step 4: Verify full frontend build**

Run: `cd frontend; npm run build`
Expected: `built in Xs` with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/layout frontend/src/pages frontend/src/App.tsx
git commit -m "feat(phase-3): integrate landing page with hero, benchmark table, and interactive UI showcase"
```

---

### Task 6: Comprehensive Verification, Testing & Phase Documentation

**Files:**
- Test: Full repository build and tests (`npm run build`, `pytest tests`, `mvnw test`)
- Update: `Project_Tracking/DEVELOPMENT_LOG.md`
- Update: `Project_Tracking/FEATURE_TRACKER.md`
- Update: `Project_Tracking/MANDIWISE_CONTEXT.md`

- [ ] **Step 1: Run Frontend Build Verification**

Run: `cd frontend; npm run build`
Expected: PASS with 0 errors.

- [ ] **Step 2: Run Python Microservice Test Verification**

Run: `python-service\venv\Scripts\pytest.exe python-service\tests`
Expected: 16 passed.

- [ ] **Step 3: Run Backend Maven Test Verification**

Run: `cd backend; .\mvnw.cmd test-compile surefire:test`
Expected: `BUILD SUCCESS` (2 passed).

- [ ] **Step 4: Update Documentation**

Record Phase 3 completion, architectural decisions, and verification logs in `Project_Tracking/DEVELOPMENT_LOG.md`, `Project_Tracking/FEATURE_TRACKER.md`, and `Project_Tracking/MANDIWISE_CONTEXT.md`.

- [ ] **Step 5: Commit**

```bash
git add Project_Tracking/
git commit -m "docs(phase-3): record UI foundation and design system completion and verification logs"
```
