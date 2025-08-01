// Service Worker Registration for Alinma Banking App

// Function to unregister existing service workers (for development)
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
        console.log('Service Worker unregistered');
      }
    });
  }
}

// Check if service workers are supported
export function registerServiceWorker() {
  // Only register service worker in production to avoid interfering with development
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/serviceWorker.js')
        .then(registration => {
          console.log('Alinma Banking App SW registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available, notify user
                  console.log('New version available! Please refresh.');
                }
              });
            }
          });
        })
        .catch(error => {
          console.log('Alinma Banking App SW registration failed:', error);
        });
    });
  } else if (!import.meta.env.PROD) {
    console.log('Service Worker disabled in development mode');
    // Unregister any existing service workers in development
    unregisterServiceWorker();
  }
}

// Check if app can be installed
export function checkInstallPrompt() {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Update UI to notify the user they can add to home screen
    console.log('App can be installed');
    
    // Optionally show install button
    showInstallButton(deferredPrompt);
  });

  window.addEventListener('appinstalled', (evt) => {
    console.log('Alinma Banking App was installed');
  });
}

function showInstallButton(deferredPrompt) {
  // You can create an install button here
  // For now, we'll just log that it's available
  console.log('Install prompt available');
}
