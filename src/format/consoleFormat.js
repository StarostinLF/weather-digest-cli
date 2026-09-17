export function printCityReport({ report }) {
  const cacheNote = report.fromCache ? ' (из кэша)' : '';
  console.log(`\n${report.name}, ${report.country}${cacheNote}`);
  console.log(`Координаты: ${report.latitude}, ${report.longitude}`);
  console.table(
    report.forecast.map((day) => ({
      Дата: day.date,
      'Мин, °C': day.tempMin,
      'Макс, °C': day.tempMax,
      'Осадки, мм': day.precipitation,
    })),
  );
}

export function printCityError({ city, error }) {
  console.error(`\n${city}: ${error.message}`);
}
