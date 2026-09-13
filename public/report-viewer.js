const fileInput = document.getElementById('fileInput');
const output = document.getElementById('output');

fileInput.addEventListener('change', async () => {
  const [file] = fileInput.files;
  if (!file) {
    return;
  }

  output.replaceChildren();

  try {
    const text = await file.text();
    const report = JSON.parse(text);
    renderReport(report);
  } catch {
    const error = document.createElement('p');
    error.className = 'error';
    error.textContent = 'Не удалось прочитать файл: это не корректный JSON-отчёт';
    output.append(error);
  }
});

function renderReport(report) {
  const heading = document.createElement('h2');
  heading.textContent = `${report.name}, ${report.country}`;
  output.append(heading);

  const coords = document.createElement('p');
  coords.textContent = `Координаты: ${report.latitude}, ${report.longitude}`;
  output.append(coords);

  output.append(buildForecastTable(report.forecast));
}

function buildForecastTable(forecast) {
  const table = document.createElement('table');
  table.append(buildTableHead());

  const tbody = document.createElement('tbody');
  for (const day of forecast) {
    tbody.append(buildTableRow([day.date, day.tempMin, day.tempMax, day.precipitation]));
  }
  table.append(tbody);

  return table;
}

function buildTableHead() {
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');

  for (const text of ['Дата', 'Мин, °C', 'Макс, °C', 'Осадки, мм']) {
    const th = document.createElement('th');
    th.textContent = text;
    headRow.append(th);
  }

  thead.append(headRow);
  return thead;
}

function buildTableRow(values) {
  const row = document.createElement('tr');
  for (const value of values) {
    const td = document.createElement('td');
    td.textContent = value;
    row.append(td);
  }
  return row;
}
