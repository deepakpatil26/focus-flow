import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { SessionProvider } from './context/SessionContext';
import { UserProvider } from './context/UserContext';
import { BrowserRouter } from 'react-router-dom';

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