import React, { useState, useEffect, useRef } from 'react';
import chatData from '../data/chatResponses.json';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { translations } from '../utils/translations';

const InteractiveChat = ({ language }) => {
  const t = translations[language];
  
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: language === 'en' 
        ? 'Namaste! 🙏 I am your Election Guide. I can help explain the entire process of Indian Elections. What would you like to know?' 
        : 'नमस्ते! 🙏 मैं आपका चुनाव मार्गदर्शक हूँ। मैं भारतीय चुनावों की पूरी प्रक्रिया समझाने में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?',
      isTyping: false
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const processResponse = (userText) => {
    const text = userText.toLowerCase().trim();
    
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'hola', 'नमस्ते'];
    const acknowledgments = ['ok', 'okay', 'thanks', 'thank you', 'cool', 'wow', 'nice', 'ठीक है', 'धन्यवाद'];

    if (greetings.some(g => text === g || text.startsWith(g + ' '))) {
      return language === 'en' 
        ? "Namaste! 🙏 Hello there! I'm your Election Expert. What part of the Indian electoral process are you curious about today?"
        : "नमस्ते! 🙏 मैं आपका चुनाव विशेषज्ञ हूँ। आज आप भारतीय चुनावी प्रक्रिया के किस भाग के बारे में जानना चाहते हैं?";
    }

    if (acknowledgments.some(a => text === a || text.startsWith(a + ' '))) {
      return language === 'en'
        ? "You're welcome! Would you like to know more or check out the other sections?"
        : "आपका स्वागत है! क्या आप और अधिक जानना चाहेंगे या अन्य अनुभागों को देखना चाहेंगे?";
    }

    const match = chatData.find(item => 
      item.keywords.some(keyword => text.includes(keyword)) || 
      text.includes(item.question.en.toLowerCase()) ||
      text.includes(item.question.hi.toLowerCase())
    );

    if (match) {
      return match.answer[language];
    } else {
      return language === 'en'
        ? "I'm not exactly sure about that. I recommend checking the official Election Commission website (eci.gov.in) for the latest updates."
        : "मुझे इसके बारे में ठीक से पता नहीं है। मैं नवीनतम अपडेट के लिए आधिकारिक चुनाव आयोग की वेबसाइट (eci.gov.in) देखने की सलाह देता हूँ।";
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText, isTyping: false }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processResponse(userText);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: response, isTyping: false }]);
    }, 1200);
  };

  const handleQuestionClick = (item) => {
    const questionText = item.question[language];
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: questionText, isTyping: false }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: item.answer[language], isTyping: false }]);
    }, 1200);
  };

  return (
    <div className="chat-section fade-in">
      <div className="section-header">
        <h2>{t.nav.chat}</h2>
        <p>{language === 'en' ? 'Ask any question about the Indian election process.' : 'भारतीय चुनाव प्रक्रिया के बारे में कोई भी प्रश्न पूछें।'}</p>
      </div>

      <div className="chat-container">
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
                {chatData.map((item) => (
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
