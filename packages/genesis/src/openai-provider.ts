import OpenAI from 'openai';
import { z } from 'zod';
import { genesisCandidateSchema, genesisRequestSchema } from './schema';
import type { GenesisCandidate, GenesisRequest } from './schema';

export type GenesisProviderErrorCode =
  | 'missing_credentials'
  | 'invalid_request'
  | 'invalid_output'
  | 'provider_failure'
  | 'rejected_candidate';

export class GenesisProviderError extends Error {
  readonly code: GenesisProviderErrorCode;

  constructor(code: GenesisProviderErrorCode, message: string) {
    super(message);
    this.name = 'GenesisProviderError';
    this.code = code;
  }
}

export interface GenesisEnvironment {
  apiKey: string;
  model: string;
}

export function readGenesisEnvironment(env: Record<string, string | undefined>): GenesisEnvironment {
  const apiKey = env.OPENAI_API_KEY?.trim();
  const model = env.OPENAI_MODEL?.trim();
  if (!apiKey) throw new GenesisProviderError('missing_credentials', 'OPENAI_API_KEY is required for Genesis provider calls.');
  if (!model) throw new GenesisProviderError('missing_credentials', 'OPENAI_MODEL is required for Genesis provider calls.');
  return { apiKey, model };
}

export interface GenesisResponsesRequest {
  model: string;
  instructions: string;
  input: string;
  text: {
    format: {
      type: 'json_schema';
      name: 'genesis_candidate';
      description: string;
      strict: true;
      schema: Record<string, unknown>;
    };
  };
}

export interface GenesisResponsesResult {
  output_text: string;
}

export type GenesisResponsesCreate = (request: GenesisResponsesRequest) => Promise<GenesisResponsesResult>;

function candidateJsonSchema(): Record<string, unknown> {
  return z.toJSONSchema(genesisCandidateSchema) as Record<string, unknown>;
}

export function buildGenesisResponseRequest(requestInput: unknown, model: string): GenesisResponsesRequest {
  const parsed = genesisRequestSchema.safeParse(requestInput);
  if (!parsed.success) {
    throw new GenesisProviderError(
      'invalid_request',
      parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(' | '),
    );
  }

  const request = parsed.data;
  return {
    model,
    instructions: [
      'You are a governed design-system candidate generator.',
      'Produce only a proposal candidate matching the supplied JSON Schema.',
      'Never claim that proposed files are accepted source and never request direct mutation.',
      'Every design decision must cite one or more supplied observation IDs and compare explicit alternatives.',
      'Provide concise rationale summaries tied to evidence; do not provide hidden chain-of-thought.',
      'Every request constraint and benchmark must be covered by both a test plan and a QA check.',
      'Only use dependencies and target roots explicitly allowed by the request.',
      'Keep the artifact domain-neutral unless the request explicitly establishes a product dialect.',
    ].join(' '),
    input: JSON.stringify({
      problem: request.problem,
      painPoint: request.painPoint,
      target: request.target,
      observations: request.observations,
      constraints: request.constraints,
      benchmarks: request.benchmarks,
      allowedDependencies: request.allowedDependencies,
      allowedWriteRoots: request.allowedWriteRoots,
      knownSystemNodes: request.knownSystemNodes,
      requiredRequestId: request.id,
    }),
    text: {
      format: {
        type: 'json_schema',
        name: 'genesis_candidate',
        description: 'A proposal-only design/code candidate with alternatives, evidence references, tests, QA, graph relations, risks, and unresolved questions.',
        strict: true,
        schema: candidateJsonSchema(),
      },
    },
  };
}

export interface GenesisProvider {
  generate(request: GenesisRequest): Promise<GenesisCandidate>;
}

export class OpenAIGenesisProvider implements GenesisProvider {
  readonly #createResponse: GenesisResponsesCreate;
  readonly #model: string;

  constructor(createResponse: GenesisResponsesCreate, model: string) {
    this.#createResponse = createResponse;
    this.#model = model;
  }

  async generate(request: GenesisRequest): Promise<GenesisCandidate> {
    const responseRequest = buildGenesisResponseRequest(request, this.#model);
    let response: GenesisResponsesResult;
    try {
      response = await this.#createResponse(responseRequest);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new GenesisProviderError('provider_failure', `OpenAI Responses request failed: ${detail}`);
    }

    let decoded: unknown;
    try {
      decoded = JSON.parse(response.output_text) as unknown;
    } catch {
      throw new GenesisProviderError('invalid_output', 'Provider output_text was not valid JSON.');
    }

    const parsed = genesisCandidateSchema.safeParse(decoded);
    if (!parsed.success) {
      throw new GenesisProviderError(
        'invalid_output',
        `Provider output failed the Genesis candidate schema: ${parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(' | ')}`,
      );
    }
    return parsed.data;
  }
}

export function createOpenAIGenesisProvider(environment: GenesisEnvironment): OpenAIGenesisProvider {
  const client = new OpenAI({ apiKey: environment.apiKey });
  return new OpenAIGenesisProvider(async (request) => {
    const response = await client.responses.create(request);
    return { output_text: response.output_text };
  }, environment.model);
}
