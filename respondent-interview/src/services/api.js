const API_BASE_URL = 'http://localhost:8000/api';

console.log('API Service initialized - using real API only');

export const interviewAPI = {
  // Get interview details
  getInterviewDetails: async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews/${sessionId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch interview details: ${response.status}`);
      }
      
      console.log('✅ Fetched real API interview details');
      return await response.json();
    } catch (error) {
      console.error('❌ API request failed:', error.message);
      throw error;
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
        throw new Error(`Failed to start interview: ${response.status}`);
      }
      
      console.log('✅ Started interview via real API');
      const result = await response.json();
      console.log('Start interview result:', result);
      return result;
    } catch (error) {
      console.error('❌ API request failed:', error.message);
      throw error;
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
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      console.log('✅ Sent message via real API');
      const result = await response.json();
      
      // Transform response to expected format
      return transformApiResponse(result);
    } catch (error) {
      console.error('❌ API request failed:', error.message);
      throw error;
    }
  },
};

// Helper function to transform API response to expected format
function transformApiResponse(apiResponse) {
  console.log('Transforming API response:', apiResponse);
  
  if (apiResponse.is_complete || apiResponse.interview_complete) {
    return {
      success: true,
      is_complete: true,
      interview_complete: true,
      summary: apiResponse.summary || apiResponse.completion_message,
      completion_message: apiResponse.completion_message || apiResponse.summary,
      incentive: apiResponse.incentive,
      completion_time: apiResponse.completion_time,
      duration_minutes: apiResponse.duration_minutes,
      total_questions: apiResponse.total_questions,
    };
  } else {
    return {
      success: true,
      is_complete: false,
      interview_complete: false,
      next_question: apiResponse.next_question || apiResponse.response?.text,
      question_id: apiResponse.question_id || apiResponse.response?.question_id,
      progress: apiResponse.progress,
      is_probe: apiResponse.is_probe,
    };
  }
}