import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import TemplateCard from '../components/Templates/TemplateCard';
import TemplateForm from '../components/Templates/TemplateForm';
import { templatesAPI } from '../services/api';

const Templates = () => {
  console.log('📝 Templates component rendering...');
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    console.log('🔄 Templates useEffect triggered');
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    console.log('📝 Starting fetchTemplates...');
    setLoading(true);
    
    try {
      console.log('🌐 Attempting to fetch templates from API...');
      const response = await templatesAPI.getAll();
      console.log('📋 Templates API response:', response);
      
      if (response.data.success) {
        setTemplates(response.data.templates || []);
        console.log('✅ Templates loaded from API:', response.data.templates);
      }
    } catch (error) {
      console.error('❌ Error fetching templates:', error);
      console.log('🔄 Loading mock templates data...');
      
      // Mock data for demo
      setTemplates([
        {
          id: '1',
          title: 'Coffee Study',
          topic: 'Coffee consumption habits',
          starter_questions: [
            'How often do you drink coffee?',
            'What time of day do you prefer coffee?',
            'What factors influence your coffee choice?'
          ],
          created_at: '2025-01-15T10:00:00Z',
          interview_count: 5
        },
        {
          id: '2',
          title: 'Product Feedback',
          topic: 'User experience with mobile app',
          starter_questions: [
            'How often do you use our mobile app?',
            'What features do you find most useful?',
            'What improvements would you suggest?'
          ],
          created_at: '2025-01-14T15:30:00Z',
          interview_count: 12
        },
        {
          id: '3',
          title: 'Brand Perception',
          topic: 'Customer brand awareness and perception',
          starter_questions: [
            'How did you first hear about our brand?',
            'What words come to mind when you think of our brand?',
            'How likely are you to recommend us to others?'
          ],
          created_at: '2025-01-13T09:15:00Z',
          interview_count: 8
        }
      ]);
      console.log('✅ Mock templates data loaded');
    } finally {
      setLoading(false);
      console.log('🏁 Templates loading complete');
    }
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleViewTemplate = (template) => {
    // Navigate to template details or open modal
    console.log('View template:', template);
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      if (editingTemplate) {
        // Update existing template
        const response = await templatesAPI.update(editingTemplate.id, templateData);
        if (response.data.success) {
          setTemplates(templates.map(t => 
            t.id === editingTemplate.id ? response.data.template : t
          ));
        }
      } else {
        // Create new template
        const response = await templatesAPI.create(templateData);
        if (response.data.success) {
          setTemplates([response.data.template, ...templates]);
        }
      }
      setShowForm(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
      // For demo purposes, add to local state
      const newTemplate = {
        id: Date.now().toString(),
        ...templateData,
        created_at: new Date().toISOString(),
        interview_count: 0
      };
      setTemplates([newTemplate, ...templates]);
      setShowForm(false);
      setEditingTemplate(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.topic.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600">Manage your interview templates</p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Template
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No templates found' : 'No templates yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first interview template to get started'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Template
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onView={handleViewTemplate}
              onEdit={handleEditTemplate}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      {/* Template Form Modal */}
      <TemplateForm
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={handleCancelForm}
        isOpen={showForm}
      />
    </div>
  );
};

export default Templates;
