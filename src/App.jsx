import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import InteractiveChat from './components/InteractiveChat';
import Insights from './components/Insights';
import IndiaMap from './components/IndiaMap';
import { MessageSquare, Languages } from 'lucide-react';
import { translations } from './utils/translations';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showAssistant, setShowAssistant] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

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
      />
      
      <main className="main-content">
        {renderContent()}
        
        {/* Scroll down for Map - Visible on first page load */}
        <IndiaMap language={language} />
      </main>

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
    </div>
  );
}

export default App;
