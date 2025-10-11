import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition for Indian English
      recognitionRef.current.continuous = true; // Keep listening
      recognitionRef.current.interimResults = true; // Show interim results
      
      // Set to Indian English (en-IN) for better accent recognition
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.maxAlternatives = 1;

      console.log('Speech recognition configured for Indian English (en-IN)');

      // Handle results
      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        setInterimTranscript(interim);
        if (final) {
          setTranscript(prev => prev + final);
        }
      };

      // Handle errors
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        // Don't stop on "no-speech" error, just continue listening
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
          return;
        }
        
        // For other errors, stop listening
        if (event.error !== 'aborted') {
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      // Handle end - restart if still supposed to be listening
      recognitionRef.current.onend = () => {
        console.log('Recognition ended, isListening:', isListeningRef.current);
        
        // If we're still supposed to be listening, restart
        if (isListeningRef.current) {
          console.log('Restarting recognition...');
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
            setIsListening(false);
            isListeningRef.current = false;
          }
        } else {
          setIsListening(false);
        }
      };

      // Handle start
      recognitionRef.current.onstart = () => {
        console.log('Recognition started with Indian English');
        setIsListening(true);
        isListeningRef.current = true;
      };
    }

    return () => {
      if (recognitionRef.current) {
        isListeningRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setInterimTranscript('');
      isListeningRef.current = true;
      
      try {
        recognitionRef.current.start();
        console.log('Starting speech recognition for Indian English');
      } catch (error) {
        console.error('Error starting recognition:', error);
        if (error.message.includes('already started')) {
          // Already running, just update state
          setIsListening(true);
          isListeningRef.current = true;
        }
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      isListeningRef.current = false;
      try {
        recognitionRef.current.stop();
        console.log('Stopping speech recognition');
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};