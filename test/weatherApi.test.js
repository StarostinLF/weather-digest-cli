import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchForecast } from '../src/api/weatherApi.js';

test('преобразует ответ API в массив дней прогноза', async (t) => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      daily: {
        time: ['2026-01-01', '2026-01-02'],
        temperature_2m_max: [1, 2],
        temperature_2m_min: [-1, 0],
        precipitation_sum: [0, 5],
      },
    }),
  });
  t.after(() => {
    global.fetch = originalFetch;
  });

  const forecast = await fetchForecast({ latitude: 1, longitude: 2, days: 2 });

  assert.deepEqual(forecast, [
    { date: '2026-01-01', tempMax: 1, tempMin: -1, precipitation: 0 },
    { date: '2026-01-02', tempMax: 2, tempMin: 0, precipitation: 5 },
  ]);
});
