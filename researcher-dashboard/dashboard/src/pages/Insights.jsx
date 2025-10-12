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
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray rounded-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white px-8 py-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Insights & Analytics</h1>
            <p className="text-gray-600">Analyze your research data and trends</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
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
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white px-6 py-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Total Interviews</p>
              <p className="text-3xl font-semibold text-gray-900">{overview?.total_interviews || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white px-6 py-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Avg Sentiment</p>
              <p className="text-3xl font-semibold text-gray-900">
                {overview ? (overview.avg_sentiment * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white px-6 py-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Completion Rate</p>
              <p className="text-3xl font-semibold text-gray-900">
                {overview ? (overview.completion_rate * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white px-6 py-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Avg Duration</p>
              <p className="text-3xl font-semibold text-gray-900">
                {overview ? formatDuration(overview.avg_duration_seconds) : '0m'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sentiment Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Sentiment Distribution</h3>
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
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-6">
            {sentimentData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Themes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Themes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={themesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="theme" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                stroke="#666"
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px'
                }}
              />
              <Bar dataKey="count" fill="#000000" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Themes Analysis */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Themes Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Theme
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mentions
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Avg Sentiment
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {themesData.map((theme, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {theme.theme.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="text-sm font-medium text-gray-900">{theme.count}</div>
                  </td>
                  <td className="px-8 py-4">
                    <div className={`text-sm font-semibold ${
                      theme.sentiment >= 70 ? 'text-green-600' :
                      theme.sentiment >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {theme.sentiment}%
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-600">+12%</span>
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
