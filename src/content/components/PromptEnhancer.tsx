import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/common/Button';
import { useToast } from '@/components/common/ToastProvider';
import { apiService } from '@/services/api.service';

const PromptEnhancer: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [inputArea, setInputArea] = useState<HTMLTextAreaElement | null>(null);
  const [inputText, setInputText] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  
  // Find and observe the ChatGPT input area
  useEffect(() => {
    const findInputArea = () => {
      const textarea = document.querySelector('textarea#prompt-textarea') as HTMLTextAreaElement;
      if (textarea) {
        setInputArea(textarea);
        
        // Monitor input changes
        const handleInput = () => {
          const text = textarea.value.trim();
          setInputText(text);
          setShowButton(text.length > 15); // Only show for meaningful text
        };
        
        textarea.addEventListener('input', handleInput);
        // Initial check
        handleInput();
        
        return () => {
          textarea.removeEventListener('input', handleInput);
        };
      }
    };
    
    // Initial check
    findInputArea();
    
    // Check periodically
    const intervalId = setInterval(() => {
      if (!inputArea) {
        findInputArea();
      }
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [inputArea]);
  
  // Position the button
  useEffect(() => {
    const positionButton = () => {
      if (inputArea && buttonRef.current) {
        const rect = inputArea.getBoundingClientRect();
        buttonRef.current.style.top = `${rect.top - 40}px`;
        buttonRef.current.style.left = `${rect.right - 150}px`;
      }
    };
    
    if (showButton) {
      positionButton();
      
      // Reposition on resize
      window.addEventListener('resize', positionButton);
      
      return () => {
        window.removeEventListener('resize', positionButton);
      };
    }
  }, [showButton, inputArea]);
  
  // Handle click outside to close the panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPanel &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPanel(false);
      }
    };
    
    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);
  
  // Generate enhanced prompt
  const enhancePrompt = async () => {
    if (!inputText) return;
    
    setIsLoading(true);
    
    try {
      const result = await apiService.enhancePrompt(inputText);
      
      if (result.success) {
        setEnhancedPrompt(result.enhanced_prompt);
      } else {
        throw new Error(result.error || 'Failed to enhance prompt');
      }
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to enhance prompt',
        type: 'error'
      });
      setEnhancedPrompt('Sorry, there was an error enhancing your prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use the enhanced prompt
  const useEnhancedPrompt = () => {
    if (!enhancedPrompt || !inputArea) return;
    
    // Replace the input area content
    inputArea.value = enhancedPrompt;
    
    // Trigger an input event
    inputArea.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Focus the input area
    inputArea.focus();
    
    // Close the panel
    setShowPanel(false);
    
    showToast({
      title: 'Prompt Enhanced',
      message: 'The enhanced prompt has been applied',
      type: 'success'
    });
  };
  
  // Open the enhancer panel
  const openEnhancerPanel = () => {
    setShowPanel(true);
    enhancePrompt();
  };
  
  // Skip rendering if button shouldn't be shown
  if (!showButton) {
    return null;
  }
  
  return (
    <>
      {/* Enhancer Button */}
      <button
        ref={buttonRef}
        className="archimind-enhancer-button absolute"
        onClick={openEnhancerPanel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z"></path>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
        <span>Enhance Prompt</span>
      </button>
      
      {/* Enhancer Panel */}
      {showPanel && (
        <div
          ref={panelRef}
          className="archimind-enhancer-panel absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Enhanced Prompt</h3>
            <div className="flex gap-2">
              <button
                className="bg-white/20 p-1 rounded hover:bg-opacity-30 transition-colors"
                onClick={useEnhancedPrompt}
                disabled={isLoading || !enhancedPrompt}
                title="Use This Prompt"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </button>
              <button
                className="bg-white/20 p-1 rounded hover:bg-opacity-30 transition-colors"
                onClick={() => setShowPanel(false)}
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="w-8 h-8 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-600">Enhancing your prompt...</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{enhancedPrompt}</div>
            )}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <Button
              onClick={useEnhancedPrompt}
              disabled={isLoading || !enhancedPrompt}
              className="w-full"
            >
              Use Enhanced Prompt
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptEnhancer;