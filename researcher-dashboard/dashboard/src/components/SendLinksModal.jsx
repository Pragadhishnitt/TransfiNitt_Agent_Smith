import { useState, useEffect } from 'react';
import { X, Search, Filter, Send, Copy, CheckCircle, User, Mail, Calendar, Loader, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { templatesAPI, respondentsAPI, sessionsAPI } from '../services/api';

const SendLinksModal = ({ isOpen, onClose, templateId, templateTitle }) => {
  const [availableRespondents, setAvailableRespondents] = useState([]);
  const [filteredRespondents, setFilteredRespondents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [participationFilter, setParticipationFilter] = useState('');
  const [sentLinks, setSentLinks] = useState(new Set());
  const [sendingLinks, setSendingLinks] = useState(new Set());

  useEffect(() => {
    if (isOpen && templateId) {
      fetchAvailableRespondents();
    }
  }, [isOpen, templateId]);

  useEffect(() => {
    filterRespondents();
  }, [availableRespondents, searchTerm, ageFilter, genderFilter, locationFilter, participationFilter]);

  const fetchAvailableRespondents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await templatesAPI.getAvailableRespondents(templateId);
      if (response.data.success) {
        const respondentIds = response.data.available_respondent_ids;
        
        // Fetch detailed information for each respondent using the individual endpoint
        const detailedRespondents = await Promise.all(
          respondentIds.map(async (respondent) => {
            try {
              
              const detailResponse = await respondentsAPI.getById(respondent.id);
              if (detailResponse.data.success) {
                return {
                  ...respondent,
                  ...detailResponse.data.respondent,
                  demographics: detailResponse.data.respondent.demographics || {}
                };
              }
              return respondent;
            } catch (error) {
              console.error('Error fetching respondent details:', error);
              return respondent;
            }
          })
        );

        setAvailableRespondents(detailedRespondents);
      } else {
        setError(response.data.message || 'Failed to fetch available respondents');
      }
    } catch (error) {
      console.error('Error fetching available respondents:', error);
      setError('Failed to fetch available respondents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterRespondents = () => {
    let filtered = availableRespondents;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(respondent =>
        respondent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (respondent.name && respondent.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (respondent.demographics?.location && respondent.demographics.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (respondent.demographics?.occupation && respondent.demographics.occupation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Age filter
    if (ageFilter) {
      filtered = filtered.filter(respondent => {
        const age = respondent.demographics?.age;
        if (!age) return false;
        
        switch (ageFilter) {
          case '18-25':
            return age >= 18 && age <= 25;
          case '26-35':
            return age >= 26 && age <= 35;
          case '36-45':
            return age >= 36 && age <= 45;
          case '46-55':
            return age >= 46 && age <= 55;
          case '55+':
            return age > 55;
          default:
            return true;
        }
      });
    }

    // Gender filter
    if (genderFilter) {
      filtered = filtered.filter(respondent =>
        respondent.demographics?.gender === genderFilter
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(respondent =>
        respondent.demographics?.location && 
        respondent.demographics.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Participation filter
    if (participationFilter) {
      filtered = filtered.filter(respondent => {
        const count = respondent.participation_count || 0;
        switch (participationFilter) {
          case 'new':
            return count === 0;
          case 'experienced':
            return count >= 1 && count <= 5;
          case 'expert':
            return count > 5;
          default:
            return true;
        }
      });
    }

    setFilteredRespondents(filtered);
  };

  const handleSendLink = async (respondent) => {
  try {
    setSendingLinks(prev => new Set(prev).add(respondent.id));

    const response = await sessionsAPI.create({
      template_id: templateId,
      respondent_name: respondent.name || respondent.email.split('@')[0],
      respondent_email: respondent.email,
      send_email: true // This triggers email sending
    });

    if (response.data.success) {
      const { interview_link, email_sent } = response.data;
      
      // Copy link to clipboard
      await navigator.clipboard.writeText(interview_link);
      
      // Mark as sent
      setSentLinks(prev => new Set(prev).add(respondent.id));
      
      // Log email status
      if (email_sent) {
        console.log(`✅ Email sent to ${respondent.email}`);
      }
      
      // Remove from available list after a short delay
      setTimeout(() => {
        setAvailableRespondents(prev => 
          prev.filter(r => r.id !== respondent.id)
        );
      }, 2000);
    } else {
      setError(response.data.message || 'Failed to create session');
    }
  } catch (error) {
    console.error('Error sending link:', error);
    setError('Failed to send link. Please try again.');
  } finally {
    setSendingLinks(prev => {
      const newSet = new Set(prev);
      newSet.delete(respondent.id);
      return newSet;
    });
  }
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Send Interview Links</h2>
            <p className="text-gray-600 mt-1 text-sm">Template: {templateTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full px-3 py-2 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>

            {/* Age Filter */}
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              <option value="">All Ages</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="55+">55+</option>
            </select>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {/* Location Filter */}
            <input
              type="text"
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            />

            {/* Results Count */}
            <div className="flex items-center justify-center px-3 py-2 bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-white">
                {filteredRespondents.length} found
              </span>
            </div>
          </div>

          {/* Participation Filter - Full Width Second Row */}
          <div className="mt-3">
            <select
              value={participationFilter}
              onChange={(e) => setParticipationFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              <option value="">All Experience Levels</option>
              <option value="new">New (0 interviews)</option>
              <option value="experienced">Experienced (1-5)</option>
              <option value="expert">Expert (5+)</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-96">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-6 h-6 animate-spin text-gray-900" />
              <span className="ml-3 text-gray-600">Loading respondents...</span>
            </div>
          ) : filteredRespondents.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || ageFilter || genderFilter ? 'No matching respondents' : 'No available respondents'}
              </h3>
              <p className="text-gray-600 text-sm">
                {searchTerm || ageFilter || genderFilter 
                  ? 'Try adjusting your filters'
                  : 'All respondents have already participated in this template'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRespondents.map((respondent) => {
                const isSent = sentLinks.has(respondent.id);
                const isSending = sendingLinks.has(respondent.id);

                return (
                  <div
                    key={respondent.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      isSent 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {(respondent.name || respondent.email).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {respondent.name || respondent.email.split('@')[0]}
                            </h4>
                            <p className="text-sm text-gray-600">{respondent.email}</p>
                          </div>
                        </div>

                        {/* Demographics */}
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 ml-13">
                          {respondent.demographics?.age && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {respondent.demographics.age} years
                            </div>
                          )}
                          {respondent.demographics?.gender && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {respondent.demographics.gender}
                            </div>
                          )}
                          {respondent.demographics?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {respondent.demographics.location}
                            </div>
                          )}
                          {respondent.demographics?.occupation && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {respondent.demographics.occupation}
                            </div>
                          )}
                          {respondent.participation_count > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              {respondent.participation_count} interviews
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isSent ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Sent</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSendLink(respondent)}
                            disabled={isSending}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSending ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                <span className="text-sm font-medium">Sending...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span className="text-sm font-medium">Send</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Links are automatically copied to clipboard when sent
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendLinksModal;
