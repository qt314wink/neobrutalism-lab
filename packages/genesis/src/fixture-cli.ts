import { readFile } from 'node:fs/promises';
import { validateGenesisCandidate } from './validate';

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8')) as unknown;
}

const requestPath = process.argv[2] ?? 'packages/genesis/fixtures/request.valid.json';
const candidatePath = process.argv[3] ?? 'packages/genesis/fixtures/candidate.valid.json';
const receipt = validateGenesisCandidate(await readJson(requestPath), await readJson(candidatePath));
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.accepted) process.exitCode = 1;
