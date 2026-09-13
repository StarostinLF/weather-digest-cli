import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchJson } from '../src/api/httpClient.js';
import { HttpError, ParseError } from '../src/errors.js';

test('возвращает распарсенный JSON при успешном ответе', async (t) => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ hello: 'world' }),
  });
  t.after(() => {
    global.fetch = originalFetch;
  });

  const data = await fetchJson(new URL('https://example.com'));
  assert.deepEqual(data, { hello: 'world' });
});

test('бросает HttpError при статусе 4xx', async (t) => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false, status: 404 });
  t.after(() => {
    global.fetch = originalFetch;
  });

  await assert.rejects(() => fetchJson(new URL('https://example.com')), HttpError);
});

test('бросает HttpError при статусе 5xx', async (t) => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false, status: 503 });
  t.after(() => {
    global.fetch = originalFetch;
  });

  await assert.rejects(() => fetchJson(new URL('https://example.com')), HttpError);
});

test('бросает ParseError при некорректном JSON в ответе', async (t) => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('bad json');
    },
  });
  t.after(() => {
    global.fetch = originalFetch;
  });

  await assert.rejects(() => fetchJson(new URL('https://example.com')), ParseError);
});
