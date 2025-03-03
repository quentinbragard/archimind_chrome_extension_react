import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './components/Popup';
import { ToastProvider } from '@/components/common/ToastProvider';
import '@/styles/globals.css';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <ToastProvider>
        <Popup />
      </ToastProvider>
    </React.StrictMode>
  );
}