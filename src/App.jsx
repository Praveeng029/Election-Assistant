import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import InteractiveChat from './components/InteractiveChat';
import { MessageSquare } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showAssistant, setShowAssistant] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <Timeline />;
      case 'flashcards':
        return <Flashcard />;
      case 'quiz':
        return <Quiz />;
      case 'chat':
        return <InteractiveChat />;
      default:
        return <Timeline />;
    }
  };

  return (
    <div className="app-wrapper">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="main-content">
        {renderContent()}
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
            <h4>Election Assistant</h4>
            <button onClick={() => setShowAssistant(false)} className="close-btn">&times;</button>
          </div>
          <div className="assistant-body">
            <p>Hi! I'm your Election Assistant. 🇮🇳</p>
            <p>Use the navigation tabs above to explore:</p>
            <ul>
              <li><strong>Timeline:</strong> See how an election unfolds.</li>
              <li><strong>Key Terms:</strong> Flip cards to learn jargon.</li>
              <li><strong>Quiz:</strong> Test your knowledge!</li>
            </ul>
            <p className="hint-text">Tip: Hover over items for more details.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
