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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{session.template?.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{session.template?.topic}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Session Info */}
        <div className="px-8 py-5 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{session.respondent?.name}</p>
                <p className="text-xs text-gray-500">{session.respondent?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDuration(session.duration_seconds)}
                </p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(session.status)}`}>
                {session.status}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getSentimentColor(session.sentiment_score)}`}>
                {(session.sentiment_score * 100).toFixed(0)}% sentiment
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 bg-white">
          <nav className="flex px-8">
            {[
              { id: 'transcript', label: 'Transcript' },
              { id: 'summary', label: 'Summary' },
              { id: 'insights', label: 'Insights' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-96">
          {activeTab === 'transcript' && (
            <div className="space-y-4">
              {session.transcript?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.role === 'agent'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-900 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'agent' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
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
                <h3 className="text-sm font-semibold text-gray-900 mb-3">AI Summary</h3>
                <div className="text-sm text-gray-700 bg-gray-50 p-5 rounded-xl border border-gray-100 leading-relaxed">
                  {session.summary || 'No summary available'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Sentiment Breakdown */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Sentiment Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(session.sentiment_breakdown || {}).map(([sentiment, percentage]) => (
                    <div key={sentiment} className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
                        sentiment === 'positive' ? 'bg-green-500 text-white' :
                        sentiment === 'neutral' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
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
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    {session.key_themes.map((theme, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Metadata */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Session Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Started</p>
                    <p className="text-sm font-medium text-gray-900">{formatTime(session.started_at)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Completed</p>
                    <p className="text-sm font-medium text-gray-900">{formatTime(session.completed_at)}</p>
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
