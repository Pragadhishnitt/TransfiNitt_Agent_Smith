import { Calendar, Users, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import RespondentModal from '../RespondentModal';
import { sessionsAPI } from '../../services/api';

const TemplateCard = ({ template, onView, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateLink = () => {
    setError(null);
    setGeneratedLink(null); // Reset any existing generated link
    setShowModal(true);
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
      <div className="bg-white rounded-lg shadow-sm border mr-1.5 border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{template.topic}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(template.created_at)}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {template.interview_count || 0} interviews
            </div>
          </div>
        </div>
      </div>

      {template.starter_questions && template.starter_questions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Starter Questions:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {template.starter_questions.slice(0, 2).map((question, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span className="line-clamp-2">{question}</span>
              </li>
            ))}
            {template.starter_questions.length > 2 && (
              <li className="text-gray-500 text-xs">
                +{template.starter_questions.length - 2} more questions
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => onView(template)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onEdit(template)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            Edit
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateLink}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
          >
            <Copy className="w-4 h-4 mr-1" />
            Generate Link
          </button>
          
          {generatedLink && (
            <>
              <button
                onClick={handleCopyLink}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <span className="w-4 h-4 mr-1">✓</span>
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Link
                  </>
                )}
              </button>
              
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </a>
            </>
          )}
        </div>
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
    </>
  );
};

export default TemplateCard;
