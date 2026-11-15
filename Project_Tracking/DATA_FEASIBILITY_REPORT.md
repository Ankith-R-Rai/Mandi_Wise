# MandiWise — Agricultural Market Data Feasibility & Research Report (Phase 2)

**Document Version:** 1.0.0  
**Phase:** Phase 2 – Data Feasibility and Research  
**Date:** November 15, 2026  
**Status:** Complete & Verified  

---

## 1. Executive Summary

A core architectural axiom of MandiWise is that **recommendations and net earnings calculations depend entirely on trustworthy, verifiable agricultural market data**. A decision-support platform that estimates net earnings using inaccurate, hallucinated, or unverified market prices risks misleading farmers and eroding trust.

In Phase 2, we conducted empirical data feasibility research on official Indian agricultural market datasets, established the data scope for Karnataka, defined strict normalization and validation rules, created an automated cleaning engine in the Python service using Test-Driven Development (TDD), and generated a verified canonical baseline dataset for Karnataka APMCs.

---

## 2. Data Sources Evaluated

### 2.1 AGMARKNET (Agricultural Marketing Information Network)
- **Governing Body:** Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare, Government of India.
- **Coverage:** Primary reporting network for Agricultural Produce Market Committees (APMCs) across Karnataka and India.
- **Access Protocols:** Daily web reports, XML bulletins, and periodic bulk releases.
- **Data Attributes Reported:**
  - `State`, `District`, `Market` (APMC name)
  - `Commodity`, `Variety`, `Arrival_Date`
  - `Min_x0020_Price`, `Max_x0020_Price`, `Modal_x0020_Price`
  - Reported Unit: Typically Rs/Quintal (1 Quintal = 100 kg)
- **Strengths:** Official legal record of mandi arrivals and transactions.
- **Observed Data Challenges:**
  - Inconsistent market and commodity naming (e.g., "Bangalore", "Bangalore (Yeshvantpur)", "Bengaluru").
  - Variable reporting cadence (Sundays, APMC holidays, and strikes produce observation gaps).
  - Occasional data entry inversions where modal price is recorded outside the min-max range or zero prices are entered.

### 2.2 Open Government Data Platform (data.gov.in)
- **API Endpoint:** Real-time / Daily Mandi Price API feeds mirroring AGMARKNET submissions.
- **Update Frequency:** Daily batches (typically posted between 18:00 and 22:00 IST for that day's trades).
- **Latency:** 12 to 24-hour reporting lag is standard across APMC networks; real-time intra-day trading tick data is not officially available from mandis.
- **MandiWise Architectural Ruling:** MandiWise displays prices with explicit **Observation Dates** and **Traceable Sources**. The platform will never claim data is "live" or real-time when it reflects end-of-day market arrivals.

---

## 3. Initial Scope Selection

### 3.1 Target Commodities
Based on trade volume, farmer participation, economic importance in Karnataka, and reporting consistency across APMCs, three initial commodities were selected for the MVP baseline:

| Commodity | Scientific / Common Varieties | Economic Relevance in Karnataka | Volatility Profile |
|:---|:---|:---|:---|
| **Tomato** | Hybrid, Local, Desi | Major cash crop in South/Eastern Karnataka (Kolar, Chikkaballapur, Bengaluru Rural). High perishability makes transport decisions critical. | High (seasonal gluts and price spikes) |
| **Onion** | Red, Local, Bellary | Staple crop grown in North and Central Karnataka (Hubballi, Bagalkot, Gadag, Chitradurga). High volume traded across APMC networks. | Moderate to High |
| **Potato** | Jyoti, Local, Kufri | Grown in Hassan, Belagavi, and Kolar; traded regionally with significant storage and transit cost considerations. | Moderate |

### 3.2 Target Karnataka APMC Markets
To ensure representative geographic and logistical diversity across Karnataka, six APMC markets spanning southern, central, northern, and consumption centers were selected:

| Market (Canonical Name) | Raw Aliases Mapped | District | Zone / Agricultural Context |
|:---|:---|:---|:---|
| **Kolar** | Kolar | Kolar | South-Eastern Karnataka. Largest tomato trading hub in Asia; crucial for farm-gate price benchmarks. |
| **Bengaluru (Yeshwanthpur)** | Bangalore, Bangalore (Yeshvantpur), Yeshwanthpur | Bengaluru Urban | Primary urban consumption terminal in Karnataka. Typically offers higher modal prices but entails higher transit and unloading expenses. |
| **Hubli (Amaragol)** | Hubli, Hubballi, Amaragol, Hubli (Amaragol) | Dharwad | North Karnataka regional trading hub for onions, pulses, and potatoes. |
| **Belagavi** | Belgaum, Belagavi | Belagavi | North-Western border trade hub linking Karnataka, Maharashtra, and Goa. |
| **Mysuru (Bandipalya)** | Mysore, Mysuru, Mysore (Bandipalya), Bandipalya | Mysuru | Southern Karnataka wholesale distribution center. |
| **Davanagere** | Davangere, Davanagere | Davanagere | Central Karnataka agricultural transit and marketing junction. |

---

## 4. Normalization & Validation Standards

The `MarketDataCleaner` engine enforces the following non-negotiable validation constraints:

1. **State Restriction:**
   - Must match `Karnataka` (case-insensitive). Non-Karnataka records are flagged and partitioned into rejected records.
2. **Canonical Price Unit:**
   - The universal internal unit is **`INR_PER_QUINTAL`** ($1\text{ Quintal} = 100\text{ kg}$).
   - Any raw record reported in $\text{Rs/Kg}$ or $\text{INR/Kg}$ is automatically converted by multiplying by 100.0.
3. **Price Order Consistency:**
   - $\text{Min Price} > 0$, $\text{Max Price} > 0$, $\text{Modal Price} > 0$.
   - Must satisfy: $\text{Min Price} \le \text{Modal Price} \le \text{Max Price}$.
   - Records with inverted prices (e.g. Min > Modal or Modal > Max) are marked invalid with descriptive validation notes.
4. **Observation Date Standardization:**
   - Parses formats `DD/MM/YYYY`, `YYYY-MM-DD`, `DD-Mon-YYYY`, `DD-MM-YYYY`.
   - Standardizes output to ISO-8601 `YYYY-MM-DD`.
5. **No Synthetic Imputation:**
   - Missing prices or corrupt records are never fabricated or silently zeroed out. They are flagged with clear validation diagnostics.

---

## 5. Data Freshness & Eligibility Policy

To protect farmers from outdated decisions while accounting for APMC weekend closures and reporting lags, MandiWise defines a three-tier freshness policy:

```
Observation Age = Current Reference Date - Observation Date
```

| Tier | Age Range | Eligibility for Recommendation Ranking | UI Advisory Notice |
|:---|:---|:---|:---|
| **FRESH** | $\le 7$ days | **Fully Eligible** — Used directly in market comparison and net earnings calculations. | Green indicator; verified recent trade price. |
| **ACCEPTABLE** | $8 - 30$ days | **Eligible with Caution** — Permitted if no fresh data is available for that market/commodity pair. | Amber advisory pill: "Notice: Prices are from X days ago. Verify locally before dispatch." |
| **STALE** | $> 30$ days | **Excluded from Recommendations** — Excluded from ranking algorithms; visible only in historical trend graphs. | Gray badge: "Archived historical record; not active for trade decisions." |

---

## 6. Implementation & Test Verification

### 6.1 Python Cleaning Pipeline
- **Module:** `python-service/app/services/data_cleaner.py`
- **Schemas:** `python-service/app/schemas/market_data.py` (`PriceRecord`, `CleanedDatasetResult`, `FreshnessStatus`)
- **API Router:** `python-service/app/api/data_routes.py` (`POST /api/v1/data/clean`, `GET /api/v1/data/canonical`, `GET /api/v1/data/canonical/summary`)

### 6.2 Test-Driven Development (TDD) Verification
The implementation strictly followed TDD Red-Green-Refactor cycles:
1. **Red Phase:** Comprehensive unit tests in `test_data_cleaner.py` and API tests in `test_api_data.py` were written first, executed, and confirmed failing.
2. **Green Phase:** The cleaner and FastAPI routes were implemented, resulting in 100% test passage.
3. **Refactor Phase:** Edge cases (empty payloads, corrupted strings like `"N/A"`, invalid date strings) were added and verified.
4. **Final Python Suite:** **16 passed in 1.16s** with 0 errors.

### 6.3 Canonical Dataset Generated
- **Raw Sample File:** `data/raw_karnataka_mandi_sample.json` (18 records)
- **Canonical Output File:** `data/canonical_karnataka_mandi_data.json` (18 verified records)
- **Breakdown:**
  - 15 Fresh records ($\le 7$ days)
  - 2 Acceptable records ($8 - 30$ days)
  - 1 Stale historical benchmark record ($> 30$ days)
  - 100% compliance with `INR_PER_QUINTAL` and Karnataka geographic boundary constraints.

---

## 7. Phase 2 Completion Checklist & Gate Sign-off

- [x] Official data sources (AGMARKNET & data.gov.in) investigated and documented.
- [x] Three target commodities selected: Tomato, Onion, Potato.
- [x] Six Karnataka APMC markets selected covering diverse logistical corridors.
- [x] Canonical price unit `INR_PER_QUINTAL` established.
- [x] Data freshness policy defined (Fresh $\le 7$d, Acceptable $8-30$d, Stale $>30$d).
- [x] Automated data cleaner and normalization engine built and verified via TDD.
- [x] Canonical verified dataset generated in `data/canonical_karnataka_mandi_data.json`.
- [x] Python test suite passing (16/16 tests).
- [x] Ready to proceed to **Phase 3: UI Foundation and Design System**.
