import { useState, useEffect } from 'react';
import { Plus, Users, BarChart3, FileText } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { sessionsAPI, insightsAPI } from '../services/api';

const Dashboard = () => {
  console.log('🏠 Dashboard component rendering...');
  
  // Simple test first
  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Researcher! 👋</h1>
            <p className="text-blue-100 text-lg">Here's what's happening with your AI interviews today</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Interviews</p>
              <p className="text-3xl font-bold">47</p>
              <p className="text-blue-200 text-sm">+12% this week</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Avg Sentiment</p>
              <p className="text-3xl font-bold">75.2%</p>
              <p className="text-emerald-200 text-sm">+5.2% improvement</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold">85.1%</p>
              <p className="text-orange-200 text-sm">+2.1% this month</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Active Sessions</p>
              <p className="text-3xl font-bold">3</p>
              <p className="text-violet-200 text-sm">Live interviews</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-200">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Coffee Study completed</p>
              <p className="text-sm text-gray-600">John Doe • 2 minutes ago</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
              <span className="text-sm font-medium text-green-600">80%</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all duration-200">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Product Feedback completed</p>
              <p className="text-sm text-gray-600">Jane Smith • 5 minutes ago</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
              <span className="text-sm font-medium text-yellow-600">60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left">
          <div className="flex items-center space-x-3">
            <Plus className="w-6 h-6" />
            <div>
              <p className="font-semibold">Create Template</p>
              <p className="text-blue-100 text-sm">Design new interview</p>
            </div>
          </div>
        </button>

        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6" />
            <div>
              <p className="font-semibold">View Respondents</p>
              <p className="text-emerald-100 text-sm">Manage panel</p>
            </div>
          </div>
        </button>

        <button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6" />
            <div>
              <p className="font-semibold">Generate Survey</p>
              <p className="text-orange-100 text-sm">Create from data</p>
            </div>
          </div>
        </button>

        <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6" />
            <div>
              <p className="font-semibold">View Sessions</p>
              <p className="text-violet-100 text-sm">Monitor interviews</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
  
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
