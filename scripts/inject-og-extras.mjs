#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const file = resolve(process.cwd(), 'index.html');
let html = await readFile(file, 'utf8');

// og:locale
if (!/property=["']og:locale["']/.test(html)) {
  const marker = '<meta property="og:type" content="website">';
  const inject = `${marker}\n  <meta property=\"og:locale\" content=\"fr_FR\">`;
  if (html.includes(marker)) {
    html = html.replace(marker, inject);
  } else {
    html = html.replace('</head>', `  <meta property=\"og:locale\" content=\"fr_FR\">\n</head>`);
  }
}

// og:updated_time
const updated = new Date().toISOString();
if (/property=["']og:updated_time["']/.test(html)) {
  html = html.replace(/<meta property=\"og:updated_time\"[^>]*>/, `<meta property=\"og:updated_time\" content=\"${updated}\">`);
} else {
  const descRe = /(<meta property=\"og:description\"[^>]*>)/;
  if (descRe.test(html)) {
    html = html.replace(descRe, `$1\n  <meta property=\"og:updated_time\" content=\"${updated}\">`);
  } else {
    html = html.replace('</head>', `  <meta property=\"og:updated_time\" content=\"${updated}\">\n</head>`);
  }
}

await writeFile(file, html);
console.log(`[og] Extras injectés: locale=fr_FR, updated_time=${updated}`);

