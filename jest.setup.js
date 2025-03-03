// Add Jest extended matchers
import '@testing-library/jest-dom';

// Mock chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
    getManifest: jest.fn().mockReturnValue({
      oauth2: {
        client_id: 'test-client-id',
        scopes: ['test-scope'],
      },
    }),
    lastError: null,
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn(),
    create: jest.fn(),
  },
  identity: {
    launchWebAuthFlow: jest.fn(),
  },
  scripting: {
    executeScript: jest.fn(),
  },
};

// Mock fetch
global.fetch = jest.fn();

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://chatgpt.com/',
  },
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};