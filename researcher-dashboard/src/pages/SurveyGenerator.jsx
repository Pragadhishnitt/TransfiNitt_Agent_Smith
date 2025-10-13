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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Survey Generator</h1>
        <p className="text-gray-600 mt-1">Generate structured surveys from your interview data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Configuration */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Survey Configuration</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template *
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
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
                      className="text-sm font-medium text-gray-900 hover:text-gray-700"
                    >
                      Select All
                    </button>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                    {sessions.map(session => (
                      <label key={session.id} className="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedSessions.includes(session.id)}
                          onChange={() => handleSessionToggle(session.id)}
                          className="h-4 w-4 text-gray-900 focus:ring-gray-200 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.respondent?.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-5 h-5" />
                    Generate Survey
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Survey */}
        <div className="space-y-4">
          {generatedSurvey ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Generated Survey</h3>
                {generatedSurvey.google_form_url && (
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {generatedSurvey.questions.map((question, index) => (
                  <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-sm font-medium text-gray-900 flex-1">
                        {question.question}
                      </h4>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-lg flex-shrink-0 ${getQuestionTypeColor(question.type)}`}>
                        {getQuestionTypeLabel(question.type)}
                      </span>
                    </div>
                    
                    {question.options && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Options:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {question.options.map((option, optionIndex) => (
                            <span
                              key={optionIndex}
                              className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg"
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
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-green-800">Google Form Created</p>
                      <p className="text-xs text-green-600 mt-1">
                        Your survey has been automatically created in Google Forms
                      </p>
                    </div>
                    <a
                      href={generatedSurvey.google_form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Form
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Create Form
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-4">
                  <FileSpreadsheet className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Survey Generated</h3>
                <p className="text-gray-600 text-sm">
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
