import { config } from '../config.js';

export async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`API ответил статусом ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
