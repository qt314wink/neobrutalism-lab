import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePhysicalOffset } from '../src/index.ts';

test('couples rest depth to visible hard shadow', () => {
  assert.deepEqual(resolvePhysicalOffset('rest', 4), { state:'rest', depth:4, translateX:0, translateY:0, shadowX:4, shadowY:4, transitionMs:120, opacity:1 });
});
test('lifts hover and focus while increasing apparent depth', () => {
  assert.equal(resolvePhysicalOffset('hover', 4).translateY, -2);
  assert.equal(resolvePhysicalOffset('hover', 4).shadowY, 6);
  assert.equal(resolvePhysicalOffset('focus', 4).shadowY, 6);
});
test('press translates by full depth and collapses shadow', () => {
  const pressed = resolvePhysicalOffset('pressed', 8);
  assert.equal(pressed.translateX, 8); assert.equal(pressed.translateY, 8); assert.equal(pressed.shadowX, 0); assert.equal(pressed.shadowY, 0);
});
test('clamps unsupported depth and disables motion for disabled state', () => {
  const disabled = resolvePhysicalOffset('disabled', 99);
  assert.equal(disabled.depth, 4); assert.equal(disabled.transitionMs, 0); assert.equal(disabled.opacity, 0.55);
});
test('reduced motion preserves state without transition duration', () => {
  const selected = resolvePhysicalOffset('selected', 4, { reducedMotion: true });
  assert.equal(selected.transitionMs, 0); assert.equal(selected.depth, 4);
});
