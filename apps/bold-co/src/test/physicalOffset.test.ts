import { describe, expect, it } from 'vitest';
import { physicalOffsetStyle } from '../design/physicalOffset';

describe('physicalOffsetStyle', () => {
  it('couples visible shadow and press distance', () => { expect(physicalOffsetStyle(4)).toEqual({ boxShadow: '4px 4px 0 0 #000000', '--press-offset': '4px' }); });
  it('falls back to canonical 4px for undeclared offsets', () => { expect(physicalOffsetStyle(5)['--press-offset']).toBe('4px'); });
});
