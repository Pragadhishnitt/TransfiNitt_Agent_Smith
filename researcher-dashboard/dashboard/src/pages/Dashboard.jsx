import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, BarChart3, FileText, Clock, CheckCircle, Calendar, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sessionsAPI, insightsAPI } from '../services/api';

const Dashboard = () => {
  console.log('🏠 Dashboard component rendering...');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgSentiment: 0,
    completionRate: 0,
    activeSessions: 0,
    pendingSessions: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create-template':
        navigate('/templates');
        break;
      case 'view-respondents':
        navigate('/respondents');
        break;
      case 'generate-survey':
        navigate('/survey');
        break;
      case 'view-sessions':
        navigate('/sessions');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };


  useEffect(() => {
    console.log('🔄 Dashboard useEffect triggered');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    console.log('📊 Starting fetchDashboardData...');
    setLoading(true);
    
    try {
      console.log('🌐 Attempting API calls...');
      
      // Fetch insights overview
      const insightsResponse = await insightsAPI.getOverview();
      console.log('📈 Insights response:', insightsResponse);
      
      if (insightsResponse.data.success) {
        const data = insightsResponse.data;
        const newStats = {
          totalInterviews: data.total_interviews || 0,
          avgSentiment: (data.avg_sentiment * 100).toFixed(1) || 0,
          completionRate: (data.completion_rate * 100).toFixed(1) || 0,
          activeSessions: data.active_sessions || 0,
        };
        setStats(newStats);
        
        // Update window object for header access
        window.dashboardStats = newStats;
        console.log('✅ Insights data loaded successfully');
      }

      // Fetch all sessions
      const sessionsResponse = await sessionsAPI.getAll();
      console.log('🎤 Sessions response:', sessionsResponse);
      
      if (sessionsResponse.data.success) {
        const sessions = sessionsResponse.data.sessions || [];
        
        // Calculate active and pending sessions
        const activeSessions = sessions.filter(session => 
          session.started_at && !session.completed_at
        ).length;
        
        const pendingSessions = sessions.filter(session => 
          !session.started_at
        ).length;
        
        // Update stats with calculated values
        setStats(prevStats => ({
          ...prevStats,
          activeSessions: activeSessions,
          pendingSessions: pendingSessions
        }));
        
        // Sort sessions by completed_at (null values last for active sessions)
        const sortedSessions = sessions.sort((a, b) => {
          if (!a.completed_at && !b.completed_at) return 0;
          if (!a.completed_at) return 1; // Active sessions go to end
          if (!b.completed_at) return -1;
          return new Date(b.completed_at) - new Date(a.completed_at);
        });
        
        // Take the most recent 5 sessions
        setRecentSessions(sortedSessions.slice(0, 5));
        console.log('✅ Sessions data loaded and sorted successfully');
        console.log(`📊 Active sessions: ${activeSessions}, Pending sessions: ${pendingSessions}`);
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      console.log('🔄 Loading mock data...');
      
      // Set mock data for demo
      const mockStats = {
        totalInterviews: 47,
        avgSentiment: 75.2,
        completionRate: 85.1,
        activeSessions: 3,
        pendingSessions: 2,
      };
      setStats(mockStats);
      window.dashboardStats = mockStats;
      setRecentSessions([
        {
          id: '1',
          template_title: 'Coffee Study',
          respondent: { name: 'John Doe', email: 'john@example.com' },
          status: 'completed',
          sentiment_score: 0.8,
          completed_at: '2025-01-15T10:30:00Z',
        },
        {
          id: '2',
          template_title: 'Product Feedback',
          respondent: { name: 'Jane Smith', email: 'jane@example.com' },
          status: 'completed',
          sentiment_score: 0.6,
          completed_at: '2025-01-15T09:15:00Z',
        },
        {
          id: '3',
          template_title: 'User Experience Study',
          respondent: { name: 'Mike Johnson', email: 'mike@example.com' },
          status: 'active',
          started_at: '2025-01-15T11:00:00Z',
          completed_at: null,
        },
      ]);
      console.log('✅ Mock data loaded');
    } finally {
      setLoading(false);
      console.log('🏁 Dashboard data loading complete');
    }
  };

  const fetchSessionDetails = async (sessionId) => {
    try {
      const response = await sessionsAPI.getById(sessionId);
      if (response.data.success) {
        setSessionDetails(response.data.session);
        setSelectedSession(sessionId);
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Welcome back, {user?.name || 'Researcher'}!
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your AI interviews today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Interviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalInterviews}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Sentiment</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgSentiment}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSessions}</p>
              <p className="text-gray-500 text-sm">
                {stats.pendingSessions > 0 ? `${stats.pendingSessions} pending` : 'Live interviews'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

        {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentSessions.length > 0 ? (
            recentSessions.map((session) => {
              const isCompleted = session.status === 'completed' && session.completed_at;
              const isActive = session.status === 'active' || !session.completed_at;
              const isExpanded = selectedSession === session.id;
              
              return (
                <div 
                  key={session.id} 
                  className={`bg-gray-50 rounded-xl transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'bg-white shadow-md' : 'hover:bg-gray-100'
                  }`}
                >
                  <div 
                    onClick={() => fetchSessionDetails(session.id)}
                    className="flex items-center space-x-4 p-4 cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : isActive ? (
                        <Clock className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {session.template_title} {isCompleted ? 'completed' : isActive ? 'in progress' : 'pending'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.respondent?.name || session.respondent?.email?.split('@')[0] || 'Anonymous'} • {
                          isCompleted 
                            ? new Date(session.completed_at).toLocaleString()
                            : isActive 
                              ? `Started ${new Date(session.started_at).toLocaleString()}`
                              : 'Pending'
                        }
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : isActive 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}
                      </span>
                      {isCompleted && session.sentiment_score && (
                        <span className="text-sm font-medium text-green-600">
                          {Math.round(session.sentiment_score * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && sessionDetails && (
                    <div className="px-4 pb-4 border-t border-gray-200">
                      <div className="pt-4 space-y-4">
                        {/* Session Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-600">Template</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{sessionDetails.template?.title}</p>
                            <p className="text-xs text-gray-600">{sessionDetails.template?.topic}</p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-600">Respondent</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{sessionDetails.respondent?.email}</p>
                          </div>
                        </div>

                        {/* Status and Timing */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-600">Status</span>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              sessionDetails.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : sessionDetails.status === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {sessionDetails.status}
                            </span>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <Calendar className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-600">Started</span>
                            </div>
                            <p className="text-xs text-gray-900">
                              {new Date(sessionDetails.started_at).toLocaleString()}
                            </p>
                          </div>
                          
                          {sessionDetails.completed_at && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-gray-600" />
                                <span className="text-xs font-medium text-gray-600">Completed</span>
                              </div>
                              <p className="text-xs text-gray-900">
                                {new Date(sessionDetails.completed_at).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Sentiment Score */}
                        {sessionDetails.sentiment_score && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <BarChart3 className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-600">Sentiment Score</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${sessionDetails.sentiment_score * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-gray-900">
                                {Math.round(sessionDetails.sentiment_score * 100)}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Summary */}
                        {sessionDetails.summary && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-600">Summary</span>
                            </div>
                            <p className="text-xs text-gray-900">{sessionDetails.summary}</p>
                          </div>
                        )}

                        {/* Key Themes */}
                        {sessionDetails.key_themes && sessionDetails.key_themes.length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-600">Key Themes</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {sessionDetails.key_themes.map((theme, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {theme}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-500">Start creating templates and conducting interviews to see activity here.</p>
          </div>
          )}
        </div>
      </div>



      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => handleQuickAction('create-template')} 
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Create Template</p>
              <p className="text-gray-600 text-sm">Design new interview</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleQuickAction('view-respondents')} 
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">View Respondents</p>
              <p className="text-gray-600 text-sm">Manage panel</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleQuickAction('generate-survey')} 
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Generate Survey</p>
              <p className="text-gray-600 text-sm">Create from data</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleQuickAction('view-sessions')} 
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">View Sessions</p>
              <p className="text-gray-600 text-sm">Monitor interviews</p>
            </div>
          </div>
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
