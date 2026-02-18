import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { LoadingProvider } from '@/contexts/LoadingContext';

// Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadingProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LoadingProvider>
  </React.StrictMode>,
);
