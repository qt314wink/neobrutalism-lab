import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Receipt } from '@neobrutalism-lab/contracts';
import { candidateDigest } from './integrity';
import type { GenesisCandidate } from './schema';
import { GenesisProviderError } from './openai-provider';

function assertInside(root: string, target: string): void {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  if (resolvedTarget === resolvedRoot || !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new GenesisProviderError('rejected_candidate', `Refusing proposal path outside isolated root: ${target}`);
  }
}

export async function writeGenesisProposal(
  proposalRoot: string,
  candidate: GenesisCandidate,
  receipt: Receipt,
): Promise<string[]> {
  const currentDigest = candidateDigest(candidate);
  if (!receipt.accepted || receipt.subjectId !== candidate.id || receipt.subjectDigest !== currentDigest) {
    throw new GenesisProviderError(
      'rejected_candidate',
      'Only the exact deterministically accepted candidate bound to this receipt may materialize proposal files.',
    );
  }

  const root = path.resolve(proposalRoot);
  await mkdir(root, { recursive: true });
  const written: string[] = [];

  const metadata = [
    { name: 'candidate.json', content: `${JSON.stringify(candidate, null, 2)}\n` },
    { name: 'receipt.json', content: `${JSON.stringify(receipt, null, 2)}\n` },
  ];
  for (const item of metadata) {
    const target = path.join(root, item.name);
    assertInside(root, target);
    await writeFile(target, item.content, 'utf8');
    written.push(target);
  }

  for (const file of candidate.files) {
    const target = path.join(root, 'files', file.path);
    assertInside(root, target);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.content, 'utf8');
    written.push(target);
  }

  return written;
}

export function proposalDirectoryName(candidateId: string): string {
  const safe = candidateId.replace(/[^A-Za-z0-9._-]+/gu, '_').replace(/^_+|_+$/gu, '');
  if (!safe) throw new GenesisProviderError('rejected_candidate', 'Candidate ID cannot produce an empty proposal directory name.');
  return safe;
}
