// Lightweight dev helper. Safe to include in production.
(function () {
  try {
    const isLocalhost = /localhost|127\.0\.0\.1|\.local/i.test(location.host);
    console.log(`[debug.js] Loaded. env=${isLocalhost ? 'local' : 'prod'} path=${location.pathname}`);

    // Optional: expose a tiny debug utility
    window.JWDebug = {
      log: (...args) => console.log('[JWDebug]', ...args),
      clearStorage: () => {
        localStorage.removeItem('jwquiz_progress');
        localStorage.removeItem('quiz_analytics');
        console.log('[JWDebug] Local storage cleared for jwquiz_progress and quiz_analytics');
      },
    };
  } catch (e) {
    // Never block the app
  }
})();
