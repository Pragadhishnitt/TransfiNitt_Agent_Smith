import { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, ExternalLink, CheckCircle, Copy } from 'lucide-react';
import { surveyAPI, templatesAPI, sessionsAPI } from '../services/api';

const SurveyGenerator = () => {
  const [templates, setTemplates] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [generatedSurvey, setGeneratedSurvey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      fetchSessions();
    }
  }, [selectedTemplate]);

  const fetchTemplates = async () => {
    try {
      const response = await templatesAPI.getAll();
      if (response.data.success) {
        setTemplates(response.data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Mock data for demo
      setTemplates([
        { id: '1', title: 'Coffee Study' },
        { id: '2', title: 'Product Feedback' },
        { id: '3', title: 'Brand Perception' }
      ]);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await sessionsAPI.getAll({ template_id: selectedTemplate });
      if (response.data.success) {
        setSessions(response.data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Mock data for demo
      setSessions([
        { id: '1', template_title: 'Coffee Study', respondent: { name: 'John Doe' }, status: 'completed' },
        { id: '2', template_title: 'Coffee Study', respondent: { name: 'Jane Smith' }, status: 'completed' },
        { id: '3', template_title: 'Coffee Study', respondent: { name: 'Mike Johnson' }, status: 'completed' }
      ]);
    }
  };

  const handleSessionToggle = (sessionId) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleSelectAllSessions = () => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    setSelectedSessions(completedSessions.map(s => s.id));
  };

  const handleGenerateSurvey = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      const response = await surveyAPI.generate({
        template_id: selectedTemplate,
        session_ids: selectedSessions.length > 0 ? selectedSessions : undefined
      });
      
      if (response.data.success) {
        setGeneratedSurvey(response.data);
      }
    } catch (error) {
      console.error('Error generating survey:', error);
      // Mock data for demo
      setGeneratedSurvey({
        questions: [
          {
            type: 'scale',
            question: 'On a scale of 1-5, how important is convenience when choosing coffee?',
            options: [1, 2, 3, 4, 5]
          },
          {
            type: 'multiple_choice',
            question: 'Which type of coffee do you prefer?',
            options: ['Instant coffee', 'Brewed coffee', 'Espresso', 'Cold brew']
          },
          {
            type: 'yes_no',
            question: 'Do you drink coffee primarily in the morning?'
          },
          {
            type: 'scale',
            question: 'How satisfied are you with your current coffee brand?',
            options: [1, 2, 3, 4, 5]
          },
          {
            type: 'multiple_choice',
            question: 'What factors most influence your coffee purchase decision?',
            options: ['Price', 'Brand reputation', 'Taste', 'Convenience', 'Quality']
          }
        ],
        google_form_url: 'https://forms.google.com/demo-survey-link'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (generatedSurvey?.google_form_url) {
      try {
        await navigator.clipboard.writeText(generatedSurvey.google_form_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'scale':
        return 'Rating Scale';
      case 'multiple_choice':
        return 'Multiple Choice';
      case 'yes_no':
        return 'Yes/No';
      default:
        return type;
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'scale':
        return 'bg-blue-100 text-blue-800';
      case 'multiple_choice':
        return 'bg-green-100 text-green-800';
      case 'yes_no':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Survey Generator</h1>
        <p className="text-gray-600">Generate structured surveys from your interview data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template *
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTemplate && sessions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Sessions (Optional)
                    </label>
                    <button
                      onClick={handleSelectAllSessions}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Select All Completed
                    </button>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                    {sessions.map(session => (
                      <label key={session.id} className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={selectedSessions.includes(session.id)}
                          onChange={() => handleSessionToggle(session.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {session.respondent?.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.template_title} • {session.status}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to use all sessions for the selected template
                  </p>
                </div>
              )}

              <button
                onClick={handleGenerateSurvey}
                disabled={!selectedTemplate || loading}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Generate Survey
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Survey */}
        <div className="space-y-6">
          {generatedSurvey ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generated Survey</h3>
                {generatedSurvey.google_form_url && (
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Link
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {generatedSurvey.questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 flex-1">
                        {question.question}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQuestionTypeColor(question.type)}`}>
                        {getQuestionTypeLabel(question.type)}
                      </span>
                    </div>
                    
                    {question.options && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Options:</p>
                        <div className="flex flex-wrap gap-1">
                          {question.options.map((option, optionIndex) => (
                            <span
                              key={optionIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {generatedSurvey.google_form_url && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Google Form Created</p>
                      <p className="text-xs text-green-600 mt-1">
                        Your survey has been automatically created in Google Forms
                      </p>
                    </div>
                    <a
                      href={generatedSurvey.google_form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-1 text-sm text-green-700 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open Form
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export Questions
                </button>
                <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Create New Form
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center py-8">
                <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Survey Generated</h3>
                <p className="text-gray-500">
                  Select a template and generate a survey to see the results here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyGenerator;
