import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useApi';
import { useToast } from '@/components/common/ToastProvider';
import Button from '@/components/common/Button';
import LoginForm from './LoginForm';
import TemplatesList from './TemplatesList';

const Popup: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const { data: stats, isLoading: statsLoading, execute: fetchStats } = useUserStats();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'templates' | 'stats'>('templates');

  // Fetch stats when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats().catch((error) => {
        showToast({
          title: 'Error',
          message: `Failed to load stats: ${error.message}`,
          type: 'error'
        });
      });
    }
  }, [isAuthenticated, fetchStats, showToast]);

  if (authLoading) {
    return (
      <div className="w-80 p-4 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <svg className="inline w-8 h-8 mr-2 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="w-80 p-0 min-h-[400px] max-h-[600px] flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-medium">Archimind</h1>
            <p className="text-sm opacity-90">{user?.email}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="text-white hover:bg-white/20"
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
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
            activeTab === 'stats'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-primary'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'templates' ? (
          <TemplatesList />
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Your Stats</h2>
            {statsLoading ? (
              <div className="text-center py-4">
                <svg className="inline w-6 h-6 mr-2 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-3 rounded-lg text-center">
                  <div className="text-2xl font-semibold text-primary">
                    {stats?.total_prompts || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Prompts</div>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg text-center">
                  <div className="text-2xl font-semibold text-primary">
                    {stats?.average_score?.toFixed(1) || '-'}<span className="text-sm font-normal">/20</span>
                  </div>
                  <div className="text-sm text-gray-600">Avg. Score</div>
                </div>
                <div className="col-span-2 bg-primary/5 p-3 rounded-lg text-center">
                  <div className="text-2xl font-semibold text-primary">
                    {stats?.energy_usage?.toFixed(2) || '-'}<span className="text-sm font-normal"> kWh</span>
                  </div>
                  <div className="text-sm text-gray-600">Energy Usage</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-3 bg-gray-50 text-center text-xs text-gray-500 border-t">
        Archimind Chrome Extension v1.0.0
      </footer>
    </div>
  );
};

export default Popup;