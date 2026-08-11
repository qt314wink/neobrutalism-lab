import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createOpenAIGenesisProvider, readGenesisEnvironment } from './openai-provider';
import { proposalDirectoryName, writeGenesisProposal } from './proposal-writer';
import { genesisRequestSchema } from './schema';
import { validateGenesisCandidate } from './validate';

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, 'utf8')) as unknown;
}

async function main(): Promise<void> {
  const requestPath = process.argv[2];
  if (!requestPath) {
    throw new Error('Usage: npm run genesis -- <request.json>');
  }

  const request = genesisRequestSchema.parse(await readJson(requestPath));
  const environment = readGenesisEnvironment(process.env);
  const provider = createOpenAIGenesisProvider(environment);
  const candidate = await provider.generate(request);
  const receipt = validateGenesisCandidate(request, candidate);

  if (!receipt.accepted) {
    console.error(JSON.stringify(receipt, null, 2));
    process.exitCode = 1;
    return;
  }

  const proposalRoot = path.join('.genesis', 'proposals', proposalDirectoryName(candidate.id));
  const written = await writeGenesisProposal(proposalRoot, candidate, receipt);
  console.log(JSON.stringify({ candidateId: candidate.id, proposalRoot, written }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
