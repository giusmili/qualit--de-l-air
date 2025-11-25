#!/usr/bin/env node
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants as FS } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function exists(path) {
  try { await access(path, FS.F_OK); return true; } catch { return false; }
}

async function ensureDir(dir) {
  try { await mkdir(dir, { recursive: true }); } catch {}
}

async function generateWithSharp(svgPath, pngPath) {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.warn('[og] "sharp" non installé. Utilisation d’un placeholder PNG.');
    return false;
  }
  const svg = await readFile(svgPath);
  await ensureDir(dirname(pngPath));
  await sharp(svg)
    .resize(1200, 630, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true })
    .toFile(pngPath);
  console.log(`[og] Généré via sharp: ${pngPath}`);
  return true;
}

async function writePlaceholder(pngPath) {
  // Transparent 1x1 PNG — minimal fallback just to avoid 404.
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  const buf = Buffer.from(b64, 'base64');
  await ensureDir(dirname(pngPath));
  await writeFile(pngPath, buf);
  console.warn(`[og] Placeholder écrit: ${pngPath}`);
}

async function main() {
  const svgPath = resolve(__dirname, '..', 'public', 'og-image.svg');
  const pngPath = resolve(__dirname, '..', 'public', 'og-image.png');

  // If PNG already exists, keep it.
  if (await exists(pngPath)) {
    console.log('[og] PNG déjà présent, rien à faire.');
    return;
  }

  // Try to generate from SVG with sharp; else write placeholder.
  try {
    const ok = await generateWithSharp(svgPath, pngPath);
    if (!ok) await writePlaceholder(pngPath);
  } catch (err) {
    console.warn('[og] Échec génération via sharp, utilisation du placeholder.', err);
    await writePlaceholder(pngPath);
  }
}

main().catch((err) => {
  console.error('[og] Erreur ensure-og:', err);
  process.exitCode = 1;
});

