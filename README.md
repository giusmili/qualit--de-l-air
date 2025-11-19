<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1wVnOYL_KP9naZoZyXJ47DsaLGq-q3ute

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
   Optionally add a footer copyright: `VITE_COPYRIGHT=Votre Nom 2025`
3. Run the app:
   `npm run dev`

Notes:
- The app now supports a manual city search fallback if geolocation fails or is denied.
- Reverse geocoding (coordinates → "City, Country") uses OpenStreetMap Nominatim without an API key.
- Air quality data generation still uses Gemini; you need a valid `GEMINI_API_KEY` for this part.
