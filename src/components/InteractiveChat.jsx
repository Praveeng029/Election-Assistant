import React, { useState, useEffect, useRef } from 'react';
import chatData from '../data/chatResponses.json';
import { Send, Bot, User, Loader2, History, Trash2, MessageSquare } from 'lucide-react';
import { translations } from '../utils/translations';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  deleteDoc, 
  getDocs,
  where
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { getGeminiResponse } from '../utils/gemini';

const InteractiveChat = ({ language }) => {
  const t = translations[language];
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history from Firestore
  useEffect(() => {
    if (!user) {
      setMessages([{
        id: 'welcome',
        sender: 'bot',
        text: language === 'en' 
          ? 'Namaste! 🙏 I am your Election Guide. Please log in to save your chat history and talk to our AI assistant.' 
          : 'नमस्ते! 🙏 मैं आपका चुनाव मार्गदर्शक हूँ। अपनी चैट हिस्ट्री को सहेजने और हमारे एआई सहायक से बात करने के लिए कृपया लॉग इन करें।',
        timestamp: new Date()
      }]);
      return;
    }

    // Simplified query to avoid indexing issues in Firestore
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)); // Sort in memory
      
      if (msgs.length === 0) {
        setMessages([{
          id: 'welcome',
          sender: 'bot',
          text: language === 'en' 
            ? 'Namaste! 🙏 I am your Election Guide. Ask me anything about Indian elections!' 
            : 'नमस्ते! 🙏 मैं आपका चुनाव मार्गदर्शक हूँ। मुझसे भारतीय चुनावों के बारे में कुछ भी पूछें!',
          timestamp: new Date()
        }]);
      } else {
        setMessages(msgs);
      }
    }, (error) => {
      console.error("Firestore error:", error);
      // Fallback for local display if Firestore fails
    });

    return () => unsubscribe();
  }, [user, language]);

  const saveMessage = async (text, sender) => {
    if (!user) return null;
    try {
      const docRef = await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        text,
        sender,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving message:", error);
      return null;
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');
    
    // Optimistic UI update for better responsiveness
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, sender: 'user', text: userText, timestamp: new Date() }]);

    if (!user) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: language === 'en' ? 'Please log in to use the AI assistant.' : 'एआई सहायक का उपयोग करने के लिए कृपया लॉग इन करें।' 
        }]);
      }, 1000);
      return;
    }

    setIsTyping(true);

    try {
      // Save to Firestore (will be picked up by onSnapshot eventually)
      await saveMessage(userText, 'user');

      const isKeyMissing = !import.meta.env.VITE_GEMINI_API_KEY || 
                          import.meta.env.VITE_GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY') ||
                          import.meta.env.VITE_GEMINI_API_KEY.length < 10;
      
      if (isKeyMissing) {
        const errorMsg = language === 'en' 
          ? "I'm currently in 'Static Mode' because the Gemini API key is missing. Please check your .env file." 
          : "Gemini API कुंजी न होने के कारण मैं अभी 'स्टेटिक मोड' में हूँ। कृपया अपनी .env फ़ाइल की जाँच करें।";
        setMessages(prev => [...prev, { id: 'error-' + Date.now(), sender: 'bot', text: errorMsg }]);
        setIsTyping(false);
        return;
      }

      const response = await getGeminiResponse(userText, language);
      await saveMessage(response, 'bot');
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: 'error-' + Date.now(), 
        sender: 'bot', 
        text: language === 'en' ? 'Something went wrong. Please try again.' : 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = async (item) => {
    const questionText = item.question[language];
    const answerText = item.answer[language];
    
    if (user) {
      await saveMessage(questionText, 'user');
      await saveMessage(answerText, 'bot');
    } else {
      setMessages(prev => [...prev, 
        { id: Date.now(), sender: 'user', text: questionText },
        { id: Date.now() + 1, sender: 'bot', text: answerText }
      ]);
    }
  };

  return (
    <div className="chat-section fade-in">
      <div className="section-header">
        <div className="header-info">
          <h2>{t.nav.chat}</h2>
          <p>{language === 'en' ? 'Ask any question about the Indian election process.' : 'भारतीय चुनाव प्रक्रिया के बारे में कोई भी प्रश्न पूछें।'}</p>
        </div>
        <div className="header-actions">
          {user && (
            <>
              <button className="icon-btn" onClick={() => setShowHistory(!showHistory)} title="History">
                <History size={20} />
              </button>
              <button className="icon-btn delete" onClick={clearHistory} title="Clear History">
                <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`chat-container ${showHistory ? 'show-sidebar' : ''}`}>
        {showHistory && user && (
          <div className="chat-sidebar glass">
            <h3>{language === 'en' ? 'Recent History' : 'हाल का इतिहास'}</h3>
            <div className="history-list">
              {messages.filter(m => m.sender === 'user').slice(-10).reverse().map((msg) => (
                <div key={msg.id} className="history-item" onClick={() => setInputValue(msg.text)}>
                  <MessageSquare size={14} />
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message-wrapper bot">
                <div className="message-avatar"><Bot size={20} /></div>
                <div className="message-bubble typing-indicator">
                  <Loader2 size={18} className="spin" />
                  <span>{language === 'en' ? 'Thinking...' : 'सोच रहा हूँ...'}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-controls">
            <div className="suggestions-area">
              <div className="suggestions-list">
                {chatData.slice(0, 4).map((item) => (
                  <button key={item.id} className="suggestion-btn" onClick={() => handleQuestionClick(item)} disabled={isTyping}>
                    {item.question[language]}
                  </button>
                ))}
              </div>
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder={language === 'en' ? "Ask a question..." : "प्रश्न पूछें..."} 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" disabled={isTyping || !inputValue.trim()}><Send size={20} /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChat;

