import { useState, useEffect, useRef } from 'react';
import { interviewAPI } from '../services/api';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { Mic, MicOff, Send, Volume2, Clock } from 'lucide-react';

function ChatInterface({ sessionId, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [startTime] = useState(Date.now());
  const [questionCount, setQuestionCount] = useState(0);
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

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
        setQuestionCount(1);
        
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
        setQuestionCount(1);
        
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
        const completionMsg = 'Thank you for completing the interview!';
        
        // Calculate duration in minutes
        const durationMs = Date.now() - startTime;
        const durationMinutes = Math.round(durationMs / 60000);
        
        // Count total questions (user messages = answers to questions)
        const totalQuestions = messages.filter(m => m.sender === 'user').length + 1;
        
        // Standard summary message instead of backend summary
        const standardSummary = 'Thank you for participating in this interview. Your responses have been recorded and will be reviewed by our team. We appreciate your time and valuable insights.';
        
        setTimeout(() => {
          console.log('Speaking completion message...');
          speak(completionMsg);
        }, 800);
        
        onComplete({
          message: completionMsg,
          summary: standardSummary,
          duration_minutes: durationMinutes,
          total_questions: totalQuestions,
          incentive: response.incentive || {
            amount: 5.00,
            payment_info: 'Your reward of $5.00 will be processed and credited to your account within 48 hours. Thank you for your participation!'
          },
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
          setQuestionCount(prev => prev + 1);
          
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 backdrop-blur-xl bg-opacity-80 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Interview in Progress</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <Clock size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700 tabular-nums">{formatTime(elapsedTime)}</span>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-blue-700">Question {questionCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl ${
                  message.sender === 'user'
                    ? 'bg-black text-white rounded-3xl rounded-tr-lg'
                    : 'bg-white text-gray-900 rounded-3xl rounded-tl-lg border border-gray-200'
                } px-6 py-4 shadow-sm`}
              >
                <p className="text-base leading-relaxed">{message.text}</p>
                {message.sender === 'bot' && isSpeechSynthesisSupported && (
                  <button
                    className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => speak(message.text)}
                    title="Replay message"
                  >
                    <Volume2 size={16} />
                    <span className="font-medium">Replay</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 rounded-3xl rounded-tl-lg border border-gray-200 px-6 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isSpeaking && (
            <div className="flex justify-center">
              <div className="bg-blue-50 border border-blue-200 rounded-full px-5 py-2.5 flex items-center gap-2">
                <Volume2 size={16} className="text-blue-600 animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Speaking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="bg-white border-t border-gray-200 backdrop-blur-xl bg-opacity-80 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {isListening && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping absolute"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-blue-700">
                {interimTranscript || 'Listening...'}
              </span>
            </div>
          )}
          
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-gray-100 rounded-3xl flex items-end overflow-hidden border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type your answer..."}
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent px-5 py-4 text-base text-gray-900 placeholder-gray-500 resize-none outline-none max-h-32"
              />
              
              {isSpeechToTextSupported && (
                <button
                  className={`m-2 p-3 rounded-full transition-all ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={toggleListening}
                  disabled={isLoading}
                  title={isListening ? "Stop recording" : "Start voice input"}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
            </div>
            
            <button
              className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
          
          {!isSpeechToTextSupported && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
              <p className="text-sm text-amber-800">
                Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;