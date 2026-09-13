import 'dotenv/config';

function parseTimeout(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5000;
}

export const config = {
  geocodingUrl:
    process.env.GEOCODING_API_URL ?? 'https://geocoding-api.open-meteo.com/v1/search',
  weatherUrl: process.env.WEATHER_API_URL ?? 'https://api.open-meteo.com/v1/forecast',
  requestTimeoutMs: parseTimeout(process.env.REQUEST_TIMEOUT_MS),
  reportsDir: process.env.REPORTS_DIR ?? 'reports',
  temperatureUnit: process.env.TEMPERATURE_UNIT ?? 'celsius',
};
