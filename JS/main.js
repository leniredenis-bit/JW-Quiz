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
        console.log('showView called with:', viewId);
        views.forEach(view => view.classList.remove('active'));
        const el = document.getElementById(viewId);
        if (el) {
            el.classList.add('active');
            console.log('Added active to:', viewId);
        } else {
            console.log('Element not found:', viewId);
        }
        // small scroll to top for mobile UX
        window.scrollTo(0, 0);
    }
    window.showView = showView;

    // Carrega perguntas do JSON
    async function loadQuestions() {
        try {
            console.log('Tentando carregar perguntas do JSON...');
            const res = await fetch('/JW-Quiz/DATA/perguntas.json');
            console.log('Resposta do fetch:', res.status, res.statusText);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();
            window.allQuestions = data;
            console.log('Perguntas carregadas:', data.length);
            populateFilters();
        } catch (err) {
            console.error('Erro ao carregar perguntas', err);
            tagsContainer.innerHTML = '<p>Erro ao carregar temas.</p>';
        }
    }

    // Popula filtros
    function populateFilters() {
        const tags = new Set();
        window.allQuestions.forEach(q => (q.tags || []).forEach(t => tags.add(t)));

        const sortedTags = Array.from(tags).sort();
        const initialTags = sortedTags.slice(0, 7);
        const hasMore = sortedTags.length > 7;

        tagsContainer.innerHTML = '';
        initialTags.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = 'tag-btn';
            btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            btn.onclick = () => {
                console.log('Tag clicked:', tag);
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

        const difficulties = [...new Set(window.allQuestions.map(q => q.dificuldade || 1))].sort((a,b)=>a-b);
        difficultyContainer.innerHTML = '';
        difficulties.forEach(d => {
            const btn = document.createElement('button');
            btn.className = 'difficulty-btn';
            if (d === 1) btn.classList.add('difficulty-easy');
            else if (d === 2) btn.classList.add('difficulty-medium');
            else if (d === 3) btn.classList.add('difficulty-hard');
            btn.innerHTML = '★'.repeat(d) + '☆'.repeat(3-d);
            btn.onclick = () => {
                console.log('Difficulty clicked:', d);
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
        showView('admin-view');
    });
    document.getElementById('show-stats-btn').addEventListener('click', () => {
        console.log('Stats button clicked');
        showStatsView();
    });

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

    // Multiplayer básico (local storage para salas)
    window.multiplayerRooms = JSON.parse(localStorage.getItem('multiplayer_rooms') || '{}');

    // Funções multiplayer
    function generateRoomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    function saveRooms() {
        localStorage.setItem('multiplayer_rooms', JSON.stringify(window.multiplayerRooms));
    }

    function showMultiplayerMenu() {
        document.getElementById('multiplayer-menu').style.display = 'block';
        document.getElementById('room-creation').style.display = 'none';
        document.getElementById('room-join').style.display = 'none';
        document.getElementById('room-lobby').style.display = 'none';
    }

    function showRoomCreation() {
        document.getElementById('multiplayer-menu').style.display = 'none';
        document.getElementById('room-creation').style.display = 'block';
        document.getElementById('room-name').focus();
    }

    function showRoomJoin() {
        document.getElementById('multiplayer-menu').style.display = 'none';
        document.getElementById('room-join').style.display = 'block';
        document.getElementById('room-code').focus();
    }

    function createRoom() {
        const roomName = document.getElementById('room-name').value.trim();
        if (!roomName) {
            alert('Digite um nome para a sala');
            return;
        }

        const roomCode = generateRoomCode();
        const playerName = prompt('Seu nome:') || 'Jogador';

        window.multiplayerRooms[roomCode] = {
            name: roomName,
            host: playerName,
            players: [playerName],
            created: Date.now(),
            gameStarted: false
        };

        saveRooms();
        joinRoomLobby(roomCode, playerName, true);
    }

    function joinRoom() {
        const roomCode = document.getElementById('room-code').value.trim().toUpperCase();
        if (!roomCode || roomCode.length !== 6) {
            alert('Digite um código válido de 6 caracteres');
            return;
        }

        if (!window.multiplayerRooms[roomCode]) {
            alert('Sala não encontrada');
            return;
        }

        if (window.multiplayerRooms[roomCode].gameStarted) {
            alert('Jogo já começou');
            return;
        }

        const playerName = prompt('Seu nome:') || 'Jogador';
        window.multiplayerRooms[roomCode].players.push(playerName);
        saveRooms();

        joinRoomLobby(roomCode, playerName, false);
    }

    function joinRoomLobby(roomCode, playerName, isHost) {
        const room = window.multiplayerRooms[roomCode];
        document.getElementById('multiplayer-menu').style.display = 'none';
        document.getElementById('room-lobby').style.display = 'block';

        document.getElementById('lobby-title').textContent = `Sala: ${room.name} (${roomCode})`;
        updatePlayersList(room.players);

        if (isHost) {
            document.getElementById('start-game-btn').style.display = 'inline-block';
        }

        // Armazenar dados da sessão atual
        window.currentRoom = { code: roomCode, playerName, isHost };
    }

    function updatePlayersList(players) {
        const ul = document.getElementById('players-ul');
        ul.innerHTML = '';
        players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player;
            li.style.padding = '0.25rem 0';
            ul.appendChild(li);
        });
    }

    function leaveRoom() {
        if (window.currentRoom) {
            const room = window.multiplayerRooms[window.currentRoom.code];
            if (room) {
                room.players = room.players.filter(p => p !== window.currentRoom.playerName);
                if (room.players.length === 0) {
                    delete window.multiplayerRooms[window.currentRoom.code];
                }
                saveRooms();
            }
        }
        showMultiplayerMenu();
    }

    // Event listeners para multiplayer
    document.getElementById('create-room-btn').addEventListener('click', showRoomCreation);
    document.getElementById('join-room-btn').addEventListener('click', showRoomJoin);
    document.getElementById('confirm-create-btn').addEventListener('click', createRoom);
    document.getElementById('cancel-create-btn').addEventListener('click', showMultiplayerMenu);
    document.getElementById('confirm-join-btn').addEventListener('click', joinRoom);
    document.getElementById('cancel-join-btn').addEventListener('click', showMultiplayerMenu);
    document.getElementById('leave-room-btn').addEventListener('click', leaveRoom);

    // Inicialização
    loadQuestions();

    // Sistema de Tema Escuro/Claro
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light'; // Tema claro como padrão

        // Aplicar tema salvo
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButton(savedTheme);

        // Event listener para alternar tema
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);

            // Analytics
            window.analytics.track('theme_changed', { theme: newTheme });
        });

        function updateThemeButton(theme) {
            themeToggle.textContent = theme === 'dark' ? 'modo claro' : 'modo escuro';
            themeToggle.setAttribute('aria-label', `Alternar para ${theme === 'dark' ? 'modo claro' : 'modo escuro'}`);
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
            showView('home-view');
        }
        if (e.target.id === 'reset-stats') {
            if (confirm('Tem certeza que deseja resetar todas as estatísticas? Esta ação não pode ser desfeita.')) {
                resetStats();
            }
        }
        if (e.target.id === 'export-stats') {
            exportStats();
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

    // Inicializar tema

    // Registrar service worker para PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/JW-Quiz/sw.js')
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
        currentGroup = {
            id: groupCode,
            name: groupName,
            host: hostName,
            players: [hostName],
            created: Date.now(),
            status: 'waiting'
        };

        isGroupHost = true;
        groupPlayers = [hostName];

        // Salvar no localStorage (simulando servidor)
        saveGroup(currentGroup);

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

        currentGroup = group;
        isGroupHost = false;
        groupPlayers = group.players;

        // Mostrar sala de espera do participante
        showGroupLobbyPlayer();

        // Analytics
        window.analytics.track('group_joined', { groupId: groupCode, playerName });
    }

    function showGroupLobbyHost() {
        document.getElementById('create-group').style.display = 'none';
        document.getElementById('group-lobby-host').style.display = 'block';

        // Atualizar informações da partida
        document.getElementById('lobby-host-title').textContent = `🎯 ${currentGroup.name}`;
        document.getElementById('group-code-display').textContent = formatGroupCode(currentGroup.id);

        // Gerar link da partida
        const baseUrl = window.location.origin + window.location.pathname;
        const groupLink = `${baseUrl}?join=${currentGroup.id}`;
        document.getElementById('group-link-display').value = groupLink;

        // Atualizar lista de jogadores
        updatePlayersListHost();

        // Verificar se pode iniciar
        updateStartButton();
    }

    function showGroupLobbyPlayer() {
        document.getElementById('join-group').style.display = 'none';
        document.getElementById('group-lobby-player').style.display = 'block';

        document.getElementById('lobby-player-title').textContent = `🎮 ${currentGroup.name}`;

        // Atualizar lista de jogadores
        updatePlayersListPlayer();
    }

    function updatePlayersListHost() {
        const container = document.getElementById('players-list-host');
        container.innerHTML = '';

        groupPlayers.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';

            const isHost = player === currentGroup.host;
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

        groupPlayers.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';

            const isHost = player === currentGroup.host;
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
        const hasEnoughPlayers = groupPlayers.length >= 2;

        startBtn.disabled = !hasEnoughPlayers;
        startBtn.textContent = hasEnoughPlayers ? '▶️ Iniciar Partida' : 'Aguardando mais jogadores...';
    }

    function startGroupGame() {
        if (groupPlayers.length < 2) {
            alert('Precisa de pelo menos 2 jogadores para iniciar a partida.');
            return;
        }

        // Atualizar status da partida
        currentGroup.status = 'playing';
        saveGroup(currentGroup);

        groupGameStarted = true;

        // Iniciar quiz em grupo
        startGroupQuiz();

        // Analytics
        window.analytics.track('group_game_started', {
            groupId: currentGroup.id,
            playerCount: groupPlayers.length
        });
    }

    function startGroupQuiz() {
        // Usar as mesmas perguntas do quiz normal
        const questions = getRandomQuestions(10);

        // Inicializar estado do quiz em grupo
        window.groupQuizState = {
            questions: questions,
            currentQuestionIndex: 0,
            players: groupPlayers.map(name => ({
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
        document.getElementById('question-progress').textContent = `Pergunta ${state.currentQuestionIndex + 1} de ${state.questions.length}`;

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
        const playerIndex = window.groupQuizState.players.findIndex(p => p.name === currentGroup.host);
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
        const playerIndex = window.groupQuizState.players.findIndex(p => p.name === currentGroup.host);
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
        currentGroup = null;
        isGroupHost = false;
        groupPlayers = [];
        groupGameStarted = false;

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

    function copyToClipboard(text) {
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
    document.getElementById('back-from-group').addEventListener('click', () => showView('home-view'));

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
    document.getElementById('copy-code-btn').addEventListener('click', () => {
        copyToClipboard(document.getElementById('group-code-display').textContent.replace('-', ''));
    });
    document.getElementById('copy-link-btn').addEventListener('click', () => {
        copyToClipboard(document.getElementById('group-link-display').value);
    });
    document.getElementById('start-group-game').addEventListener('click', startGroupGame);
    document.getElementById('cancel-group-lobby').addEventListener('click', leaveGroup);

    // Sala de espera (participante)
    document.getElementById('leave-group-lobby').addEventListener('click', leaveGroup);

    // Verificar parâmetros da URL ao carregar
    checkUrlParams();

    function loadAndDisplayAnalytics() {
        const analytics = calculateAnalytics();

        // Métricas gerais
        document.getElementById('analytics-users').textContent = analytics.uniqueUsers;
        document.getElementById('analytics-sessions').textContent = analytics.totalSessions;
        document.getElementById('analytics-avg-session').textContent = formatTime(analytics.avgSessionTime);
        document.getElementById('analytics-completion').textContent = analytics.completionRate + '%';

        // Atividade
        document.getElementById('analytics-quizzes').textContent = analytics.totalQuizzes;
        document.getElementById('analytics-questions').textContent = analytics.totalQuestions;
        document.getElementById('analytics-light-theme').textContent = analytics.themeUsage.light;
        document.getElementById('analytics-dark-theme').textContent = analytics.themeUsage.dark;

        // Dispositivos
        displayDeviceStats(analytics.deviceStats);

        // Uso por hora
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

        // Processar dados de analytics
        Object.values(data).forEach(day => {
            Object.entries(day.events).forEach(([event, occurrences]) => {
                occurrences.forEach(occ => {
                    // Usuários únicos
                    if (occ.userId) {
                        analytics.uniqueUsers.add(occ.userId);
                    }

                    // Sessões
                    if (event === 'session_start') {
                        analytics.totalSessions++;
                        analytics.sessions.push({
                            sessionId: occ.sessionId,
                            startTime: occ.timestamp,
                            userId: occ.userId,
                            device: occ.device,
                            duration: 0
                        });
                    }

                    // Tempo de sessão
                    if (event === 'session_end' && occ.sessionId) {
                        const session = analytics.sessions.find(s => s.sessionId === occ.sessionId);
                        if (session) {
                            session.endTime = occ.timestamp;
                            session.duration = (occ.timestamp - session.startTime) / 1000;
                            analytics.totalSessionTime += session.duration;
                        }
                    }

                    // Quizzes
                    if (event === 'quiz_start') {
                        analytics.totalQuizzes++;
                    }

                    if (event === 'quiz_complete') {
                        analytics.completedQuizzes++;
                    }

                    // Perguntas
                    if (event === 'question_answered') {
                        analytics.totalQuestions++;
                    }

                    // Tema
                    if (event === 'theme_changed') {
                        if (occ.theme === 'light') analytics.themeUsage.light++;
                        if (occ.theme === 'dark') analytics.themeUsage.dark++;
                    }

                    // Dispositivos
                    if (occ.device) {
                        if (!analytics.deviceStats[occ.device]) {
                            analytics.deviceStats[occ.device] = 0;
                        }
                        analytics.deviceStats[occ.device]++;
                    }

                    // Uso por hora
                    if (occ.timestamp) {
                        const hour = new Date(occ.timestamp).getHours();
                        analytics.hourlyUsage[hour]++;
                    }
                });
            });
        });

        // Calcular médias e percentuais
        analytics.avgSessionTime = analytics.totalSessions > 0 ?
            Math.round(analytics.totalSessionTime / analytics.totalSessions) : 0;

        analytics.completionRate = analytics.totalQuizzes > 0 ?
            Math.round((analytics.completedQuizzes / analytics.totalQuizzes) * 100) : 0;

        analytics.uniqueUsers = analytics.uniqueUsers.size;

        return analytics;
    }

    function displayDeviceStats(deviceStats) {
        const container = document.getElementById('device-stats');
        container.innerHTML = '';

        if (Object.keys(deviceStats).length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum dispositivo registrado ainda.</p>';
            return;
        }

        Object.entries(deviceStats)
            .sort(([,a], [,b]) => b - a)
            .forEach(([device, count]) => {
                const item = document.createElement('div');
                item.className = 'device-item';
                item.innerHTML = `
                    <span class="device-name">${device}</span>
                    <span class="device-count">${count}</span>
                `;
                container.appendChild(item);
            });
    }

    function displayHourlyChart(hourlyUsage) {
        const container = document.getElementById('hourly-chart');
        container.innerHTML = '';

        const maxUsage = Math.max(...hourlyUsage);

        hourlyUsage.forEach((usage, hour) => {
            const bar = document.createElement('div');
            bar.className = 'hourly-bar';

            const height = maxUsage > 0 ? (usage / maxUsage) * 100 : 0;

            bar.innerHTML = `
                <div class="hourly-fill" style="height: ${height}%"></div>
                <span class="hourly-label">${hour.toString().padStart(2, '0')}</span>
            `;

            container.appendChild(bar);
        });
    }

    // Event listeners para analytics
    document.addEventListener('click', (e) => {
        if (e.target.id === 'back-from-analytics') {
            showView('home-view');
        }
        if (e.target.id === 'export-analytics') {
            exportAnalyticsData();
        }
        if (e.target.id === 'clear-analytics') {
            if (confirm('Tem certeza que deseja limpar TODOS os dados de analytics? Esta ação não pode ser desfeita.')) {
                clearAnalyticsData();
            }
        }
    });

    function exportAnalyticsData() {
        const analytics = calculateAnalytics();
        const data = {
            exportDate: new Date().toISOString(),
            analytics: analytics,
            rawData: window.analytics.data
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jw-quiz-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function clearAnalyticsData() {
        localStorage.removeItem('quiz_analytics');
        window.analytics.data = {};
        showView('home-view');
    }

    // Expor função para acesso externo (desenvolvedor)
    window.showAnalyticsView = showAnalyticsView;

    // Acesso secreto à analytics (clique duplo no título)
    document.getElementById('home-title').addEventListener('dblclick', () => {
        if (confirm('Acesso ao painel de analytics do desenvolvedor. Continuar?')) {
            showAnalyticsView();
        }
    });
});