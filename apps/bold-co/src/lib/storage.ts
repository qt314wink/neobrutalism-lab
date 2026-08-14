import type { BlogPost, Review } from '../model';

type Guard<T> = (value: unknown) => value is T;
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

export const isBlogPost: Guard<BlogPost> = (value): value is BlogPost => {
  if (!isRecord(value)) return false;
  return typeof value.id === 'number' && typeof value.title === 'string' && typeof value.category === 'string' && typeof value.color === 'string' && typeof value.date === 'string' && typeof value.readTime === 'string' && typeof value.author === 'string' && typeof value.summary === 'string' && typeof value.content === 'string';
};

export const isReview: Guard<Review> = (value): value is Review => {
  if (!isRecord(value)) return false;
  return typeof value.id === 'number' && typeof value.name === 'string' && typeof value.role === 'string' && typeof value.stars === 'number' && value.stars >= 1 && value.stars <= 5 && typeof value.comment === 'string';
};

export function loadStoredArray<T>(key: string, fallback: T[], guard: Guard<T>): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(guard)) return fallback;
    return parsed;
  } catch { return fallback; }
}

export function saveStoredArray<T>(key: string, value: T[]): boolean {
  if (typeof window === 'undefined') return false;
  try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
