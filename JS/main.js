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

    // Analytics básico
    window.analytics = {
        data: JSON.parse(localStorage.getItem('quiz_analytics') || '{}'),
        track: function(event, data = {}) {
            const now = new Date();
            const dateKey = now.toISOString().split('T')[0];

            if (!this.data[dateKey]) {
                this.data[dateKey] = { events: {} };
            }

            if (!this.data[dateKey].events[event]) {
                this.data[dateKey].events[event] = [];
            }

            this.data[dateKey].events[event].push({
                timestamp: now.getTime(),
                ...data
            });

            // Limitar a 1000 eventos por dia para não crescer demais
            if (this.data[dateKey].events[event].length > 1000) {
                this.data[dateKey].events[event] = this.data[dateKey].events[event].slice(-500);
            }

            this.save();
        },
        save: function() {
            try {
                localStorage.setItem('quiz_analytics', JSON.stringify(this.data));
            } catch (e) {
                console.warn('Erro salvando analytics:', e);
            }
        },
        getStats: function() {
            const stats = { totalSessions: 0, totalQuizzes: 0, popularTags: {}, popularDifficulties: {} };

            Object.values(this.data).forEach(day => {
                Object.entries(day.events).forEach(([event, occurrences]) => {
                    if (event === 'session_start') stats.totalSessions += occurrences.length;
                    if (event === 'quiz_start') stats.totalQuizzes += occurrences.length;
                    if (event === 'tag_selected') {
                        occurrences.forEach(occ => {
                            stats.popularTags[occ.tag] = (stats.popularTags[occ.tag] || 0) + 1;
                        });
                    }
                    if (event === 'difficulty_selected') {
                        occurrences.forEach(occ => {
                            stats.popularDifficulties[occ.difficulty] = (stats.popularDifficulties[occ.difficulty] || 0) + 1;
                        });
                    }
                });
            });

            return stats;
        }
    };

    // Rastrear início de sessão
    window.analytics.track('session_start');

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
        window.analytics.track('quiz_start', { filter });

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
        const savedTheme = localStorage.getItem('theme') || 'dark'; // Tema escuro como padrão

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
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', `Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`);
        }
    }

    // Inicializar tema
    initTheme();

    // Registrar service worker para PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/JW-Quiz/sw.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Erro no SW:', err));
    }
});