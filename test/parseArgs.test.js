import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../src/cli/parseArgs.js';
import { ValidationError } from '../src/errors.js';

test('разбирает один город со значениями по умолчанию', () => {
  const result = parseArgs(['--city', 'Москва']);
  assert.deepEqual(result, { cities: ['Москва'], days: 3, noCache: false });
});

test('разбирает несколько городов через запятую и убирает пробелы', () => {
  const result = parseArgs(['--city', 'Москва, Сочи , Казань']);
  assert.deepEqual(result.cities, ['Москва', 'Сочи', 'Казань']);
});

test('принимает --days и --no-cache', () => {
  const result = parseArgs(['--city', 'Москва', '--days', '5', '--no-cache']);
  assert.equal(result.days, 5);
  assert.equal(result.noCache, true);
});

test('бросает ValidationError без --city', () => {
  assert.throws(() => parseArgs([]), ValidationError);
});

test('бросает ValidationError при --days вне диапазона 1-7', () => {
  assert.throws(() => parseArgs(['--city', 'Москва', '--days', '9']), ValidationError);
});

test('бросает ValidationError при нечисловом --days', () => {
  assert.throws(() => parseArgs(['--city', 'Москва', '--days', 'abc']), ValidationError);
});
