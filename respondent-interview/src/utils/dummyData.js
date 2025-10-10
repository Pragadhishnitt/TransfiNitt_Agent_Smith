let currentQuestionIndex = 0;

const dummyQuestions = [
  {
    text: "Hi! Welcome to our coffee survey. How often do you drink coffee?",
    question_id: "q1"
  },
  {
    text: "What's your preferred type of coffee (e.g., espresso, latte, etc.)?",
    question_id: "q2"
  },
  {
    text: "Do you usually make coffee at home or buy it from cafes?",
    question_id: "q3"
  },
  {
    text: "What's your favorite coffee brand or coffee shop?",
    question_id: "q4"
  },
  {
    text: "How much do you typically spend on coffee per week?",
    question_id: "q5"
  }
];

export const dummyResponses = {
  interviewDetails: {
    success: true,
    session: {
      id: "dummy-session-123",
      status: "active",
      template: {
        title: "Coffee Consumption Survey",
        description: "Help us understand your coffee drinking habits and preferences. This survey takes about 5 minutes to complete."
      },
      estimated_duration_minutes: 5,
      incentive_amount: 5.00
    }
  },

  startInterview: {
    success: true,
    first_question: {
      text: dummyQuestions[0].text,
      question_id: dummyQuestions[0].question_id
    },
    progress: {
      current: 1,
      total: dummyQuestions.length
    }
  },

  getNextQuestion: (prevAnswer) => {
    currentQuestionIndex++;
    console.log(`Processing answer: "${prevAnswer}" (Question ${currentQuestionIndex}/${dummyQuestions.length})`);

    // Check if we've reached the end of the questions
    if (currentQuestionIndex >= dummyQuestions.length) {
      return {
        success: true,
        is_complete: true,
        summary: `Thank you for sharing your coffee preferences! We learned that ${prevAnswer}. Your insights will help us understand coffee consumption patterns better.`,
        completion_time: new Date().toISOString(),
        duration_minutes: 5,
        total_questions: dummyQuestions.length,
        incentive: {
          amount: 5.00,
          currency: "USD",
          status: "pending",
          payment_info: "You will receive $5.00 within 48 hours."
        }
      };
    }

    // Return next question
    return {
      success: true,
      response: {
        text: dummyQuestions[currentQuestionIndex].text,
        question_id: dummyQuestions[currentQuestionIndex].question_id
      },
      is_probe: false,
      progress: {
        current: currentQuestionIndex + 1,
        total: dummyQuestions.length
      },
      is_complete: false
    };
  },

  // Reset function for testing
  resetInterview: () => {
    currentQuestionIndex = 0;
  }
};