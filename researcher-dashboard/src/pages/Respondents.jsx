import { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, MapPin, Briefcase, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { respondentsAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const Respondents = () => {
  console.log('👥 Respondents component rendering...');
  
  const { showSuccess, showError } = useToast();
  const [respondents, setRespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    demographics: {
      age_range: '',
      location: '',
      occupation: ''
    }
  });

  useEffect(() => {
    console.log('🔄 Respondents useEffect triggered');
    fetchRespondents();
  }, []);

  const fetchRespondents = async () => {
    console.log('👥 Starting fetchRespondents...');
    setLoading(true);
    
    try {
      console.log('🌐 Attempting to fetch respondents from API...');
      const response = await respondentsAPI.getAll();
      console.log('👥 Respondents API response:', response);
      
      if (response.data.success) {
        setRespondents(response.data.respondents || []);
        console.log('✅ Respondents loaded from API:', response.data.respondents);
      }
    } catch (error) {
      console.error('❌ Error fetching respondents:', error);
      console.log('🔄 Loading mock respondents data...');
      
      // Mock data for demo
      setRespondents([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          demographics: {
            age_range: '25-34',
            location: 'New York',
            occupation: 'Software Engineer'
          },
          participation_count: 5,
          total_incentives: 25.00,
          avg_sentiment: 0.8,
          behavior_tags: ['detailed_responder', 'voice_user']
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          demographics: {
            age_range: '35-44',
            location: 'California',
            occupation: 'Marketing Manager'
          },
          participation_count: 3,
          total_incentives: 15.00,
          avg_sentiment: 0.6,
          behavior_tags: ['quick_responder']
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          demographics: {
            age_range: '18-24',
            location: 'Texas',
            occupation: 'Student'
          },
          participation_count: 2,
          total_incentives: 10.00,
          avg_sentiment: 0.7,
          behavior_tags: ['tech_savvy']
        }
      ]);
      console.log('✅ Mock respondents data loaded');
    } finally {
      setLoading(false);
      console.log('🏁 Respondents loading complete');
    }
  };

  const handleCreateRespondent = async (e) => {
    e.preventDefault();
    try {
      console.log('💾 Creating respondent:', formData);
      
      const response = await respondentsAPI.create(formData);
      console.log('✅ Create response:', response);
      
      if (response.data.success) {
        // Add default values for newly created respondent
        const newRespondent = {
          ...response.data.respondent,
          participation_count: 0,
          total_incentives: 0,
          avg_sentiment: 0,
          behavior_tags: []
        };
        setRespondents([newRespondent, ...respondents]);
        console.log('✅ Respondent created successfully');
        
        // Reset form and close modal
        setShowForm(false);
        setFormData({
          name: '',
          email: '',
          demographics: {
            age_range: '',
            location: '',
            occupation: ''
          }
        });
        console.log('✅ Form closed successfully');
        
        // Show success message
        showSuccess('Respondent created successfully!');
        
      } else {
        console.error('❌ Creation failed:', response.data.message);
        throw new Error(response.data.message || 'Failed to create respondent');
      }
    } catch (error) {
      console.error('❌ Error creating respondent:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show error message
      showError(`Error creating respondent: ${error.message || 'Unknown error occurred'}`);
      
      // Still close the form to prevent blank screen
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        demographics: {
          age_range: '',
          location: '',
          occupation: ''
        }
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('demographics.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        demographics: {
          ...formData.demographics,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const getSentimentColor = (score) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredRespondents = respondents.filter(respondent =>
    respondent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    respondent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    respondent.demographics?.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    respondent.demographics?.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Respondents</h1>
          <p className="text-gray-600 mt-1">Manage your research panel</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Respondent
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search respondents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-full text-sm border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Respondents Grid */}
      {filteredRespondents.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No respondents found' : 'No respondents yet'}
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Add respondents to build your research panel'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Add Respondent
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRespondents.map((respondent) => (
            <div key={respondent.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{respondent.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{respondent.email}</p>
                </div>
              </div>

              {/* Demographics */}
              <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{respondent.demographics?.age_range || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{respondent.demographics?.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{respondent.demographics?.occupation || 'Not specified'}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-lg font-semibold text-gray-900">{respondent.participation_count}</p>
                  <p className="text-xs text-gray-600">Interviews</p>
                </div>
                <div className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(respondent.total_incentives || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Earned</p>
                </div>
                <div className="text-center bg-gray-50 rounded-xl p-3">
                  <p className={`text-lg font-semibold ${getSentimentColor(respondent.avg_sentiment || 0)}`}>
                    {((respondent.avg_sentiment || 0) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-600">Sentiment</p>
                </div>
              </div>

              {/* Behavior Tags */}
              {respondent.behavior_tags && respondent.behavior_tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {respondent.behavior_tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
                      >
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  View Profile
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Respondent Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">Add New Respondent</h2>
            </div>

            <form onSubmit={handleCreateRespondent} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <select
                  name="demographics.age_range"
                  value={formData.demographics.age_range}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                >
                  <option value="">Select age range</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="demographics.location"
                  value={formData.demographics.location}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  name="demographics.occupation"
                  value={formData.demographics.occupation}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                  placeholder="Enter occupation"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Add Respondent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Respondents;
