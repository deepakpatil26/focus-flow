import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { SessionProvider } from './context/SessionContext';
import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SessionProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </SessionProvider>
  </React.StrictMode>,
);
