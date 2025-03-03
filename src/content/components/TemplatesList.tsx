import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import { useTemplates } from '@/hooks/useApi';
import { Template } from '@/types/common';
import { truncateText } from '@/utils/formatting';
import { useToast } from '@/components/common/ToastProvider';
import { apiService } from '@/services/api.service';

interface TemplatesListProps {
  onClose: () => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({ onClose }) => {
  const { data, isLoading, error, execute: fetchTemplates } = useTemplates();
  const { showToast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTemplates().catch((error) => {
      showToast({
        title: 'Error',
        message: `Failed to load templates: ${error.message}`,
        type: 'error'
      });
    });
  }, [fetchTemplates, showToast]);

  const handleUseTemplate = async (template: Template) => {
    try {
      // Track template usage
      await apiService.trackTemplateUsage(template.id);
      
      // Find the ChatGPT input area
      const inputArea = document.querySelector('textarea#prompt-textarea') as HTMLTextAreaElement;
      if (!inputArea) {
        throw new Error('No input area found on page');
      }
      
      // Insert template content
      inputArea.value = template.content;
      // Trigger input event to ensure any listeners detect the change
      inputArea.dispatchEvent(new Event('input', { bubbles: true }));
      // Focus the input
      inputArea.focus();
      
      showToast({
        title: 'Template Applied',
        message: `"${template.name}" has been inserted into the input area`,
        type: 'success'
      });
      
      // Close the modal
      onClose();
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to apply template',
        type: 'error'
      });
    }
  };

  // Get unique folders
  const folders = data?.folders || [];
  
  // Get templates for the selected folder or all templates if no folder is selected
  const getFilteredTemplates = () => {
    if (!data?.templates) return [];
    
    let filteredTemplates = data.templates;
    
    // Filter by folder
    if (selectedFolder) {
      filteredTemplates = filteredTemplates.filter(t => t.folder === selectedFolder);
    } else if (selectedFolder === null) {
      filteredTemplates = filteredTemplates.filter(t => !t.folder); // Root templates
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTemplates = filteredTemplates.filter(
        t => t.name?.toLowerCase().includes(query) || 
             t.content.toLowerCase().includes(query) ||
             t.description?.toLowerCase().includes(query)
      );
    }
    
    return filteredTemplates;
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Folder Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          className={`px-3 py-1 text-xs rounded-full ${
            selectedFolder === null
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedFolder(null)}
        >
          Root
        </button>
        <button
          className={`px-3 py-1 text-xs rounded-full ${
            selectedFolder === undefined
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedFolder(undefined)}
        >
          All
        </button>
        {folders.map((folder) => (
          <button
            key={folder}
            className={`px-3 py-1 text-xs rounded-full flex items-center ${
              selectedFolder === folder
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedFolder(folder)}
          >
            <span className="mr-1">📁</span>
            {folder.split('/').pop()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <svg className="w-8 h-8 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          <p>Error loading templates</p>
          <button
            className="text-primary text-sm hover:underline mt-2"
            onClick={() => fetchTemplates()}
          >
            Try again
          </button>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No templates found</p>
          {selectedFolder !== undefined ? (
            <button
              className="text-primary text-sm hover:underline mt-2"
              onClick={() => {
                setSelectedFolder(undefined);
                setSearchQuery('');
              }}
            >
              View all templates
            </button>
          ) : searchQuery ? (
            <button
              className="text-primary text-sm hover:underline mt-2"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              Create a template to get started
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-3 bg-white border border-gray-200 rounded-md hover:border-primary transition-colors cursor-pointer group"
              onClick={() => handleUseTemplate(template)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                    {template.name || 'Untitled Template'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {template.description || truncateText(template.content, 80)}
                  </p>
                  {template.folder && (
                    <div className="mt-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                      <span className="mr-1">📁</span>
                      {template.folder.split('/').pop()}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                >
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesList;