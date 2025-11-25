# Public AQI Flag (OpenAQ)

This app can fetch real air quality measurements from OpenAQ when enabled. It always falls back safely to the existing Gemini → mock flow if public data is unavailable or disabled.

How to configure
- Add `USE_PUBLIC_AQI=true` or `false` to your `.env` / `.env.local`.
- Defaults: development OFF, production ON.

Behavior
- When ON, the app tries OpenAQ first (via coordinates when available).
- If it fails (no data, network, quota), it falls back to Gemini, then to the built‑in mock.

Notes
- Manual city search is validated and normalized using OpenStreetMap Nominatim.
- You still need a valid `GEMINI_API_KEY` for the fallback path.

