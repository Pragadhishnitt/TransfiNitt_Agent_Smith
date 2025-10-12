import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MessageSquare, Clock, Filter } from 'lucide-react';
import { insightsAPI, templatesAPI } from '../services/api';

const Insights = () => {
  const [overview, setOverview] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(true);
  const [marketingReport, setMarketingReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    console.log("🔄 useEffect triggered - selectedTemplate:", selectedTemplate);
    fetchData();
    // Clear report when template changes, but don't auto-fetch
    setMarketingReport(null);
    console.log("🧹 Cleared marketing report due to template change");
  }, [selectedTemplate]);

  // Track marketing report state changes
  useEffect(() => {
    console.log("📊 Marketing report state changed:", marketingReport);
  }, [marketingReport]);

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

  const fetchMarketingReport = async (templateId) => {
    try {
      setReportLoading(true);
      console.log("🔍 Starting to fetch marketing report for template:", templateId);
      
      const response = await insightsAPI.getReport(templateId);
      console.log("📊 Full API Response:", response);
      console.log("📊 Response Data:", response.data);
      console.log("📊 Response Status:", response.status);
      
      // Check if the response is successful
      if (response.status === 200 && response.data) {
        console.log("✅ API call successful, processing response...");
        
        // Handle different response structures
        let reportData = null;
        
        if (response.data.success && response.data.data) {
          // Structure: { success: true, data: { report: ... } }
          reportData = response.data.data.report || response.data.data;
          console.log("📋 Report data from success.data:", reportData);
        } else if (response.data.report) {
          // Structure: { report: ... }
          reportData = response.data.report;
          console.log("📋 Report data from direct report field:", reportData);
        } else if (response.data.data) {
          // Structure: { data: { report: ... } }
          reportData = response.data.data;
          console.log("📋 Report data from data field:", reportData);
        } else {
          // Use the entire response data
          reportData = response.data;
          console.log("📋 Using entire response data as report:", reportData);
        }
        
        if (reportData) {
          console.log("✅ Setting marketing report:", reportData);
          
          // Handle different report data structures
          let processedReport = reportData;
          
          // If reportData is a string (raw report text), create a structured object
          if (typeof reportData === 'string') {
            console.log("📝 Processing string report data");
            processedReport = {
              summary: reportData,
              keyFindings: [],
              recommendations: [],
              rawReport: reportData
            };
          }
          // If reportData is an object but doesn't have expected structure, wrap it
          else if (typeof reportData === 'object' && !reportData.summary && !reportData.keyFindings) {
            console.log("📦 Wrapping object report data");
            processedReport = {
              summary: reportData.report || JSON.stringify(reportData),
              keyFindings: reportData.keyFindings || [],
              recommendations: reportData.recommendations || [],
              rawReport: reportData.report || JSON.stringify(reportData)
            };
          }
          
          console.log("📋 Processed report:", processedReport);
          setMarketingReport(processedReport);
        } else {
          console.warn("⚠️ No report data found in response");
          throw new Error("No report data in response");
        }
      } else {
        console.error("❌ API call failed with status:", response.status);
        throw new Error(`API call failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching marketing report:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Mock data for demo
      console.log("🔄 Using mock data as fallback");
      setMarketingReport({
        summary: "Based on the interview analysis, key insights include strong positive sentiment around convenience features and moderate concerns about pricing. The data suggests opportunities for product positioning and pricing strategy adjustments.",
        keyFindings: [
          "Convenience is the top driver of satisfaction (85% positive sentiment)",
          "Price sensitivity varies significantly across demographics",
          "Quality perception is consistently high across all segments",
          "Customer service interactions show room for improvement"
        ],
        recommendations: [
          "Leverage convenience features in marketing messaging",
          "Consider tiered pricing strategy to address price sensitivity",
          "Maintain quality standards as a competitive advantage",
          "Invest in customer service training and processes"
        ]
      });
    } finally {
      setReportLoading(false);
      console.log("🏁 Report fetching process completed");
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
            
            {selectedTemplate && (
              <button
                onClick={() => {
                  console.log("🖱️ Generate Report button clicked for template:", selectedTemplate);
                  fetchMarketingReport(selectedTemplate);
                }}
                disabled={reportLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {reportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Generate Report</span>
                  </>
                )}
              </button>
            )}
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

      {/* Marketing Research Report Section */}
      {marketingReport && selectedTemplate && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Marketing Research Report</h3>
              <p className="text-gray-600 text-sm mt-1">
                Generated for: {templates.find(t => t.id === selectedTemplate)?.title || 'Selected Template'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Report Available</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Report Content */}
            {marketingReport.rawReport ? (
              /* Raw Report Text (from backend) */
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Marketing Research Report
                </h4>
                <div className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                  {marketingReport.rawReport}
                </div>
              </div>
            ) : (
              /* Structured Report (mock data) */
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Executive Summary
                </h4>
                <p className="text-blue-800 leading-relaxed">
                  {marketingReport.summary}
                </p>
              </div>
            )}

            {/* Key Findings - Only show for structured data */}
            {!marketingReport.rawReport && marketingReport.keyFindings && marketingReport.keyFindings.length > 0 && (
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Key Findings
                </h4>
                <ul className="space-y-3">
                  {marketingReport.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-green-800">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations - Only show for structured data */}
            {!marketingReport.rawReport && marketingReport.recommendations && marketingReport.recommendations.length > 0 && (
              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Recommendations
                </h4>
                <ul className="space-y-3">
                  {marketingReport.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-purple-800">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Report Metadata */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Report generated on: {new Date().toLocaleDateString()}</span>
                <span>Template ID: {selectedTemplate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Themes Analysis removed per request - Top Themes chart is retained above */}
    </div>
  );
};

export default Insights;
