import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, LogIn, UserPlus, Eye, EyeOff, Globe, Zap } from 'lucide-react';

const DEMO_EMAIL = 'demo@gmail.com';
const DEMO_PASSWORD = '123456';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup, loginWithGoogle, user, logout } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccessMsg('Logged in successfully! 🎉');
        setTimeout(() => onClose(), 1000);
      } else {
        await signup(email, password);
        setSuccessMsg('Account created successfully! 🎉');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      const msg = err.code || err.message;
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Invalid email or password. Try demo@gmail.com / 123456');
      } else if (msg.includes('email-already-in-use')) {
        setError('This email is already registered. Please log in.');
      } else if (msg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (msg.includes('network-request-failed')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Logged in with Google! 🎉');
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD);
      setSuccessMsg('Logged in with Demo account! 🎉');
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError('Demo login failed. Please ensure the demo account exists in Firebase Authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  // If already logged in, show profile view
  if (user) {
    return (
      <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="auth-modal">
          <button className="auth-close-btn" onClick={onClose}><X size={20} /></button>
          <div className="auth-logged-in">
            <div className="auth-avatar">
              {user.photoURL
                ? <img src={user.photoURL} alt="avatar" />
                : <span>{(user.email || 'U')[0].toUpperCase()}</span>}
            </div>
            <h2>Welcome back!</h2>
            <p className="auth-user-email">{user.email}</p>
            <p className="auth-user-since">Signed in as a verified voter 🗳️</p>
            <button className="auth-logout-btn" onClick={handleLogout}>
              <LogIn size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        {/* Close button */}
        <button className="auth-close-btn" onClick={onClose}><X size={20} /></button>

        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-logo">🗳️</div>
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{mode === 'login' ? 'Sign in to access Election Assistant' : 'Join the Election Assistant community'}</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            <LogIn size={16} /> Login
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            <UserPlus size={16} /> Sign Up
          </button>
        </div>

        {/* Demo Credentials Banner */}
        <div className="auth-demo-banner" onClick={handleDemoLogin} title="Click to login instantly">
          <Zap size={15} />
          <span>Demo: <strong>demo@gmail.com</strong> / <strong>123456</strong></span>
          <span className="auth-demo-cta">Click to auto-login →</span>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Error / Success */}
          {error && <div className="auth-error">{error}</div>}
          {successMsg && <div className="auth-success">{successMsg}</div>}

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={17} className="auth-input-icon" />
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={17} className="auth-input-icon" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="auth-confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider"><span>or continue with</span></div>

        {/* Google */}
        <button className="auth-google-btn" onClick={handleGoogleLogin} disabled={loading}>
        <Globe size={18} /> Sign in with Google
        </button>

        {/* Switch mode */}
        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
