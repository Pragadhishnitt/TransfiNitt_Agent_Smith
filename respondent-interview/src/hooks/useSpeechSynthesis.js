import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      // Force initial voice load
      window.speechSynthesis.getVoices();
      
      // Load voices with multiple attempts (some browsers are slow)
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          setVoicesLoaded(true);
          console.log('✅ Voices loaded:', availableVoices.length);
          console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
          
          // Log American voices if found
          const americanVoices = availableVoices.filter(v => 
            v.lang.includes('en-US') || v.name.toLowerCase().includes('us') || v.name.toLowerCase().includes('american')
          );
          if (americanVoices.length > 0) {
            console.log('🇺🇸 American English voices found:', americanVoices.map(v => v.name));
          } else {
            console.log('⚠️ No American voices found, will use best alternative');
          }
        } else {
          console.log('⏳ No voices loaded yet, retrying...');
        }
      };

      // Initial load
      loadVoices();
      
      // Load on voices changed event
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      // Aggressive fallback attempts for voice loading
      const timers = [
        setTimeout(loadVoices, 50),
        setTimeout(loadVoices, 100),
        setTimeout(loadVoices, 200),
        setTimeout(loadVoices, 500),
        setTimeout(loadVoices, 1000),
        setTimeout(() => {
          if (!voicesLoaded) {
            console.log('⚠️ Forcing voices loaded flag after timeout');
            setVoicesLoaded(true);
          }
        }, 2000)
      ];
      
      return () => {
        timers.forEach(timer => clearTimeout(timer));
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) {
      console.warn('Speech not supported or no text provided');
      return;
    }

    // If voices not loaded yet, wait and retry
    if (!voicesLoaded) {
      console.log('Voices not loaded yet, waiting...');
      const checkVoices = setInterval(() => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          clearInterval(checkVoices);
          setVoices(voices);
          setVoicesLoaded(true);
          speak(text, options); // Retry speaking
        }
      }, 100);
      
      // Timeout after 3 seconds
      setTimeout(() => {
        clearInterval(checkVoices);
        if (!voicesLoaded) {
          console.warn('Voices failed to load, attempting to speak anyway');
          setVoicesLoaded(true);
        }
      }, 3000);
      
      return;
    }

    // Stop any ongoing speech first
    window.speechSynthesis.cancel();
    
    // Small delay to ensure cancel completes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Configure voice settings for natural American English
      utterance.rate = options.rate || 0.95; // Natural speaking pace
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      // Select best American English voice
      const currentVoices = window.speechSynthesis.getVoices();
      if (currentVoices.length > 0) {
        let selectedVoice = null;
        
        // Priority 1: Look for US English voices (en-US)
        selectedVoice = currentVoices.find(voice => 
          voice.lang === 'en-US' || voice.lang === 'en_US'
        );
        
        // Priority 2: Google US English voices (high quality)
        if (!selectedVoice) {
          selectedVoice = currentVoices.find(voice => 
            voice.lang.includes('en-US') && voice.name.toLowerCase().includes('google')
          );
        }
        
        // Priority 3: Microsoft voices with "United States" in name
        if (!selectedVoice) {
          selectedVoice = currentVoices.find(voice => 
            voice.name.toLowerCase().includes('united states') ||
            voice.name.toLowerCase().includes('american')
          );
        }
        
        // Priority 4: Any voice with "US" in name
        if (!selectedVoice) {
          selectedVoice = currentVoices.find(voice => 
            voice.name.toLowerCase().includes('us') ||
            voice.name.toLowerCase().includes('zira') || // Microsoft Zira (US)
            voice.name.toLowerCase().includes('david') // Microsoft David (US)
          );
        }
        
        // Priority 5: Any English voice
        if (!selectedVoice) {
          selectedVoice = currentVoices.find(voice => 
            voice.lang.startsWith('en')
          );
        }
        
        // Fallback: First available voice
        if (!selectedVoice) {
          selectedVoice = currentVoices[0];
        }
        
        utterance.voice = selectedVoice;
        console.log('🔊 Using voice:', selectedVoice?.name, '- Language:', selectedVoice?.lang);
      }

      utterance.onstart = () => {
        console.log('🗣️ Speech started');
        setIsSpeaking(true);
        options.onStart?.();
      };

      utterance.onend = () => {
        console.log('✅ Speech ended');
        setIsSpeaking(false);
        utteranceRef.current = null;
        options.onEnd?.();
      };

      utterance.onerror = (event) => {
        console.error('❌ Speech error:', event.error);
        setIsSpeaking(false);
        utteranceRef.current = null;
        options.onError?.(event);
      };

      // Speak the utterance
      try {
        window.speechSynthesis.speak(utterance);
        console.log('💬 Speech queued:', text.substring(0, 50) + '...');
      } catch (error) {
        console.error('Error speaking:', error);
        setIsSpeaking(false);
      }
    }, 150);
  }, [isSupported, voicesLoaded]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
      console.log('🛑 Speech stopped');
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
      console.log('⏸️ Speech paused');
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume();
      console.log('▶️ Speech resumed');
    }
  }, [isSupported]);

  // Helper function to get available American voices
  const getAmericanVoices = useCallback(() => {
    return voices.filter(voice => 
      voice.lang.includes('en-US') || 
      voice.name.toLowerCase().includes('us') ||
      voice.name.toLowerCase().includes('american')
    );
  }, [voices]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
    voicesLoaded,
    voices,
    getAmericanVoices,
  };
}