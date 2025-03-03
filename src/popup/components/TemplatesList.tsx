import React, { useEffect, useState } from 'react';
import { useTemplates } from '@/hooks/useApi';
import { useToast } from '@/components/common/ToastProvider';
import Button from '@/components/common/Button';
import { Template } from '@/types/common';
import { apiService } from '@/services/api.service';

const TemplatesList: React.FC = () => {
  const { data, isLoading, error, execute: fetchTemplates } = useTemplates();
  const { showToast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

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
      // Find the ChatGPT input area in the tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        throw new Error('No active tab found');
      }
      
      // Track template usage
      await apiService.trackTemplateUsage(template.id);
      
      // Execute script in the active tab to fill the input area
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (content: string) => {
          const inputArea = document.querySelector('textarea#prompt-textarea') as HTMLTextAreaElement;
          if (inputArea) {
            inputArea.value = content;
            // Trigger input event to ensure any listeners detect the change
            inputArea.dispatchEvent(new Event('input', { bubbles: true }));
            // Focus the input
            inputArea.focus();
          }
        },
        args: [template.content]
      });
      
      showToast({
        title: 'Template Applied',
        message: `"${template.name}" has been inserted into the input area`,
        type: 'success'
      });
      
      // Close the popup
      window.close();
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
  const getTemplatesForDisplay = () => {
    if (!data?.templates) return [];
    
    if (!selectedFolder) {
      return data.templates.filter(t => !t.folder); // Root templates
    }
    
    return data.templates.filter(t => t.folder === selectedFolder);
  };

  const templatesForDisplay = getTemplatesForDisplay();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Templates</h2>
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            // This would be implemented to create a new template
            showToast({
              title: 'Coming Soon',
              message: 'Template creation in popup will be available in the next update',
              type: 'info'
            });
          }}
        >
          New
        </Button>
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
        <div className="text-center py-8">
          <svg className="inline w-8 h-8 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      ) : templatesForDisplay.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No templates found</p>
          {selectedFolder ? (
            <button
              className="text-primary text-sm hover:underline mt-2"
              onClick={() => setSelectedFolder(null)}
            >
              View all templates
            </button>
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              Create a template to get started
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {templatesForDisplay.map((template) => (
            <div
              key={template.id}
              className="p-3 bg-white border border-gray-200 rounded-md hover:border-primary transition-colors cursor-pointer group"
              onClick={() => handleUseTemplate(template)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {template.name || 'Untitled Template'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {template.description || truncateText(template.content, 80)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
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

// Helper to truncate text
function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default TemplatesList;