import React from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';

const OptionsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Archimind Extension Options</h1>
      <p className="mb-4">Configure your Archimind extension settings here.</p>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Coming Soon</h2>
        <p>Options settings will be available in a future update.</p>
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <OptionsPage />
    </React.StrictMode>
  );
}