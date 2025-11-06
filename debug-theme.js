// debug-theme.js - Script temporário para debugar o sistema de temas
(function() {
    console.log('=== DEBUG THEME SYSTEM ===');

    // Verificar se o themeManager existe
    console.log('themeManager exists:', typeof window.themeManager);
    console.log('themeManager methods:', window.themeManager ? Object.keys(window.themeManager) : 'N/A');

    // Verificar tema atual
    const currentTheme = document.documentElement.getAttribute('data-theme');
    console.log('Current theme attribute:', currentTheme);

    // Verificar se os botões existem
    const welcomeThemeToggle = document.getElementById('welcome-theme-toggle');
    const themeToggle = document.getElementById('theme-toggle');

    console.log('welcome-theme-toggle exists:', !!welcomeThemeToggle);
    console.log('theme-toggle exists:', !!themeToggle);

    if (welcomeThemeToggle) {
        console.log('welcome-theme-toggle has click listeners:', welcomeThemeToggle.onclick || 'none');
        console.log('welcome-theme-toggle innerHTML:', welcomeThemeToggle.innerHTML);
    }

    // Verificar localStorage
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme in localStorage:', savedTheme);

    // Testar mudança manual de tema
    setTimeout(() => {
        console.log('Testing manual theme toggle...');
        if (window.themeManager && window.themeManager.toggleTheme) {
            const newTheme = window.themeManager.toggleTheme();
            console.log('Theme toggled to:', newTheme);
            console.log('New theme attribute:', document.documentElement.getAttribute('data-theme'));
        } else {
            console.log('themeManager.toggleTheme not available');
        }
    }, 2000);

    console.log('=== END DEBUG ===');
})();