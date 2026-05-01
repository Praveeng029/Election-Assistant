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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleQuestionClick = (item) => {
    // Add user message
    const userMsgId = Date.now();
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: item.question,
      isTyping: false
    }]);

    // Simulate bot thinking/typing
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: item.answer,
        isTyping: false
      }]);
    }, 1500); // 1.5 second delay for realism
  };

  return (
    <div className="chat-section fade-in">
      <div className="section-header">
        <h2>Ask the Expert</h2>
        <p>Select a question to learn more about the election process interactively.</p>
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
                  <span>Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (Input Area) */}
          <div className="chat-input-area">
            <h4 className="suggestions-title">Suggested Questions:</h4>
            <div className="suggestions-list">
              {chatData.map((item) => (
                <button 
                  key={item.id} 
                  className="suggestion-btn"
                  onClick={() => handleQuestionClick(item)}
                  disabled={isTyping}
                >
                  {item.question}
                  <Send size={14} className="send-icon" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChat;
