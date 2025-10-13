import { useState } from 'react';
import { X, User, Mail, Loader } from 'lucide-react';

const RespondentModal = ({ isOpen, onClose, onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
        Generate Interview Link
      </h2>
      <button
        onClick={handleClose}
        disabled={loading}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>

    <div className="px-8 py-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-0 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-3">
            Respondent Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 ${
                errors.name ? 'ring-2 ring-red-500' : ''
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-3">
            Respondent Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 ${
                errors.email ? 'ring-2 ring-red-500' : ''
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Link'
          )}
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default RespondentModal;
