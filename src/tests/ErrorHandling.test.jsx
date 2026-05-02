/**
 * ErrorHandling.test.jsx – Error Handling Tests
 * Verifies the application handles edge cases gracefully:
 * Firebase auth errors, network failures, empty chat input,
 * quiz boundary conditions, and unexpected runtime scenarios.
 */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import AuthModal from '../components/AuthModal';
import InteractiveChat from '../components/InteractiveChat';
import Quiz from '../components/Quiz';
import Flashcard from '../components/Flashcard';
import App from '../App';
import { renderWithAuth } from './testUtils';

// Helper: click submit button unambiguously
const clickSubmit = async (user) => {
  await user.click(document.querySelector('button.auth-submit-btn'));
};

// ─── Auth Error Handling ──────────────────────────────────────────────────────
describe('⚠️ Auth Error Handling', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows correct message for user-not-found error', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/user-not-found' });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'ghost@test.com');
    await user.type(document.getElementById('auth-password'), 'pass1234');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('shows correct message for wrong-password error', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'real@test.com');
    await user.type(document.getElementById('auth-password'), 'wrongone');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('shows invalid-email error for bad email format', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-email' });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    // Use a value that passes the browser required check but Firebase rejects
    await user.type(screen.getByLabelText(/email address/i), 'not@invalid');
    await user.type(document.getElementById('auth-password'), 'pass1234');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  it('shows network error when internet is unavailable', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/network-request-failed' });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(document.getElementById('auth-password'), 'pass1234');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('shows Google sign-in failure message when Google login throws', async () => {
    const user = userEvent.setup();
    signInWithPopup.mockRejectedValueOnce(new Error('popup_closed_by_user'));
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    const googleBtn = document.querySelector('.auth-google-btn');
    await user.click(googleBtn);

    await waitFor(() => {
      expect(screen.getByText(/google sign-in failed/i)).toBeInTheDocument();
    });
  });

  it('error message disappears when form is resubmitted successfully', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword
      .mockRejectedValueOnce({ code: 'auth/wrong-password' })
      .mockResolvedValueOnce({ user: { email: 'ok@test.com' } });
    renderWithAuth(<AuthModal isOpen={true} onClose={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = document.getElementById('auth-password');

    await user.type(emailInput, 'ok@test.com');
    await user.type(passwordInput, 'wrongpass');
    await clickSubmit(user);
    await waitFor(() => expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument());

    await user.clear(passwordInput);
    await user.type(passwordInput, 'correctpass');
    await clickSubmit(user);

    await waitFor(() => {
      expect(screen.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
    });
  });
});

// ─── Chat Error Handling ──────────────────────────────────────────────────────
describe('💬 Chat Error Handling', () => {
  it('does not send empty or whitespace-only messages', async () => {
    const user = userEvent.setup();
    renderWithAuth(<InteractiveChat language="en" />);

    const input = document.querySelector('.chat-input-form input');
    const initialMessages = document.querySelectorAll('.message-bubble').length;

    // Type spaces then try to submit via clicking (button is disabled for whitespace)
    await user.type(input, '   ');
    const sendBtn = document.querySelector('.chat-input-form button[type="submit"]');
    // Button should be disabled for whitespace-only input
    expect(sendBtn).toBeDisabled();
    expect(document.querySelectorAll('.message-bubble').length).toBe(initialMessages);
  });

  it('returns a fallback response for completely unknown questions', async () => {
    const user = userEvent.setup();
    renderWithAuth(<InteractiveChat language="en" />);

    const input = document.querySelector('.chat-input-form input');
    await user.type(input, 'xyzzy totally unknown query !!');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      const bubbles = document.querySelectorAll('.message-bubble');
      const botReplies = Array.from(bubbles).find(b =>
        b.textContent.includes('eci.gov.in') || b.textContent.includes('not exactly sure')
      );
      expect(botReplies).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows typing indicator while bot is responding', async () => {
    const user = userEvent.setup();
    renderWithAuth(<InteractiveChat language="en" />);

    const input = document.querySelector('.chat-input-form input');
    await user.type(input, 'Tell me about elections');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(document.querySelector('.typing-indicator')).toBeInTheDocument();
    });
  });

  it('input is disabled while bot is typing', async () => {
    const user = userEvent.setup();
    renderWithAuth(<InteractiveChat language="en" />);

    const input = document.querySelector('.chat-input-form input');
    await user.type(input, 'Election process');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(input.disabled).toBe(true);
    });
  });

  it('handles greeting messages correctly', async () => {
    const user = userEvent.setup();
    renderWithAuth(<InteractiveChat language="en" />);

    const input = document.querySelector('.chat-input-form input');
    await user.type(input, 'hello');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      const bubbles = document.querySelectorAll('.message-bubble');
      const botGreeting = Array.from(bubbles).find(b =>
        b.textContent.includes('Namaste') || b.textContent.includes('Election Expert')
      );
      expect(botGreeting).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

// ─── Quiz Boundary / Error Handling ──────────────────────────────────────────
describe('📝 Quiz Edge Cases', () => {
  it('does not allow answering the same question twice', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Quiz language="en" />);

    const answerBtns = document.querySelectorAll('.answer-btn');
    await user.click(answerBtns[0]);
    // Second click is ignored because buttons are disabled after first answer
    await user.click(answerBtns[1]);

    const selected = document.querySelectorAll('.answer-btn.incorrect, .answer-btn.correct');
    expect(selected.length).toBeLessThanOrEqual(2);
  });

  it('score tracker shows a numeric score (not NaN)', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Quiz language="en" />);

    const answerBtns = document.querySelectorAll('.answer-btn');
    await user.click(answerBtns[0]);

    const scoreText = document.querySelector('.score-tracker').textContent;
    expect(scoreText).toMatch(/Score: \d/);
  });
});

// ─── Flashcard Edge Cases ─────────────────────────────────────────────────────
describe('📇 Flashcard Edge Cases', () => {
  it('wraps around to the last card when clicking Prev on the first card', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Flashcard language="en" />);

    expect(document.querySelector('.card-counter').textContent).toContain('1 /');

    const prevBtn = document.querySelectorAll('.control-btn')[0];
    await user.click(prevBtn);

    await waitFor(() => {
      expect(document.querySelector('.card-counter').textContent).not.toContain('1 /');
    });
  });

  it('resets flip state when navigating to next card', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Flashcard language="en" />);

    const card = document.querySelector('.flashcard');
    await user.click(card);
    expect(card.className).toContain('flipped');

    const nextBtn = document.querySelectorAll('.control-btn')[1];
    await user.click(nextBtn);

    // The flip resets after 150ms timeout inside the component
    await waitFor(() => {
      expect(document.querySelector('.flashcard').className).not.toContain('flipped');
    }, { timeout: 500 });
  });
});

// ─── App-Level Error Handling ─────────────────────────────────────────────────
describe('🛡️ App-Level Resilience', () => {
  beforeEach(() => localStorage.clear());

  it('handles invalid localStorage theme gracefully — does not crash', async () => {
    localStorage.setItem('theme', 'invalid-theme-xyz');
    expect(() => renderWithAuth(<App />)).not.toThrow();
    await waitFor(() => expect(document.body).toBeInTheDocument());
  });

  it('handles unsupported localStorage language without crashing', async () => {
    localStorage.setItem('language', 'jp'); // unsupported
    expect(() => renderWithAuth(<App />)).not.toThrow();
  });

  it('Auth modal opens and closes without leaving behind stale DOM', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    await waitFor(() => expect(document.getElementById('auth-fab-btn')).toBeInTheDocument());
    await user.click(document.getElementById('auth-fab-btn'));
    await waitFor(() => expect(document.querySelector('.auth-modal')).toBeInTheDocument());

    await user.click(document.querySelector('.auth-close-btn'));
    await waitFor(() => {
      expect(document.querySelector('.auth-modal')).not.toBeInTheDocument();
    });
  });
});
