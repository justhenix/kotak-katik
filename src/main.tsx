import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/fredoka/latin-500.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import { App } from './app/App';
import './styles/index.css';
import './styles/title.css';
import './styles/gameplay.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
