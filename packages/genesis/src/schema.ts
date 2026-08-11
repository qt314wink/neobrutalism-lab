import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);
const idString = z.string().trim().min(3);
const refArray = z.array(idString).min(1);

export const observationSchema = z.object({
  id: idString,
  statement: nonEmptyString,
  evidence: z.array(nonEmptyString),
}).strict();

export const constraintSchema = z.object({
  id: idString,
  statement: nonEmptyString,
}).strict();

export const benchmarkSchema = z.object({
  id: idString,
  statement: nonEmptyString,
  measure: nonEmptyString,
}).strict();

export const genesisRequestSchema = z.object({
  id: idString,
  problem: nonEmptyString,
  painPoint: nonEmptyString,
  target: z.object({
    kind: z.enum(['asset', 'token', 'interaction', 'primitive', 'pattern', 'assembly', 'composition', 'configuration', 'module', 'test']),
    name: nonEmptyString,
  }).strict(),
  observations: z.array(observationSchema).min(1),
  constraints: z.array(constraintSchema).min(1),
  benchmarks: z.array(benchmarkSchema).min(1),
  allowedDependencies: z.array(nonEmptyString),
  allowedWriteRoots: z.array(nonEmptyString).min(1),
  knownSystemNodes: z.array(idString),
}).strict();

export const systemNodeProposalSchema = z.object({
  id: idString,
  kind: z.enum(['package', 'token', 'mechanism', 'primitive', 'pattern', 'assembly', 'composition', 'test', 'observation', 'constraint', 'benchmark', 'proposal']),
  layer: z.enum(['contracts', 'tokens', 'interaction', 'primitives', 'patterns', 'assemblies', 'compositions', 'apps', 'governance']),
  status: z.literal('candidate'),
  label: nonEmptyString,
}).strict();

export const relationshipSchema = z.object({
  id: idString,
  from: idString,
  to: idString,
  kind: z.enum(['depends_on', 'derived_from', 'implements', 'uses_token', 'composes', 'validated_by', 'constrained_by', 'optimizes', 'alternative_to']),
}).strict();

export const genesisCandidateSchema = z.object({
  id: idString,
  requestId: idString,
  writeMode: z.literal('proposal_only'),
  requestContext: z.object({
    problem: nonEmptyString,
    painPoint: nonEmptyString,
  }).strict(),
  summary: nonEmptyString,
  assumptions: z.array(nonEmptyString),
  alternatives: z.array(z.object({
    id: idString,
    title: nonEmptyString,
    description: nonEmptyString,
    tradeoffs: z.array(nonEmptyString).min(1),
  }).strict()).min(2),
  decisions: z.array(z.object({
    id: idString,
    decision: nonEmptyString,
    observationRefs: refArray,
    alternativeRefs: refArray,
    rationaleSummary: nonEmptyString,
  }).strict()).min(1),
  nodes: z.array(systemNodeProposalSchema).min(1),
  files: z.array(z.object({
    path: nonEmptyString,
    purpose: nonEmptyString,
    content: z.string(),
    dependencies: z.array(nonEmptyString),
    observationRefs: refArray,
  }).strict()).min(1),
  tests: z.array(z.object({
    id: idString,
    name: nonEmptyString,
    kind: z.enum(['unit', 'component', 'integration', 'accessibility', 'visual', 'contract']),
    spec: nonEmptyString,
    constraintRefs: refArray,
    benchmarkRefs: refArray,
  }).strict()).min(1),
  qaChecks: z.array(z.object({
    id: idString,
    spec: nonEmptyString,
    constraintRefs: refArray,
    benchmarkRefs: refArray,
  }).strict()).min(1),
  relationships: z.array(relationshipSchema),
  risks: z.array(z.object({
    id: idString,
    statement: nonEmptyString,
    mitigation: nonEmptyString,
  }).strict()),
  openQuestions: z.array(nonEmptyString),
}).strict();

export type GenesisRequest = z.infer<typeof genesisRequestSchema>;
export type GenesisCandidate = z.infer<typeof genesisCandidateSchema>;
