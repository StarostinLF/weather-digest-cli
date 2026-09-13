import { config } from '../config.js';
import { fetchJson } from './httpClient.js';

export async function fetchForecast({ latitude, longitude, days }) {
  const url = new URL(config.weatherUrl);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum');
  url.searchParams.set('forecast_days', String(days));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('temperature_unit', config.temperatureUnit);

  const data = await fetchJson(url);

  return data.daily.time.map((date, index) => ({
    date,
    tempMax: data.daily.temperature_2m_max[index],
    tempMin: data.daily.temperature_2m_min[index],
    precipitation: data.daily.precipitation_sum[index],
  }));
}
