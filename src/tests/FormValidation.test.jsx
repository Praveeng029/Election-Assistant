/**
 * FormValidation.test.jsx – Form Validation Tests
 * Tests all validation logic inside the AuthModal login/signup form:
 * empty fields, short passwords, mismatched passwords, invalid emails,
 * and success paths.
 */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import AuthModal from '../components/AuthModal';
import { renderWithAuth } from './testUtils';

// Helper: click the submit button by its CSS class (always unambiguous)
const clickSubmit = async (user) => {
  const btn = document.querySelector('button.auth-submit-btn');
  await user.click(btn);
};

// Helper: switch to the Sign Up tab
const switchToSignup = async (user) => {
  const signupTab = document.querySelector('button.auth-tab:last-of-type');
  await user.click(signupTab);
};

// ─── Login Validation ─────────────────────────────────────────────────────────
describe('🔒 Login Form Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form when modal is open', () => {
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(document.getElementById('auth-password')).toBeInTheDocument();
  });

  it('shows error for password shorter than 6 characters', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(document.getElementById('auth-password'), '123'); // too short
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('does not call Firebase login when password is too short', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(document.getElementById('auth-password'), '12');
    await clickSubmit(user);

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('shows Firebase error for invalid credentials', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'wrong@test.com');
    await user.type(document.getElementById('auth-password'), 'wrongpass');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('shows network error message on connection failure', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/network-request-failed' });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(document.getElementById('auth-password'), 'password123');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('shows generic error for unknown Firebase errors', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/unknown', message: 'Unknown error' });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(document.getElementById('auth-password'), 'password123');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('shows success message after successful login', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@test.com' } });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(document.getElementById('auth-password'), 'validpass');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/logged in successfully/i)).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    // Make login hang so loading stays true
    signInWithEmailAndPassword.mockImplementationOnce(() => new Promise(() => {}));
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(document.getElementById('auth-password'), 'password123');
    await clickSubmit(user);

    await waitFor(() => {
      expect(document.querySelector('button.auth-submit-btn')).toBeDisabled();
    });
  });
});

// ─── Sign Up Validation ───────────────────────────────────────────────────────
describe('📝 Sign Up Form Validation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders confirm password field in signup mode', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);
    await switchToSignup(user);
    expect(document.getElementById('auth-confirm')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);
    await switchToSignup(user);

    await user.type(screen.getByLabelText(/email address/i), 'new@test.com');
    await user.type(document.getElementById('auth-password'), 'password123');
    await user.type(document.getElementById('auth-confirm'), 'differentpass');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('does NOT call Firebase signup when passwords mismatch', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);
    await switchToSignup(user);

    await user.type(screen.getByLabelText(/email address/i), 'new@test.com');
    await user.type(document.getElementById('auth-password'), 'abc123');
    await user.type(document.getElementById('auth-confirm'), 'xyz999');
    await clickSubmit(user);

    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('shows error when signup password is shorter than 6 characters', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);
    await switchToSignup(user);

    await user.type(screen.getByLabelText(/email address/i), 'new@test.com');
    await user.type(document.getElementById('auth-password'), '12');
    await user.type(document.getElementById('auth-confirm'), '12');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('shows error when email is already in use', async () => {
    const user = userEvent.setup();
    createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);
    await switchToSignup(user);

    await user.type(screen.getByLabelText(/email address/i), 'existing@test.com');
    await user.type(document.getElementById('auth-password'), 'validpass');
    await user.type(document.getElementById('auth-confirm'), 'validpass');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/already registered/i)).toBeInTheDocument();
    });
  });

  it('shows success message after successful signup', async () => {
    const user = userEvent.setup();
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'new@test.com' } });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);
    await switchToSignup(user);

    await user.type(screen.getByLabelText(/email address/i), 'new@test.com');
    await user.type(document.getElementById('auth-password'), 'validpass');
    await user.type(document.getElementById('auth-confirm'), 'validpass');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    });
  });

  it('clears errors when switching between login and signup tabs', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    // Trigger an error in login mode
    await user.type(screen.getByLabelText(/email address/i), 'x@x.com');
    await user.type(document.getElementById('auth-password'), '12');
    await clickSubmit(user);
    await waitFor(() => expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument());

    // Switch to signup – error should disappear
    await switchToSignup(user);
    await waitFor(() => {
      expect(screen.queryByText(/at least 6 characters/i)).not.toBeInTheDocument();
    });
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    const passwordInput = document.getElementById('auth-password');
    expect(passwordInput.type).toBe('password');

    const eyeBtn = document.querySelector('.auth-eye-btn');
    await user.click(eyeBtn);
    expect(passwordInput.type).toBe('text');

    await user.click(eyeBtn);
    expect(passwordInput.type).toBe('password');
  });
});
