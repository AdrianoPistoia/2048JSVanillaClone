if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js').then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function(error) {
      console.error('Service Worker registration failed:', error);
    });
  }