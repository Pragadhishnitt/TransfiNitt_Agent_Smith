import { useState, useEffect, useRef } from 'react';
import { interviewAPI } from '../services/api';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';

function ChatInterface({ sessionId, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const messagesEndRef = useRef(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechToTextSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    voicesLoaded,
    isSupported: isSpeechSynthesisSupported,
  } = useSpeechSynthesis();

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update input value with transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Load first question
  useEffect(() => {
    loadFirstQuestion();
  }, [sessionId]);

  // Ensure voices are loaded before speaking first question
  useEffect(() => {
    if (voicesLoaded && currentQuestion && messages.length === 1) {
      console.log('✅ Voices loaded, speaking first question now');
      // Longer delay to ensure everything is ready
      const timer = setTimeout(() => {
        speak(currentQuestion);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [voicesLoaded, currentQuestion, messages.length, speak]);

  const loadFirstQuestion = async () => {
    setIsLoading(true);
    try {
      console.log('Loading first question for session:', sessionId);
      const response = await interviewAPI.startInterview(sessionId);
      console.log('Start interview response:', response);
      
      const questionText = response.question || response.first_question;
      
      console.log('Extracted question text:', questionText);
      
      if (questionText) {
        const botMessage = {
          id: Date.now(),
          sender: 'bot',
          text: questionText,
          timestamp: new Date().toISOString(),
        };
        setMessages([botMessage]);
        setCurrentQuestion(questionText);
        
        // Don't speak here - let the useEffect handle it when voices are loaded
        console.log('First question loaded, waiting for voices...');
        console.log('First question loaded successfully');
      } else {
        console.error('No question text found in response:', response);
        const errorMessage = {
          id: Date.now(),
          sender: 'bot',
          text: 'Hi! Welcome to the interview. Please tell me about yourself.',
          timestamp: new Date().toISOString(),
        };
        setMessages([errorMessage]);
        
        setTimeout(() => {
          console.log('Speaking error message...');
          speak(errorMessage.text);
        }, 800);
      }
    } catch (error) {
      console.error('Error loading first question:', error);
      const errorMessage = {
        id: Date.now(),
        sender: 'bot',
        text: 'Sorry, there was an error starting the interview. Please refresh the page.',
        timestamp: new Date().toISOString(),
      };
      setMessages([errorMessage]);
      
      setTimeout(() => {
        console.log('Speaking error message...');
        speak(errorMessage.text);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const messageText = inputValue.trim();
    if (!messageText || isLoading) return;

    // Stop any ongoing speech
    stopSpeaking();

    // Stop listening if active and clear transcripts
    if (isListening) {
      stopListening();
    }
    resetTranscript();

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await interviewAPI.sendMessage(sessionId, messageText);
      
      console.log('Response from API:', response);

      const isComplete = response.interview_complete || response.is_complete;
      
      if (isComplete) {
        // Interview is complete
        const completionMsg = response.completion_message || response.summary || 'Thank you for completing the interview!';
        
        setTimeout(() => {
          console.log('Speaking completion message...');
          speak(completionMsg);
        }, 800);
        
        onComplete({
          message: completionMsg,
          summary: response.summary,
          incentive: response.incentive,
        });
      } else {
        const nextQuestionText = response.next_question || response.response?.text;
        
        if (nextQuestionText) {
          const botMessage = {
            id: Date.now() + 1,
            sender: 'bot',
            text: nextQuestionText,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, botMessage]);
          setCurrentQuestion(nextQuestionText);
          
          // Automatically speak the next question with logging
          setTimeout(() => {
            console.log('Speaking next question...');
            speak(nextQuestionText);
          }, 800);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, there was an error processing your response. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      setTimeout(() => {
        console.log('Speaking error message...');
        speak(errorMessage.text);
      }, 800);
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

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      // Stop speaking when starting to listen
      stopSpeaking();
      resetTranscript();
      setInputValue('');
      startListening();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Interview in Progress</h2>
        <div className="question-counter">
          Question {messages.filter(m => m.sender === 'user').length + 1}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              {message.sender === 'bot' && isSpeechSynthesisSupported && (
                <button
                  className="replay-button"
                  onClick={() => speak(message.text)}
                  title="Replay message"
                >
                  <Volume2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        {isSpeaking && (
          <div className="speaking-indicator">
            <Volume2 size={16} />
            <span>Speaking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        {isListening && (
          <div className="interim-transcript">
            <span className="listening-pulse"></span>
            Listening: {interimTranscript || 'Speak now...'}
          </div>
        )}
        
        <div className="input-wrapper">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Type your answer or use voice input..."}
            disabled={isLoading}
            rows={1}
          />
          
          <div className="input-actions">
            {isSpeechToTextSupported && (
              <button
                className={`voice-button ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                disabled={isLoading}
                title={isListening ? "Stop recording" : "Start voice input"}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
            
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        
        {!isSpeechToTextSupported && (
          <div className="browser-warning">
            Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;