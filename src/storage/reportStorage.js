import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function slugifyCity(city) {
  return city.trim().toLowerCase().replace(/\s+/g, '_');
}

function reportFilePath(city) {
  const fileName = `${slugifyCity(city)}-${todayDate()}.json`;
  return path.join(config.reportsDir, fileName);
}

export async function readCachedReport(city) {
  try {
    const raw = await readFile(reportFilePath(city), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveReport(city, report) {
  await mkdir(config.reportsDir, { recursive: true });
  await writeFile(reportFilePath(city), JSON.stringify(report, null, 2), 'utf-8');
}
