// Development utilities to help with caching issues

export function clearBrowserCache() {
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
        console.log('Cache deleted:', name);
      }
    });
  }
}

export function forceReload() {
  // Clear cache and reload
  clearBrowserCache();
  window.location.reload(true);
}

// Add to window for easy access in development
if (import.meta.env.DEV) {
  window.clearCache = clearBrowserCache;
  window.forceReload = forceReload;
  console.log('Development mode: Use clearCache() or forceReload() in console if needed');
}
