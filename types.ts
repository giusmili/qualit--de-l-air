
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Pollutant {
  value: number;
  unit: string;
}

export interface Pollutants {
  pm25: Pollutant;
  pm10: Pollutant;
  o3: Pollutant;
  no2: Pollutant;
  so2: Pollutant;
  co: Pollutant;
}

export interface HealthRecommendations {
  general: string;
  sensitiveGroups: string;
}

export interface AirQualityData {
  aqi: number;
  pollutants: Pollutants;
  healthRecommendations: HealthRecommendations;
  simulated?: boolean;
}
