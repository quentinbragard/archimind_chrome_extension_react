import React from 'react';
import { StatsPanelProps, StatItemProps } from '@/types/ui';

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, tooltip, unit }) => {
  return (
    <div 
      className="relative flex items-center justify-center h-10 mx-1 px-3 bg-primary bg-opacity-5 rounded-full transition-colors hover:bg-primary hover:bg-opacity-10" 
      data-tooltip={tooltip}
    >
      <span className="text-primary mr-1">{icon}</span>
      <span className="font-medium">{value}</span>
      {unit && <span className="text-xs opacity-70 ml-1">{unit}</span>}
    </div>
  );
};

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, isLoading = false }) => {
  return (
    <div
      id="archimind-stats-panel"
      className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-white border border-primary border-opacity-15 rounded-full text-sm w-80 h-10 shadow-md transition-all duration-300 z-50 overflow-hidden"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-800-secondary">Loading stats...</span>
        </div>
      ) : (
        <div id="archimind-stats-summary" className="flex justify-between items-center h-full px-2">
          <StatItem
            icon={<span>💬</span>}
            value={stats.total_prompts || 0}
            label="Prompts"
            tooltip="Total number of prompts used in this session"
          />
          
          <StatItem
            icon={<span>⭐</span>}
            value={stats.average_score || '-'}
            label="Score"
            tooltip="Average quality score of your conversations"
            unit="/20"
          />
          
          <StatItem
            icon={<span>⚡</span>}
            value={stats.energy_usage || '-'}
            label="Energy"
            tooltip="Energy efficiency of your AI usage"
            unit="kWh"
          />
        </div>
      )}
    </div>
  );
};

export default StatsPanel;