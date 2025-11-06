// themeManager.js - Gerenciador de tema compartilhado entre todas as páginas
(function() {
    'use strict';

    // Configurações do tema
    const THEME_KEY = 'theme';
    const DEFAULT_THEME = 'light';

    // Função para obter o tema atual do localStorage
    function getSavedTheme() {
        try {
            return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        } catch (e) {
            console.warn('Erro ao acessar localStorage:', e);
            return DEFAULT_THEME;
        }
    }

    // Função para salvar o tema no localStorage
    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            console.warn('Erro ao salvar tema no localStorage:', e);
        }
    }

    // Função para aplicar o tema ao documento
    function applyTheme(theme) {
        const root = document.documentElement;
        const body = document.body;

        // Aplicar no documentElement E no body para compatibilidade
        root.setAttribute('data-theme', theme);
        body.setAttribute('data-theme', theme);

        // Atualizar botões de tema se existirem
        updateThemeButtons(theme);

        // Disparar evento customizado para outras partes da aplicação
        const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(themeChangeEvent);
    }

    // Função para atualizar os botões de tema (se existirem na página)
    function updateThemeButtons(theme) {
        // Botão de tema na tela de boas-vindas
        const welcomeThemeToggle = document.getElementById('welcome-theme-toggle');
        if (welcomeThemeToggle) {
            const themeIcon = welcomeThemeToggle.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
            welcomeThemeToggle.setAttribute('aria-label', `Alternar para ${theme === 'dark' ? 'modo claro' : 'modo escuro'}`);
        }

        // Botão de tema na tela principal (se existir)
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️ modo claro' : '🌙 modo escuro';
            themeToggle.setAttribute('aria-label', `Alternar para ${theme === 'dark' ? 'modo claro' : 'modo escuro'}`);
        }
    }

    // Função para alternar o tema
    function toggleTheme() {
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
        saveTheme(newTheme);

        // Analytics (se disponível)
        if (window.analytics && typeof window.analytics.track === 'function') {
            window.analytics.track('theme_changed', { theme: newTheme });
        }

        return newTheme;
    }

    // Função para definir um tema específico
    function setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.warn('Tema inválido:', theme);
            return;
        }

        applyTheme(theme);
        saveTheme(theme);

        // Analytics (se disponível)
        if (window.analytics && typeof window.analytics.track === 'function') {
            window.analytics.track('theme_changed', { theme: theme });
        }

        return theme;
    }

    // Inicializar o tema quando o DOM estiver pronto
    function initTheme() {
        // Aguardar o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTheme);
            return;
        }

        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);

        // Configurar event listeners para botões de tema
        setupThemeListeners();

        // Observar mudanças de view para reaplicar tema se necessário
        setupViewObserver();

        // Log para debug
        console.log('ThemeManager inicializado. Tema atual:', getSavedTheme());
    }

    // Configurar observer para mudanças de view
    function setupViewObserver() {
        // Usar MutationObserver para detectar quando uma view fica ativa
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    // Verificar se uma view ficou ativa
                    if (target.classList.contains('view') && target.classList.contains('active')) {
                        // Reaplicar tema para garantir consistência
                        const currentTheme = getSavedTheme();
                        applyTheme(currentTheme);
                    }
                }
            });
        });

        // Observar mudanças de classe em todas as views
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            observer.observe(view, {
                attributes: true,
                attributeFilter: ['class']
            });
        });

        // Também observar mudanças no atributo data-theme do documentElement
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    // Configurar event listeners para botões de tema
    function setupThemeListeners() {
        // Usar setTimeout para garantir que os elementos existem
        setTimeout(() => {
            // Botão de tema na tela de boas-vindas
            const welcomeThemeToggle = document.getElementById('welcome-theme-toggle');
            if (welcomeThemeToggle) {
                welcomeThemeToggle.addEventListener('click', toggleTheme);
                console.log('Event listener adicionado ao welcome-theme-toggle');
            }

            // Botão de tema na tela principal (se existir)
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', toggleTheme);
                console.log('Event listener adicionado ao theme-toggle');
            }
        }, 100);
    }

    // Expor funções globalmente
    window.themeManager = {
        getCurrentTheme: getSavedTheme,
        setTheme: setTheme,
        toggleTheme: toggleTheme,
        applyTheme: applyTheme
    };

    // Alias para compatibilidade com código existente
    window.updateThemeButton = updateThemeButtons;

    // Inicializar automaticamente
    initTheme();

    // Log para debug
    console.log('ThemeManager inicializado. Tema atual:', getSavedTheme());

})();