import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';

/**
 * renderWithAuth – wraps any component inside AuthProvider so hooks that call
 * useAuth() resolve correctly during tests.
 * Pass { user } in options to simulate a logged-in user.
 */
export function renderWithAuth(ui, { user = null, ...options } = {}) {
  const Wrapper = ({ children }) => {
    if (user) {
      // Inject a mock logged-in user directly into the context
      return (
        <AuthContext.Provider value={{ user, loading: false, login: vi.fn(), signup: vi.fn(), loginWithGoogle: vi.fn(), logout: vi.fn() }}>
          {children}
        </AuthContext.Provider>
      );
    }
    return <AuthProvider>{children}</AuthProvider>;
  };
  return render(ui, { wrapper: Wrapper, ...options });
}
