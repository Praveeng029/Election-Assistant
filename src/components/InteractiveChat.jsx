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

    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
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
    });

    return () => unsubscribe();
  }, [user, language]);

  const saveMessage = async (text, sender) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        text,
        sender,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const clearHistory = async () => {
    if (!user || !window.confirm(language === 'en' ? 'Clear all chat history?' : 'क्या आप सारी चैट हिस्ट्री मिटाना चाहते हैं?')) return;
    try {
      const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');
    
    // If not logged in, just show local response
    if (!user) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: language === 'en' ? 'Please log in to use the AI assistant.' : 'एआई सहायक का उपयोग करने के लिए कृपया लॉग इन करें।' 
        }]);
      }, 1000);
      return;
    }

    await saveMessage(userText, 'user');
    setIsTyping(true);

    try {
      const response = await getGeminiResponse(userText, language);
      await saveMessage(response, 'bot');
    } catch (error) {
      console.error("Chat Error:", error);
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

