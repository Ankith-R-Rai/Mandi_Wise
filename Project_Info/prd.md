# MandiWise

## Product Requirements Document (PRD)

**Document Version:** 1.0  
**Last Updated:** 15 November 2026  
**Project Name:** MandiWise  
**Project Type:** Agricultural Market Intelligence and Decision Support Platform  
**Initial Geographic Scope:** Karnataka, India  
**Development Status:** Planning and initial development  
**Target Users:** Farmers, agricultural producers and agricultural stakeholders

---

# 1. PRODUCT OVERVIEW

## 1.1 Introduction

MandiWise is an agricultural market intelligence and decision-support platform designed to help farmers make better-informed decisions about crop selection, harvesting, grading, transportation and selling their agricultural produce.

Farmers frequently face difficulties identifying the most profitable agricultural markets for their produce. The market offering the highest price is not necessarily the market that provides the highest actual profit.

Transportation expenses, market distance, commodity quality, demand, market price fluctuations and buyer availability all influence the final earnings of a farmer.

Additionally, farmers may lack convenient access to information about:

- Historical agricultural commodity prices.
- Current market prices across different mandis.
- Crop rotation opportunities.
- Government agricultural subsidies and schemes.
- Quality-based commodity pricing.
- Potential buyers and their locations.
- Transportation costs and expected net earnings.

MandiWise aims to bring these different sources of information together into one accessible platform.

Instead of merely displaying market prices, MandiWise will help farmers understand their available options and make informed agricultural and commercial decisions.

## 1.2 Product Vision

To develop an accessible, data-driven agricultural decision-support platform that empowers farmers to maximise their potential earnings through better market selection, agricultural insights and transparent recommendations.

## 1.3 Product Mission

MandiWise aims to:

1. Reduce information asymmetry between farmers and agricultural markets.
2. Help farmers identify profitable markets based on expected net earnings.
3. Provide reliable and understandable agricultural market information.
4. Help farmers understand how produce quality influences potential selling prices.
5. Improve awareness of relevant government agricultural schemes.
6. Help farmers discover potential buyers and nearby agricultural markets.
7. Provide personalised agricultural insights using available farm and market information.

## 1.4 Core Product Philosophy

MandiWise is not intended to be just another agricultural information dashboard.

Its primary purpose is to convert agricultural data into actionable decisions.

For example:

A conventional agricultural application might display:

- Market A: ₹2,500 per quintal.
- Market B: ₹2,300 per quintal.
- Market C: ₹2,450 per quintal.

MandiWise should go further.

It should consider:

- Distance from the farmer.
- Estimated transportation expenses.
- Expected selling price.
- Produce quality.
- Other applicable selling expenses.
- Estimated final earnings.

It should then explain which market offers the highest estimated net earnings.

The central principle is:

**The highest market price does not necessarily mean the highest profit.**

---

# 2. PROBLEM STATEMENT

## 2.1 Existing Problems

Farmers encounter several challenges while making agricultural and selling decisions.

### Problem 1: Lack of centralised market information

Market prices are available through different platforms and sources.

However, farmers may find it difficult to compare prices across multiple mandis in a convenient manner.

### Problem 2: Selecting the wrong mandi

Farmers may choose a mandi based entirely on its displayed commodity price.

A distant mandi offering a higher price may actually produce lower earnings after transportation expenses.

### Problem 3: Limited quality-based pricing awareness

Agricultural produce is not always sold at the same price regardless of its quality.

Factors such as size, appearance, defects and grading can influence the price offered by buyers.

Farmers may lack an accessible way to understand the potential relationship between produce quality and selling price.

### Problem 4: Limited agricultural planning information

Farmers may not have convenient access to personalised information about:

- Suitable crop rotation opportunities.
- Relevant agricultural subsidies.
- Government schemes.
- Agricultural planning considerations.

### Problem 5: Difficulty discovering buyers

Farmers may struggle to identify potential buyers located near their farms or along practical transportation routes.

### Problem 6: Uncertainty in agricultural decision-making

Market prices fluctuate, and historical information alone cannot guarantee future prices.

Farmers need transparent information that distinguishes actual historical prices from predictions and estimates.

---

# 3. PRODUCT OBJECTIVES

The following objectives define what MandiWise intends to achieve.

## 3.1 Primary Objectives

1. Provide access to agricultural commodity prices from supported Karnataka mandis.
2. Allow farmers to compare prices across multiple markets.
3. Calculate estimated transportation expenses.
4. Calculate estimated net earnings for different market choices.
5. Rank markets based on estimated net earnings.
6. Provide historical commodity price trends.
7. Introduce produce quality assessment through computer vision.
8. Provide quality-based estimated selling price information where reliable data is available.
9. Provide personalised agricultural insights.
10. Help farmers discover relevant buyers.

## 3.2 Secondary Objectives

1. Provide Kannada and English language support.
2. Maintain a farmer profile containing relevant agricultural information.
3. Provide information about relevant government schemes and subsidies.
4. Provide crop rotation recommendations.
5. Present agricultural information through an understandable dashboard.
6. Make agricultural market information accessible through a simple interface.

## 3.3 Success Criteria

The project will be evaluated using the following criteria:

- Accuracy and reliability of market data.
- Correctness of net earnings calculations.
- Availability of historical market information.
- Reliability of transportation estimates.
- Correct interpretation of commodity quality.
- Transparency of recommendations.
- Usability of the application.
- Successful integration between the frontend and backend.
- Successful completion of end-to-end user workflows.

No recommendation should be considered successful merely because it produces a visually attractive result.

Its underlying data and calculations must also be defensible.

---

# 4. TARGET USERS AND PERSONAS

## 4.1 Primary User: Farmer

**Description:**

An agricultural producer who wants to understand market conditions and identify better selling opportunities.

**Needs:**

- Current or latest available mandi prices.
- Market comparisons.
- Transportation cost estimates.
- Expected net earnings.
- Historical price trends.
- Produce quality information.
- Buyer discovery.
- Agricultural scheme information.

**Technical familiarity:**

The platform should not assume that every farmer is comfortable with complex digital interfaces.

The application must prioritise simplicity, clarity and accessibility.

## 4.2 Secondary User: Agricultural Producer / Farm Manager

**Description:**

An individual responsible for managing agricultural production and making decisions about crop selection, harvesting and selling.

**Needs:**

- Crop-related information.
- Market intelligence.
- Historical trends.
- Quality assessment.
- Selling recommendations.
- Agricultural planning information.

## 4.3 Administrative User

**Description:**

An authorised individual responsible for maintaining application information and managing data quality.

**Responsibilities:**

- Managing supported commodities and markets.
- Monitoring data ingestion.
- Managing buyer information.
- Maintaining government scheme information.
- Reviewing data quality.
- Managing application-level configuration.

Administrative functionality should be restricted to authorised users.

---

# 5. GEOGRAPHICAL AND FUNCTIONAL SCOPE

## 5.1 Initial Geographic Scope

MandiWise will initially focus on Karnataka.

This is a deliberate project decision.

The project prioritises reliable, manageable and verifiable data coverage over attempting to support every Indian agricultural market immediately.

Initial implementation should use a carefully selected collection of Karnataka commodities and mandis.

The exact initial coverage must be finalised after evaluating:

- Data availability.
- Historical record completeness.
- Market identification consistency.
- Commodity availability.
- Data update frequency.
- Reliability of the source.

## 5.2 Geographic Expansion

The application should be designed so that additional states and markets can be incorporated later.

However, nationwide coverage is not part of the initial implementation scope.

## 5.3 Initial Commodity Coverage

The initial implementation will focus on a limited number of agricultural commodities for which reliable market data can be obtained.

The initial data investigation should prioritise commodities with adequate historical price records.

Tomato is the initial target commodity for the computer-vision-based quality assessment feature.

Additional commodities may be supported when suitable datasets and grading information become available.

---

# 6. FUNCTIONAL REQUIREMENTS

This section defines the functional capabilities of MandiWise.

Each feature is assigned a priority.

**Priority definitions:**

- P0: Essential for the core application.
- P1: Important planned functionality.
- P2: Secondary functionality or future enhancement.

A priority indicates product importance, not implementation completion.

## 6.1 Farmer Registration and Authentication

**Priority:** P0

### Description

Farmers should be able to create accounts and securely access their personalised application dashboard.

### Functional Requirements

FR-001: Users must be able to register using the supported registration mechanism.

FR-002: Users must be able to log in securely.

FR-003: Users must be able to log out.

FR-004: Authenticated users must have access to their own profile information.

FR-005: Unauthenticated users must not be able to access protected account functionality.

FR-006: Authentication must be handled securely by the backend.

FR-007: Passwords must never be stored in plaintext.

FR-008: The application must support secure session/token handling.

### Expected Outcome

A farmer should be able to create an account and access a personalised MandiWise experience.

---

## 6.2 Farmer Profile Management

**Priority:** P0

### Description

MandiWise should maintain relevant information about the farmer and their agricultural activities.

### Profile Information

The profile may contain:

- Farmer name.
- Contact information.
- Preferred language.
- District.
- Taluk.
- Village.
- Farm location.
- Farm size.
- Primary crops.
- Agricultural interests.

Information should be collected only when required.

### Functional Requirements

FR-009: Users must be able to view their profile.

FR-010: Users must be able to update their profile.

FR-011: Users should be able to select their preferred language.

FR-012: Farm-related information should be available for relevant personalised features.

FR-013: Sensitive information must be protected.

---

## 6.3 Agricultural Market Price Information

**Priority:** P0

### Description

MandiWise must retrieve and present agricultural commodity market prices from reliable data sources.

The initial focus is on AGMARKNET and available government datasets through data.gov.in.

### Information to Display

Where available:

- Commodity name.
- State.
- District.
- Market/mandi name.
- Arrival date.
- Minimum price.
- Maximum price.
- Modal price.
- Price unit.
- Data source.
- Last updated information.

### Functional Requirements

FR-014: Users must be able to select a commodity.

FR-015: Users must be able to view available market prices.

FR-016: Users must be able to filter prices by supported geographic locations.

FR-017: Users must be able to compare prices across available mandis.

FR-018: Market information must display its relevant date.

FR-019: The system must identify the original data source.

FR-020: The system must distinguish unavailable data from zero-valued data.

FR-021: The application must not present outdated information as live market information.

FR-022: If the source provides historical records rather than real-time prices, the application must clearly communicate this distinction.

### Important Data Rule

MandiWise must not assume that an API provides real-time information.

The actual update frequency must be determined from the source.

The interface should use descriptions such as:

- Latest available market price.
- Historical market price.
- Last updated on.

The term "Live Price" must only be used when the underlying source genuinely supports live updates.

---

## 6.4 Mandi Comparison and Market Recommendation

**Priority:** P0

### Description

This is the central feature of MandiWise.

The system should help farmers identify potentially profitable markets by comparing expected net earnings rather than simply comparing displayed prices.

### User Inputs

The farmer should be able to provide:

- Commodity.
- Quantity of produce.
- Farm location or origin location.
- Relevant quality information, when available.

The system should identify supported markets using available data.

### Information Used

The recommendation engine may consider:

- Available market prices.
- Modal price.
- Transportation distance.
- Estimated transportation expenses.
- Quantity.
- Additional selling expenses, where applicable.
- Quality-based price adjustments, when supported.

### Core Calculation

**Gross Expected Revenue:**

Gross Revenue = Expected Selling Price per Unit × Quantity

**Total Selling Expenses:**

Total Expenses = Transportation Cost + Other Applicable Selling Expenses

**Estimated Net Earnings:**

Net Earnings = Gross Revenue - Total Selling Expenses

All quantities and prices must use consistent units.

For example, when market prices are provided per quintal:

1 quintal = 100 kilograms.

The calculation engine must convert quantities appropriately.

### Functional Requirements

FR-023: Users must be able to enter their produce quantity.

FR-024: Users must be able to provide their farm or origin location.

FR-025: The system must identify eligible markets with available price information.

FR-026: The system must estimate transportation expenses using the supported cost-estimation method.

FR-027: The system must calculate expected gross revenue.

FR-028: The system must calculate estimated total selling expenses.

FR-029: The system must calculate estimated net earnings.

FR-030: Markets must be ranked based on estimated net earnings.

FR-031: Users must be able to inspect the calculation behind a recommendation.

FR-032: Users must be able to compare multiple markets.

FR-033: Markets with insufficient information must not receive misleading recommendations.

FR-034: The application must communicate when a result is estimated rather than guaranteed.

### Recommendation Output

Each market result should communicate:

- Market name.
- Commodity price.
- Price date.
- Distance.
- Estimated transportation expense.
- Expected gross revenue.
- Other applicable expenses.
- Estimated net earnings.
- Recommendation ranking.
- Explanation of the recommendation.

### Important Business Rule

The market with the highest modal price must not automatically be considered the best market.

The primary ranking criterion is estimated net earnings.

---

## 6.5 Historical Price Trends

**Priority:** P0

### Description

Farmers should be able to understand how commodity prices change over time.

### Functional Requirements

FR-035: Users must be able to select a commodity.

FR-036: Users must be able to select a supported mandi.

FR-037: Users must be able to view historical price information.

FR-038: The system should provide graphical price trends.

FR-039: Users should be able to select available historical periods.

FR-040: Historical information must display the relevant dates and price units.

FR-041: Missing data points must not be treated as actual zero prices.

### Visualisation

The interface should use suitable charts to communicate:

- Price changes.
- Historical trends.
- Market comparisons.

The charts must be based on actual available records.

---

## 6.6 Produce Quality Assessment Using Computer Vision

**Priority:** P1

### Description

MandiWise will incorporate computer vision to help farmers understand the visual quality of their agricultural produce.

The initial implementation will focus on tomatoes.

The user should be able to upload or capture an image of their produce.

A computer-vision component will analyse the image and return a quality assessment.

### Intended Assessment

Depending on the availability and reliability of the model, the system may assess:

- Visible defects.
- Colour characteristics.
- Surface appearance.
- Size-related characteristics, if measurable.
- Other visually identifiable quality indicators.

### Functional Requirements

FR-042: Users must be able to upload an image.

FR-043: The system must validate supported image formats.

FR-044: The system must communicate when an image cannot be processed.

FR-045: The image must be sent to the computer-vision processing component.

FR-046: The system must return the available assessment results.

FR-047: The result must communicate the detected quality characteristics.

FR-048: The application must not claim to assess characteristics that cannot be reliably inferred from the image.

FR-049: Users must be informed that visual assessment is an aid and not an official agricultural grading certificate.

### Quality-Based Price Estimation

Where reliable grading standards and corresponding market-price information are available, MandiWise may estimate the potential selling price associated with the assessed quality.

This feature must not arbitrarily assign a premium or discount.

The estimated price must be supported by an explainable relationship between:

- Quality category.
- Applicable grading information.
- Available market data.
- Relevant pricing observations.

If reliable quality-specific pricing information is unavailable, the system should display the quality assessment without generating an unsupported price estimate.

### Initial Scope

Tomato quality assessment is the initial computer-vision target.

Support for other commodities can be introduced later.

---

## 6.7 Personalised Agricultural Insights

**Priority:** P1

### Description

MandiWise should use the farmer's profile and available agricultural information to provide relevant insights.

These insights should help farmers make better agricultural planning decisions.

### Potential Information

- Farm location.
- Farm size.
- Previously selected crops.
- Primary crops.
- Available market information.
- Relevant agricultural information.

### Functional Requirements

FR-050: The system should use available profile information to personalise relevant insights.

FR-051: Recommendations must communicate their underlying reasoning.

FR-052: The application must distinguish general agricultural information from personalised recommendations.

FR-053: Missing farmer information must not be fabricated.

FR-054: Recommendations must not be presented as guaranteed agricultural outcomes.

---

## 6.8 Crop Rotation Recommendations

**Priority:** P1

### Description

The application should provide crop rotation suggestions based on available agricultural information.

### Intended Inputs

- Previous crop.
- Farm location.
- Soil information, when available.
- Seasonal information.
- Relevant agricultural conditions.

### Functional Requirements

FR-055: Users should be able to view relevant crop rotation suggestions.

FR-056: Suggestions should consider the available agricultural context.

FR-057: The application should explain why a crop is suggested.

FR-058: The application must communicate when important information is missing.

FR-059: Crop rotation suggestions must not be presented as guaranteed yield or profit predictions.

### Important Constraint

Crop rotation recommendations require credible agricultural information.

They should not be generated through arbitrary crop combinations.

Where expert-validated information is unavailable, the system must communicate the limitations.

---

## 6.9 Government Schemes and Subsidies

**Priority:** P1

### Description

MandiWise should help farmers discover potentially relevant government agricultural schemes and subsidies.

### Information to Display

Where available:

- Scheme name.
- Description.
- Benefits.
- Eligibility criteria.
- Required documents.
- Application procedure.
- Official source.
- Last verified date.
- Relevant deadlines.

### Functional Requirements

FR-060: Users should be able to browse available schemes.

FR-061: Users should be able to view scheme details.

FR-062: The system should identify schemes relevant to the farmer's available profile information.

FR-063: Eligibility information must be based on published scheme requirements.

FR-064: The system must distinguish potential eligibility from officially confirmed eligibility.

FR-065: Users should be directed to official government information wherever applicable.

FR-066: Outdated scheme information must not be presented as current without an appropriate warning.

### Important Business Rule

MandiWise cannot officially approve a farmer's eligibility for a government scheme.

It can only provide an indication based on the available eligibility criteria and user-provided information.

---

## 6.10 Buyer Discovery

**Priority:** P1

### Description

MandiWise should help farmers discover potential buyers for their agricultural produce.

The objective is to reduce the difficulty of finding relevant buyers and improve access to selling opportunities.

### Potential Buyer Information

Where verified and available:

- Buyer name.
- Buyer category.
- Location.
- Contact information.
- Commodities handled.
- Relevant purchasing information.
- Verification status.

### Functional Requirements

FR-067: Users should be able to discover available buyers.

FR-068: Users should be able to filter buyers based on relevant criteria.

FR-069: The system should support location-based buyer discovery.

FR-070: The system should communicate the verification status of buyer information.

FR-071: Unverified buyers must not be presented as verified.

FR-072: The application must not invent buyer information or purchasing offers.

### Route-Based Discovery

Where route and location information is available, the application should support discovering relevant buyers near a selected transportation route.

The purpose is to help farmers identify potential selling opportunities without requiring unnecessary additional travel.

This feature must not assume that a buyer is willing to purchase a specific quantity unless that information has been verified.

---

## 6.11 Farmer Dashboard

**Priority:** P0

### Description

The dashboard should provide a central location from which farmers can access the application's important features.

### Expected Information

Depending on the availability of user and market data:

- Farmer profile summary.
- Selected crops.
- Relevant market prices.
- Market insights.
- Historical price information.
- Suggested actions.
- Available agricultural insights.
- Relevant scheme information.

### Functional Requirements

FR-073: Authenticated users must be directed to the dashboard.

FR-074: The dashboard should provide access to the primary application features.

FR-075: Dashboard information should be relevant to the farmer.

FR-076: The dashboard must communicate unavailable information clearly.

FR-077: The interface should avoid unnecessary information overload.

---

## 6.12 Demonstration Mode

**Priority:** P0 for project demonstration

### Description

MandiWise should include a dedicated demonstration workflow for academic evaluation and project presentations.

This is important because external data sources, integrations or datasets may not always be available during a live demonstration.

### Requirements

FR-078: The application should provide a clearly labelled demonstration mode.

FR-079: Demonstration data must be distinguishable from actual market data.

FR-080: Sample information must never be presented as verified real-world information.

FR-081: The demonstration workflow should allow evaluators to explore important application features.

FR-082: Demonstration mode must not silently replace actual application data.

### Important Rule

Demonstration mode must be explicit.

The application must not display fabricated market prices, buyers, government schemes or predictions as actual information.

---

# 7. NON-FUNCTIONAL REQUIREMENTS

## 7.1 Performance

NFR-001: Common application operations should respond within a reasonable time under normal conditions.

NFR-002: The interface should provide loading indicators for operations that require processing.

NFR-003: Expensive operations such as image processing should be handled asynchronously where appropriate.

NFR-004: The system should avoid unnecessary repeated requests to external data sources.

## 7.2 Security

NFR-005: Authentication must be handled securely.

NFR-006: Passwords must be securely hashed.

NFR-007: Protected backend endpoints must enforce authentication and authorisation.

NFR-008: User information must not be exposed to unauthorised users.

NFR-009: Uploaded images must undergo validation.

NFR-010: Sensitive configuration values and API credentials must not be committed to source control.

## 7.3 Reliability

NFR-011: External API failures must not crash the entire application.

NFR-012: Missing data must be handled gracefully.

NFR-013: Invalid calculations must be prevented through input validation.

NFR-014: Data source failures should be logged.

NFR-015: The system should communicate when information cannot be retrieved.

## 7.4 Usability

NFR-016: The application must have a simple and understandable interface.

NFR-017: Important information should be visually prioritised.

NFR-018: Financial calculations must be understandable to non-technical users.

NFR-019: The interface should provide clear feedback after user actions.

NFR-020: The application should support mobile and desktop screen sizes.

## 7.5 Accessibility

NFR-021: The application should support Kannada and English.

NFR-022: Text must remain readable across supported devices.

NFR-023: Important information must not be communicated through colour alone.

NFR-024: Interactive elements must have clear labels.

NFR-025: Forms must provide understandable validation messages.

## 7.6 Maintainability

NFR-026: Frontend, backend and data-processing responsibilities must remain separated.

NFR-027: Business logic should not be unnecessarily duplicated.

NFR-028: APIs must follow consistent conventions.

NFR-029: Important configuration must be externalised.

NFR-030: The application should support future geographic and functional expansion.

---

# 8. DATA SOURCES AND DATA RELIABILITY

Data reliability is one of the most important requirements of MandiWise.

The application must never prioritise displaying information over displaying accurate information.

## 8.1 Agricultural Market Data

Initial sources:

1. AGMARKNET.
2. Government datasets available through data.gov.in.

The availability, licensing, access requirements, update frequency and completeness of each source must be investigated before integration.

## 8.2 Data Classification

Every relevant information category must be classified appropriately.

### Actual Data

Information retrieved from an identifiable external or verified source.

Example:

A historical modal price retrieved from an official agricultural market dataset.

### Estimated Data

Information calculated using actual inputs and a defined estimation method.

Example:

Estimated transportation expenses.

### Predicted Data

Information generated using a predictive model.

Example:

A forecast of future commodity prices.

Predictions must only be introduced when an adequately validated model and suitable historical data are available.

### Sample Data

Artificial information used for development, testing or demonstrations.

Sample information must be explicitly labelled.

### Verified Information

Information whose source and relevant details have been checked through an appropriate verification process.

Examples:

- Verified buyer information.
- Official government scheme information.

Verification must be based on a documented procedure.

## 8.3 Data Integrity Rules

1. Never invent market prices.
2. Never fabricate historical records.
3. Never present sample information as actual information.
4. Never generate unsupported price predictions.
5. Never assume missing values are zero.
6. Preserve the original source and relevant date.
7. Maintain consistent commodity and market identification.
8. Communicate data limitations.
9. Maintain traceability between displayed results and their underlying data.
10. Use only supported geographic and commodity coverage.

---

# 9. BUSINESS RULES

The following rules govern the application's behaviour.

## BR-001: Net Earnings-Based Ranking

Markets must be ranked primarily using estimated net earnings rather than raw commodity prices.

## BR-002: Consistent Units

All financial calculations must use consistent units.

For example:

1 quintal = 100 kg.

A quantity expressed in kilograms must be converted correctly when the source price is expressed per quintal.

## BR-003: Price Date Transparency

Every displayed market price must have an associated date or clearly communicate that its date is unavailable.

## BR-004: No Unsupported Recommendations

The system must not generate recommendations when the underlying information is insufficient.

## BR-005: Quality-Based Pricing

Quality-based price adjustments must be supported by reliable grading and pricing information.

## BR-006: Buyer Verification

The system must distinguish verified buyer information from unverified information.

## BR-007: Scheme Eligibility

The application may indicate potential eligibility but must not claim official approval.

## BR-008: Prediction Transparency

Predicted information must be labelled as predicted and must not be confused with actual observations.

## BR-009: Demonstration Data

All sample data must be clearly identifiable.

## BR-010: Recommendation Explainability

Every major recommendation must provide an understandable explanation.

---

# 10. OUT OF SCOPE

The following capabilities are not guaranteed as part of the initial implementation.

They may be considered for future versions.

1. Nationwide agricultural market coverage.
2. Direct financial transactions.
3. Online payment processing.
4. Automated buying and selling contracts.
5. Guaranteed buyer availability.
6. Guaranteed future commodity prices.
7. Official agricultural grading certification.
8. Guaranteed crop yield predictions.
9. Automated government subsidy application submission.
10. Direct integration with every agricultural marketplace.
11. Guaranteed transportation bookings.
12. Real-time GPS tracking of transported produce.

These exclusions are important because MandiWise is initially a market intelligence and decision-support platform, not a complete agricultural trading marketplace.

---

# 11. HIGH-LEVEL APPLICATION MODULES

The application is organised into the following logical modules.

| Module                | Responsibility                               |
| --------------------- | -------------------------------------------- |
| Authentication        | Registration, login and access control       |
| Farmer Profile        | Personal and agricultural profile management |
| Market Intelligence   | Commodity and mandi price information        |
| Mandi Recommendation  | Net earnings calculation and market ranking  |
| Historical Trends     | Historical market price analysis             |
| Quality Assessment    | Image-based produce quality analysis         |
| Agricultural Insights | Personalised agricultural information        |
| Crop Rotation         | Crop rotation suggestions                    |
| Government Schemes    | Scheme discovery and eligibility information |
| Buyer Discovery       | Potential buyer discovery and verification   |
| Dashboard             | Centralised farmer interface                 |
| Administration        | Data management and system maintenance       |
| Demonstration Mode    | Controlled academic demonstration workflow   |

---

# 12. EXPECTED USER EXPERIENCE

The intended primary user journey is:

1. A farmer opens MandiWise.
2. The farmer registers or logs in.
3. The farmer completes relevant profile information.
4. The farmer accesses the dashboard.
5. The farmer selects a commodity.
6. The farmer enters the quantity of produce.
7. The farmer provides the farm or origin location.
8. MandiWise retrieves available market information.
9. The application calculates transportation expenses.
10. The application calculates expected net earnings.
11. Available markets are ranked.
12. The farmer compares the recommendations.
13. The farmer inspects historical price trends if needed.
14. The farmer may assess produce quality.
15. The farmer may explore buyers and agricultural insights.

This is the central decision-support journey.

Other features should complement this experience rather than make it unnecessarily complicated.

---

# 13. PRODUCT ARCHITECTURE AT A CONCEPTUAL LEVEL

MandiWise will consist of four major layers.

## 13.1 Frontend Layer

Responsible for:

- User interface.
- Navigation.
- Forms.
- Dashboards.
- Data visualisation.
- User interactions.
- Language selection.

## 13.2 Backend Layer

Responsible for:

- Authentication.
- User management.
- Business logic.
- Market data access.
- Market comparisons.
- Net earnings calculations.
- API communication.
- Data persistence.

## 13.3 Data and Machine Learning Layer

Responsible for:

- Data collection.
- Data cleaning.
- Data preprocessing.
- Market data analysis.
- Computer vision.
- Future predictive analytics.

## 13.4 Database Layer

Responsible for maintaining:

- User information.
- Farmer profiles.
- Commodity information.
- Market information.
- Historical prices.
- Buyer information.
- Scheme information.
- Application records.

The detailed technical architecture will be documented separately in `TRD.md`.

---

# 14. PRODUCT RISKS AND MITIGATION

## Risk 1: Incomplete Market Data

**Problem:**

Some Karnataka mandis may have incomplete or inconsistent historical records.

**Mitigation:**

Start with a smaller set of markets and commodities that have sufficient reliable data.

## Risk 2: External API Unavailability

**Problem:**

Government APIs may become unavailable or have access restrictions.

**Mitigation:**

Implement proper error handling, controlled data storage and transparent data freshness information.

## Risk 3: Incorrect Transportation Estimates

**Problem:**

Actual transportation expenses may differ from calculated estimates.

**Mitigation:**

Clearly identify transportation expenses as estimates and communicate the assumptions used.

## Risk 4: Unreliable Quality Assessment

**Problem:**

Image-based assessment may not accurately identify every quality characteristic.

**Mitigation:**

Limit the initial assessment scope, validate the model and communicate its limitations.

## Risk 5: Unsupported Quality-Based Pricing

**Problem:**

Reliable quality-specific market prices may not be available.

**Mitigation:**

Do not apply arbitrary quality premiums or discounts.

## Risk 6: Outdated Government Scheme Information

**Problem:**

Scheme eligibility and application conditions may change.

**Mitigation:**

Maintain source information and last-verified dates.

## Risk 7: Unverified Buyer Information

**Problem:**

Incorrect buyer information may mislead farmers.

**Mitigation:**

Maintain explicit verification statuses and avoid presenting unverified buyers as trusted contacts.

## Risk 8: Excessive Initial Scope

**Problem:**

Attempting to implement every feature simultaneously may delay development and reduce overall quality.

**Mitigation:**

Implement the application incrementally and validate each phase before proceeding.

---

# 15. MVP DEFINITION

The Minimum Viable Product must demonstrate the central value of MandiWise.

The MVP should prioritise a functional, reliable market decision-support workflow.

## 15.1 Essential MVP Capabilities

1. User registration and authentication.
2. Farmer profile management.
3. Commodity selection.
4. Supported Karnataka mandi information.
5. Agricultural market price retrieval.
6. Market comparison.
7. Transportation expense estimation.
8. Expected gross revenue calculation.
9. Estimated net earnings calculation.
10. Net earnings-based market ranking.
11. Historical price visualisation.
12. Farmer dashboard.
13. Clearly labelled demonstration mode.

## 15.2 Subsequent Feature Expansion

After the core workflow is stable, the application can expand into:

1. Tomato quality assessment using computer vision.
2. Quality-based price estimation, subject to data availability.
3. Personalised agricultural insights.
4. Crop rotation recommendations.
5. Government schemes and subsidies.
6. Verified buyer discovery.
7. Route-based buyer discovery.
8. Additional commodities and Karnataka markets.

The order of implementation must be determined by technical dependencies and data feasibility.

A feature should not be considered complete merely because its interface exists.

---

# 16. ACCEPTANCE CRITERIA

The following conditions define the minimum acceptable behaviour of the application.

## 16.1 Authentication

- Users can register.
- Users can log in.
- Users can log out.
- Protected information cannot be accessed without authorisation.

## 16.2 Market Data

- Supported commodities can be selected.
- Available market records can be retrieved.
- Market prices display their dates and units.
- Data sources are identifiable.
- Missing information is handled correctly.

## 16.3 Mandi Recommendation

- Users can enter quantity and origin location.
- The system can identify supported markets.
- Transportation expenses are calculated using a documented method.
- Gross revenue is calculated correctly.
- Net earnings are calculated correctly.
- Markets are ranked using net earnings.
- Users can inspect the calculation.

## 16.4 Historical Trends

- Historical records can be retrieved.
- Price trends can be displayed.
- Dates and units are communicated.
- Missing records are not treated as zero prices.

## 16.5 Quality Assessment

- Supported images can be uploaded.
- Invalid images are rejected.
- The processing component returns an assessment.
- The assessment communicates its limitations.
- Unsupported price adjustments are not generated.

## 16.6 Agricultural Insights

- Available profile information can be used.
- Recommendations communicate their reasoning.
- Missing information is handled transparently.

## 16.7 Demonstration Mode

- Sample data is clearly labelled.
- Demonstration workflows are functional.
- Sample data cannot be mistaken for verified actual information.

---

# 17. DEVELOPMENT AND PROJECT MANAGEMENT PRINCIPLES

MandiWise will be developed incrementally.

The project will follow a phase-based development methodology.

## 17.1 Development Process

Every development phase must follow this sequence:

1. Understand the phase requirements.
2. Identify technical dependencies.
3. Design the required functionality.
4. Implement the functionality.
5. Run tests.
6. Identify and fix errors.
7. Validate the expected behaviour.
8. Document important implementation decisions.
9. Review the completed phase.
10. Obtain approval before starting the next phase.

## 17.2 Phase Approval Rule

A new phase must not begin while the previous phase contains unresolved critical issues.

The project must maintain a working and testable application throughout development.

## 17.3 AI-Assisted Development Guidelines

Any AI assistant contributing to MandiWise must:

- Read the project documentation before modifying the application.
- Respect the existing technology stack.
- Avoid introducing unnecessary dependencies.
- Avoid changing established architecture without justification.
- Preserve existing working functionality.
- Explain significant implementation decisions.
- Test changes before declaring them complete.
- Update documentation when architectural decisions change.
- Never invent API responses or real-world data.
- Ask for clarification when a requirement conflicts with an established project decision.

The six project documentation files must be treated as the primary reference for development.

---

# 18. FUTURE EXPANSION

MandiWise should be designed with future expansion in mind.

Potential future improvements include:

- Additional Indian states.
- Additional agricultural commodities.
- More advanced agricultural analytics.
- Improved computer vision models.
- Validated commodity price forecasting.
- More detailed transportation estimates.
- Additional buyer discovery capabilities.
- Improved agricultural personalisation.
- Additional Indian languages.
- Integration with additional official agricultural data sources.

These are future possibilities and must not be treated as completed functionality.

---

# 19. FINAL PRODUCT DEFINITION

MandiWise is a Karnataka-first agricultural market intelligence and decision-support platform that helps farmers make informed decisions about where and when to sell their produce.

Its central functionality is the comparison of agricultural markets based on estimated net earnings after accounting for transportation and other applicable selling expenses.

The platform extends this core functionality through historical price analysis, computer-vision-based produce quality assessment, personalised agricultural insights, crop rotation information, government scheme discovery and buyer discovery.

The application must prioritise data reliability, calculation transparency, explainable recommendations and accessibility.

The fundamental objective is not simply to show farmers where prices are higher.

**It is to help farmers understand where they can potentially earn more.**

---

# 20. DOCUMENT CONTROL

| Property           | Value                                |
| ------------------ | ------------------------------------ |
| Document           | PRD.md                               |
| Project            | MandiWise                            |
| Version            | 1.0                                  |
| Last Updated       | 15 November 2026                     |
| Status             | Initial Product Requirements         |
| Geographic Scope   | Karnataka                            |
| Primary Purpose    | Agricultural Market Decision Support |
| Primary Users      | Farmers                              |
| Document Authority | Product Requirements                 |

### Related Project Documents

The following documents provide additional project context:

1. `TRD.md` — Technical Requirements Document.
2. `UI_UX_DESIGN_BRIEF.md` — UI/UX Design Brief.
3. `APP_FLOW.md` — Application Flow.
4. `BACKEND_SCHEMA.md` — Backend Database Schema and API Contracts.
5. `IMPLEMENTATION_PLAN.md` — Phase-wise Implementation Plan.

**Consistency Rule:** Any modification to the product scope or functional requirements must be reflected in the relevant related documents.
