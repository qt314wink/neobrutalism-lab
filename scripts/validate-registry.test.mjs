import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalRelationKinds, validateRegistry } from './validate-registry.mjs';

const valid = {
  relationKinds: canonicalRelationKinds,
  nodes: [
    { id: 'a', kind: 'package', layer: 'contracts', status: 'accepted' },
    { id: 'b', kind: 'package', layer: 'tokens', status: 'accepted' },
  ],
  edges: [{ id: 'e', from: 'b', to: 'a', kind: 'depends_on' }],
};

test('accepts a registry with unique nodes and known edge endpoints', () => {
  assert.deepEqual(validateRegistry(valid), { ok: true, errors: [] });
});

test('rejects duplicate node ids', () => {
  const registry = { ...valid, nodes: [...valid.nodes, valid.nodes[0]] };
  const result = validateRegistry(registry);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /duplicate node id: a/);
});

test('rejects edges with unknown endpoints or relation kinds', () => {
  const registry = {
    ...valid,
    edges: [{ id: 'bad', from: 'missing', to: 'a', kind: 'mystery' }],
  };
  const result = validateRegistry(registry);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /unknown from node: missing/);
  assert.match(result.errors.join('\n'), /unknown relation kind: mystery/);
});
