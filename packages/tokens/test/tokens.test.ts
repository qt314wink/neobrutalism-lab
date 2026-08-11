import assert from 'node:assert/strict';
import test from 'node:test';
import {
  color,
  shadow,
  dialects,
  tokenCssVariables,
} from '../src/index.ts';

test('separates semantic color roles from BOLD_CO hue choices', () => {
  assert.deepEqual(Object.keys(color), [
    'ink',
    'paper',
    'action',
    'info',
    'attention',
    'identity',
    'critical',
  ]);
  assert.equal(dialects.boldCo.color.action, '#A2FF00');
  assert.equal(dialects.boldCo.color.info, '#00E5FF');
});

test('declares supported hard-shadow depths', () => {
  assert.deepEqual(shadow.depth, [2, 4, 8]);
});

test('renders semantic CSS custom properties', () => {
  const vars = tokenCssVariables(dialects.boldCo);
  assert.equal(vars['--nb-color-action'], '#A2FF00');
  assert.equal(vars['--nb-shadow-base'], '4px');
  assert.equal(vars['--nb-border-structural'], '3px');
});
