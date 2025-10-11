const API_BASE_URL = 'http://localhost:8000/api';
import { dummyResponses } from '../utils/dummyData';

export const interviewAPI = {
  // Get interview details
  getInterviewDetails: async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch interview details');
      }
      return response.json();
    } catch (error) {
      console.warn('Using fallback interview details:', error);
      // Reset the interview state when getting details
      dummyResponses.resetInterview();
      return dummyResponses.interviewDetails;
    }
  },

  // Start interview
  startInterview: async (sessionId, data = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews/${sessionId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to start interview');
      }
      return response.json();
    } catch (error) {
      console.warn('Using fallback start interview response:', error);
      return dummyResponses.startInterview;
    }
  },

  // Send message
  sendMessage: async (sessionId, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          message_type: 'text',
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    } catch (error) {
      console.warn('Using fallback message response:', error);
      return dummyResponses.getNextQuestion(message);
    }
  },
};