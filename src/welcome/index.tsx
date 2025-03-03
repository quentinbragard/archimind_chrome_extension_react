import React from 'react';
import { createRoot } from 'react-dom/client';
import WelcomePage from './components/WelcomePage';
import { ToastProvider } from '@/components/common/ToastProvider';
import '@/styles/globals.css';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <ToastProvider>
        <WelcomePage />
      </ToastProvider>
    </React.StrictMode>
  );
}