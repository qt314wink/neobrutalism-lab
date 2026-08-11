import assert from 'node:assert/strict';
import test from 'node:test';
import { validateDependencyPair, validateBoundaryModel } from './validate-boundaries.mjs';

test('allows a layer to consume itself or lower layers', () => {
  assert.deepEqual(validateDependencyPair('primitives', 'interaction'), []);
  assert.deepEqual(validateDependencyPair('patterns', 'primitives'), []);
  assert.deepEqual(validateDependencyPair('compositions', 'patterns'), []);
});

test('rejects upward dependencies', () => {
  assert.match(validateDependencyPair('primitives', 'patterns').join('\n'), /primitives cannot depend on patterns/);
  assert.match(validateDependencyPair('tokens', 'interaction').join('\n'), /tokens cannot depend on interaction/);
});

test('restricts genesis internal dependencies to contracts and tokens', () => {
  assert.deepEqual(validateDependencyPair('genesis', 'contracts'), []);
  assert.deepEqual(validateDependencyPair('genesis', 'tokens'), []);
  assert.match(validateDependencyPair('genesis', 'primitives').join('\n'), /genesis may only depend on contracts or tokens/);
});

test('rejects unknown internal package targets', () => {
  const result = validateBoundaryModel({
    packages: [{ name: 'primitives', manifestDependencies: [], imports: ['@neobrutalism-lab/not-real'] }],
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /unknown internal package not-real/);
});

test('rejects upward manifest dependencies and source imports with file evidence', () => {
  const result = validateBoundaryModel({
    packages: [
      {
        name: 'primitives',
        manifestDependencies: ['@neobrutalism-lab/patterns'],
        imports: [{ specifier: '@neobrutalism-lab/compositions', file: 'packages/primitives/src/Bad.tsx' }],
      },
    ],
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /manifest.*primitives cannot depend on patterns/);
  assert.match(result.errors.join('\n'), /Bad\.tsx.*primitives cannot depend on compositions/);
});
