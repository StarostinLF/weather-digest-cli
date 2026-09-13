import { config } from '../config.js';
import { HttpError, NetworkError, ParseError, TimeoutError } from '../errors.js';

export async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new TimeoutError(
        `Превышено время ожидания ответа (${config.requestTimeoutMs} мс)`,
      );
    }
    throw new NetworkError('Не удалось подключиться к API, проверьте сеть');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const reason =
      response.status >= 500 ? 'сервер API временно недоступен' : 'некорректный запрос к API';
    throw new HttpError(`Ошибка ${response.status}: ${reason}`, response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new ParseError('Не удалось разобрать ответ API: некорректный JSON');
  }
}
