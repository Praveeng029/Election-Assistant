import { Vote, Sun, Moon, Languages, User, LogOut } from 'lucide-react';
import { translations } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

const Header = ({ activeTab, setActiveTab, theme, toggleTheme, language, toggleLanguage, onAuthClick }) => {
  const t = translations[language];
  const { user, logout } = useAuth();

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

            {/* Auth Button */}
            {user ? (
              <div className="header-user-group">
                <button
                  className="header-user-btn"
                  onClick={onAuthClick}
                  title={user.email}
                  id="header-user-btn"
                >
                  {user.photoURL
                    ? <img src={user.photoURL} alt="avatar" className="header-avatar-img" />
                    : <User size={18} />}
                  <span className="header-user-email">{user.email?.split('@')[0]}</span>
                </button>
                <button
                  className="header-logout-btn"
                  onClick={logout}
                  title="Sign Out"
                  id="header-logout-btn"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                className="header-login-btn"
                onClick={onAuthClick}
                id="header-login-btn"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

