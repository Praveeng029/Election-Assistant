import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { MessageSquare } from 'lucide-react';
import { translations } from './utils/translations';
import './index.css';

// Code splitting via lazy imports — improves initial load performance
const Timeline = lazy(() => import('./components/Timeline'));
const Flashcard = lazy(() => import('./components/Flashcard'));
const Quiz = lazy(() => import('./components/Quiz'));
const InteractiveChat = lazy(() => import('./components/InteractiveChat'));
const Insights = lazy(() => import('./components/Insights'));

function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showAssistant, setShowAssistant] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    // Guard against unsupported language codes
    return saved && translations[saved] ? saved : 'en';
  });

  const { user } = useAuth();
  const t = translations[language];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <Timeline language={language} />;
      case 'flashcards':
        return <Flashcard language={language} />;
      case 'quiz':
        return <Quiz language={language} />;
      case 'chat':
        return <InteractiveChat language={language} />;
      case 'insights':
        return <Insights language={language} />;
      default:
        return <Timeline language={language} />;
    }
  };

  return (
    <div className="app-wrapper">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
        user={user}
        onAuthClick={() => setShowAuth(true)}
      />
      
      <main className="main-content" aria-live="polite" aria-atomic="false">
        <Suspense fallback={<div className="fade-in" style={{textAlign:'center',padding:'4rem',color:'var(--text-muted)'}}>Loading...</div>}>
          {renderContent()}
        </Suspense>
      </main>

      {/* Auth FAB */}
      <button
        className="auth-fab"
        onClick={() => setShowAuth(true)}
        title={user ? `Signed in as ${user.email}` : 'Login / Sign Up'}
        id="auth-fab-btn"
      >
        {user
          ? <span className="auth-fab-avatar">{(user.email || 'U')[0].toUpperCase()}</span>
          : '🔐'}
      </button>

      {/* Floating Assistant Button */}
      <button 
        className="assistant-fab"
        onClick={() => setShowAssistant(!showAssistant)}
        title="Need Help?"
      >
        <MessageSquare size={24} />
      </button>

      {/* Simple Contextual Assistant Popup */}
      {showAssistant && (
        <div className="assistant-popup slide-up">
          <div className="assistant-header">
            <h4>{t.app.assistant}</h4>
            <button onClick={() => setShowAssistant(false)} className="close-btn">&times;</button>
          </div>
          <div className="assistant-body">
            <p>{language === 'en' ? 'Hi! I\'m your Election Assistant. 🇮🇳' : 'नमस्ते! मैं आपका चुनाव सहायक हूँ। 🇮🇳'}</p>
            <p>{t.app.needHelp}</p>
            <ul>
              <li><strong>{t.nav.timeline}:</strong> {language === 'en' ? 'See how an election unfolds.' : 'देखें कि चुनाव कैसे होता है।'}</li>
              <li><strong>{t.nav.flashcards}:</strong> {language === 'en' ? 'Flip cards to learn jargon.' : 'शब्दावली सीखने के लिए कार्ड पलटें।'}</li>
              <li><strong>{t.nav.quiz}:</strong> {language === 'en' ? 'Test your knowledge!' : 'अपने ज्ञान का परीक्षण करें!'}</li>
            </ul>
            <p className="hint-text">{t.app.tip}</p>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}

export default App;

