import React from 'react';
import PropTypes from 'prop-types';
import './CompletionScreen.css';
import { CheckCircle, Clock, HelpCircle, DollarSign, CreditCard } from 'lucide-react';

const CompletionScreen = ({ completionData }) => {
  return (
    <div className="min-h-screen bg-white from-gray-50 to-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle background decoration */}
      
      <div className="max-w-3xl w-full relative z-10">
        {/* Success Animation */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-bounce-slow">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
          </div>
          
          <h1 className="text-6xl font-semibold text-gray-900 tracking-tight mb-4 leading-tight">
            Interview Complete!
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Great job! Your responses have been recorded.
          </p>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            {completionData.summary}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-3">
              <Clock className="w-6 h-6 text-gray-700" />
            </div>
            <div className="text-sm text-gray-500 mb-1 font-medium">Duration</div>
            <div className="text-2xl font-semibold text-gray-900">
              {completionData.duration_minutes} <span className="text-lg text-gray-600">mins</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-3">
              <HelpCircle className="w-6 h-6 text-gray-700" />
            </div>
            <div className="text-sm text-gray-500 mb-1 font-medium">Questions</div>
            <div className="text-2xl font-semibold text-gray-900">
              {completionData.total_questions}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
              <DollarSign className="w-6 h-6 text-green-700" />
            </div>
            <div className="text-sm text-gray-500 mb-1 font-medium">Reward</div>
            <div className="text-2xl font-semibold text-green-600">
              ${completionData.incentive.amount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Payment Information</h3>
          </div>
          <p className="text-base text-gray-700 leading-relaxed">
            You will receive <span className="font-semibold text-gray-900">${completionData.incentive.amount.toFixed(2)}</span> within the next <span className="font-semibold text-gray-900">48 hours</span>.
          </p>
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