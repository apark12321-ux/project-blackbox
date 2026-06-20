import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

const DIST = join(process.cwd(), 'dist');
const FROM = 'https://www.nutube.kr';
const TO = 'https://nutube.kr';
const TARGET_EXTENSIONS = new Set(['.html', '.xml', '.txt']);

let changedFiles = 0;

function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const filePath = join(dir, name);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      walk(filePath);
      continue;
    }

    if (!TARGET_EXTENSIONS.has(extname(filePath))) continue;

    const before = readFileSync(filePath, 'utf-8');
    const after = before.replaceAll(FROM, TO);

    if (after !== before) {
      writeFileSync(filePath, after, 'utf-8');
      changedFiles++;
    }
  }
}

if (!existsSync(DIST)) {
  console.warn('[fix-domain] dist directory not found. Skip domain normalization.');
} else {
  walk(DIST);
  console.log(`[fix-domain] ${changedFiles} file(s) normalized: ${FROM} -> ${TO}`);
}
