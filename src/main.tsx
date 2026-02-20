import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { SessionProvider } from './context/SessionContext';
import { UserProvider } from './context/UserContext';
import { BrowserRouter } from 'react-router-dom';

// Global flag to track extension status
declare global {
  interface Window {
    __FOCUSFLOW_EXTENSION_READY__: boolean;
    __FOCUSFLOW_EXTENSION_ID__?: string;
  }
}

// Set up global extension detection listener BEFORE React renders
console.log('[FocusFlow App] Setting up global extension listener');
window.__FOCUSFLOW_EXTENSION_READY__ = false;

const handleExtensionMessage = (event: MessageEvent) => {
  if (event.data?.type === 'FOCUSFLOW_EXTENSION_READY') {
    console.log('[FocusFlow App] Extension detected!');
    window.__FOCUSFLOW_EXTENSION_READY__ = true;
    window.__FOCUSFLOW_EXTENSION_ID__ = event.data.extensionId;
  }
};

// Add listener immediately before React renders
window.addEventListener('message', handleExtensionMessage, true);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SessionProvider>
      <UserProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
        </BrowserRouter>
      </UserProvider>
    </SessionProvider>
  </React.StrictMode>,
);