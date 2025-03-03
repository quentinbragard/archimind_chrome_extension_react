import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import NotificationsList from './NotificationsList';
import TemplatesList from './TemplatesList';
import QuickActionsList from './QuickActionsList';
import { Notification, UserStats } from '@/types/common';
import { useToast } from '@/components/common/ToastProvider';
import { apiService } from '@/services/api.service';

interface MainModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  notificationsLoading: boolean;
  stats?: UserStats;
  statsLoading: boolean;
}

const MainModal: React.FC<MainModalProps> = ({
  isOpen,
  onClose,
  notifications,
  notificationsLoading,
  stats,
  statsLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'notifications' | 'actions'>('templates');
  const { showToast } = useToast();

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiService.markNotificationRead(id);
      showToast({
        title: 'Success',
        message: 'Notification marked as read',
        type: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to mark notification as read',
        type: 'error',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsRead();
      showToast({
        title: 'Success',
        message: 'All notifications marked as read',
        type: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to mark all notifications as read',
        type: 'error',
      });
    }
  };

  const handleNotificationAction = async (id: string) => {
    // Find the notification
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;
    
    // Mark notification as read
    await handleMarkAsRead(id);
    
    // Handle different notification types
    switch (notification.type) {
      case 'welcome_first_conversation':
        window.open('https://chat.openai.com/chat', '_blank');
        break;
      case 'insight_prompt_length':
      case 'insight_response_time':
      case 'insight_conversation_quality':
        showToast({
          title: notification.title,
          message: 'Detailed analytics view coming soon!',
          type: 'info',
        });
        break;
      default:
        // Default action
        break;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Archimind"
      className="w-96 max-w-full"
    >
      {/* Stat summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-primary bg-opacity-5 p-3 rounded-md text-center">
          <span className="block text-2xl font-semibold text-primary">
            {statsLoading ? '-' : stats?.total_prompts || 0}
          </span>
          <span className="text-xs text-gray-600">Prompts</span>
        </div>
        
        <div className="bg-primary bg-opacity-5 p-3 rounded-md text-center">
          <span className="block text-2xl font-semibold text-primary">
            {statsLoading ? '-' : stats?.average_score?.toFixed(1) || '-'}
            <span className="text-xs font-normal">/20</span>
          </span>
          <span className="text-xs text-gray-600">Score</span>
        </div>
        
        <div className="bg-primary bg-opacity-5 p-3 rounded-md text-center">
          <span className="block text-2xl font-semibold text-primary">
            {statsLoading ? '-' : stats?.energy_usage?.toFixed(2) || '-'}
            <span className="text-xs font-normal">kWh</span>
          </span>
          <span className="text-xs text-gray-600">Energy</span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'templates'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-primary'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'notifications'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-primary'
          }`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
          {notifications.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'actions'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-primary'
          }`}
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </button>
      </div>
      
      {/* Tab content */}
      <div className="overflow-y-auto max-h-[400px]">
        {activeTab === 'templates' && (
          <TemplatesList onClose={onClose} />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationsList 
            notifications={notifications}
            isLoading={notificationsLoading}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onAction={handleNotificationAction}
          />
        )}
        
        {activeTab === 'actions' && (
          <QuickActionsList onClose={onClose} />
        )}
      </div>
    </Modal>
  );
};

export default MainModal;