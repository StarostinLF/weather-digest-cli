import { parseArgs } from './cli/parseArgs.js';
import { printCityError, printCityReport } from './format/consoleFormat.js';
import { AppError } from './errors.js';
import { getWeatherDigest } from './services/weatherDigest.js';

async function main() {
  const { cities, days, noCache } = parseArgs(process.argv.slice(2));
  const results = await getWeatherDigest(cities, { days, noCache });

  for (const result of results) {
    if (result.ok) {
      printCityReport(result);
    } else {
      printCityError(result);
    }
  }

  const hasSuccess = results.some((result) => result.ok);
  process.exitCode = hasSuccess ? 0 : 1;
}

main().catch((error) => {
  const message = error instanceof AppError ? error.message : 'Непредвиденная ошибка приложения';
  console.error(message);
  process.exitCode = 1;
});
