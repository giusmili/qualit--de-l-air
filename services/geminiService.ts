
import { AirQualityData } from '../types';

// Read API key from Vite-injected env (see vite.config.ts)
const API_KEY = (process.env.API_KEY || process.env.GEMINI_API_KEY) as string | undefined;

async function getAIClient() {
    if (!API_KEY) {
        throw new Error("Clé API Gemini manquante. Ajoutez GEMINI_API_KEY dans .env.local puis redémarrez.");
    }
    const mod: any = await import('@google/genai');
    const GoogleGenAI = mod.GoogleGenAI || mod.GoogleGenerativeAI || mod.default;
    return new GoogleGenAI({ apiKey: API_KEY });
}

export async function fetchCityName(lat: number, lon: number): Promise<string> {
    // 1) Try OpenStreetMap Nominatim (no API key required)
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=fr&zoom=10`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
        const data: any = await res.json();

        const addr = data?.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || data?.name;
        const country = addr.country;
        if (city && country) return `${city}, ${country}`;

        if (typeof data?.display_name === 'string') {
            const parts = data.display_name.split(',').map((s: string) => s.trim());
            if (parts.length >= 2) return `${parts[0]}, ${parts[parts.length - 1]}`;
        }
        throw new Error('Réponse Nominatim incomplète');
    } catch (e) {
        console.warn('Nominatim reverse geocoding failed, falling back to Gemini:', e);
    }

    // 2) Fallback: ask Gemini if available
    try {
        const prompt = `Réponds uniquement avec le nom de la ville et du pays (ex: "Paris, France") pour la latitude ${lat} et la longitude ${lon}. Ne fournis aucune autre information.`;
        const ai = await getAIClient();
        // Try modern or legacy call shapes to be resilient to library changes
        const response: any = await (ai as any).models?.generateContent
            ? (ai as any).models.generateContent({ model: 'gemini-2.5-flash', contents: prompt })
            : (async () => {
                const model = (ai as any).getGenerativeModel?.({ model: 'gemini-2.5-flash' });
                const res = await model.generateContent?.(prompt);
                return { text: res?.response?.text?.() ?? '' };
            })();

        const text: string = (response?.text?.trim?.() ?? '').trim();
        if (!text) throw new Error("Réponse vide de Gemini");
        return text;
    } catch (error) {
        console.error("Error fetching city name:", error);
        throw new Error("Impossible de contacter le service de géolocalisation.");
    }
}

export async function fetchAirQualityData(city: string): Promise<AirQualityData> {

    try {
        const prompt = `Agis en tant qu'API de qualité de l'air. Pour la ville de "${city}", génère un objet JSON qui simule les données actuelles sur la pollution de l'air. Le JSON doit être en français, les valeurs des polluants doivent être réalistes et l'IQA doit correspondre à ces valeurs.`;

        const ai = await getAIClient();
        const response: any = await (ai as any).models?.generateContent
            ? (ai as any).models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json'
                },
            })
            : (async () => {
                const model = (ai as any).getGenerativeModel?.({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json' } });
                const res = await model.generateContent?.(prompt);
                return { text: res?.response?.text?.() ?? '' };
            })();

        const jsonText: string = (response?.text?.trim?.() ?? '').trim();
        if (!jsonText) throw new Error('Réponse vide de Gemini');
        return JSON.parse(jsonText) as AirQualityData;
    } catch (error) {
        console.error("Error fetching air quality data, using mock fallback:", error);
        // Fallback: generate plausible mock data so the app remains usable
        return generateMockAirQuality(city);
    }
}

function generateMockAirQuality(city: string): AirQualityData {
    const seed = Math.abs(hashString(city)) || 1;
    const rand = seeded(seed);

    const pm25 = clamp(round(randRange(rand, 8, 60), 1), 3, 150);
    const pm10 = clamp(round(randRange(rand, 12, 100), 1), 5, 200);
    const o3 = clamp(round(randRange(rand, 20, 140), 1), 5, 240);
    const no2 = clamp(round(randRange(rand, 10, 90), 1), 3, 200);
    const so2 = clamp(round(randRange(rand, 2, 30), 1), 1, 100);
    const co = clamp(round(randRange(rand, 200, 1000), 0), 50, 2000); // µg/m3 equivalent

    // Simple AQI estimation based on PM2.5/PM10
    const aqiFromPM25 = scale(pm25, [0, 12, 35.4, 55.4, 150.4], [0, 50, 100, 150, 200]);
    const aqiFromPM10 = scale(pm10, [0, 54, 154, 254, 354], [0, 50, 100, 150, 200]);
    const aqi = Math.max(Math.round(aqiFromPM25), Math.round(aqiFromPM10));

    const rec = recommendations(aqi);

    return {
        aqi,
        pollutants: {
            pm25: { value: pm25, unit: 'µg/m³' },
            pm10: { value: pm10, unit: 'µg/m³' },
            o3: { value: o3, unit: 'µg/m³' },
            no2: { value: no2, unit: 'µg/m³' },
            so2: { value: so2, unit: 'µg/m³' },
            co: { value: co, unit: 'µg/m³' },
        },
        healthRecommendations: rec,
        simulated: true,
    };
}

function hashString(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return h;
}

function seeded(seed: number) {
    // Mulberry32
    let t = seed >>> 0;
    return function() {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function randRange(rand: () => number, min: number, max: number) {
    return min + (max - min) * rand();
}
function round(n: number, digits = 0) {
    const p = Math.pow(10, digits);
    return Math.round(n * p) / p;
}
function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

// Piecewise-linear scaling: map value from domain breakpoints to range breakpoints
function scale(value: number, domain: number[], range: number[]) {
    const n = Math.min(domain.length, range.length);
    if (n === 0) return value;
    if (value <= domain[0]) return range[0];
    for (let i = 1; i < n; i++) {
        const x0 = domain[i - 1];
        const x1 = domain[i];
        const y0 = range[i - 1];
        const y1 = range[i];
        if (value <= x1) {
            const t = (value - x0) / (x1 - x0 || 1);
            return y0 + t * (y1 - y0);
        }
    }
    return range[n - 1];
}

function recommendations(aqi: number) {
    if (aqi <= 50) {
        return {
            general: "Qualité de l'air bonne. Activités extérieures sans restriction.",
            sensitiveGroups: "Aucune précaution particulière requise.",
        };
    }
    if (aqi <= 100) {
        return {
            general: "Qualité de l'air modérée. Limitez les efforts prolongés en extérieur si vous êtes sensible.",
            sensitiveGroups: "Envisagez de réduire les activités intenses en plein air.",
        };
    }
    if (aqi <= 150) {
        return {
            general: "Air dégradé. Réduisez les activités intenses en extérieur.",
            sensitiveGroups: "Évitez les efforts soutenus; privilégiez l'intérieur.",
        };
    }
    return {
        general: "Air de mauvaise qualité. Limitez au maximum les activités extérieures.",
        sensitiveGroups: "Restez à l'intérieur si possible et utilisez un purificateur.",
    };
}
