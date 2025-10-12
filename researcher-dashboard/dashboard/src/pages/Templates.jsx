import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import TemplateCard from '../components/Templates/TemplateCard';
import TemplateForm from '../components/Templates/TemplateForm';
import { templatesAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const Templates = () => {
  console.log('📝 Templates component rendering...');
  
  const { showSuccess, showError } = useToast();
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
    // This is now handled internally by TemplateCard
    console.log('View template:', template);
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      console.log('💾 Saving template:', templateData);
      
      if (editingTemplate) {
        // Update existing template
        console.log('🔄 Updating existing template:', editingTemplate.id);
        const response = await templatesAPI.update(editingTemplate.id, templateData);
        console.log('✅ Update response:', response);
        
        if (response.data.success) {
          setTemplates(templates.map(t => {
            if (t.id === editingTemplate.id) {
              // Preserve existing values if not provided in update
              return {
                ...t,
                ...response.data.template,
                interview_count: response.data.template.interview_count ?? t.interview_count ?? 0,
                starter_questions: response.data.template.starter_questions || t.starter_questions || [],
                created_at: response.data.template.created_at || t.created_at || new Date().toISOString()
              };
            }
            return t;
          }));
          console.log('✅ Template updated successfully');
        } else {
          console.error('❌ Update failed:', response.data.message);
          throw new Error(response.data.message || 'Failed to update template');
        }
      } else {
        // Create new template
        console.log('🆕 Creating new template');
        const response = await templatesAPI.create(templateData);
        console.log('✅ Create response:', response);
        
        if (response.data.success) {
          // Add default values for newly created template
          const newTemplate = {
            ...response.data.template,
            interview_count: 0,
            created_at: response.data.template.created_at || new Date().toISOString(),
            starter_questions: response.data.template.starter_questions || [],
          };
          setTemplates([newTemplate, ...templates]);
          console.log('✅ Template created successfully');
        } else {
          console.error('❌ Creation failed:', response.data.message);
          throw new Error(response.data.message || 'Failed to create template');
        }
      }
      
      // Close form and reset state
      setShowForm(false);
      setEditingTemplate(null);
      console.log('✅ Form closed successfully');
      
      // Show success message
      showSuccess(editingTemplate ? 'Template updated successfully!' : 'Template created successfully!');
      
    } catch (error) {
      console.error('❌ Error saving template:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show error message
      showError(`Error saving template: ${error.message || 'Unknown error occurred'}`);
      
      // Still close the form to prevent blank screen
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
   <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-1">Manage your interview templates</p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 font-medium text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-10 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-4">
            <Plus className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No templates found' : 'No templates yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first interview template to get started'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateTemplate}
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 font-medium text-white hover:bg-gray-800 transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Your First Template
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
