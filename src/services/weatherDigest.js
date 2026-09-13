import { fetchCityLocation } from '../api/geocodingApi.js';
import { fetchForecast } from '../api/weatherApi.js';
import { readCachedReport, saveReport } from '../storage/reportStorage.js';

async function buildCityReport(city, days) {
  const location = await fetchCityLocation(city);
  const forecast = await fetchForecast({ ...location, days });

  return {
    requestedCity: city,
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    requestedDays: days,
    generatedAt: new Date().toISOString(),
    forecast,
  };
}

async function getCityDigest(city, { days, noCache }) {
  if (!noCache) {
    const cached = await readCachedReport(city);
    if (cached) {
      return { ...cached, fromCache: true };
    }
  }

  const report = await buildCityReport(city, days);
  await saveReport(city, report);
  return { ...report, fromCache: false };
}

export async function getWeatherDigest(cities, options) {
  const outcomes = await Promise.allSettled(
    cities.map((city) => getCityDigest(city, options)),
  );

  return outcomes.map((outcome, index) => {
    const city = cities[index];
    return outcome.status === 'fulfilled'
      ? { city, ok: true, report: outcome.value }
      : { city, ok: false, error: outcome.reason };
  });
}
