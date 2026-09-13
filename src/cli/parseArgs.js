import { parseArgs as parseNodeArgs } from 'node:util';
import { ValidationError } from '../errors.js';

export function parseArgs(argv) {
  let values;

  try {
    ({ values } = parseNodeArgs({
      args: argv,
      options: {
        city: { type: 'string' },
        days: { type: 'string', default: '3' },
        'no-cache': { type: 'boolean', default: false },
      },
    }));
  } catch {
    throw new ValidationError(
      'Некорректные аргументы командной строки. Используйте --city и --days',
    );
  }

  if (!values.city || !values.city.trim()) {
    throw new ValidationError('Параметр --city обязателен, например: --city "Москва"');
  }

  const cities = values.city
    .split(',')
    .map((city) => city.trim())
    .filter(Boolean);

  if (cities.length === 0) {
    throw new ValidationError('Параметр --city не содержит ни одного города');
  }

  const days = Number.parseInt(values.days, 10);

  if (!Number.isInteger(days) || days < 1 || days > 7) {
    throw new ValidationError('Параметр --days должен быть целым числом от 1 до 7');
  }

  return { cities, days, noCache: values['no-cache'] };
}
