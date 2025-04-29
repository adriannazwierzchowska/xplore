import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SoundProvider } from './SoundContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SoundProvider>
      <App />
    </SoundProvider>
  </React.StrictMode>
);

reportWebVitals();