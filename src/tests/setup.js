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

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((q, cb) => {
    // Return empty array initially
    cb({ docs: [] });
    return vi.fn();
  }),
  serverTimestamp: vi.fn(() => ({ toMillis: () => Date.now() })),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  where: vi.fn(),
  getFirestore: vi.fn(() => ({})),
}));

vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key-1234567890');

vi.mock('../utils/gemini', () => ({
  getGeminiResponse: vi.fn(async (text) => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (text.includes('xyzzy')) resolve('I am not exactly sure, please check eci.gov.in');
        else if (text.toLowerCase().includes('hello')) resolve('Namaste! Election Expert here.');
        else resolve('Mocked AI response');
      }, 500); // 500ms is enough for state updates but less than waitFor default timeout (1000ms)
    });
  })
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
