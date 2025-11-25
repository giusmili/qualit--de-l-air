
import React, { useState, useEffect, useCallback } from 'react';
import { fetchCityName, fetchAirQualityDataSafe, verifyCityName } from './services/geminiService';
import { AirQualityData, Coordinates } from './types';
import Header from './components/Header';
import AqiDisplay from './components/AqiDisplay';
import PollutantDetails from './components/PollutantDetails';
import HealthRecommendations from './components/HealthRecommendations';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import Footer from './components/Footer';
import CitySearch from './components/CitySearch';

const App: React.FC = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState<string>('Initialisation...');
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(() => {
    setLoading('Recherche de votre position...');
    setError(null);
    setAirQuality(null);
    setCity(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setError(`Erreur de géolocalisation : ${err.message}. Veuillez autoriser l'accès à votre position.`);
        setLoading('');
      }
    );
  }, []);

  const fetchData = useCallback(async () => {
    if (!coords) return;

    try {
      setLoading('Identification de votre ville...');
      const cityName = await fetchCityName(coords.latitude, coords.longitude);
      setCity(cityName);

      setLoading(`Analyse de la qualité de l'air pour ${cityName}...`);
      const data = await fetchAirQualityDataSafe(cityName, coords || undefined);
      setAirQuality(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
    } finally {
      setLoading('');
    }
  }, [coords]);

  const handleCitySearch = useCallback(async (manualCity: string) => {
    setError(null);
    setCoords(null);
    setCity(manualCity);
    setAirQuality(null);
    try {
      setLoading(`Analyse de la qualité de l'air pour ${manualCity}...`);
      const data = await fetchAirQualityData(manualCity);
      setAirQuality(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
    } finally {
      setLoading('');
    }
  }, []);

  const sanitizeCity = (s: string) => {
    return s
      .normalize('NFKC')
      .replace(/[^\p{L}\s,'-]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleCitySearchVerified = useCallback(async (manualCity: string) => {
    setError(null);
    setCoords(null);
    setAirQuality(null);
    const sanitized = sanitizeCity(manualCity);
    if (!sanitized || /[0-9]/.test(sanitized) || sanitized.length < 2) {
      setLoading('');
      setError("Nom de ville invalide. Utilisez uniquement des lettres, espaces, apostrophes et tirets.");
      return;
    }
    try {
      setLoading(`Vérification de la ville "${sanitized}"...`);
      const resolved = await verifyCityName(sanitized);
      setCity(resolved.displayName);
      setLoading(`Analyse de la qualité de l'air pour ${resolved.displayName}...`);
      const data = await fetchAirQualityDataSafe(resolved.displayName, { latitude: resolved.latitude, longitude: resolved.longitude });
      setAirQuality(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ville introuvable ou erreur réseau.');
    } finally {
      setLoading('');
    }
  }, []);

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (coords) {
      fetchData();
    }
  }, [coords, fetchData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-500">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        {loading && <LoadingSpinner message={loading} />}
        {error && <ErrorDisplay message={error} onRetry={getLocation} />}

        {!loading && (
          <div className="mb-6 grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow">
              <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Utiliser ma position pour détecter la ville
                </div>
                <button
                  onClick={getLocation}
                  className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
                  disabled={!!loading}
                >
                  Détecter ma position
                </button>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow">
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">Ou rechercher par ville</div>
              <CitySearch onSubmit={handleCitySearchVerified} disabled={!!loading} />
            </div>
          </div>
        )}
        
        {!loading && !error && airQuality && city && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <AqiDisplay aqi={airQuality.aqi} city={city} />
            <PollutantDetails pollutants={airQuality.pollutants} />
            <HealthRecommendations recommendations={airQuality.healthRecommendations} />
          </div>
        )}
      </main>
      <Footer onRefresh={getLocation} isLoading={!!loading} />
    </div>
  );
};

export default App;
