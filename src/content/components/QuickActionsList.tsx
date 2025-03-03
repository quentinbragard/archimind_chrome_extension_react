import React from 'react';
import { useToast } from '@/components/common/ToastProvider';

interface QuickActionsListProps {
  onClose: () => void;
}

interface QuickAction {
  id: string;
  icon: string;
  title: string;
  description: string;
  comingSoon?: boolean;
  handler: () => void;
}

const QuickActionsList: React.FC<QuickActionsListProps> = ({ onClose }) => {
  const { showToast } = useToast();

  const handleGenerateReport = () => {
    showToast({
      title: 'Coming Soon',
      message: 'This feature will be available in the next update',
      type: 'info',
    });
  };

  const handleOptimizePrompts = () => {
    showToast({
      title: 'Coming Soon',
      message: 'This feature will be available in the next update',
      type: 'info',
    });
  };

  const handleLearnTechniques = () => {
    // Show prompting tips dialog
    showToast({
      title: 'Prompting Techniques',
      message: 'Check out our documentation for effective prompting techniques',
      type: 'info',
    });
    
    // Open documentation in a new tab
    window.open('https://archimind.ai/docs/prompting', '_blank');
  };

  const quickActions: QuickAction[] = [
    {
      id: 'generate-report',
      icon: '📄',
      title: 'Generate Session Report',
      description: 'Create a detailed report of your ChatGPT usage',
      comingSoon: true,
      handler: handleGenerateReport,
    },
    {
      id: 'optimize-prompts',
      icon: '✨',
      title: 'Analyze & Optimize Prompts',
      description: 'Get insights and suggestions for your prompts',
      comingSoon: true,
      handler: handleOptimizePrompts,
    },
    {
      id: 'learn-techniques',
      icon: '🧠',
      title: 'Learn Prompting Techniques',
      description: 'Discover tips and tricks for better prompting',
      handler: handleLearnTechniques,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quick Actions</h3>
      
      <div className="space-y-2">
        {quickActions.map((action, index) => (
          <div
            key={action.id}
            className="p-3 bg-white border border-gray-200 rounded-md hover:border-primary transition-colors cursor-pointer relative"
            onClick={action.handler}
          >
            <div className="flex items-start">
              <span className="text-2xl mr-3">{action.icon}</span>
              <div>
                <h4 className="font-medium">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
            
            {action.comingSoon && (
              <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsList;