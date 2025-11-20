#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Utilise l’ID de build Vercel/Git si présent, sinon timestamp
const version = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8)
  || process.env.GIT_COMMIT?.slice(0, 8)
  || String(Date.now());

const file = resolve(process.cwd(), 'index.html');
let html = await readFile(file, 'utf8');

function addVersion(url) {
  if (!url.includes('og-image.png')) return url;
  if (url.includes('?')) return url; // version déjà présente
  return `${url}?v=${version}`;
}

// Injecte ?v=xxx dans les metas og:image et twitter:image
html = html.replace(/(og-image\.png)("|')/g, (_, p1, p2) => `${p1}?v=${version}${p2}`);

await writeFile(file, html);
console.log(`[og] Version injectée dans index.html: v=${version}`);

