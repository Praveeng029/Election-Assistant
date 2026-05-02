import '@testing-library/jest-dom';

// ─── Browser API stubs (jsdom gaps) ─────────────────────────────────────────
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// ─── Mock Firebase ──────────────────────────────────────────────────────────
// Prevent real Firebase SDK calls during tests
vi.mock('../firebase', () => ({
  auth: {},
  googleProvider: {},
  default: {},
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null); // simulate no user by default
    return vi.fn(); // unsubscribe
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(() => ({})),
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false)),
}));

// ─── Mock localStorage ───────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ─── Suppress noisy console errors in test output ────────────────────────────
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('not wrapped in act'))
    ) return;
    originalError(...args);
  };
});
afterAll(() => { console.error = originalError; });
