import { config } from '../config.js';
import { fetchJson } from './httpClient.js';

export async function fetchCityLocation(city) {
  const url = new URL(config.geocodingUrl);
  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'ru');
  url.searchParams.set('format', 'json');

  const data = await fetchJson(url);
  const [result] = data.results ?? [];

  if (!result) {
    throw new Error(`Город "${city}" не найден`);
  }

  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}
