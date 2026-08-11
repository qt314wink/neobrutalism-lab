import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  GenesisProviderError,
  OpenAIGenesisProvider,
  readGenesisEnvironment,
  validateGenesisCandidate,
  writeGenesisProposal,
} from '../src/index.ts';

const request = JSON.parse(await readFile('packages/genesis/fixtures/request.valid.json', 'utf8'));
const candidate = JSON.parse(await readFile('packages/genesis/fixtures/candidate.valid.json', 'utf8'));

describe('OpenAIGenesisProvider', () => {
  it('requests strict structured output while preserving the governed design problem', async () => {
    let captured: unknown;
    const provider = new OpenAIGenesisProvider(async (input) => {
      captured = input;
      return { output_text: JSON.stringify(candidate) };
    }, 'gpt-test');

    const generated = await provider.generate(request);
    expect(generated.id).toBe(candidate.id);
    expect(captured).toMatchObject({
      model: 'gpt-test',
      text: {
        format: {
          type: 'json_schema',
          name: 'genesis_candidate',
          strict: true,
        },
      },
    });
    expect(JSON.stringify(captured)).toContain(request.problem);
    expect(JSON.stringify(captured)).toContain(request.painPoint);
    expect(JSON.stringify(captured)).toContain('alternatives');
    expect(JSON.stringify(captured)).toContain('qaChecks');
  });

  it('rejects malformed provider output before it can become a candidate', async () => {
    const provider = new OpenAIGenesisProvider(async () => ({ output_text: '{"id":"not-enough"}' }), 'gpt-test');
    await expect(provider.generate(request)).rejects.toMatchObject({ code: 'invalid_output' });
  });
});

describe('environment preflight', () => {
  it('fails before provider invocation when credentials or model are missing', () => {
    expect(() => readGenesisEnvironment({})).toThrow(GenesisProviderError);
    expect(() => readGenesisEnvironment({ OPENAI_API_KEY: 'key-only' })).toThrow(/OPENAI_MODEL/);
    expect(readGenesisEnvironment({ OPENAI_API_KEY: 'test-key', OPENAI_MODEL: 'gpt-test' })).toEqual({
      apiKey: 'test-key',
      model: 'gpt-test',
    });
  });
});

describe('proposal-only materialization', () => {
  it('writes candidate evidence and proposed files only underneath an isolated proposal root', async () => {
    const receipt = validateGenesisCandidate(request, candidate);
    expect(receipt.accepted).toBe(true);
    const root = await mkdtemp(path.join(tmpdir(), 'nb-genesis-'));

    try {
      const written = await writeGenesisProposal(root, candidate, receipt);
      const normalizedRoot = path.resolve(root);
      expect(written.every((file) => path.resolve(file).startsWith(`${normalizedRoot}${path.sep}`))).toBe(true);
      expect(written.some((file) => file.endsWith(path.join('files', 'packages', 'patterns', 'src', 'MetricRail.tsx')))).toBe(true);
      const materialized = await readFile(path.join(root, 'files', 'packages', 'patterns', 'src', 'MetricRail.tsx'), 'utf8');
      expect(materialized).toContain('MetricRail');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('refuses to materialize a rejected candidate receipt', async () => {
    const rejected = { ...validateGenesisCandidate(request, candidate), accepted: false };
    const root = await mkdtemp(path.join(tmpdir(), 'nb-genesis-reject-'));
    try {
      await expect(writeGenesisProposal(root, candidate, rejected)).rejects.toMatchObject({ code: 'rejected_candidate' });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('refuses a stale accepted receipt when the candidate changes after validation', async () => {
    const receipt = validateGenesisCandidate(request, candidate);
    expect(receipt.accepted).toBe(true);
    const mutated = structuredClone(candidate);
    mutated.files[0].dependencies.push('@neobrutalism-lab/apps');
    const root = await mkdtemp(path.join(tmpdir(), 'nb-genesis-stale-'));
    try {
      await expect(writeGenesisProposal(root, mutated, receipt)).rejects.toMatchObject({ code: 'rejected_candidate' });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
