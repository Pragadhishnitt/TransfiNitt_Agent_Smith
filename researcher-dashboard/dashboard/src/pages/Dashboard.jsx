import { useState, useEffect } from 'react';
import { Plus, Users, BarChart3, FileText } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { sessionsAPI, insightsAPI } from '../services/api';

const Dashboard = () => {
  console.log('🏠 Dashboard component rendering...');
  
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgSentiment: 0,
    completionRate: 0,
    activeSessions: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setStats({
          totalInterviews: data.total_interviews || 0,
          avgSentiment: (data.avg_sentiment * 100).toFixed(1) || 0,
          completionRate: (data.completion_rate * 100).toFixed(1) || 0,
          activeSessions: 0,
        });
        console.log('✅ Insights data loaded successfully');
      }

      // Fetch recent sessions
      const sessionsResponse = await sessionsAPI.getAll({ limit: 5 });
      console.log('🎤 Sessions response:', sessionsResponse);
      
      if (sessionsResponse.data.success) {
        setRecentSessions(sessionsResponse.data.sessions || []);
        console.log('✅ Sessions data loaded successfully');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      console.log('🔄 Loading mock data...');
      
      // Set mock data for demo
      setStats({
        totalInterviews: 47,
        avgSentiment: 75.2,
        completionRate: 85.1,
        activeSessions: 3,
      });
      setRecentSessions([
        {
          id: '1',
          template_title: 'Coffee Study',
          respondent: { name: 'John Doe' },
          status: 'completed',
          sentiment_score: 0.8,
          completed_at: '2025-01-15T10:30:00Z',
        },
        {
          id: '2',
          template_title: 'Product Feedback',
          respondent: { name: 'Jane Smith' },
          status: 'completed',
          sentiment_score: 0.6,
          completed_at: '2025-01-15T09:15:00Z',
        },
      ]);
      console.log('✅ Mock data loaded');
    } finally {
      setLoading(false);
      console.log('🏁 Dashboard data loading complete');
    }
  };

  const quickActions = [
    {
      title: 'Create Template',
      description: 'Design a new interview template',
      icon: Plus,
      href: '/templates',
      color: 'blue',
    },
    {
      title: 'View Respondents',
      description: 'Manage your research panel',
      icon: Users,
      href: '/respondents',
      color: 'green',
    },
    {
      title: 'Generate Survey',
      description: 'Create surveys from interview data',
      icon: BarChart3,
      href: '/survey',
      color: 'purple',
    },
    {
      title: 'View Sessions',
      description: 'Monitor active interviews',
      icon: FileText,
      href: '/sessions',
      color: 'yellow',
    },
  ];

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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your research.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Interviews"
          value={stats.totalInterviews}
          change="+12%"
          changeType="positive"
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Avg Sentiment"
          value={`${stats.avgSentiment}%`}
          change="+5.2%"
          changeType="positive"
          icon={BarChart3}
          color="green"
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          change="+2.1%"
          changeType="positive"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Active Sessions"
          value={stats.activeSessions}
          icon={Plus}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentSessions} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.href}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                    <Icon className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
