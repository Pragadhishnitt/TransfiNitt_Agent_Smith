import PropTypes from 'prop-types';
import './WelcomeScreen.css';

const WelcomeScreen = ({ interviewDetails, onStart }) => {
  console.log('Welcome Screen Props:', { interviewDetails });
  
  if (!interviewDetails || !interviewDetails.template) {
    console.error('Invalid interview details:', interviewDetails);
    return (
      <div className="welcome-screen">
        <div className="welcome-card">
          <h1>Interview Loading...</h1>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-screen">
      <div className="floating-elements">
        <div className="floating-icon icon-1">💬</div>
        <div className="floating-icon icon-2">🎯</div>
        <div className="floating-icon icon-3">✨</div>
        <div className="floating-icon icon-4">🚀</div>
        <div className="floating-icon icon-5">💡</div>
        <div className="floating-icon icon-6">🎉</div>
      </div>
      
      <div className="welcome-card">
        <div className="welcome-header">
          <div className="welcome-icon">🎤</div>
          <h1>{interviewDetails.template.title}</h1>
        </div>
        
        <p className="description">{interviewDetails.template.description}</p>
        
        <div className="interview-details">
          <div className="detail-item">
            <div className="detail-icon">⏱️</div>
            <div className="detail-content">
              <span className="detail-label">Duration: </span>
              <span className="detail-value">{interviewDetails.estimated_duration_minutes} minutes</span>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-icon">💰</div>
            <div className="detail-content">
              <span className="detail-label">Reward: </span>
              <span className="detail-value">${interviewDetails.expected_incentive.toFixed(2)}</span>
            </div>
          </div>
        </div>


        <button 
          className="start-button" 
          onClick={() => {
            console.log('Start button clicked');
            onStart();
          }}
        >
          <span className="button-icon">🚀</span>
          <div className="button-text">
            <span className="button-main-text">Begin Interview</span>
            <span className="button-sub-text">Estimated {interviewDetails.estimated_duration_minutes} mins</span>
          </div>
        </button>
      </div>
    </div>
  );
};

WelcomeScreen.propTypes = {
  interviewDetails: PropTypes.shape({
    template: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    estimated_duration_minutes: PropTypes.number.isRequired,
    incentive_amount: PropTypes.number.isRequired,
  }).isRequired,
  onStart: PropTypes.func.isRequired,
};

export default WelcomeScreen;