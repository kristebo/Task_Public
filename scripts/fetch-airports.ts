#!/usr/bin/env tsx
/**
 * Fetch the full airports dataset (mwgg/Airports) and distill into a compact
 * frontend/src/data/IATAcodes.json with fields we care about.
 *
 * Keeps only entries with an IATA code ("iata") of length 3 and non-empty city/country.
 * Output format: [{ code, city, country, name, lat, lon }]
 */
import fs from 'fs';
import path from 'path';
import https from 'https';

const SOURCE_URL = 'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json';

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8'))); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

(async () => {
  console.log('Downloading airports dataset...');
  const data = await fetchJson(SOURCE_URL);
  // dataset is an object keyed by ICAO or random id -> each value has iata/lat/lon/name/city/country
  const rows: any[] = [];
  for (const key of Object.keys(data)) {
    const a = data[key];
    const code = (a.iata || '').trim().toUpperCase();
    if (!code || code.length !== 3) continue; // only keep real IATA codes
    const city = (a.city || '').trim();
    const country = (a.country || '').trim();
    if (!city || !country) continue;
    rows.push({
      code,
      city,
      country,
      name: (a.name || '').trim(),
      lat: a.lat,
      lon: a.lon,
    });
  }
  // Sort by code for stable diffs
  rows.sort((a,b) => a.code.localeCompare(b.code));
  const outPath = path.join(process.cwd(), 'frontend', 'src', 'data', 'IATAcodes.json');
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await fs.promises.writeFile(outPath, JSON.stringify(rows, null, 2));
  console.log(`Wrote ${rows.length} IATA codes to ${outPath}`);
})().catch(e => {
  console.error('Failed to fetch airports:', e);
  process.exit(1);
});
