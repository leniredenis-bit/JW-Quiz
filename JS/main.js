// Aguardar DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing app...');

    // Views and containers
    console.log('main.js loaded');
    const views = document.querySelectorAll('.view');
    const homeView = document.getElementById('home-view');
    const tagsContainer = document.getElementById('tags-container');
    const difficultyContainer = document.getElementById('difficulty-container');

    // Shared data
    window.allQuestions = []; // ficará disponível globalmente para quiz.js

    // showView exposto globalmente para outras partes usarem
    function showView(viewId) {
        views.forEach(view => view.classList.remove('active'));
        const el = document.getElementById(viewId);
        if (el) {
            el.classList.add('active');
        }
        // small scroll to top for mobile UX
        window.scrollTo(0, 0);

        // Se estamos indo para home-view e já temos perguntas carregadas, repopular filtros
        if (viewId === 'home-view' && window.allQuestions && window.allQuestions.length > 0) {
            console.log('Going to home-view, repopulating filters...');
            populateFilters();
        }
    }
    window.showView = showView;

    // Função global para atualizar o botão de tema
    function updateThemeButton(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        const welcomeThemeToggle = document.getElementById('welcome-theme-toggle');

        // LÓGICA CORRETA: Se está em DARK, mostrar SOL (para ir para LIGHT)
        //                 Se está em LIGHT, mostrar LUA (para ir para DARK)
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️ modo claro' : '🌙 modo escuro';
            themeToggle.setAttribute('aria-label', `Alternar para ${theme === 'dark' ? 'modo claro' : 'modo escuro'}`);
        }

        if (welcomeThemeToggle) {
            const themeIcon = welcomeThemeToggle.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
            welcomeThemeToggle.setAttribute('aria-label', `Alternar para ${theme === 'dark' ? 'modo claro' : 'modo escuro'}`);
        }
    }
    window.updateThemeButton = updateThemeButton;

    // Carrega perguntas do JSON
    async function loadQuestions() {
        // Mostrar loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }

        try {
            console.log('Tentando carregar perguntas do JSON...');
            const res = await fetch('DATA/perguntas.json');
            console.log('Resposta do fetch:', res.status, res.statusText);
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }
            const data = await res.json();
            console.log('Perguntas carregadas com sucesso:', data.length);
            console.log('Primeira pergunta:', data[0]);
            window.allQuestions = data;
            console.log('window.allQuestions definido:', window.allQuestions.length);
            console.log('Chamando populateFilters...');
            populateFilters();
            console.log('Filtros populados, botões devem funcionar agora');
        } catch (err) {
            console.error('Erro ao carregar perguntas:', err);
            alert('Erro ao carregar perguntas: ' + err.message);
            // Mostrar botões desabilitados ou mensagem de erro
            const btnQuick = document.getElementById('start-quick-quiz-btn');
            const btnStudy = document.getElementById('start-study-mode-btn');
            const btnMemory = document.getElementById('start-memory-game-btn');
            if (btnQuick) btnQuick.disabled = true;
            if (btnStudy) btnStudy.disabled = true;
            if (btnMemory) btnMemory.disabled = true;
        } finally {
            // Esconder loading overlay
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }
    }

    // Popula filtros
    function populateFilters() {
        if (!tagsContainer || !difficultyContainer) {
            console.error('Containers not found!');
            return;
        }

        // Extrair tags únicas
        const tags = new Set();
        window.allQuestions.forEach(q => (q.tags || []).forEach(t => tags.add(t)));

        const sortedTags = Array.from(tags).sort();

        // Seleção reduzida solicitada: Bíblia, Crianças, Milagres (+ expandir)
        const norm = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        const desired = ['biblia', 'criancas', 'milagres'];

        // map real labels preserving original casing from dataset
        const byNorm = new Map(sortedTags.map(t => [norm(t), t]));
        const picked = [];
        desired.forEach(key => {
            if (byNorm.has(key)) picked.push(byNorm.get(key));
        });
        // fallback: se faltar alguma, completa com primeiras disponíveis
        if (picked.length < 3) {
            for (const t of sortedTags) {
                if (!picked.includes(t)) picked.push(t);
                if (picked.length >= 3) break;
            }
        }

        const hasMore = sortedTags.length > picked.length;

        tagsContainer.innerHTML = '';
        picked.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = 'tag-btn';
            btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            btn.onclick = () => {
                window.startQuiz({ type: 'tag', value: tag });
            };
            tagsContainer.appendChild(btn);
        });

        if (hasMore) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'tag-btn show-more-btn';
            showMoreBtn.textContent = 'Mostrar Todas';
            showMoreBtn.onclick = () => {
                tagsContainer.innerHTML = '';
                sortedTags.forEach(tag => {
                    const btn = document.createElement('button');
                    btn.className = 'tag-btn';
                    btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
                    btn.onclick = () => window.startQuiz({ type: 'tag', value: tag });
                    tagsContainer.appendChild(btn);
                });
                const showLessBtn = document.createElement('button');
                showLessBtn.className = 'tag-btn show-more-btn';
                showLessBtn.textContent = 'Mostrar Menos';
                showLessBtn.onclick = () => populateFilters();
                tagsContainer.appendChild(showLessBtn);
            };
            tagsContainer.appendChild(showMoreBtn);
        }

        // Extrair dificuldades únicas
        const difficulties = [...new Set(window.allQuestions.map(q => q.dificuldade || 1))].sort((a,b)=>a-b);
        difficultyContainer.innerHTML = '';
        difficulties.forEach(d => {
            const btn = document.createElement('button');
            btn.className = 'difficulty-btn';
            if (d === 1) btn.classList.add('difficulty-easy');
            else if (d === 2) btn.classList.add('difficulty-medium');
            else if (d === 3) btn.classList.add('difficulty-hard');
            // Usar emoji de estrela dourada (⭐)
            let stars = '';
            if (d === 1) stars = '⭐';
            else if (d === 2) stars = '⭐⭐';
            else if (d === 3) stars = '⭐⭐⭐';
            btn.innerHTML = stars;
            btn.onclick = () => {
                window.startQuiz({ type: 'difficulty', value: d });
            };
            difficultyContainer.appendChild(btn);
        });
    }

    // Botões principais
    console.log('Adding event listeners');
    document.getElementById('start-quick-quiz-btn').addEventListener('click', () => {
        console.log('Quick quiz button clicked');
        window.startQuiz({ type: 'random', value: 10 });
    });
    document.getElementById('start-study-mode-btn').addEventListener('click', () => {
        console.log('Study mode button clicked');
        window.startQuiz({ type: 'study', value: 10 });
    });
    document.getElementById('start-multiplayer-btn').addEventListener('click', () => {
        console.log('Multiplayer button clicked');
        window.showView('multiplayer-view');
        showMultiplayerMenu();
    });
    document.getElementById('manage-content-btn').addEventListener('click', () => {
        showAdminView();
    });
    document.getElementById('show-stats-btn').addEventListener('click', () => {
        console.log('Stats button clicked');
        showStatsView();
    });
    const legalBtn = document.getElementById('legal-btn');
    if (legalBtn) {
        legalBtn.addEventListener('click', () => {
            console.log('Legal button clicked');
            showView('legal-view');
        });
    }

    // Analytics avançado para análise de usuários
    window.analytics = {
        data: JSON.parse(localStorage.getItem('quiz_analytics') || '{}'),
        userId: localStorage.getItem('user_id') || generateUserId(),
        sessionId: generateSessionId(),
        sessionStart: Date.now(),

        track: function(event, data = {}) {
            const now = new Date();
            const dateKey = now.toISOString().split('T')[0];

            if (!this.data[dateKey]) {
                this.data[dateKey] = { events: {} };
            }

            if (!this.data[dateKey].events[event]) {
                this.data[dateKey].events[event] = [];
            }

            const eventData = {
                timestamp: now.getTime(),
                userId: this.userId,
                sessionId: this.sessionId,
                userAgent: navigator.userAgent,
                screenSize: `${window.screen.width}x${window.screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                ...data
            };

            this.data[dateKey].events[event].push(eventData);

            // Limitar a 2000 eventos por dia para não crescer demais
            if (this.data[dateKey].events[event].length > 2000) {
                this.data[dateKey].events[event] = this.data[dateKey].events[event].slice(-1000);
            }

            this.save();
        },

        save: function() {
            try {
                localStorage.setItem('quiz_analytics', JSON.stringify(this.data));
                localStorage.setItem('user_id', this.userId);
            } catch (e) {
                console.warn('Erro salvando analytics:', e);
            }
        },

        getStats: function() {
            const stats = {
                totalSessions: 0,
                totalUsers: new Set(),
                totalQuizzes: 0,
                totalQuestions: 0,
                avgSessionTime: 0,
                popularTags: {},
                popularDifficulties: {},
                deviceStats: {},
                hourlyUsage: new Array(24).fill(0),
                dailyUsage: {},
                completionRate: 0,
                themeUsage: { light: 0, dark: 0 }
            };

            let totalSessionTime = 0;
            let completedQuizzes = 0;

            Object.values(this.data).forEach(day => {
                Object.entries(day.events).forEach(([event, occurrences]) => {
                    occurrences.forEach(occ => {
                        stats.totalUsers.add(occ.userId);

                        if (event === 'session_start') {
                            stats.totalSessions++;
                        }
                        if (event === 'quiz_start') {
                            stats.totalQuizzes++;
                        }
                        if (event === 'question_answered') {
                            stats.totalQuestions++;
                        }
                        if (event === 'quiz_completed') {
                            completedQuizzes++;
                        }
                        if (event === 'session_end') {
                            totalSessionTime += occ.duration || 0;
                        }

                        // Estatísticas por dispositivo
                        if (occ.userAgent) {
                            const device = getDeviceType(occ.userAgent);
                            stats.deviceStats[device] = (stats.deviceStats[device] || 0) + 1;
                        }

                        // Uso por hora
                        const hour = new Date(occ.timestamp).getHours();
                        stats.hourlyUsage[hour]++;

                        // Uso por dia
                        const date = new Date(occ.timestamp).toISOString().split('T')[0];
                        stats.dailyUsage[date] = (stats.dailyUsage[date] || 0) + 1;

                        // Tags e dificuldades
                        if (event === 'tag_selected') {
                            stats.popularTags[occ.tag] = (stats.popularTags[occ.tag] || 0) + 1;
                        }
                        if (event === 'difficulty_selected') {
                            stats.popularDifficulties[occ.difficulty] = (stats.popularDifficulties[occ.difficulty] || 0) + 1;
                        }

                        // Tema usado
                        if (event === 'theme_changed') {
                            stats.themeUsage[occ.theme] = (stats.themeUsage[occ.theme] || 0) + 1;
                        }
                    });
                });
            });

            stats.totalUsers = stats.totalUsers.size;
            stats.avgSessionTime = stats.totalSessions > 0 ? Math.round(totalSessionTime / stats.totalSessions) : 0;
            stats.completionRate = stats.totalQuizzes > 0 ? Math.round((completedQuizzes / stats.totalQuizzes) * 100) : 0;

            return stats;
        },

        exportData: function() {
            return {
                exportDate: new Date().toISOString(),
                userId: this.userId,
                totalDays: Object.keys(this.data).length,
                data: this.data
            };
        }
    };

    function generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    function generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    function getDeviceType(userAgent) {
        if (/Android/i.test(userAgent)) return 'Android';
        if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
        if (/Windows/i.test(userAgent)) return 'Windows';
        if (/Mac/i.test(userAgent)) return 'macOS';
        if (/Linux/i.test(userAgent)) return 'Linux';
        return 'Other';
    }

    // Rastrear início de sessão
    window.analytics.track('session_start');

    // Rastrear fim de sessão quando a página é fechada
    window.addEventListener('beforeunload', () => {
        const sessionDuration = Math.round((Date.now() - window.analytics.sessionStart) / 1000);
        window.analytics.track('session_end', { duration: sessionDuration });
    });

    // Wrapper para rastrear
    window.startQuiz = function(filter) {
        console.log('Wrapped startQuiz called with:', filter);
        console.log('window.originalStartQuiz exists:', typeof window.originalStartQuiz);
        console.log('window.allQuestions length:', window.allQuestions ? window.allQuestions.length : 'undefined');

        if (filter.type === 'tag') {
            window.analytics.track('tag_selected', { tag: filter.value });
        }
        if (filter.type === 'difficulty') {
            window.analytics.track('difficulty_selected', { difficulty: filter.value });
        }
        window.analytics.track('quiz_start', {
            filter,
            totalQuestions: window.allQuestions?.length || 0,
            currentTheme: document.documentElement.getAttribute('data-theme') || 'light'
        });

        // Chama o original
        if (window.originalStartQuiz) {
            console.log('Calling originalStartQuiz...');
            window.originalStartQuiz(filter);
        } else {
            console.error('originalStartQuiz not found - quiz.js may not have loaded yet');
            // Tentar novamente em alguns milissegundos
            setTimeout(() => {
                if (window.originalStartQuiz) {
                    console.log('Retrying originalStartQuiz call...');
                    window.originalStartQuiz(filter);
                } else {
                    console.error('originalStartQuiz still not found after retry');
                }
            }, 100);
        }
    };

    // Acessibilidade: Navegação por teclado
    document.addEventListener('keydown', function(e) {
        // ESC para voltar ao menu principal
        if (e.key === 'Escape') {
            const currentView = document.querySelector('.view.active');
            if (currentView && currentView.id !== 'home-view') {
                showView('home-view');
                e.preventDefault();
            }
        }

        // Navegação por Tab nos botões de opção durante o quiz
        if (document.getElementById('quiz-view').classList.contains('active')) {
            const options = document.querySelectorAll('#options-container .option-btn');
            const focusedElement = document.activeElement;

            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const currentIndex = Array.from(options).indexOf(focusedElement);
                const nextIndex = (currentIndex + 1) % options.length;
                options[nextIndex].focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const currentIndex = Array.from(options).indexOf(focusedElement);
                const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                options[prevIndex].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                if (focusedElement && focusedElement.classList.contains('option-btn')) {
                    e.preventDefault();
                    focusedElement.click();
                }
            }
        }
    });

    // Focar primeiro elemento interativo quando uma view muda
    function focusFirstInteractive(viewId) {
        const view = document.getElementById(viewId);
        if (!view) return;

        // Pequeno delay para garantir que a view está visível
        setTimeout(() => {
            const focusableElements = view.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }, 100);
    }

    // Modificar showView para incluir foco
    const originalShowView = window.showView;
    window.showView = function(viewId) {
        originalShowView(viewId);
        focusFirstInteractive(viewId);
    };

    // Inicialização
    loadQuestions();

    // Sistema de Tema Escuro/Claro
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light'; // Tema claro como padrão

        // Aplicar tema salvo
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButton(savedTheme);

        // Event listener para alternar tema (opcional, botão pode não existir)
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeButton(newTheme);

                // Analytics
                window.analytics.track('theme_changed', { theme: newTheme });
            });
        }
    }

    // Inicializar tema
    initTheme();

    // Sistema de Estatísticas Pessoais
    function showStatsView() {
        showView('stats-view');
        loadAndDisplayStats();
    }

    function loadAndDisplayStats() {
        const stats = calculateStats();

        // Estatísticas gerais
        document.getElementById('total-games').textContent = stats.totalGames;
        document.getElementById('total-questions').textContent = stats.totalQuestions;
        document.getElementById('accuracy-rate').textContent = stats.accuracyRate + '%';
        document.getElementById('best-streak').textContent = stats.bestStreak;

        // Estatísticas de tempo
        document.getElementById('avg-time').textContent = stats.avgTimePerQuestion + 's';
        document.getElementById('total-time').textContent = formatTime(stats.totalTimeSpent);
        document.getElementById('fastest-answer').textContent = stats.fastestAnswer + 's';
        document.getElementById('study-sessions').textContent = stats.studySessions;

        // Estatísticas por categoria
        displayCategoryStats(stats.categoryStats);

        // Estatísticas por dificuldade
        document.getElementById('easy-progress').style.width = stats.difficultyStats.easy.percentage + '%';
        document.getElementById('medium-progress').style.width = stats.difficultyStats.medium.percentage + '%';
        document.getElementById('hard-progress').style.width = stats.difficultyStats.hard.percentage + '%';
        document.getElementById('easy-rate').textContent = stats.difficultyStats.easy.accuracy + '%';
        document.getElementById('medium-rate').textContent = stats.difficultyStats.medium.accuracy + '%';
        document.getElementById('hard-rate').textContent = stats.difficultyStats.hard.accuracy + '%';
    }

    function calculateStats() {
        const data = window.analytics.data;
        let stats = {
            totalGames: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            totalTimeSpent: 0,
            bestStreak: 0,
            fastestAnswer: Infinity,
            studySessions: 0,
            categoryStats: {},
            difficultyStats: {
                easy: { correct: 0, total: 0, accuracy: 0, percentage: 0 },
                medium: { correct: 0, total: 0, accuracy: 0, percentage: 0 },
                hard: { correct: 0, total: 0, accuracy: 0, percentage: 0 }
            }
        };

        // Processar dados de analytics
        Object.values(data).forEach(day => {
            Object.entries(day.events).forEach(([event, occurrences]) => {
                if (event === 'quiz_start') {
                    stats.totalGames += occurrences.length;
                    occurrences.forEach(occ => {
                        if (occ.filter?.type === 'study') {
                            stats.studySessions++;
                        }
                    });
                }
                if (event === 'question_answered') {
                    occurrences.forEach(occ => {
                        stats.totalQuestions++;
                        if (occ.correct) stats.totalCorrect++;
                        if (occ.timeSpent && occ.timeSpent < stats.fastestAnswer) {
                            stats.fastestAnswer = occ.timeSpent;
                        }
                        stats.totalTimeSpent += occ.timeSpent || 0;

                        // Estatísticas por categoria
                        if (occ.category) {
                            if (!stats.categoryStats[occ.category]) {
                                stats.categoryStats[occ.category] = { correct: 0, total: 0 };
                            }
                            stats.categoryStats[occ.category].total++;
                            if (occ.correct) stats.categoryStats[occ.category].correct++;
                        }

                        // Estatísticas por dificuldade
                        const diff = occ.difficulty;
                        if (diff && stats.difficultyStats[diff]) {
                            stats.difficultyStats[diff].total++;
                            if (occ.correct) stats.difficultyStats[diff].correct++;
                        }
                    });
                }
                if (event === 'streak_achieved') {
                    occurrences.forEach(occ => {
                        if (occ.streak > stats.bestStreak) {
                            stats.bestStreak = occ.streak;
                        }
                    });
                }
            });
        });

        // Calcular percentuais e médias
        stats.accuracyRate = stats.totalQuestions > 0 ?
            Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

        stats.avgTimePerQuestion = stats.totalQuestions > 0 ?
            Math.round((stats.totalTimeSpent / stats.totalQuestions) * 10) / 10 : 0;

        if (stats.fastestAnswer === Infinity) stats.fastestAnswer = 0;

        // Calcular estatísticas por dificuldade
        Object.keys(stats.difficultyStats).forEach(diff => {
            const d = stats.difficultyStats[diff];
            d.accuracy = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
            d.percentage = stats.totalQuestions > 0 ? Math.round((d.total / stats.totalQuestions) * 100) : 0;
        });

        return stats;
    }

    function displayCategoryStats(categoryStats) {
        const container = document.getElementById('category-stats');
        container.innerHTML = '';

        if (Object.keys(categoryStats).length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhuma categoria jogada ainda.</p>';
            return;
        }

        Object.entries(categoryStats)
            .sort(([,a], [,b]) => b.total - a.total)
            .forEach(([category, data]) => {
                const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                const item = document.createElement('div');
                item.className = 'category-item';
                item.innerHTML = `
                    <span class="category-name">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span class="category-stats-text">${data.correct}/${data.total} (${accuracy}%)</span>
                `;
                container.appendChild(item);
            });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        if (minutes > 0) {
            return `${minutes}min ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }

    // Event listeners para a página de estatísticas
    document.addEventListener('click', (e) => {
        if (e.target.id === 'back-from-stats') {
            showView('welcome-view');
        }
        if (e.target.id === 'reset-stats') {
            if (confirm('Tem certeza que deseja resetar todas as estatísticas? Esta ação não pode ser desfeita.')) {
                resetStats();
            }
        }
        if (e.target.id === 'export-stats') {
            exportStats();
        }
        if (e.target.id === 'back-from-legal') {
            showView('welcome-view');
        }
    });

    function resetStats() {
        // Resetar dados de progresso do quiz
        localStorage.removeItem('jwquiz_progress');

        // Resetar analytics
        localStorage.removeItem('quiz_analytics');

        // Resetar preferências
        localStorage.removeItem('theme');

        // Recarregar página
        window.location.reload();
    }

    function exportStats() {
        const stats = calculateStats();
        const data = {
            exportDate: new Date().toISOString(),
            stats: stats,
            rawAnalytics: window.analytics.data
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jw-quiz-stats-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Registrar service worker para PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Erro no SW:', err));
    }

    function getRandomQuestions(count) {
        const pool = window.allQuestions || [];
        if (pool.length === 0) return [];

        // Embaralhar e selecionar
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, pool.length));
    }

    function showGroupView() {
        showView('group-view');
        showGroupMenu();
    }

    function showGroupMenu() {
        document.getElementById('group-menu').style.display = 'block';
        document.getElementById('create-group').style.display = 'none';
        document.getElementById('join-group').style.display = 'none';
        document.getElementById('group-lobby-host').style.display = 'none';
        document.getElementById('group-lobby-player').style.display = 'none';
    }

    function showCreateGroup() {
        document.getElementById('group-menu').style.display = 'none';
        document.getElementById('create-group').style.display = 'block';
        document.getElementById('group-name').focus();
    }

    function showJoinGroup() {
        document.getElementById('group-menu').style.display = 'none';
        document.getElementById('join-group').style.display = 'block';
        document.getElementById('group-code').focus();
    }

    function createGroup() {
        const groupName = document.getElementById('group-name').value.trim();
        const hostName = document.getElementById('host-name').value.trim();

        if (!groupName || !hostName) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Gerar código único para a partida
        const groupCode = generateGroupCode();

        // Criar objeto da partida
        window.currentGroup = {
            id: groupCode,
            name: groupName,
            host: hostName,
            players: [hostName],
            created: Date.now(),
            status: 'waiting'
        };

        window.isGroupHost = true;
        window.groupPlayers = [hostName];

        // Salvar no localStorage (simulando servidor)
        saveGroup(window.currentGroup);

        // Mostrar sala de espera do anfitrião
        showGroupLobbyHost();

        // Analytics
        window.analytics.track('group_created', { groupId: groupCode, groupName });
    }

    function joinGroup() {
        const groupCode = document.getElementById('group-code').value.trim().toUpperCase();
        const playerName = document.getElementById('player-name').value.trim();

        if (!groupCode || !playerName) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Verificar se a partida existe
        const group = loadGroup(groupCode);
        if (!group) {
            alert('Código da partida não encontrado. Verifique se o código está correto.');
            return;
        }

        if (group.status !== 'waiting') {
            alert('Esta partida já começou ou foi encerrada.');
            return;
        }

        if (group.players.length >= 10) {
            alert('Esta partida já está cheia (máximo 10 jogadores).');
            return;
        }

        if (group.players.includes(playerName)) {
            alert('Já existe um jogador com este nome nesta partida.');
            return;
        }

        // Adicionar jogador à partida
        group.players.push(playerName);
        saveGroup(group);

        window.currentGroup = group;
        window.isGroupHost = false;
        window.groupPlayers = group.players;

        // Mostrar sala de espera do participante
        showGroupLobbyPlayer();

        // Analytics
        window.analytics.track('group_joined', { groupId: groupCode, playerName });
    }

    function showGroupLobbyHost() {
        document.getElementById('create-group').style.display = 'none';
        document.getElementById('group-lobby-host').style.display = 'block';

        // Atualizar informações da partida
        document.getElementById('lobby-host-title').textContent = `🎯 ${window.currentGroup.name}`;
        document.getElementById('group-code-display').textContent = formatGroupCode(window.currentGroup.id);

        // Gerar link da partida
        const baseUrl = window.location.origin + window.location.pathname;
        const groupLink = `${baseUrl}?join=${window.currentGroup.id}`;
        document.getElementById('group-link-display').value = groupLink;

        // Atualizar lista de jogadores
        updatePlayersListHost();

        // Verificar se pode iniciar
        updateStartButton();
    }

    function showGroupLobbyPlayer() {
        document.getElementById('join-group').style.display = 'none';
        document.getElementById('group-lobby-player').style.display = 'block';

        document.getElementById('lobby-player-title').textContent = `🎮 ${window.currentGroup.name}`;

        // Atualizar lista de jogadores
        updatePlayersListPlayer();
    }

    function updatePlayersListHost() {
        const container = document.getElementById('players-list-host');
        container.innerHTML = '';

        window.groupPlayers.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';

            const isHost = player === window.currentGroup.host;
            const avatarLetter = player.charAt(0).toUpperCase();

            playerItem.innerHTML = `
                <div class="player-avatar">${avatarLetter}</div>
                <span class="player-name">${player}</span>
                <span class="player-status ${isHost ? 'host-badge' : ''}">${isHost ? 'Anfitrião' : 'Jogador'}</span>
            `;

            container.appendChild(playerItem);
        });
    }

    function updatePlayersListPlayer() {
        const container = document.getElementById('players-list-player');
        container.innerHTML = '';

        window.groupPlayers.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';

            const isHost = player === window.currentGroup.host;
            const avatarLetter = player.charAt(0).toUpperCase();

            playerItem.innerHTML = `
                <div class="player-avatar">${avatarLetter}</div>
                <span class="player-name">${player}</span>
                <span class="player-status ${isHost ? 'host-badge' : ''}">${isHost ? 'Anfitrião' : 'Jogador'}</span>
            `;

            container.appendChild(playerItem);
        });
    }

    function updateStartButton() {
        const startBtn = document.getElementById('start-group-game');
        const hasEnoughPlayers = window.groupPlayers.length >= 2;

        startBtn.disabled = !hasEnoughPlayers;
        startBtn.textContent = hasEnoughPlayers ? '▶️ Iniciar Partida' : 'Aguardando mais jogadores...';
    }

    function startGroupGame() {
        if (window.groupPlayers.length < 2) {
            alert('Precisa de pelo menos 2 jogadores para iniciar a partida.');
            return;
        }

        // Atualizar status da partida
        window.currentGroup.status = 'playing';
        saveGroup(window.currentGroup);

        window.groupGameStarted = true;

        // Iniciar quiz em grupo
        startGroupQuiz();

        // Analytics
        window.analytics.track('group_game_started', {
            groupId: window.currentGroup.id,
            playerCount: window.groupPlayers.length
        });
    }

    function startGroupQuiz() {
        // Usar as mesmas perguntas do quiz normal
        const questions = getRandomQuestions(10);

        // Inicializar estado do quiz em grupo
        window.groupQuizState = {
            questions: questions,
            currentQuestionIndex: 0,
            players: window.groupPlayers.map(name => ({
                name: name,
                score: 0,
                answers: [],
                timeSpent: []
            })),
            startTime: Date.now(),
            timeLimit: 30 // segundos por pergunta
        };

        // Mostrar primeira pergunta
        showGroupQuestion();
    }

    function showGroupQuestion() {
        const state = window.groupQuizState;
        const question = state.questions[state.currentQuestionIndex];

        // Mostrar pergunta (usando a tela normal do quiz)
        showView('quiz-view');

        // Configurar pergunta
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('quiz-progress').textContent = `Pergunta ${state.currentQuestionIndex + 1} de ${state.questions.length}`;

        // Configurar opções
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.onclick = () => handleGroupAnswer(btn, question, index);
            optionsContainer.appendChild(btn);
        });

        // Configurar timer
        startGroupTimer();

        // Esconder elementos desnecessários
        document.getElementById('reference-area').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('quit-btn').style.display = 'none';
    }

    function startGroupTimer() {
        const state = window.groupQuizState;
        let timeLeft = state.timeLimit;

        const timerElement = document.getElementById('timer-text');
        const timerBar = document.getElementById('timer-bar');

        const timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft + 's';

            // Atualizar barra de progresso
            const progress = (timeLeft / state.timeLimit) * 100;
            timerBar.style.setProperty('--progress', progress + '%');

            if (timeLeft <= 0) {
                clearInterval(timer);
                handleGroupTimeUp();
            }
        }, 1000);

        state.currentTimer = timer;
    }

    function handleGroupAnswer(btn, question, selectedIndex) {
        if (window.groupQuizState.answered) return;

        window.groupQuizState.answered = true;
        clearInterval(window.groupQuizState.currentTimer);

        const isCorrect = selectedIndex === question.correct;

        // Destacar resposta
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns.forEach((b, i) => {
            if (i === question.correct) {
                b.classList.add('correct');
            } else if (i === selectedIndex && !isCorrect) {
                b.classList.add('wrong');
            }
        });

        // Registrar resposta (simulando apenas o jogador local por enquanto)
        const playerIndex = window.groupQuizState.players.findIndex(p => p.name === window.currentGroup.host);
        if (playerIndex >= 0) {
            window.groupQuizState.players[playerIndex].answers.push(isCorrect);
            window.groupQuizState.players[playerIndex].score += isCorrect ? 10 : 0;
        }

        // Mostrar próxima pergunta após delay
        setTimeout(() => {
            nextGroupQuestion();
        }, 2000);
    }

    function handleGroupTimeUp() {
        // Destacar resposta correta
        const question = window.groupQuizState.questions[window.groupQuizState.currentQuestionIndex];
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns[question.correct].classList.add('correct');

        // Registrar resposta incorreta por tempo
        const playerIndex = window.groupQuizState.players.findIndex(p => p.name === window.currentGroup.host);
        if (playerIndex >= 0) {
            window.groupQuizState.players[playerIndex].answers.push(false);
        }

        // Próxima pergunta após delay
        setTimeout(() => {
            nextGroupQuestion();
        }, 2000);
    }

    function nextGroupQuestion() {
        window.groupQuizState.currentQuestionIndex++;
        window.groupQuizState.answered = false;

        if (window.groupQuizState.currentQuestionIndex >= window.groupQuizState.questions.length) {
            // Fim do quiz
            showGroupResults();
        } else {
            // Próxima pergunta
            showGroupQuestion();
        }
    }

    function showGroupResults() {
        // Mostrar resultados (simplificado por enquanto)
        const state = window.groupQuizState;
        const player = state.players[0]; // Apenas o jogador local por enquanto

        const correctAnswers = player.answers.filter(a => a).length;
        const totalQuestions = state.questions.length;

        alert(`Partida Finalizada!\n\n${player.name}\nAcertos: ${correctAnswers}/${totalQuestions}\nPontuação: ${player.score}`);

        // Voltar ao menu
        leaveGroup();
    }

    function leaveGroup() {
        // Limpar estado
        window.currentGroup = null;
        window.isGroupHost = false;
        window.groupPlayers = [];
        window.groupGameStarted = false;

        if (window.groupQuizState) {
            if (window.groupQuizState.currentTimer) {
                clearInterval(window.groupQuizState.currentTimer);
            }
            delete window.groupQuizState;
        }

        showView('home-view');
    }

    function generateGroupCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    function formatGroupCode(code) {
        return code.match(/.{4}/g).join('-');
    }

    function saveGroup(group) {
        const groups = JSON.parse(localStorage.getItem('jwquiz_groups') || '{}');
        groups[group.id] = group;
        localStorage.setItem('jwquiz_groups', JSON.stringify(groups));
    }

    function loadGroup(code) {
        const groups = JSON.parse(localStorage.getItem('jwquiz_groups') || '{}');
        return groups[code];
    }

    function copyToClipboard(text, event) {
        navigator.clipboard.writeText(text).then(() => {
            // Feedback visual temporário
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✅ Copiado!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            // Fallback para método antigo
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }

    // Verificar se há parâmetro de join na URL
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const joinCode = urlParams.get('join');

        if (joinCode) {
            // Remover parâmetro da URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Preencher automaticamente o campo de código
            setTimeout(() => {
                showGroupView();
                showJoinGroup();
                document.getElementById('group-code').value = joinCode;
                document.getElementById('player-name').focus();
            }, 500);
        }
    }

    // Event listeners para partida em grupo
    document.getElementById('start-multiplayer-btn').addEventListener('click', showGroupView);
    document.getElementById('back-from-group').addEventListener('click', () => showView('welcome-view'));

    // Menu
    document.getElementById('create-group-btn').addEventListener('click', showCreateGroup);
    document.getElementById('join-group-btn').addEventListener('click', showJoinGroup);

    // Criar partida
    document.getElementById('confirm-create-group').addEventListener('click', createGroup);
    document.getElementById('cancel-create-group').addEventListener('click', showGroupMenu);

    // Entrar na partida
    document.getElementById('confirm-join-group').addEventListener('click', joinGroup);
    document.getElementById('cancel-join-group').addEventListener('click', showGroupMenu);

    // Sala de espera (anfitrião)
    document.getElementById('copy-code-btn').addEventListener('click', (e) => {
        copyToClipboard(document.getElementById('group-code-display').textContent.replace('-', ''), e);
    });
    document.getElementById('copy-link-btn').addEventListener('click', (e) => {
        copyToClipboard(document.getElementById('group-link-display').value, e);
    });
    document.getElementById('start-group-game').addEventListener('click', startGroupGame);
    document.getElementById('cancel-group-lobby').addEventListener('click', leaveGroup);

    // Sala de espera (participante)
    document.getElementById('leave-group-lobby').addEventListener('click', leaveGroup);

    // Verificar parâmetros da URL ao carregar
    checkUrlParams();

    // === JOGO DA MEMÓRIA ===
    // Implementação do jogo da memória movida para script.js
    /*
    let memoryGame = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        attempts: 0,
        timer: null,
        timeElapsed: 0,
        gameStarted: false,
        animals: [
            { name: 'leão', emoji: '🦁' },
            { name: 'tigre', emoji: '🐯' },
            { name: 'elefante', emoji: '🐘' },
            { name: 'macaco', emoji: '🐵' },
            { name: 'panda', emoji: '🐼' },
            { name: 'girafa', emoji: '🦒' },
            { name: 'zebra', emoji: '🦓' },
            { name: 'cavalo', emoji: '🐎' },
        ]
    };
    */

    function showMemoryView() {
        console.log('showMemoryView called');
        showView('memory-view');
        // Mostrar diretamente a tela de configuração
        setTimeout(() => {
            console.log('Calling showMemoryConfig from main.js');
            if (window.showMemoryConfig) {
                console.log('window.showMemoryConfig exists, calling it');
                window.showMemoryConfig();
            } else {
                console.log('window.showMemoryConfig does not exist');
            }
        }, 100);
    }

    /*
    function initializeMemoryGame() {
        resetMemoryGame();
        createMemoryBoard();
        updateMemoryDisplay();
    }

    function resetMemoryGame() {
        memoryGame.cards = [];
        memoryGame.flippedCards = [];
        memoryGame.matchedPairs = 0;
        memoryGame.attempts = 0;
        memoryGame.timeElapsed = 0;
        memoryGame.gameStarted = false;

        if (memoryGame.timer) {
            clearInterval(memoryGame.timer);
            memoryGame.timer = null;
        }

        document.getElementById('memory-victory').classList.add('hidden');
        document.getElementById('start-memory-btn').disabled = false;
        document.getElementById('reset-memory-btn').disabled = true;
    }

    function createMemoryBoard() {
        const board = document.getElementById('memory-board');
        board.innerHTML = '';

        const cardPairs = [];
        memoryGame.animals.forEach(animal => {
            cardPairs.push({ ...animal, id: `${animal.name}-1` });
            cardPairs.push({ ...animal, id: `${animal.name}-2` });
        });

        shuffleArray(cardPairs);

        cardPairs.forEach(cardData => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.animal = cardData.name;
            card.dataset.id = cardData.id;

            card.innerHTML = `
                <div class="memory-card-back">?</div>
                <div class="memory-card-front">
                    <div class="memory-animal">${cardData.emoji}</div>
                </div>
            `;

            card.addEventListener('click', () => flipMemoryCard(card));
            board.appendChild(card);
            memoryGame.cards.push(card);
        });
    }

    function flipMemoryCard(card) {
        if (!memoryGame.gameStarted) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (memoryGame.flippedCards.length >= 2) return;

        card.classList.add('flipped');
        memoryGame.flippedCards.push(card);

        playMemorySound('flip');

        if (memoryGame.flippedCards.length === 2) {
            memoryGame.attempts++;
            setTimeout(checkMemoryMatch, 1000);
        }

        updateMemoryDisplay();
    }

    function checkMemoryMatch() {
        const [card1, card2] = memoryGame.flippedCards;
        const animal1 = card1.dataset.animal;
        const animal2 = card2.dataset.animal;

        if (animal1 === animal2) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            memoryGame.matchedPairs++;
            playMemorySound('match');
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        memoryGame.flippedCards = [];

        if (memoryGame.matchedPairs === memoryGame.animals.length) {
            endMemoryGame();
        }

        updateMemoryDisplay();
    }

    function startMemoryGame() {
        if (memoryGame.gameStarted) return;

        memoryGame.gameStarted = true;
        memoryGame.timeElapsed = 0;

        document.getElementById('start-memory-btn').disabled = true;
        document.getElementById('reset-memory-btn').disabled = false;

        memoryGame.timer = setInterval(() => {
            memoryGame.timeElapsed++;
            updateMemoryDisplay();
        }, 1000);

        window.analytics.track('memory_game_started');
    }

    function endMemoryGame() {
        clearInterval(memoryGame.timer);
        memoryGame.gameStarted = false;

        const timeBonus = Math.max(0, 120 - memoryGame.timeElapsed);
        const attemptPenalty = memoryGame.attempts * 2;
        const score = Math.max(0, timeBonus - attemptPenalty + (memoryGame.animals.length * 10));

        document.getElementById('victory-time').textContent = formatMemoryTime(memoryGame.timeElapsed);
        document.getElementById('victory-attempts').textContent = memoryGame.attempts;
        document.getElementById('victory-score').textContent = score;
        document.getElementById('memory-victory').classList.remove('hidden');

        window.analytics.track('memory_game_completed', {
            time: memoryGame.timeElapsed,
            attempts: memoryGame.attempts,
            score: score
        });
    }

    function updateMemoryDisplay() {
        document.getElementById('memory-timer').textContent = formatMemoryTime(memoryGame.timeElapsed);
        document.getElementById('memory-attempts').textContent = memoryGame.attempts;
        document.getElementById('memory-pairs').textContent = `${memoryGame.matchedPairs}/${memoryGame.animals.length}`;
    }

    function formatMemoryTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function playMemorySound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (type === 'match') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            } else if (type === 'flip') {
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        } catch (e) {
            // Silently fail
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    */

    function showAnalyticsView() {
        showView('analytics-view');
        loadAndDisplayAnalytics();
    }

    function loadAndDisplayAnalytics() {
        const analytics = calculateAnalytics();

        document.getElementById('analytics-users').textContent = analytics.uniqueUsers;
        document.getElementById('analytics-sessions').textContent = analytics.totalSessions;
        document.getElementById('analytics-avg-session').textContent = formatTime(analytics.avgSessionTime);
        document.getElementById('analytics-completion').textContent = analytics.completionRate + '%';
        document.getElementById('analytics-quizzes').textContent = analytics.totalQuizzes;
        document.getElementById('analytics-questions').textContent = analytics.totalQuestions;
        document.getElementById('analytics-light-theme').textContent = analytics.themeUsage.light;
        document.getElementById('analytics-dark-theme').textContent = analytics.themeUsage.dark;

        displayDeviceStats(analytics.deviceStats);
        displayHourlyChart(analytics.hourlyUsage);
    }

    function calculateAnalytics() {
        const data = window.analytics.data;
        let analytics = {
            uniqueUsers: new Set(),
            totalSessions: 0,
            totalSessionTime: 0,
            completedQuizzes: 0,
            totalQuizzes: 0,
            totalQuestions: 0,
            themeUsage: { light: 0, dark: 0 },
            deviceStats: {},
            hourlyUsage: new Array(24).fill(0),
            sessions: []
        };

        Object.values(data).forEach(day => {
            Object.entries(day.events).forEach(([event, occurrences]) => {
                occurrences.forEach(occ => {
                    if (occ.userId) analytics.uniqueUsers.add(occ.userId);
                    if (event === 'session_start') {
                        analytics.totalSessions++;
                        analytics.sessions.push({ sessionId: occ.sessionId, startTime: occ.timestamp, duration: 0 });
                    }
                    if (event === 'session_end' && occ.sessionId) {
                        const session = analytics.sessions.find(s => s.sessionId === occ.sessionId);
                        if (session) {
                            session.duration = occ.duration;
                            analytics.totalSessionTime += session.duration;
                        }
                    }
                    if (event === 'quiz_start') analytics.totalQuizzes++;
                    if (event === 'quiz_completed') analytics.completedQuizzes++;
                    if (event === 'question_answered') analytics.totalQuestions++;
                    if (event === 'theme_changed') analytics.themeUsage[occ.theme]++;
                    const device = getDeviceType(occ.userAgent);
                    analytics.deviceStats[device] = (analytics.deviceStats[device] || 0) + 1;
                    const hour = new Date(occ.timestamp).getHours();
                    analytics.hourlyUsage[hour]++;
                });
            });
        });

        analytics.avgSessionTime = analytics.totalSessions > 0 ? Math.round(analytics.totalSessionTime / analytics.totalSessions) : 0;
        analytics.completionRate = analytics.totalQuizzes > 0 ? Math.round((analytics.completedQuizzes / analytics.totalQuizzes) * 100) : 0;
        analytics.uniqueUsers = analytics.uniqueUsers.size;

        return analytics;
    }

    function displayDeviceStats(deviceStats) {
        const container = document.getElementById('device-stats');
        container.innerHTML = '';
        Object.entries(deviceStats).sort(([,a], [,b]) => b - a).forEach(([device, count]) => {
            const item = document.createElement('div');
            item.className = 'category-stats';
            item.innerHTML = `<span class="category-name">${device}</span> <span class="category-stats-text">${count}</span>`;
            container.appendChild(item);
        });
    }

    function displayHourlyChart(hourlyUsage) {
        const container = document.getElementById('hourly-chart');
        container.innerHTML = '';
        const maxUsage = Math.max(...hourlyUsage, 1);
        hourlyUsage.forEach((usage, hour) => {
            const bar = document.createElement('div');
            bar.className = 'hourly-bar';
            const height = (usage / maxUsage) * 100;
            bar.innerHTML = `<div class="hourly-fill" style="height: ${height}%"></div><span class="hourly-label">${hour.toString().padStart(2, '0')}</span>`;
            container.appendChild(bar);
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.id === 'back-from-analytics') showView('welcome-view');
        if (e.target.id === 'export-analytics') exportAnalyticsData();
        if (e.target.id === 'clear-analytics') {
            if (confirm('Tem certeza?')) {
                localStorage.removeItem('quiz_analytics');
                window.analytics.data = {};
                showAnalyticsView();
            }
        }
    });

    function exportAnalyticsData() {
        const dataStr = JSON.stringify(window.analytics.exportData(), null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quiz_analytics.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    window.showAnalyticsView = showAnalyticsView;

    document.getElementById('home-title').addEventListener('dblclick', () => {
        if (confirm('Acessar painel de analytics?')) {
            showAnalyticsView();
        }
    });

    // Event listeners para o jogo da memória (movidos para script.js)
    /*
    document.getElementById('start-memory-game-btn').addEventListener('click', showMemoryView);
    document.getElementById('back-from-memory').addEventListener('click', () => showView('welcome-view'));
    document.getElementById('start-memory-btn').addEventListener('click', startMemoryGame);
    document.getElementById('reset-memory-btn').addEventListener('click', initializeMemoryGame);
    document.getElementById('play-again-memory').addEventListener('click', () => {
        document.getElementById('memory-victory').classList.add('hidden');
        initializeMemoryGame();
        startMemoryGame(); // Inicia o jogo automaticamente
    });
    */

    // Adicionar event listener para o botão do jogo da memória com debug
    const memoryBtn = document.getElementById('start-memory-game-btn');
    if (memoryBtn) {
        console.log('Adding event listener to start-memory-game-btn');
        memoryBtn.addEventListener('click', function(e) {
            console.log('start-memory-game-btn clicked');
            showMemoryView();
        });
    } else {
        console.log('start-memory-game-btn not found');
    }

    // Adicionar event listener para o botão de voltar ao início
    const backFromMemoryBtn = document.getElementById('back-from-memory');
    if (backFromMemoryBtn) {
        console.log('Adding event listener to back-from-memory');
        backFromMemoryBtn.addEventListener('click', function(e) {
            console.log('back-from-memory clicked - going back to welcome');
            showView('welcome-view');
        });
    } else {
        console.log('back-from-memory not found');
    }

    // Event listeners para a tela de boas-vindas
    const welcomeQuizBtn = document.getElementById('welcome-quiz-btn');
    if (welcomeQuizBtn) {
        welcomeQuizBtn.addEventListener('click', () => {
            showView('home-view');
        });
    }

    const welcomeMemoryBtn = document.getElementById('welcome-memory-btn');
    if (welcomeMemoryBtn) {
        welcomeMemoryBtn.addEventListener('click', () => {
            showView('memory-view');
            // Mostrar diretamente a tela de configuração
            setTimeout(() => {
                if (window.showMemoryConfig) {
                    window.showMemoryConfig();
                }
            }, 100);
        });
    }

    const welcomeThemeToggle = document.getElementById('welcome-theme-toggle');
    if (welcomeThemeToggle) {
        welcomeThemeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);

            // Analytics
            window.analytics.track('theme_changed', { theme: newTheme });
        });
    }

    const welcomeLegalBtn = document.getElementById('welcome-legal-btn');
    if (welcomeLegalBtn) {
        welcomeLegalBtn.addEventListener('click', () => {
            showView('legal-view');
        });
    }

    // Event listener para o botão de voltar à tela inicial na tela do quiz
    const backToWelcomeBtn = document.getElementById('back-to-welcome');
    if (backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', () => {
            showView('welcome-view');
        });
    }

    // Event listeners para o modal de fim de jogo
    document.getElementById('play-again-btn').addEventListener('click', () => {
        document.getElementById('end-game-modal').classList.add('hidden');
        // Reinicia um quiz com as mesmas configurações (simplificado por enquanto)
        window.location.reload();
    });

    document.getElementById('back-to-menu-btn').addEventListener('click', () => {
        document.getElementById('end-game-modal').classList.add('hidden');
        showView('home-view');
    });

    // Sempre mostrar tela de boas-vindas como página inicial
    showView('welcome-view');

    // === FUNCIONALIDADES DA PÁGINA DE ADMIN ===
    let currentPage = 1;
    let itemsPerPage = 10;
    let filteredQuestions = [];
    let allTags = new Set();

    // Função para mostrar a página de admin
    function showAdminView() {
        showView('admin-view');
        loadAdminData();
    }

    // Carregar dados para a página de admin
    function loadAdminData() {
        if (!window.allQuestions || window.allQuestions.length === 0) {
            console.warn('Nenhuma pergunta carregada para admin');
            return;
        }

        // Atualizar estatísticas
        updateAdminStats();

        // Coletar todas as tags
        allTags.clear();
        window.allQuestions.forEach(q => {
            if (q.tags) {
                q.tags.forEach(tag => allTags.add(tag));
            }
        });

        // Popular filtro de tags
        populateTagFilter();

        // Aplicar filtros iniciais (todas as questões)
        applyFilters();
    }

    // Atualizar estatísticas da página admin
    function updateAdminStats() {
        const questions = window.allQuestions || [];
        document.getElementById('total-questions-count').textContent = questions.length;

        const easy = questions.filter(q => q.dificuldade === 1).length;
        const medium = questions.filter(q => q.dificuldade === 2).length;
        const hard = questions.filter(q => q.dificuldade === 3).length;

        document.getElementById('easy-questions-count').textContent = easy;
        document.getElementById('medium-questions-count').textContent = medium;
        document.getElementById('hard-questions-count').textContent = hard;
    }

    // Popular filtro de tags
    function populateTagFilter() {
        const tagFilter = document.getElementById('tag-filter');
        tagFilter.innerHTML = '<option value="">Todas as tags</option>';

        Array.from(allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagFilter.appendChild(option);
        });
    }

    // Aplicar filtros de busca
    function applyFilters() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const difficultyFilter = document.getElementById('difficulty-filter').value;
        const tagFilter = document.getElementById('tag-filter').value;

        filteredQuestions = (window.allQuestions || []).filter(question => {
            // Filtro de texto
            const matchesSearch = !searchTerm ||
                question.question.toLowerCase().includes(searchTerm) ||
                question.options.some(opt => opt.toLowerCase().includes(searchTerm));

            // Filtro de dificuldade
            const matchesDifficulty = !difficultyFilter ||
                question.dificuldade.toString() === difficultyFilter;

            // Filtro de tag
            const matchesTag = !tagFilter ||
                (question.tags && question.tags.includes(tagFilter));

            return matchesSearch && matchesDifficulty && matchesTag;
        });

        currentPage = 1;
        renderQuestionsPage();
    }

    // Renderizar página atual de questões
    function renderQuestionsPage() {
        const questionsList = document.getElementById('questions-list');
        questionsList.innerHTML = '';

        const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredQuestions.length);
        const questionsToShow = filteredQuestions.slice(startIndex, endIndex);

        if (questionsToShow.length === 0) {
            questionsList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">Nenhuma questão encontrada.</div>';
        } else {
            questionsToShow.forEach((question, index) => {
                const questionItem = createQuestionItem(question, startIndex + index);
                questionsList.appendChild(questionItem);
            });
        }

        // Atualizar controles de paginação
        updatePaginationControls(totalPages);
    }

    // Criar item de questão para a lista
    function createQuestionItem(question, globalIndex) {
        const item = document.createElement('div');
        item.className = 'question-item';

        const difficultyClass = question.dificuldade === 1 ? 'difficulty-easy' :
                               question.dificuldade === 2 ? 'difficulty-medium' : 'difficulty-hard';
        const difficultyText = question.dificuldade === 1 ? 'Fácil' :
                              question.dificuldade === 2 ? 'Médio' : 'Difícil';

        item.innerHTML = `
            <div class="question-header">
                <div class="question-text">${question.question}</div>
                <div class="question-meta">
                    <span class="difficulty-badge ${difficultyClass}">${difficultyText}</span>
                    ${question.tags ? question.tags.map(tag =>
                        `<span class="tag-badge">${tag}</span>`
                    ).join('') : ''}
                </div>
            </div>
            <div class="question-options">
                ${question.options.map((option, idx) =>
                    `<span class="question-option ${idx === question.correct ? 'correct' : ''}">• ${option}</span>`
                ).join('')}
            </div>
        `;

        return item;
    }

    // Atualizar controles de paginação
    function updatePaginationControls(totalPages) {
        document.getElementById('current-page').textContent = currentPage;
        document.getElementById('total-pages').textContent = totalPages;
        document.getElementById('showing-count').textContent = filteredQuestions.length;

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    // Navegar para página anterior
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderQuestionsPage();
        }
    }

    // Navegar para próxima página
    function goToNextPage() {
        const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderQuestionsPage();
        }
    }

    // Event listeners para a página de admin
    document.addEventListener('click', (e) => {
        if (e.target.id === 'back-from-admin') {
            showView('home-view');
        }
        if (e.target.id === 'prev-page') {
            goToPrevPage();
        }
        if (e.target.id === 'next-page') {
            goToNextPage();
        }
    });

    // Event listeners para filtros
    document.addEventListener('input', (e) => {
        if (e.target.id === 'search-input') {
            applyFilters();
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.id === 'difficulty-filter' || e.target.id === 'tag-filter') {
            applyFilters();
        }
    });

    // Expor função global para acessar admin
    window.showAdminView = showAdminView;
});