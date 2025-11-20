#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const buildId = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8)
  || process.env.GIT_COMMIT?.slice(0, 8)
  || String(Date.now());

const file = resolve(process.cwd(), 'public', 'sw.js');
let sw = await readFile(file, 'utf8');
sw = sw.replace('__BUILD_ID__', buildId);
await writeFile(file, sw);
console.log(`[sw] Injected build id into sw.js: ${buildId}`);

