import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Make Vitest's vi available as a global for Jest compatibility
// This allows tests to use jest.mock, jest.fn, etc.
// Make Vitest's vi available as a global for Jest compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).jest = vi;

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// MSW server for API mocking
export const server = setupServer(...handlers);

// Setup mock server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
