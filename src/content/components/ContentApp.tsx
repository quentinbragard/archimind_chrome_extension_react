import React, { useState, useEffect } from 'react';
import MainButton from '@/components/features/MainButton';
import StatsPanel from '@/components/features/StatsPanel';
import MainModal from './MainModal';
import PromptEnhancer from './PromptEnhancer';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats, useUnreadNotifications } from '@/hooks/useApi';
import { useToast } from '@/components/common/ToastProvider';
import useUrlChangeListener from '../hooks/useUrlChangeListener';
import useChatObserver from '../hooks/useChatObserver';

const ContentApp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading, execute: fetchStats } = useUserStats();
  const { 
    data: notifications, 
    isLoading: notificationsLoading, 
    execute: fetchNotifications 
  } = useUnreadNotifications();
  const { showToast } = useToast();
  
  // Listen for URL changes to detect chat ID changes
  const { currentChatId } = useUrlChangeListener();
  
  // Observe chat for new messages
  const { lastProcessedTurn } = useChatObserver(currentChatId);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch stats and notifications
      fetchStats().catch(error => {
        console.error('Failed to fetch stats:', error);
      });
      
      fetchNotifications().catch(error => {
        console.error('Failed to fetch notifications:', error);
      });
      
      // Set up interval to refresh data
      const intervalId = setInterval(() => {
        fetchStats().catch(error => {
          console.error('Failed to fetch stats:', error);
        });
        
        fetchNotifications().catch(error => {
          console.error('Failed to fetch notifications:', error);
        });
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, fetchStats, fetchNotifications]);

  // Do not render if not authenticated yet or still loading
  if (authLoading) {
    return null;
  }

  // Do not render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Main Button */}
      <MainButton 
        notification={notifications?.length > 0 ? String(notifications.length) : null}
        pulse={notifications?.some(n => !n.read_at) || false}
        important={notifications?.length > 5 || false}
        onClick={() => setIsModalOpen(true)}
      />
      
      {/* Stats Panel */}
      <StatsPanel 
        stats={stats || { total_prompts: 0, average_score: 0, energy_usage: 0 }} 
        isLoading={statsLoading}
      />
      
      {/* Main Modal */}
      <MainModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notifications={notifications || []}
        notificationsLoading={notificationsLoading}
        stats={stats}
        statsLoading={statsLoading}
      />
      
      {/* Prompt Enhancer */}
      <PromptEnhancer />
    </>
  );
};

export default ContentApp;