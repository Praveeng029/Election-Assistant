import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';

/**
 * renderWithAuth – wraps any component inside AuthProvider so hooks that call
 * useAuth() resolve correctly during tests.
 */
export function renderWithAuth(ui, options = {}) {
  const Wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
  return render(ui, { wrapper: Wrapper, ...options });
}
