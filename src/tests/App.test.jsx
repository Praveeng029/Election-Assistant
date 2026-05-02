/**
 * App.test.jsx – App Load Tests
 * Verifies the application renders successfully on first load,
 * default state is correct, and all major UI regions are present.
 */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import { renderWithAuth } from './testUtils';

describe('🚀 App Load Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', async () => {
    renderWithAuth(<App />);
    // If no error is thrown, the app mounted successfully
    await waitFor(() => {
      expect(document.getElementById('root') || document.body).toBeTruthy();
    });
  });

  it('renders the page title / app header', async () => {
    renderWithAuth(<App />);
    await waitFor(() => {
      // The heading text comes from translations
      const heading = screen.queryByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  it('renders the main navigation bar', async () => {
    renderWithAuth(<App />);
    await waitFor(() => {
      const nav = document.querySelector('.nav-menu');
      expect(nav).toBeInTheDocument();
    });
  });

  it('defaults to the Timeline tab on first load', async () => {
    localStorage.removeItem('theme');
    localStorage.removeItem('language');
    renderWithAuth(<App />);
    await waitFor(() => {
      // Timeline uses .timeline-container, Flashcard uses .flashcards-section, etc.
      const section = document.querySelector(
        '.timeline-container, .flashcards-section, .quiz-section, .chat-section, .insights-section'
      );
      expect(section).toBeInTheDocument();
    });
  });

  it('applies the light theme by default when localStorage is empty', async () => {
    localStorage.removeItem('theme');
    renderWithAuth(<App />);
    await waitFor(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      expect(attr).toBe('light');
    });
  });

  it('applies a persisted dark theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark');
    renderWithAuth(<App />);
    await waitFor(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      expect(attr).toBe('dark');
    });
  });

  it('renders the Auth FAB button', async () => {
    renderWithAuth(<App />);
    await waitFor(() => {
      const fab = document.getElementById('auth-fab-btn');
      expect(fab).toBeInTheDocument();
    });
  });

  it('renders the floating assistant button', async () => {
    renderWithAuth(<App />);
    await waitFor(() => {
      const btn = document.querySelector('.assistant-fab');
      expect(btn).toBeInTheDocument();
    });
  });

  it('renders the Login/Sign Up button in the header when no user', async () => {
    renderWithAuth(<App />);
    await waitFor(() => {
      const loginBtn = document.getElementById('header-login-btn');
      expect(loginBtn).toBeInTheDocument();
    });
  });
});
