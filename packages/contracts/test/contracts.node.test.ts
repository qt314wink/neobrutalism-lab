import assert from 'node:assert/strict';
import test from 'node:test';
import { isRelationKind } from '../src/index.ts';

test('recognizes governed relationship kinds', () => {
  assert.equal(isRelationKind('composes'), true);
  assert.equal(isRelationKind('uses_token'), true);
  assert.equal(isRelationKind('mystery'), false);
});
