/**
 * ButtonClick.test.jsx – Button Click Tests
 * Covers every interactive button: nav tabs, theme toggle, language toggle,
 * auth FAB, assistant FAB, flashcard controls, quiz answers, and chat send.
 */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import { renderWithAuth } from './testUtils';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';
import InteractiveChat from '../components/InteractiveChat';

// ─── Nav Tabs ─────────────────────────────────────────────────────────────────
describe('🖱️ Navigation Button Clicks', () => {
  beforeEach(() => localStorage.clear());

  it('clicking Flashcards nav button activates it', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);
    await waitFor(() => expect(document.querySelector('.nav-menu')).toBeInTheDocument());

    const navBtns = document.querySelectorAll('button.nav-btn');
    // buttons: timeline(0), flashcards(1), quiz(2), chat(3), insights(4)
    await user.click(navBtns[1]);
    expect(navBtns[1].className).toContain('active');
  });

  it('clicking Quiz nav button activates it', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);
    await waitFor(() => expect(document.querySelector('.nav-menu')).toBeInTheDocument());

    const navBtns = document.querySelectorAll('button.nav-btn');
    await user.click(navBtns[2]);
    expect(navBtns[2].className).toContain('active');
  });

  it('clicking Chat nav button activates it', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);
    await waitFor(() => expect(document.querySelector('.nav-menu')).toBeInTheDocument());

    const navBtns = document.querySelectorAll('button.nav-btn');
    await user.click(navBtns[3]);
    expect(navBtns[3].className).toContain('active');
  });

  it('clicking Timeline nav button activates it', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);
    await waitFor(() => expect(document.querySelector('.nav-menu')).toBeInTheDocument());

    const navBtns = document.querySelectorAll('button.nav-btn');
    await user.click(navBtns[1]); // Go to flashcards first
    await user.click(navBtns[0]); // Then back to timeline
    expect(navBtns[0].className).toContain('active');
  });
});

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
describe('🌙 Theme Toggle Button', () => {
  beforeEach(() => localStorage.clear());

  it('toggles from light to dark when theme button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);
    await waitFor(() => expect(document.documentElement.getAttribute('data-theme')).toBe('light'));

    await user.click(document.querySelector('.theme-toggle'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles from dark back to light on second click', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    const btn = document.querySelector('.theme-toggle');
    await user.click(btn); // light → dark
    await user.click(btn); // dark → light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('persists theme to localStorage after toggle', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    await user.click(document.querySelector('.theme-toggle'));
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});

// ─── Language Toggle ──────────────────────────────────────────────────────────
describe('🌐 Language Toggle Button', () => {
  beforeEach(() => localStorage.clear());

  it('switches from English to Hindi when language button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    const langBtn = document.querySelector('.lang-toggle');
    expect(langBtn.textContent).toContain('HI');
    await user.click(langBtn);
    expect(langBtn.textContent).toContain('EN');
  });

  it('persists language to localStorage', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    await user.click(document.querySelector('.lang-toggle'));
    expect(localStorage.getItem('language')).toBe('hi');
  });
});

// ─── Auth FAB ─────────────────────────────────────────────────────────────────
describe('🔐 Auth FAB Button', () => {
  beforeEach(() => localStorage.clear());

  it('opens the Auth Modal when FAB is clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);
    await waitFor(() => expect(document.getElementById('auth-fab-btn')).toBeInTheDocument());

    await user.click(document.getElementById('auth-fab-btn'));
    await waitFor(() => {
      expect(document.querySelector('.auth-modal')).toBeInTheDocument();
    });
  });

  it('closes the Auth Modal when close button is pressed', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    await user.click(document.getElementById('auth-fab-btn'));
    await waitFor(() => expect(document.querySelector('.auth-modal')).toBeInTheDocument());

    await user.click(document.querySelector('.auth-close-btn'));
    await waitFor(() => {
      expect(document.querySelector('.auth-modal')).not.toBeInTheDocument();
    });
  });
});

// ─── Assistant FAB ────────────────────────────────────────────────────────────
describe('💬 Floating Assistant Button', () => {
  beforeEach(() => localStorage.clear());

  it('shows the assistant popup when FAB is clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    await user.click(document.querySelector('.assistant-fab'));
    await waitFor(() => {
      expect(document.querySelector('.assistant-popup')).toBeInTheDocument();
    });
  });

  it('hides the assistant popup on second click (toggle)', async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    const fab = document.querySelector('.assistant-fab');
    await user.click(fab);
    await waitFor(() => expect(document.querySelector('.assistant-popup')).toBeInTheDocument());
    await user.click(fab);
    await waitFor(() => {
      expect(document.querySelector('.assistant-popup')).not.toBeInTheDocument();
    });
  });
});

// ─── Flashcard Controls ───────────────────────────────────────────────────────
describe('📇 Flashcard Button Clicks', () => {
  it('flips the card when clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Flashcard language="en" />);

    const card = document.querySelector('.flashcard');
    expect(card.className).not.toContain('flipped');
    await user.click(card);
    expect(card.className).toContain('flipped');
  });

  it('navigates to next card when Next button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Flashcard language="en" />);

    expect(document.querySelector('.card-counter').textContent).toContain('1 /');
    await user.click(document.querySelectorAll('.control-btn')[1]); // Next
    await waitFor(() => {
      expect(document.querySelector('.card-counter').textContent).toContain('2 /');
    });
  });

  it('navigates to previous card (wraps to last) from first card', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Flashcard language="en" />);

    await user.click(document.querySelectorAll('.control-btn')[0]); // Prev → last
    await waitFor(() => {
      expect(document.querySelector('.card-counter').textContent).not.toContain('1 /');
    });
  });
});

// ─── Quiz Answer Buttons ──────────────────────────────────────────────────────
describe('📝 Quiz Button Clicks', () => {
  it('selects an answer option and disables all buttons', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Quiz language="en" />);

    const answerBtns = document.querySelectorAll('.answer-btn');
    expect(answerBtns.length).toBeGreaterThan(0);
    await user.click(answerBtns[0]);
    expect(answerBtns[0].disabled).toBe(true);
  });

  it('shows the explanation box after answering', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Quiz language="en" />);

    await user.click(document.querySelectorAll('.answer-btn')[0]);
    await waitFor(() => {
      expect(document.querySelector('.explanation-box')).toBeInTheDocument();
    });
  });

  it('shows a correct class on the right answer after selection', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Quiz language="en" />);

    await user.click(document.querySelectorAll('.answer-btn')[0]);
    await waitFor(() => {
      expect(document.querySelector('.answer-btn.correct')).toBeInTheDocument();
    });
  });

  it('resets quiz when Retake button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Quiz language="en" />);

    // Complete the quiz
    const answerAll = async () => {
      while (!document.querySelector('.score-section')) {
        const btns = document.querySelectorAll('.answer-btn:not([disabled])');
        if (!btns.length) break;
        await user.click(btns[0]);
        await waitFor(() => expect(document.querySelector('.explanation-box')).toBeInTheDocument());
        const next = document.querySelector('.next-btn');
        if (next) await user.click(next);
        await new Promise(r => setTimeout(r, 20));
      }
    };
    await answerAll();
    await waitFor(() => expect(document.querySelector('.score-section')).toBeInTheDocument(), { timeout: 15000 });

    await user.click(screen.getByText(/Retake Quiz/i));
    await waitFor(() => {
      expect(document.querySelector('.question-section')).toBeInTheDocument();
    });
  });
});

// ─── Chat Send Button ─────────────────────────────────────────────────────────
describe('💬 Chat Send Button', () => {
  it('send button is disabled when input is empty', () => {
    renderWithAuth(<InteractiveChat language="en" />);
    expect(document.querySelector('.chat-input-form button[type="submit"]')).toBeDisabled();
  });

  it('send button becomes enabled when user types a message', async () => {
    const user = userEvent.setup();
    renderWithAuth(<InteractiveChat language="en" />);

    await user.type(document.querySelector('.chat-input-form input'), 'Hello');
    expect(document.querySelector('.chat-input-form button[type="submit"]')).not.toBeDisabled();
  });

  it('sends a message and shows it in the chat window', async () => {
    const user = userEvent.setup();
    renderWithAuth(<InteractiveChat language="en" />);

    await user.type(document.querySelector('.chat-input-form input'), 'Hello');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      const messages = document.querySelectorAll('.message-bubble');
      const userMsg = Array.from(messages).find(m => m.textContent === 'Hello');
      expect(userMsg).toBeInTheDocument();
    });
  });

  it('clears input after sending a message', async () => {
    const user = userEvent.setup();
    renderWithAuth(<InteractiveChat language="en" />);

    const input = document.querySelector('.chat-input-form input');
    await user.type(input, 'test message');
    await user.keyboard('{Enter}');
    expect(input.value).toBe('');
  });
});
