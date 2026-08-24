import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => cleanup());
Object.defineProperty(window, 'scrollTo', { value: () => undefined, writable: true });

class TestIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}
Object.defineProperty(globalThis, 'IntersectionObserver', { value: TestIntersectionObserver, writable: true });
Object.defineProperty(window, 'matchMedia', { value: (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }), writable: true });
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { value: () => null, writable: true });
