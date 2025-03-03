import React from 'react';
import { createRoot } from 'react-dom/client';
import ContentApp from './components/ContentApp';
import { ToastProvider } from '@/components/common/ToastProvider';
import '@/styles/globals.css';
import './content.css';

// Initialize the content script
function initialize() {
  console.log('🚀 Archimind Extension content script initializing...');
  
  // Create a container for our React app
  const container = document.createElement('div');
  container.id = 'archimind-extension-container';
  document.body.appendChild(container);
  
  // Mount React app
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ToastProvider>
        <ContentApp />
      </ToastProvider>
    </React.StrictMode>
  );
  
  console.log('✅ Archimind Extension content script initialized successfully');
}

// Handle any clean-up when the extension is unloaded
function cleanup() {
  console.log('🧹 Archimind Extension content script cleaning up...');
  
  // Remove container
  const container = document.getElementById('archimind-extension-container');
  if (container) {
    container.remove();
  }
}

// Set up lifecycle handlers
function setupLifecycleHandlers() {
  // Handle page unload
  window.addEventListener('beforeunload', cleanup);
  
  // Handle visibility change (tab switch, minimize)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      console.log('⏸️ Page hidden, pausing non-essential operations');
      // Could pause polling or other resource-intensive operations here
    } else if (document.visibilityState === 'visible') {
      console.log('▶️ Page visible again, resuming operations');
      // Resume operations if needed
    }
  });
}

// Run the initializer
console.log('====================🚀 Archimind Extension content script initializing...');
initialize();
setupLifecycleHandlers();