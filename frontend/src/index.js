import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import 'aos/dist/aos.css';
import AOS from 'aos';

// Initialiser AOS avec des durées plus courtes
AOS.init({
  duration: 400,        // Réduit de 800ms à 400ms
  once: true,
  offset: 80,           // Réduit de 100 à 80
  easing: 'ease-out'    // Changement pour une animation plus rapide
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);