import { Vote, Sun, Moon, Languages } from 'lucide-react';
import { translations } from '../utils/translations';

const Header = ({ activeTab, setActiveTab, theme, toggleTheme, language, toggleLanguage }) => {
  const t = translations[language];

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">
            <Vote size={32} />
          </div>
          <h1>{t.app.title}</h1>
        </div>
        
        <div className="header-actions">
          <nav className="nav-menu">
            <button 
              className={`nav-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              {t.nav.timeline}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveTab('flashcards')}
            >
              {t.nav.flashcards}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              {t.nav.quiz}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              {t.nav.chat}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              {t.nav.insights}
            </button>
          </nav>

          <div className="toggle-group">
            <button 
              className="lang-toggle" 
              onClick={toggleLanguage}
              title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Languages size={20} />
              <span>{language === 'en' ? 'HI' : 'EN'}</span>
            </button>

            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
