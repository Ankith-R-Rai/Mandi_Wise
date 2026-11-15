# MandiWise — API Specification & Contracts

**Document Version:** 1.0  
**API Prefix:** `/api/v1`  
**Protocol:** REST over HTTPS  
**Default Content-Type:** `application/json`  

---

## 1. Global Response Standards

### 1.1 Standard Success Envelope
All successful backend responses wrap their payload inside a consistent envelope:
```json
{
  "success": true,
  "message": "Market recommendation generated successfully",
  "data": { ... },
  "timestamp": "2026-11-15T14:30:00Z"
}
```

### 1.2 Standard Error Envelope
Failed responses use appropriate HTTP status codes and provide actionable error codes:
```json
{
  "success": false,
  "message": "No market observations satisfy the freshness threshold",
  "errorCode": "MARKET_DATA_STALE",
  "details": [
    "Latest available price for commodity TOMATO is older than 30 days"
  ],
  "timestamp": "2026-11-15T14:30:00Z"
}
```

### 1.3 Common HTTP Status Codes
* `200 OK`: Request succeeded.
* `201 Created`: Resource successfully created (registration, new recommendation).
* `400 Bad Request`: Validation failure or malformed payload.
* `401 Unauthorized`: Missing, invalid, or expired JWT token.
* `403 Forbidden`: Authenticated user lacks required role (`ROLE_ADMIN`).
* `404 Not Found`: Resource does not exist.
* `409 Conflict`: Unique constraint violation (e.g., email already registered).
* `422 Unprocessable Entity`: Semantic validation failure (e.g., negative quantity).
* `500 Internal Server Error`: Unhandled server exception (stack trace never exposed).

---

## 2. API Endpoints by Domain Module

### 2.1 Authentication & User Management (`/api/v1/auth`)

#### `POST /api/v1/auth/register`
* **Access:** Public
* **Request:**
  ```json
  {
    "fullName": "Basavaraj Patil",
    "email": "basavaraj@example.com",
    "password": "SecurePassword123!",
    "phoneNumber": "+919876543210",
    "preferredLanguage": "KN"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "basavaraj@example.com",
      "token": "eyJhbGciOi...",
      "refreshToken": "dGhpcy1pcy1h..."
    }
  }
  ```

#### `POST /api/v1/auth/login`
* **Access:** Public
* **Request:**
  ```json
  {
    "email": "basavaraj@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response (200 OK):** Returns JWT access token, refresh token, user profile, and assigned roles.

#### `GET /api/v1/auth/me`
* **Access:** Authenticated (`ROLE_FARMER` or `ROLE_ADMIN`)
* **Response (200 OK):** Returns current user session details and profile.

---

### 2.2 Farmer & Farm Management (`/api/v1/farmers`)

#### `GET /api/v1/farmers/profile`
* **Access:** Authenticated (`ROLE_FARMER`)
* **Response (200 OK):** Returns farmer profile, preferred language, district, taluk, village.

#### `PUT /api/v1/farmers/profile`
* **Access:** Authenticated (`ROLE_FARMER`)
* **Request:** Updates district, taluk, village, language preference.

#### `POST /api/v1/farmers/farms`
* **Access:** Authenticated (`ROLE_FARMER`)
* **Request:** Registers a farm with land area, district, taluk, optional coordinates (lat/long).

---

### 2.3 Commodities & Markets (`/api/v1/commodities`, `/api/v1/markets`)

#### `GET /api/v1/commodities`
* **Access:** Public / Authenticated
* **Query Params:** `activeOnly=true`
* **Response (200 OK):** List of supported commodities (e.g., Tomato, Onion, Potato) with Kannada names and standard units.

#### `GET /api/v1/markets`
* **Access:** Public / Authenticated
* **Query Params:** `district`, `state=Karnataka`
* **Response (200 OK):** List of APMC mandis with coordinates and district mapping.

#### `GET /api/v1/prices`
* **Access:** Public / Authenticated
* **Query Params:** `commodityId`, `marketId`, `fromDate`, `toDate`, `page`, `size`
* **Response (200 OK):** Paginated historical market price records with observation date, unit (`INR_PER_QUINTAL`), modal price, and source.

---

### 2.4 Mandi Recommendation Engine (`/api/v1/recommendations`)

#### `POST /api/v1/recommendations`
* **Access:** Authenticated (`ROLE_FARMER`)
* **Request:**
  ```json
  {
    "commodityId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "quantityKg": 2500.00,
    "originDistrict": "Kolar",
    "originLatitude": 13.1367,
    "originLongitude": 78.1291,
    "vehicleType": "LIGHT_COMMERCIAL_VEHICLE"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Mandi recommendations generated successfully",
    "data": {
      "requestId": "9c8b7a6d-5e4f-3a2b-1c0d-ef9876543210",
      "commodity": "Tomato",
      "quantityKg": 2500.00,
      "recommendedMarket": {
        "marketId": "m1-uuid",
        "marketName": "Kolar APMC Mandi",
        "district": "Kolar",
        "modalPricePerQuintal": 2400.00,
        "observationDate": "2026-11-14",
        "distanceKm": 12.5,
        "estimatedTransportCost": 500.00,
        "grossRevenue": 60000.00,
        "otherExpenses": 0.00,
        "estimatedNetEarnings": 59500.00,
        "ranking": 1,
        "explanation": "Yields highest estimated net earnings after deducting ₹500 in transport costs for 12.5 km."
      },
      "candidateMarkets": [
        {
          "marketId": "m2-uuid",
          "marketName": "Yeshwanthpur APMC (Bangalore)",
          "district": "Bangalore Urban",
          "modalPricePerQuintal": 2650.00,
          "observationDate": "2026-11-14",
          "distanceKm": 78.0,
          "estimatedTransportCost": 3900.00,
          "grossRevenue": 66250.00,
          "otherExpenses": 0.00,
          "estimatedNetEarnings": 62350.00,
          "ranking": 2
        }
      ]
    }
  }
  ```

#### `GET /api/v1/recommendations/{requestId}`
* **Access:** Authenticated (`ROLE_FARMER` — owned requests only)
* **Response (200 OK):** Historical calculation snapshot.

---

### 2.5 Historical Price Trends (`/api/v1/trends`)

#### `GET /api/v1/trends`
* **Access:** Public / Authenticated
* **Query Params:** `commodityId`, `marketIds` (comma-separated), `period=1M|3M|6M|1Y`
* **Response (200 OK):** Time-series array suitable for Recharts visualization.

---

### 2.6 Quality Assessment (`/api/v1/quality`)

#### `POST /api/v1/quality/assess`
* **Access:** Authenticated (`ROLE_FARMER`)
* **Content-Type:** `multipart/form-data`
* **Payload:** `file` (JPEG/PNG image), `commodityId`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Quality assessment completed",
    "data": {
      "assessmentId": "q1-uuid",
      "commodity": "Tomato",
      "visibleDefects": ["Minor surface abrasion"],
      "colorClassification": "Ripe (85% red)",
      "estimatedGrade": "Grade A (Visual Estimate Only)",
      "confidenceScore": 0.88,
      "disclaimer": "Visual assessment is an aid and does not constitute an official agricultural laboratory grading certificate."
    }
  }
  ```
