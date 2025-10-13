import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const TemplateForm = ({ template, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    title: template?.title || '',
    topic: template?.topic || '',
    starter_questions: template?.starter_questions || [''],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.starter_questions];
    newQuestions[index] = value;
    setFormData({
      ...formData,
      starter_questions: newQuestions,
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      starter_questions: [...formData.starter_questions, ''],
    });
  };

  const removeQuestion = (index) => {
    if (formData.starter_questions.length > 1) {
      const newQuestions = formData.starter_questions.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        starter_questions: newQuestions,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredQuestions = formData.starter_questions.filter(q => q.trim() !== '');
    onSave({
      ...formData,
      starter_questions: filteredQuestions,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-md flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden border border-gray-100">
    <div className="px-8 py-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {template ? 'Edit Template' : 'New Template'}
        </h2>
        <button
          onClick={onCancel}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(85vh-140px)]">
      <div className="px-8 py-6 space-y-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-3">
            Template Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
            placeholder="Coffee Study"
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-900 mb-3">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            required
            value={formData.topic}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
            placeholder="Coffee consumption habits"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Starter Questions
          </label>
          <div className="space-y-3">
            {formData.starter_questions.map((question, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                  placeholder={`Question ${index + 1}`}
                  required
                />
                {formData.starter_questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors group"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addQuestion}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
        >
          {template ? 'Update Template' : 'Create Template'}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default TemplateForm;
