import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Play, Clock, User, MessageSquare } from 'lucide-react';
import SessionModal from '../components/Sessions/SessionModal';
import { sessionsAPI } from '../services/api';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionsAPI.getAll();
      if (response.data.success) {
        setSessions(response.data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Mock data for demo - set immediately
      setSessions([
        {
          id: '1',
          template_id: '1',
          template_title: 'Coffee Study',
          respondent: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          status: 'completed',
          sentiment_score: 0.75,
          started_at: '2025-01-15T10:00:00Z',
          completed_at: '2025-01-15T10:05:00Z',
          duration_seconds: 300,
          transcript: [
            {
              role: 'agent',
              message: 'How often do you drink coffee?',
              timestamp: '2025-01-15T10:00:00Z'
            },
            {
              role: 'user',
              message: 'I drink coffee every morning',
              timestamp: '2025-01-15T10:00:15Z'
            },
            {
              role: 'agent',
              message: 'What time of day do you prefer coffee?',
              timestamp: '2025-01-15T10:01:00Z'
            },
            {
              role: 'user',
              message: 'Definitely in the morning, around 8 AM',
              timestamp: '2025-01-15T10:01:20Z'
            }
          ],
          summary: 'User is a daily coffee drinker who prefers morning consumption around 8 AM. Shows strong preference for convenience and quality.',
          sentiment_breakdown: {
            positive: 70,
            neutral: 20,
            negative: 10
          },
          key_themes: ['morning routine', 'convenience', 'quality preference']
        },
        {
          id: '2',
          template_id: '2',
          template_title: 'Product Feedback',
          respondent: {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          status: 'completed',
          sentiment_score: 0.6,
          started_at: '2025-01-15T09:00:00Z',
          completed_at: '2025-01-15T09:08:00Z',
          duration_seconds: 480,
          transcript: [
            {
              role: 'agent',
              message: 'How often do you use our mobile app?',
              timestamp: '2025-01-15T09:00:00Z'
            },
            {
              role: 'user',
              message: 'I use it daily for checking my account',
              timestamp: '2025-01-15T09:00:20Z'
            }
          ],
          summary: 'User is a regular app user who primarily uses it for account management. Has some suggestions for improvement.',
          sentiment_breakdown: {
            positive: 50,
            neutral: 30,
            negative: 20
          },
          key_themes: ['account management', 'daily usage', 'improvement suggestions']
        },
        {
          id: '3',
          template_id: '1',
          template_title: 'Coffee Study',
          respondent: {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com'
          },
          status: 'active',
          sentiment_score: null,
          started_at: '2025-01-15T11:00:00Z',
          completed_at: null,
          duration_seconds: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSession = async (session) => {
    try {
      const response = await sessionsAPI.getById(session.id);
      if (response.data.success) {
        setSelectedSession(response.data.session);
      } else {
        setSelectedSession(session);
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      setSelectedSession(session);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSession(null);
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

  const getSentimentColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.template_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.respondent?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.respondent?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Sessions</h1>
        <p className="text-gray-600 mt-1">Monitor and analyze interview sessions</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-full text-sm border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 text-sm">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No interview sessions have been conducted yet'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Respondent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {session.template_title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          ID: {session.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {session.respondent?.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {session.respondent?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {session.sentiment_score ? (
                        <div className="flex items-center">
                          <span className={`text-sm font-semibold ${getSentimentColor(session.sentiment_score)}`}>
                            {(session.sentiment_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {session.duration_seconds > 0 ? formatDuration(session.duration_seconds) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(session.completed_at || session.started_at)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewSession(session)}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Session Modal */}
      <SessionModal
        session={selectedSession}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Sessions;
