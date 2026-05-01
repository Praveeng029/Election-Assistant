import React from 'react';
import { Vote, Sun, Moon } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">
            <Vote size={32} />
          </div>
          <h1>India Elects</h1>
        </div>
        
        <div className="header-actions">
          <nav className="nav-menu">
            <button 
              className={`nav-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Process Timeline
            </button>
            <button 
              className={`nav-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveTab('flashcards')}
            >
              Key Terms
            </button>
            <button 
              className={`nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              Knowledge Check
            </button>
            <button 
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Interactive Chat
            </button>
          </nav>

          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
