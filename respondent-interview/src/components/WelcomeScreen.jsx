import PropTypes from 'prop-types';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] text-4xl animate-bounce opacity-20">💬</div>
        <div className="absolute top-[20%] right-[20%] text-3xl animate-pulse opacity-30">🎯</div>
        <div className="absolute bottom-[30%] left-[10%] text-5xl animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-[60%] right-[15%] text-4xl animate-pulse opacity-25" style={{ animationDelay: '0.5s' }}>🚀</div>
        <div className="absolute bottom-[20%] right-[30%] text-3xl animate-bounce opacity-30" style={{ animationDelay: '1.5s' }}>💡</div>
        <div className="absolute top-[40%] left-[25%] text-4xl animate-pulse opacity-20" style={{ animationDelay: '2s' }}>🎉</div>
      </div>
      
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-10 relative z-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {interviewDetails.template.title}
          </h1>
        </div>
        
        <p className="text-lg text-gray-600 text-center mb-10 leading-relaxed">
          {interviewDetails.template.description}
        </p>
        
         <div className="grid grid-cols-2 gap-8 mb-16">
          <div className="group bg-white rounded-3xl p-10 text-center border border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl hover:shadow-gray-200/50">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-gray-700" />
            </div>
            <div className="text-5xl font-semibold text-gray-900 mb-2">
              {interviewDetails.estimated_duration_minutes}
            </div>
            <div className="text-base text-gray-500 font-medium">
              minutes
            </div>
          </div>
          
          <div className="group bg-white rounded-3xl p-10 text-center border border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl hover:shadow-gray-200/50">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7 text-gray-700" />
            </div>
            <div className="text-5xl font-semibold text-gray-900 mb-2">
              ${interviewDetails.expected_incentive.toFixed(2)}
            </div>
            <div className="text-base text-gray-500 font-medium">
              reward
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-xl font-medium px-10 py-5 rounded-full transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 active:scale-100"
            onClick={() => {
              console.log('Start button clicked');
              onStart();
            }}
          >
            Begin Interview
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-base text-gray-500 mt-6 font-light">
            Takes approximately {interviewDetails.estimated_duration_minutes} minutes to complete
          </p>
        </div>
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