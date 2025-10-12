import PropTypes from 'prop-types';
import './CompletionScreen.css';

const CompletionScreen = ({ completionData }) => {
  return (
    <div className="completion-screen">
      <div className="celebration-elements">
        <div className="celebration-icon icon-1">🎉</div>
        <div className="celebration-icon icon-2">✨</div>
        <div className="celebration-icon icon-3">🎊</div>
        <div className="celebration-icon icon-4">🏆</div>
        <div className="celebration-icon icon-5">💫</div>
        <div className="celebration-icon icon-6">🌟</div>
        <div className="celebration-icon icon-7">🎈</div>
        <div className="celebration-icon icon-8">🎁</div>
      </div>

      <div className="completion-card">
        <div className="completion-header">
          <div className="success-animation">
            <div className="check-icon">✅</div>
            <div className="success-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          </div>
          <h1>Interview Complete!</h1>
          <p className="completion-subtitle">Great job! Your responses have been recorded.</p>
        </div>

        <div className="summary-section">
          <div className="section-header">
            <span className="section-icon">📝</span>
            <h2>Summary</h2>
          </div>
          <p>{completionData.summary}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <span className="stat-label">Duration</span>
              <span className="stat-value">{completionData.duration_minutes} mins</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">❓</div>
            <div className="stat-content">
              <span className="stat-label">Questions</span>
              <span className="stat-value">{completionData.total_questions}</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-label">Reward</span>
              <span className="stat-value">${completionData.incentive.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-info">
          <div className="section-header">
            <span className="section-icon">💳</span>
            <h3>Payment Information</h3>
          </div>
          <p>You will get $5 within the next 48 hours.</p>
        </div>
      </div>
    </div>
  );
};

CompletionScreen.propTypes = {
  completionData: PropTypes.shape({
    summary: PropTypes.string.isRequired,
    duration_minutes: PropTypes.number.isRequired,
    total_questions: PropTypes.number.isRequired,
    incentive: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      payment_info: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CompletionScreen;