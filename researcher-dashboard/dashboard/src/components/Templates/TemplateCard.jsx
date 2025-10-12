import { Calendar, Users, Copy, ExternalLink, Send, ChevronDown, ChevronUp, Clock, CheckCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import RespondentModal from '../RespondentModal';
import SendLinksModal from '../SendLinksModal';
import { sessionsAPI, templatesAPI } from '../../services/api';

const TemplateCard = ({ template, onView, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSendLinksModal, setShowSendLinksModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const handleGenerateLink = () => {
    setError(null);
    setGeneratedLink(null); // Reset any existing generated link
    setShowModal(true);
  };

  const handleSendLinks = () => {
    setShowSendLinksModal(true);
  };

  const handleViewTemplate = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    try {
      setSessionsLoading(true);
      const response = await templatesAPI.getSessions(template.id);
      if (response.data.success) {
        setSessions(response.data.session_ids || []);
        setExpanded(true);
      } else {
        setError(response.data.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to fetch sessions. Please try again.');
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleModalSubmit = async (respondentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await sessionsAPI.create({
        template_id: template.id,
        respondent_name: respondentData.name,
        respondent_email: respondentData.email
      });

      if (response.data.success) {
        const { interview_link } = response.data;
        setGeneratedLink(interview_link);
        
        // Copy the link to clipboard
        await navigator.clipboard.writeText(interview_link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        setShowModal(false);
      } else {
        setError(response.data.message || 'Failed to create session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create session. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className={`rounded-2xl border border-gray-100 bg-white px-6 py-6 transition-all duration-300 ${
        expanded ? 'shadow-lg' : 'hover:shadow-md'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.topic}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {template.created_at ? formatDate(template.created_at) : 'Just now'}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {template.interview_count || 0} interviews
              </div>
            </div>
          </div>
        </div>

        {template.starter_questions && template.starter_questions.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">Starter Questions</p>
            <ul className="text-sm text-gray-600 space-y-2">
              {template.starter_questions.slice(0, 2).map((question, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2 mt-0.5">•</span>
                  <span className="line-clamp-2">{question}</span>
                </li>
              ))}
              {template.starter_questions.length > 2 && (
                <li className="text-gray-500 text-xs mt-2">
                  +{template.starter_questions.length - 2} more questions
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Expandable Sessions Section */}
        {expanded && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Session Details</h4>
              <span className="text-sm text-gray-500">{sessions.length} sessions</span>
            </div>
            
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-sm text-gray-600">Loading sessions...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No sessions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => {
                  const isCompleted = session.status === 'completed';
                  const isActive = session.status === 'active';
                  const isPending = session.status === 'pending';

                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : isActive ? (
                            <Clock className="w-5 h-5 text-white" />
                          ) : (
                            <FileText className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.respondent_email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isCompleted && session.completed_at
                              ? `Completed ${new Date(session.completed_at).toLocaleDateString()}`
                              : isActive && session.started_at
                                ? `Started ${new Date(session.started_at).toLocaleDateString()}`
                                : 'Pending'
                            }
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-lg ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          {/* Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewTemplate}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Sessions
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View Sessions
                </>
              )}
            </button>
            <button
              onClick={() => onEdit(template)}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendLinks}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
            
            <button
              onClick={handleGenerateLink}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Link
            </button>
          </div>

          {/* Generated Link Actions */}
          {generatedLink && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <span className="text-sm">✓</span>
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </a>
            </div>
          )}
        </div>
      </div>

      <RespondentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setError(null);
        }}
        onSubmit={handleModalSubmit}
        loading={loading}
        error={error}
      />

      <SendLinksModal
        isOpen={showSendLinksModal}
        onClose={() => setShowSendLinksModal(false)}
        templateId={template.id}
        templateTitle={template.title}
      />
    </>
  );
};

export default TemplateCard;
