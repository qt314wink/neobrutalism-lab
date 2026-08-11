import { beforeEach, describe, expect, it } from 'vitest';
import { INITIAL_BLOGS } from '../data/seed';
import { isBlogPost, loadStoredArray } from '../lib/storage';

describe('loadStoredArray', () => {
  beforeEach(() => localStorage.clear());
  it('falls back when stored JSON is malformed', () => { localStorage.setItem('blogs', '{broken'); expect(loadStoredArray('blogs', INITIAL_BLOGS, isBlogPost)).toEqual(INITIAL_BLOGS); });
  it('falls back when stored data is not an array', () => { localStorage.setItem('blogs', JSON.stringify({ title: 'wrong shape' })); expect(loadStoredArray('blogs', INITIAL_BLOGS, isBlogPost)).toEqual(INITIAL_BLOGS); });
  it('restores a valid array', () => { const stored = [{ ...INITIAL_BLOGS[0], id: 9001 }]; localStorage.setItem('blogs', JSON.stringify(stored)); expect(loadStoredArray('blogs', INITIAL_BLOGS, isBlogPost)).toEqual(stored); });
});
