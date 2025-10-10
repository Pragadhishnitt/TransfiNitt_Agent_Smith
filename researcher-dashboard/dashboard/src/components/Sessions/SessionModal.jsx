import { useState } from 'react';
import { X, Clock, User, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';

const SessionModal = ({ session, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('transcript');

  if (!isOpen || !session) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (score) => {
    if (score >= 0.7) return 'text-green-600 bg-green-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{session.template?.title}</h2>
              <p className="text-sm text-gray-500">{session.template?.topic}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Session Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">{session.respondent?.name}</p>
                <p className="text-xs text-gray-500">{session.respondent?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDuration(session.duration_seconds)}
                </p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                {session.status}
              </div>
            </div>
            <div className="flex items-center">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(session.sentiment_score)}`}>
                {(session.sentiment_score * 100).toFixed(0)}% sentiment
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'transcript', label: 'Transcript' },
              { id: 'summary', label: 'Summary' },
              { id: 'insights', label: 'Insights' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'transcript' && (
            <div className="space-y-4">
              {session.transcript?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'agent'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">AI Summary</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {session.summary || 'No summary available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Sentiment Breakdown */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Sentiment Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(session.sentiment_breakdown || {}).map(([sentiment, percentage]) => (
                    <div key={sentiment} className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        sentiment === 'positive' ? 'bg-green-100 text-green-600' :
                        sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <span className="text-lg font-bold">{percentage}%</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{sentiment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Themes */}
              {session.key_themes && session.key_themes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Key Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    {session.key_themes.map((theme, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Metadata */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Session Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Started</p>
                    <p className="font-medium">{formatTime(session.started_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Completed</p>
                    <p className="font-medium">{formatTime(session.completed_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
