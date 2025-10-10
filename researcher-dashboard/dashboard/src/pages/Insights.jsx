import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MessageSquare, Clock, Filter } from 'lucide-react';
import { insightsAPI, templatesAPI } from '../services/api';

const Insights = () => {
  const [overview, setOverview] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedTemplate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch templates for filter
      const templatesResponse = await templatesAPI.getAll();
      if (templatesResponse.data.success) {
        setTemplates(templatesResponse.data.templates || []);
      }

      // Fetch insights overview
      const params = selectedTemplate ? { template_id: selectedTemplate } : {};
      const insightsResponse = await insightsAPI.getOverview(params);
      if (insightsResponse.data.success) {
        setOverview(insightsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      // Mock data for demo - set immediately
      setOverview({
        total_interviews: 50,
        avg_sentiment: 0.75,
        sentiment_distribution: {
          positive: 35,
          neutral: 10,
          negative: 5
        },
        top_themes: [
          {
            theme: 'convenience',
            count: 42,
            avg_sentiment: 0.8
          },
          {
            theme: 'price sensitivity',
            count: 38,
            avg_sentiment: 0.6
          },
          {
            theme: 'quality',
            count: 32,
            avg_sentiment: 0.85
          },
          {
            theme: 'customer service',
            count: 28,
            avg_sentiment: 0.7
          }
        ],
        completion_rate: 0.85,
        avg_duration_seconds: 280
      });
      
      setTemplates([
        { id: '1', title: 'Coffee Study' },
        { id: '2', title: 'Product Feedback' },
        { id: '3', title: 'Brand Perception' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sentimentData = overview ? [
    { name: 'Positive', value: overview.sentiment_distribution.positive, color: '#10B981' },
    { name: 'Neutral', value: overview.sentiment_distribution.neutral, color: '#F59E0B' },
    { name: 'Negative', value: overview.sentiment_distribution.negative, color: '#EF4444' }
  ] : [];

  const themesData = overview?.top_themes?.map(theme => ({
    theme: theme.theme,
    count: theme.count,
    sentiment: (theme.avg_sentiment * 100).toFixed(0)
  })) || [];

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insights & Analytics</h1>
          <p className="text-gray-600">Analyze your research data and trends</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Templates</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.total_interviews || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Sentiment</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview ? (overview.avg_sentiment * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview ? (overview.completion_rate * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview ? formatDuration(overview.avg_duration_seconds) : '0m'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sentiment Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {sentimentData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Themes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Themes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={themesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="theme" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Themes with Sentiment */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Themes Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Theme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mentions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Sentiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {themesData.map((theme, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {theme.theme.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{theme.count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      theme.sentiment >= 70 ? 'text-green-600' :
                      theme.sentiment >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {theme.sentiment}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-gray-500">+12%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Insights;
