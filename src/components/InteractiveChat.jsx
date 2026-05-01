import React, { useState, useEffect, useRef } from 'react';
import chatData from '../data/chatResponses.json';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const InteractiveChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! 🙏 I am your Election Guide. I can help explain the entire process of Indian Elections. What would you like to know?',
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
    const text = userText.toLowerCase();
    
    // Search for matching keywords in chatData
    const match = chatData.find(item => 
      item.keywords.some(keyword => text.includes(keyword)) || 
      text.includes(item.question.toLowerCase())
    );

    if (match) {
      return match.answer;
    } else {
      return "I'm not exactly sure about that specific detail. I recommend checking the official Election Commission website (eci.gov.in) for the latest updates and detailed legal provisions. (Note: I cannot provide live data or exact real-time statistics).";
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: userText,
      isTyping: false
    }]);

    setIsTyping(true);

    setTimeout(() => {
      const response = processResponse(userText);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: response,
        isTyping: false
      }]);
    }, 1200);
  };

  const handleQuestionClick = (item) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: item.question,
      isTyping: false
    }]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: item.answer,
        isTyping: false
      }]);
    }, 1200);
  };

  return (
    <div className="chat-section fade-in">
      <div className="section-header">
        <h2>Ask the Expert</h2>
        <p>Ask any question about the Indian election process or choose from suggested topics.</p>
      </div>

      <div className="chat-container">
        <div className="chat-window">
          {/* Message History */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-wrapper bot">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-bubble typing-indicator">
                  <Loader2 size={18} className="spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Suggestions */}
          <div className="chat-controls">
            <div className="suggestions-area">
              <div className="suggestions-list">
                {chatData.slice(0, 4).map((item) => (
                  <button 
                    key={item.id} 
                    className="suggestion-btn"
                    onClick={() => handleQuestionClick(item)}
                    disabled={isTyping}
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Ask a question about elections..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" disabled={isTyping || !inputValue.trim()}>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChat;
