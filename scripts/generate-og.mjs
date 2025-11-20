#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function ensureDir(dir) {
  try { await mkdir(dir, { recursive: true }); } catch {}
}

async function main() {
  const svgPath = resolve(__dirname, '..', 'public', 'og-image.svg');
  const pngPath = resolve(__dirname, '..', 'public', 'og-image.png');

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.warn('[og] "sharp" non installé. Ignorer la génération PNG.');
    console.warn('[og] Installez-le avec: npm i -D sharp');
    return;
  }

  const svg = await readFile(svgPath);
  await ensureDir(dirname(pngPath));
  // 1200x630 recommandés pour OG
  await sharp(svg).png({ quality: 90 }).resize(1200, 630, { fit: 'cover' }).toFile(pngPath);
  console.log(`[og] Généré: ${pngPath}`);
}

main().catch((err) => {
  console.error('[og] Erreur génération PNG:', err);
  process.exitCode = 1;
});

