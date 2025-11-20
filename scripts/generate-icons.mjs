#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function ensureDir(dir) {
  try { await mkdir(dir, { recursive: true }); } catch {}
}

async function main() {
  const publicDir = resolve(__dirname, '..', 'public');
  const svgPath = resolve(publicDir, 'favicon.svg');
  const files = [
    { out: 'favicon-16x16.png', size: 16 },
    { out: 'favicon-32x32.png', size: 32 },
    { out: 'apple-touch-icon.png', size: 180 },
    { out: 'android-chrome-192x192.png', size: 192 },
    { out: 'android-chrome-512x512.png', size: 512 },
  ];

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.warn('[icons] "sharp" non installé. Ignorer la génération d’icônes PNG.');
    console.warn('[icons] Installez-le avec: npm i -D sharp');
    return;
  }

  const svg = await readFile(svgPath);
  await ensureDir(publicDir);
  for (const f of files) {
    const outPath = resolve(publicDir, f.out);
    await sharp(svg).resize(f.size, f.size, { fit: 'cover' }).png({ quality: 90 }).toFile(outPath);
    console.log(`[icons] Généré: ${f.out}`);
  }
}

main().catch((err) => {
  console.error('[icons] Erreur génération icônes:', err);
  process.exitCode = 1;
});

