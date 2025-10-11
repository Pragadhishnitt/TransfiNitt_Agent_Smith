import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { interviewAPI } from '../services/api';
import './ChatInterface.css';

const ChatInterface = ({ sessionId, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadFirstQuestion();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadFirstQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await interviewAPI.startInterview(sessionId);
      if (response.success && response.first_question) {
        // Handle both string format (from backend) and object format (from dummy data)
        const questionText = typeof response.first_question === 'string' 
          ? response.first_question 
          : response.first_question.text;
        const questionId = typeof response.first_question === 'string' 
          ? "q1" 
          : response.first_question.question_id;
          
        setMessages([{
          type: 'assistant',
          text: questionText,
          id: questionId
        }]);
        setProgress(response.progress || { current: 1, total: 5 });
      }
    } catch (error) {
      console.error('Failed to load first question:', error);
      // Use dummy first question if API fails
      setMessages([{
        type: 'assistant',
        text: "Hi! Welcome to our coffee survey. How often do you drink coffee?",
        id: "q1"
      }]);
      setProgress({ current: 1, total: 5 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);

    try {
      const response = await interviewAPI.sendMessage(sessionId, userMessage);
      
      if (response.is_complete) {
        onComplete(response);
      } else {
        // Handle both string format (from backend) and object format (from dummy data)
        const questionText = response.next_question || response.response?.text;
        const questionId = response.response?.question_id || `q${Date.now()}`;
        
        setMessages(prev => [...prev, {
          type: 'assistant',
          text: questionText,
          id: questionId
        }]);
        setProgress(response.progress);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">
            AI
          </div>
          <div className="chat-title">
            Interview Assistant
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`message-wrapper ${message.type}`}
          >
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
            <div className="message-timestamp">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your response here..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          title="Send message"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

ChatInterface.propTypes = {
  sessionId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default ChatInterface;