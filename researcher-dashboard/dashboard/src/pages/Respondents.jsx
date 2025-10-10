import { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, MapPin, Briefcase, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { respondentsAPI } from '../services/api';

const Respondents = () => {
  console.log('👥 Respondents component rendering...');
  
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
      const response = await respondentsAPI.create(formData);
      if (response.data.success) {
        setRespondents([response.data.respondent, ...respondents]);
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
    } catch (error) {
      console.error('Error creating respondent:', error);
      // For demo purposes, add to local state
      const newRespondent = {
        id: Date.now().toString(),
        ...formData,
        participation_count: 0,
        total_incentives: 0,
        avg_sentiment: 0,
        behavior_tags: []
      };
      setRespondents([newRespondent, ...respondents]);
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Respondents</h1>
          <p className="text-gray-600">Manage your research panel</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Respondent
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search respondents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Respondents Grid */}
      {filteredRespondents.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No respondents found' : 'No respondents yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Add respondents to build your research panel'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Respondent
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRespondents.map((respondent) => (
            <div key={respondent.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{respondent.name}</h3>
                    <p className="text-sm text-gray-500">{respondent.email}</p>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {respondent.demographics?.age_range || 'Not specified'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {respondent.demographics?.location || 'Not specified'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {respondent.demographics?.occupation || 'Not specified'}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{respondent.participation_count}</p>
                  <p className="text-xs text-gray-500">Interviews</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">${respondent.total_incentives.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Earned</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-semibold ${getSentimentColor(respondent.avg_sentiment)}`}>
                    {(respondent.avg_sentiment * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">Sentiment</p>
                </div>
              </div>

              {/* Behavior Tags */}
              {respondent.behavior_tags && respondent.behavior_tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {respondent.behavior_tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  View Profile
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Respondent Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New Respondent</h2>
            </div>

            <form onSubmit={handleCreateRespondent} className="p-6 space-y-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter occupation"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
