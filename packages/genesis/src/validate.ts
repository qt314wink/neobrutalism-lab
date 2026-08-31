import path from 'node:path';
import type { Receipt, ValidationCheck } from '@neobrutalism-lab/contracts';
import { candidateDigest } from './integrity';
import { genesisCandidateSchema, genesisRequestSchema } from './schema';
import type { GenesisCandidate, GenesisRequest } from './schema';

function subjectId(candidate: unknown): string {
  if (typeof candidate === 'object' && candidate !== null && 'id' in candidate && typeof candidate.id === 'string') {
    return candidate.id;
  }
  return 'genesis-candidate:unknown';
}

function check(id: string, failures: string[], success: string): ValidationCheck {
  return failures.length === 0
    ? { id, status: 'pass', detail: success }
    : { id, status: 'fail', detail: failures.join(' | ') };
}

function uniqueFailures(values: readonly string[], label: string): string[] {
  const seen = new Set<string>();
  const failures: string[] = [];
  for (const value of values) {
    if (seen.has(value)) failures.push(`duplicate ${label}: ${value}`);
    seen.add(value);
  }
  return failures;
}

function normalizeRelative(value: string): string | null {
  const slashValue = value.replaceAll('\\', '/');
  if (slashValue.includes('\0') || slashValue.includes('\u0000') || slashValue.startsWith('/') || /^[A-Za-z]:\//u.test(slashValue)) return null;
  const normalized = path.posix.normalize(slashValue).replace(/^\.\//u, '');
  if (normalized === '..' || normalized.startsWith('../') || normalized === '.') return null;
  return normalized;
}

function pathFailures(request: GenesisRequest, candidate: GenesisCandidate): string[] {
  const roots = request.allowedWriteRoots.map((root) => {
    const normalized = normalizeRelative(root);
    return { raw: root, normalized: normalized?.replace(/\/+$/u, '') || normalized };
  });
  const failures = roots.filter((root) => root.normalized === null).map((root) => `unsafe allowed root: ${root.raw}`);
  const normalizedPaths = candidate.files.map((file) => normalizeRelative(file.path)).filter((value): value is string => value !== null);
  failures.push(...uniqueFailures(normalizedPaths, 'normalized file path'));

  for (const file of candidate.files) {
    const normalized = normalizeRelative(file.path);
    if (normalized === null) {
      failures.push(`unsafe file path: ${file.path}`);
      continue;
    }
    const insideRoot = roots.some((root) => root.normalized !== null && (normalized === root.normalized || normalized.startsWith(`${root.normalized}/`)));
    if (!insideRoot) failures.push(`path outside allowed roots: ${file.path}`);
  }
  return failures;
}

function importedDependencies(content: string): string[] {
  const dependencies = new Set<string>();
  const patterns = [
    /(?:import|export)\\s+(?:[^'";]*?\\s+from\\s+)?['"]([^'"]+)['"]/gu,
    /(?:import|require)\\(\\s*['"]([^'"]+)['"]\\s*\\)/gu,
  ];
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const specifier = match[1];
      if (!specifier || specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('node:')) continue;
      dependencies.add(specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0] ?? specifier);
    }
  }
  return [...dependencies];
}

function dependencyFailures(request: GenesisRequest, candidate: GenesisCandidate): string[] {
  const allowed = new Set(request.allowedDependencies);
  const failures: string[] = [];
  for (const file of candidate.files) {
    const declared = new Set(file.dependencies);
    for (const dependency of file.dependencies) {
      if (!allowed.has(dependency)) failures.push(`${file.path} uses disallowed dependency ${dependency}`);
    }
    for (const dependency of importedDependencies(file.content)) {
      if (!declared.has(dependency)) failures.push(`${file.path} imports undeclared dependency ${dependency}`);
      if (!allowed.has(dependency)) failures.push(`${file.path} imports disallowed dependency ${dependency}`);
    }
  }
  return failures;
}

function evidenceFailures(request: GenesisRequest, candidate: GenesisCandidate): string[] {
  const knownObservations = new Set(request.observations.map((observation) => observation.id));
  const knownAlternatives = new Set(candidate.alternatives.map((alternative) => alternative.id));
  const failures: string[] = [];

  failures.push(...uniqueFailures(request.observations.map((item) => item.id), 'observation id'));
  failures.push(...uniqueFailures(candidate.alternatives.map((item) => item.id), 'alternative id'));
  failures.push(...uniqueFailures(candidate.decisions.map((item) => item.id), 'decision id'));

  for (const decision of candidate.decisions) {
    for (const ref of decision.observationRefs) if (!knownObservations.has(ref)) failures.push(`${decision.id} references unknown observation ${ref}`);
    for (const ref of decision.alternativeRefs) if (!knownAlternatives.has(ref)) failures.push(`${decision.id} references unknown alternative ${ref}`);
  }
  for (const file of candidate.files) {
    for (const ref of file.observationRefs) if (!knownObservations.has(ref)) failures.push(`${file.path} references unknown observation ${ref}`);
  }
  return failures;
}

function coverageFailures(request: GenesisRequest, candidate: GenesisCandidate): string[] {
  const testConstraints = new Set(candidate.tests.flatMap((item) => item.constraintRefs));
  const testBenchmarks = new Set(candidate.tests.flatMap((item) => item.benchmarkRefs));
  const qaConstraints = new Set(candidate.qaChecks.flatMap((item) => item.constraintRefs));
  const qaBenchmarks = new Set(candidate.qaChecks.flatMap((item) => item.benchmarkRefs));
  const knownConstraints = new Set(request.constraints.map((item) => item.id));
  const knownBenchmarks = new Set(request.benchmarks.map((item) => item.id));
  const failures: string[] = [];

  for (const item of request.constraints) {
    if (!testConstraints.has(item.id)) failures.push(`constraint missing test coverage: ${item.id}`);
    if (!qaConstraints.has(item.id)) failures.push(`constraint missing QA coverage: ${item.id}`);
  }
  for (const item of request.benchmarks) {
    if (!testBenchmarks.has(item.id)) failures.push(`benchmark missing test coverage: ${item.id}`);
    if (!qaBenchmarks.has(item.id)) failures.push(`benchmark missing QA coverage: ${item.id}`);
  }
  for (const test of candidate.tests) {
    for (const ref of test.constraintRefs) if (!knownConstraints.has(ref)) failures.push(`${test.id} references unknown constraint ${ref}`);
    for (const ref of test.benchmarkRefs) if (!knownBenchmarks.has(ref)) failures.push(`${test.id} references unknown benchmark ${ref}`);
  }
  for (const qa of candidate.qaChecks) {
    for (const ref of qa.constraintRefs) if (!knownConstraints.has(ref)) failures.push(`${qa.id} references unknown constraint ${ref}`);
    for (const ref of qa.benchmarkRefs) if (!knownBenchmarks.has(ref)) failures.push(`${qa.id} references unknown benchmark ${ref}`);
  }
  return failures;
}

function graphFailures(request: GenesisRequest, candidate: GenesisCandidate): string[] {
  const candidateNodes = candidate.nodes.map((node) => node.id);
  const knownNodes = new Set([...request.knownSystemNodes, ...candidateNodes]);
  const failures = [
    ...uniqueFailures(candidateNodes, 'candidate node id'),
    ...uniqueFailures(candidate.relationships.map((edge) => edge.id), 'relationship id'),
  ];
  for (const edge of candidate.relationships) {
    if (!knownNodes.has(edge.from)) failures.push(`${edge.id} has unknown from endpoint ${edge.from}`);
    if (!knownNodes.has(edge.to)) failures.push(`${edge.id} has unknown to endpoint ${edge.to}`);
  }
  return failures;
}

function contextFailures(request: GenesisRequest, candidate: GenesisCandidate): string[] {
  const failures: string[] = [];
  if (candidate.requestId !== request.id) failures.push(`requestId mismatch: ${candidate.requestId}`);
  if (candidate.requestContext.problem !== request.problem) failures.push('candidate problem context does not exactly match request problem');
  if (candidate.requestContext.painPoint !== request.painPoint) failures.push('candidate pain-point context does not exactly match request painPoint');
  return failures;
}

export function validateGenesisCandidate(requestInput: unknown, candidateInput: unknown): Receipt {
  const parsedRequest = genesisRequestSchema.safeParse(requestInput);
  const parsedCandidate = genesisCandidateSchema.safeParse(candidateInput);
  const subject = subjectId(candidateInput);

  if (!parsedRequest.success || !parsedCandidate.success) {
    const details = [
      ...(parsedRequest.success ? [] : parsedRequest.error.issues.map((issue) => `request ${issue.path.join('.')}: ${issue.message}`)),
      ...(parsedCandidate.success ? [] : parsedCandidate.error.issues.map((issue) => `candidate ${issue.path.join('.')}: ${issue.message}`)),
    ];
    return {
      id: `receipt:${subject}`,
      subjectId: subject,
      checks: [{ id: 'schema', status: 'fail', detail: details.join(' | ') }],
      accepted: false,
    };
  }

  const request = parsedRequest.data;
  const candidate = parsedCandidate.data;
  const checks: ValidationCheck[] = [
    { id: 'schema', status: 'pass', detail: 'request and candidate match strict Genesis schemas' },
    check('context', contextFailures(request, candidate), 'candidate retains the exact problem and pain-point context'),
    check('paths', pathFailures(request, candidate), 'all proposed destinations are unique, relative, and inside allowed roots'),
    check('dependencies', dependencyFailures(request, candidate), 'all proposed dependencies are explicitly allowed'),
    check('evidence', evidenceFailures(request, candidate), 'all decisions and files reference known observations and alternatives'),
    check('coverage', coverageFailures(request, candidate), 'every constraint and benchmark has both test and QA coverage'),
    check('graph', graphFailures(request, candidate), 'all proposed relationship endpoints resolve to known or candidate nodes'),
  ];

  return {
    id: `receipt:${candidate.id}`,
    subjectId: candidate.id,
    subjectDigest: candidateDigest(candidate),
    checks,
    accepted: checks.every((item) => item.status === 'pass'),
  };
}
