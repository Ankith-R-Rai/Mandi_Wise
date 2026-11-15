# MandiWise — Comprehensive Testing Strategy

**Document Version:** 1.0  
**Status:** Approved Quality Assurance Standard  
**Core Principle:** *Evidence before assertions always. Never assume code works simply because it compiles.*

---

## 1. Testing Philosophy & Verification Gates

In MandiWise, automated tests are not an afterthought; they are a prerequisite for phase sign-off.
Every development phase must satisfy the following cycle:
$$\text{BUILD} \longrightarrow \text{TEST} \longrightarrow \text{FIX} \longrightarrow \text{DOCUMENT} \longrightarrow \text{REPORT} \longrightarrow \text{APPROVAL}$$

### Non-Negotiable Rules
1. **Mathematical Accuracy is Paramount:** The calculation engine must be tested against independently calculated expected values with zero tolerance for floating-point inaccuracies.
2. **No Mock Data in Production Workflows:** Tests verifying production recommendation services must assert that missing data generates explicit unavailability warnings rather than silent mock data fallbacks.
3. **Continuous Verification:** Tests must be executed prior to committing code or declaring any phase complete.

---

## 2. Multi-Tier Testing Pyramid

```
                                 ▲
                                / \
                               /   \
                              / E2E \   (Critical Farmer Journeys)
                             /───────\
                            /  Integ  \  (API Endpoints + PostgreSQL)
                           /───────────\
                          /    Unit     \ (Math, Calculations, Entities)
                         /───────────────\
```

### 2.1 Backend Unit & Calculation Testing (JUnit 5 + Mockito)
* **Target Package:** `com.mandiwise.recommendation`, `com.mandiwise.transport`, `com.mandiwise.security`
* **Test Suites:**
  * `NetEarningsCalculationTest`:
    * Verify Gross Revenue: $(\text{QuantityKg} / 100) \times \text{ModalPricePerQuintal}$.
    * Verify Total Expenses: $\text{TransportCost} + \text{OtherExpenses}$.
    * Verify Net Earnings: $\text{GrossRevenue} - \text{TotalExpenses}$.
    * Verify edge cases: quantity with fractions, high distance, zero transport cost (local mandi).
  * `MarketRankingTest`:
    * Verify sorting by `estimatedNetEarnings DESC`.
    * Verify tie-breaking deterministically by `estimatedTransportCost ASC`.
    * Verify that a mandi with a higher modal price is properly ranked **lower** when its transport cost exceeds the price premium.
  * `PriceFreshnessValidationTest`:
    * Test rejection/warning for observations older than configured threshold (e.g., > 30 days).

#### Example Calculation Test Scenario:
* Commodity: Tomato
* Quantity: 2,500 kg (25 quintals)
* Mandi A (Local): Distance 10 km, Cost ₹25/km = ₹250 transport. Price ₹2,400/quintal.
  $$\text{Revenue} = 25 \times 2400 = ₹60,000 \implies \text{Net} = 60000 - 250 = ₹59,750$$
* Mandi B (Distant City): Distance 120 km, Cost ₹25/km = ₹3,000 transport. Price ₹2,500/quintal.
  $$\text{Revenue} = 25 \times 2500 = ₹62,500 \implies \text{Net} = 62500 - 3000 = ₹59,500$$
* **Expected Result:** Mandi A must be ranked #1 despite offering a ₹100 lower price per quintal.

---

### 2.2 Database Integration Testing (Flyway + PostgreSQL)
* **Tools:** Supabase PostgreSQL development instance.
* **Checks:**
  * Verify clean execution of each Flyway migration script (`V1__...`).
  * Verify foreign-key constraints (e.g., deleting a user cascades to profile; deleting a commodity is restricted if historical prices exist).
  * Verify check constraints (e.g., negative prices or negative quantities are rejected at the database level).
  * Verify unique constraints (normalized market name + district + state).

---

### 2.3 Frontend Component & Interaction Testing (Vitest + React Testing Library)
* **Target:** `frontend/src/`
* **Checks:**
  * Component rendering and accessible labels (WCAG AA).
  * Form validation with React Hook Form + Zod (e.g., zero or negative quantity triggers immediate inline error).
  * Formatting utilities (currency in ₹, metric units in kg/quintals, date localization).
  * Respect for `prefers-reduced-motion` in all Motion for React wrappers.
  * Empty, loading (skeleton), and error state presentation.

---

### 2.4 Python Processing Service Testing (Pytest)
* **Target:** `python-service/tests/`
* **Checks:**
  * Image upload format validation (reject corrupted bytes or unsupported MIME types).
  * Dataset cleaning and normalization scripts.
  * Tomato quality assessment output schema validation.

---

### 2.5 End-to-End User Journey Verification
Before final sign-off, verify the complete primary flow:
1. Register a new farmer account (`POST /api/v1/auth/register`).
2. Log in and acquire JWT token (`POST /api/v1/auth/login`).
3. Set farm location in Kolar district (`PUT /api/v1/farmers/profile`).
4. Submit recommendation request for 2,000 kg Tomatoes (`POST /api/v1/recommendations`).
5. Assert HTTP 201 response with ranked mandi list.
6. Verify calculation transparency breakdown matches mathematical formula.
7. Verify historical trend chart retrieves matching observation dates.
