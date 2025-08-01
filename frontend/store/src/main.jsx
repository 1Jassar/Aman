import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker, checkInstallPrompt } from './registerServiceWorker'
import './devUtils.js' // Import development utilities

// Register service worker for PWA support (only in production)
registerServiceWorker();

// Check for install prompt
checkInstallPrompt();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)