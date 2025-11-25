# App Qualité de l'air 

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: [App Qualité de l'air](https://ai.studio/apps/drive/1wVnOYL_KP9naZoZyXJ47DsaLGq-q3ute)

## Run Locally

Prerequisites: Node.js

1. Install dependencies:
   `npm install`
2. Create `.env.local` and set at least:
   - `GEMINI_API_KEY=...` (required for fallback flow)
   - `USE_PUBLIC_AQI=true|false` (optional; defaults: dev OFF, prod ON)
   - `VITE_COPYRIGHT=Votre Nom 2025` (optional footer)
3. Start the app:
   `npm run dev`

Notes:
- Manual city search is available if geolocation fails or is denied.
- Reverse geocoding (coordinates → "City, Country") uses OpenStreetMap Nominatim (no API key).
- When enabled, public AQI (OpenAQ) is used first; otherwise the app falls back to Gemini, then to a mock so the UI remains usable.

## Technical Changes

- Structured data (SEO):
  - Added Schema.org JSON-LD to `index.html` describing `Organization`, `WebSite` (with `SearchAction`), `WebPage`, and `WebApplication`.

- City input filtering and verification:
  - `App.tsx` now sanitizes user input (letters, spaces, apostrophes, hyphens), rejects invalid inputs, and shows clear error messages.
  - Added a verified submit flow (`handleCitySearchVerified`) wired to `<CitySearch />`.
  - `services/geminiService.ts` adds `verifyCityName` (OpenStreetMap Nominatim forward geocoding) returning a normalized display name and coordinates.

- Public AQI integration (safe by default):
  - `services/geminiService.ts` adds `fetchAirQualityDataPublic` (OpenAQ) and `fetchAirQualityDataSafe`.
  - `fetchAirQualityDataSafe` tries OpenAQ first (when enabled), then falls back to your existing Gemini flow, then to the built‑in mock.
  - Aggregates PM2.5/PM10/O3/NO2/SO2/CO and computes a local AQI consistent with the app’s logic.

- Feature flag for public AQI:
  - `USE_PUBLIC_AQI` exposed via Vite as `process.env.USE_PUBLIC_AQI`.
  - Defaults: development OFF (if not set), production ON.
  - Configure in `.env` / `.env.local`: `USE_PUBLIC_AQI=true|false`.
  - See `docs/AQI_FLAG.md` for details.

- UI wiring updates:
  - Geolocation path uses `fetchAirQualityDataSafe(city, coords)`.
  - Manual city search verifies the city (Nominatim) and uses `fetchAirQualityDataSafe` with the resolved coordinates.

## Files Touched (overview)

- `index.html` — added JSON-LD structured data.
- `App.tsx` — sanitized/verified city search and safe AQI fetch usage.
- `services/geminiService.ts` — added `verifyCityName`, OpenAQ integration (`fetchAirQualityDataPublic`, `fetchAirQualityDataSafe`), and helpers.
- `vite.config.ts` — added `USE_PUBLIC_AQI` define with sensible defaults per mode.
- `docs/AQI_FLAG.md` — documentation for the public AQI flag and fallback behavior.

