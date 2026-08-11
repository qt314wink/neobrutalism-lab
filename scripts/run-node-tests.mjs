import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(target));
    else if (entry.name.endsWith('.node.test.ts') || entry.name.endsWith('.test.mjs')) files.push(target);
  }
  return files;
}

const files = [
  ...await collect('packages'),
  ...await collect('scripts'),
].sort();

if (files.length === 0) {
  console.error('node-tests:error no Node test files found');
  process.exit(1);
}
const result = spawnSync(process.execPath, ['--experimental-strip-types', '--test', ...files], { stdio: 'inherit' });
process.exit(result.status ?? 1);
