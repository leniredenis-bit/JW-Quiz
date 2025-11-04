// Quiz logic: depends on window.allQuestions and window.showView
(function () {
    // Função auxiliar para embaralhar array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Carrega progresso do localStorage
    function loadProgress() {
        try {
            const data = JSON.parse(localStorage.getItem('jwquiz_progress') || '{}');
            answeredQuestions = new Set(data.answered || []);
            questionErrors = data.errors || {};
        } catch (e) {
            console.error('Erro carregando progresso:', e);
        }
    }

    // Salva progresso
    function saveProgress() {
        try {
            localStorage.setItem('jwquiz_progress', JSON.stringify({
                answered: Array.from(answeredQuestions),
                errors: questionErrors
            }));
        } catch (e) {
            console.error('Erro salvando progresso:', e);
        }
    }

    loadProgress();
    // Configuração do temporizador
    const BASE_TIME = 8; // segundos base
    const TIME_PER_WORD = 0.5; // segundos por palavra
    const MAX_TIME = 30; // limite por pergunta

    // Estado do quiz
    let questions = [];
    let currentIndex = 0;
    let score = 0;
    let timer = null;
    let timeLeft = 0;
    let totalQuestions = 0;
    let currentStreak = 0;
    let timeSpent = 0;
    let answeredQuestions = new Set(); // IDs já acertados
    let questionErrors = {}; // erros por pergunta ID
    let autoNextTimeout = null; // timeout para próxima pergunta automática
    let autoNextTimeLeft = 0; // tempo restante para próxima automática
    let correctAnswers = 0; // contador de respostas corretas
    let isStudyMode = false; // flag para modo estudo

    // DOM - só buscar quando necessário
    let progressEl, questionTextEl, optionsContainer, timerBarElem, timerText, referenceArea, correctAnswerEl, referenceTextEl, biblicalTextEl, nextBtn, quitBtn, autoNextCounter, autoNextText, soundToggle;

    function getDOMElements() {
        if (!progressEl) {
            progressEl = document.getElementById('quiz-progress');
            questionTextEl = document.getElementById('question-text');
            optionsContainer = document.getElementById('options-container');
            timerBarElem = document.getElementById('timer-bar');
            timerText = document.getElementById('timer-text');
            referenceArea = document.getElementById('reference-area');
            correctAnswerEl = document.getElementById('correct-answer');
            referenceTextEl = document.getElementById('reference-text');
            biblicalTextEl = document.getElementById('biblical-text');
            nextBtn = document.getElementById('next-btn');
            quitBtn = document.getElementById('quit-btn');
            autoNextCounter = document.getElementById('auto-next-counter');
            autoNextText = document.getElementById('auto-next-text');
            soundToggle = document.getElementById('sound-toggle');
        }
    }

    // Audio feedback aprimorado
    function playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Hierarquia de volumes: UI (-10dB), sucesso (-6dB), vitória (-3dB)
            const baseVolume = 0.1; // Volume base reduzido

            if (type === 'correct') {
                // ✅ "Harp Shine" - Suave, notas ascendentes, sensação de luz (0.8s)
                oscillator.type = 'sine';
                const now = audioContext.currentTime;

                // Arpejo ascendente celestial
                oscillator.frequency.setValueAtTime(523.25, now); // C5
                oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
                oscillator.frequency.setValueAtTime(1046.50, now + 0.3); // C6

                gainNode.gain.setValueAtTime(baseVolume * 0.5, now); // -6dB (sucesso)
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                oscillator.start(now);
                oscillator.stop(now + 0.8);
            } else if (type === 'wrong') {
                // ❌ "Soft Thud" - Grave e discreto, sem susto (0.5s)
                oscillator.type = 'triangle';
                const now = audioContext.currentTime;

                oscillator.frequency.setValueAtTime(146.83, now); // D3
                oscillator.frequency.exponentialRampToValueAtTime(110.00, now + 0.3); // A2

                gainNode.gain.setValueAtTime(baseVolume * 0.3, now); // -10dB (UI)
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

                oscillator.start(now);
                oscillator.stop(now + 0.5);
            } else if (type === 'timer') {
                // ⏳ "Tick-Tick Fade" - Tick leve com fade-in (3–5s)
                const now = audioContext.currentTime;
                let tickCount = 0;
                const maxTicks = 8;

                const playTick = () => {
                    if (tickCount >= maxTicks) return;

                    const tickOsc = audioContext.createOscillator();
                    const tickGain = audioContext.createGain();

                    tickOsc.connect(tickGain);
                    tickGain.connect(audioContext.destination);

                    tickOsc.type = 'square';
                    tickOsc.frequency.setValueAtTime(800 + (tickCount * 50), now + tickCount * 0.4);

                    // Fade-in progressivo
                    const volume = baseVolume * 0.2 * (tickCount + 1) / maxTicks; // -10dB crescendo
                    tickGain.gain.setValueAtTime(volume, now + tickCount * 0.4);
                    tickGain.gain.exponentialRampToValueAtTime(0.001, now + tickCount * 0.4 + 0.1);

                    tickOsc.start(now + tickCount * 0.4);
                    tickOsc.stop(now + tickCount * 0.4 + 0.1);

                    tickCount++;
                    if (tickCount < maxTicks) {
                        setTimeout(playTick, 400 - (tickCount * 30)); // Acelera progressivamente
                    }
                };
                playTick();
            } else if (type === 'new_question') {
                // 📖 "Page Flip" - Som de página virando (0.4s)
                oscillator.type = 'sawtooth';
                const now = audioContext.currentTime;

                oscillator.frequency.setValueAtTime(200, now);
                oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.2);

                gainNode.gain.setValueAtTime(baseVolume * 0.3, now); // -10dB (UI)
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                oscillator.start(now);
                oscillator.stop(now + 0.4);
            } else if (type === 'perfect_sequence') {
                // 🕊️ "Harp Chord Ascending" - Arpejo celestial curto (1.2s)
                const now = audioContext.currentTime;

                // Primeiro acorde (C-E-G)
                const osc1 = audioContext.createOscillator();
                const osc2 = audioContext.createOscillator();
                const osc3 = audioContext.createOscillator();
                const chordGain = audioContext.createGain();

                [osc1, osc2, osc3].forEach(osc => {
                    osc.connect(chordGain);
                    osc.type = 'sine';
                });
                chordGain.connect(audioContext.destination);

                osc1.frequency.setValueAtTime(523.25, now); // C5
                osc2.frequency.setValueAtTime(659.25, now); // E5
                osc3.frequency.setValueAtTime(783.99, now); // G5

                chordGain.gain.setValueAtTime(baseVolume * 0.7, now); // -3dB (vitória)
                chordGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

                osc1.start(now);
                osc2.start(now);
                osc3.start(now);

                osc1.stop(now + 1.2);
                osc2.stop(now + 1.2);
                osc3.stop(now + 1.2);
            }
        } catch (e) {
            // Silently fail if audio not supported
        }
    }

    // Calcula tempo com base no número de palavras
    function calculateTimeForQuestion(text) {
        const words = text ? text.trim().split(/\s+/).length : 0;
        let t = Math.round(BASE_TIME + words * TIME_PER_WORD) + 5;
        if (t > MAX_TIME) t = MAX_TIME;
        if (t < 5) t = 5;
        return t;
    }

    // Atualiza barra visual do timer (usa width %)
    function setTimerVisual(percentage) {
        // utilizaremos style.setProperty em pseudoelemento não é trivial; em vez disso, mudamos background via linear-gradient e width via inner element
        timerBarElem.style.setProperty('--timer-percent', `${percentage}%`);
        timerBarElem.style.width = `${percentage}%`;
        // também alteramos cor conforme %:
        if (percentage > 60) timerBarElem.style.background = 'linear-gradient(90deg,#28a745,#7bd389)';
        else if (percentage > 30) timerBarElem.style.background = 'linear-gradient(90deg,#ffc107,#ffd479)';
        else timerBarElem.style.background = 'linear-gradient(90deg,#dc3545,#f08a8a)';
    }

    // Mostra resultados finais simples e volta para home em botão
    function finishQuiz() {
        getDOMElements(); // Garante que os elementos DOM estão disponíveis
        stopAutoNextTimer(); // Parar temporizador automático
        // construir tela de resultados simples
        const total = totalQuestions;
        let resultText = '';

        if (isStudyMode) {
            resultText = `Modo Estudo Concluído`;
        } else {
            resultText = `Quiz Finalizado!`;
        }

        const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
        const totalTimeSec = timeSpent || 0;
        const timeFormatted = totalTimeSec > 0 ? `${Math.floor(totalTimeSec / 60)}m ${Math.floor(totalTimeSec % 60)}s` : 'N/A';

        // Preenche e exibe o modal
        document.getElementById('end-game-title').textContent = resultText;
        document.getElementById('end-game-message').textContent = `Você acertou ${correctAnswers} de ${total} perguntas.`;
        document.getElementById('end-game-score').textContent = score.toFixed(2);
        document.getElementById('end-game-accuracy').textContent = `${accuracy}%`;
        document.getElementById('end-game-time').textContent = timeFormatted;

        showConfetti();
        document.getElementById('end-game-modal').classList.remove('hidden');

        // Verificar conquistas
        const quizResult = {
            mode: window.currentQuiz?.mode || 'random',
            value: window.currentQuiz?.value || '',
            difficulty: window.currentQuiz?.difficulty || 1,
            accuracy: accuracy,
            totalQuestions: total
        };
        if (window.checkAchievements) {
            window.checkAchievements(quizResult);
        }
    }

    // Função para exibir confetes (pode ser adicionada ao final do quiz.js)
    function showConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#f44336', '#ffc107', '#4caf50', '#3a6ea5', '#9c27b0'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(confetti);
        }
    }

    // Exibe pergunta atual
    function renderQuestion() {
        getDOMElements(); // Garante que os elementos DOM estão disponíveis

        console.log('renderQuestion chamada');
        console.log('questions array:', questions);
        console.log('currentIndex:', currentIndex);
        console.log('totalQuestions:', totalQuestions);

        stopAutoNextTimer(); // Parar temporizador automático da pergunta anterior
        referenceArea.classList.add('hidden');
        nextBtn.disabled = true;

        const q = questions[currentIndex];
        console.log('Pergunta atual (q):', q);

        if (!q) {
            console.log('Nenhuma pergunta encontrada, chamando finishQuiz');
            finishQuiz();
            return;
        }

        console.log('Renderizando pergunta:', q.pergunta);

        // 📖 Som de nova pergunta
        if (soundToggle && soundToggle.checked) {
            playSound('new_question');
        }

        // Atualiza progresso
        progressEl.textContent = `Pergunta ${currentIndex + 1} de ${totalQuestions}`;

        // Exibe pergunta
        questionTextEl.textContent = q.pergunta;
        console.log('Pergunta exibida no DOM:', questionTextEl.textContent);

        // Prepara opções embaralhadas
        const opts = q.opcoes.map(o => ({ text: o }));
        shuffleArray(opts);

        optionsContainer.innerHTML = '';
        opts.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${String.fromCharCode(65 + idx)}) ${opt.text}`;
            btn.dataset.answer = opt.text;
            btn.onclick = () => handleOptionClick(btn, q);
            optionsContainer.appendChild(btn);
        });

        console.log('Opções criadas:', opts.length);

        // Calcula tempo e inicia countdown (apenas se não for modo estudo)
        if (!isStudyMode) {
            const seconds = calculateTimeForQuestion(q.pergunta);
            startTimer(seconds);
        } else {
            // No modo estudo, esconder o timer
            const timerElement = document.getElementById('quiz-timer');
            if (timerElement) timerElement.style.display = 'none';
        }
    }

    // Lida com clique na opção (cinza -> 0.5s -> verde/vermelho)
    function handleOptionClick(btn, q) {
        // prevenir múltiplos cliques
        const allBtns = Array.from(optionsContainer.querySelectorAll('.option-btn'));
        if (allBtns.some(b => b.classList.contains('disabled'))) return;

        // marca selecionado visual temporário
        btn.classList.add('selected');

        // desabilita todas já ao marcar
        allBtns.forEach(b => b.classList.add('disabled'));

        // aguarda 0.5s antes de revelar
        setTimeout(() => {
            // parar timer (apenas se não for modo estudo)
            if (!isStudyMode) {
                stopTimer();
            }

            const chosen = btn.dataset.answer;
            const correct = q.resposta_correta;
            const isCorrect = chosen === correct;
            const timeAllocated = isStudyMode ? 0 : calculateTimeForQuestion(q.pergunta);
            const timeRemaining = isStudyMode ? 0 : timeLeft;
            const qId = q.id;

            // colore botões
            allBtns.forEach(b => {
                if (b.dataset.answer === correct) {
                    b.classList.add('correct');
                    if (isCorrect) playSound('correct');
                }
                if (b.dataset.answer === chosen && !isCorrect) {
                    b.classList.add('wrong');
                    playSound('wrong');
                }
            });

            // Calcular pontos avançados
            let pointsEarned = 0;
            if (isCorrect) {
                correctAnswers += 1; // Incrementar contador de acertos
                // Base: 1 ponto
                pointsEarned += 1;

                // Bônus velocidade: apenas no modo normal
                if (!isStudyMode) {
                    const speedBonus = Math.min(10, timeRemaining) * 0.01;
                    pointsEarned += speedBonus;
                }

                // Bônus streak: 0.01 por acerto consecutivo a partir do 2º
                if (currentStreak >= 1) {
                    pointsEarned += currentStreak * 0.01;
                }

                // Bônus dificuldade: apenas no modo normal
                if (!isStudyMode) {
                    const diffBonus = (q.dificuldade - 1) * 0.033; // 0 para fácil, ~0.066 para médio, ~0.1 para difícil
                    pointsEarned += diffBonus;
                }

                // Verificar se já foi acertada antes
                if (answeredQuestions.has(qId)) {
                    pointsEarned = 0; // Não ganha pontos por perguntas já acertadas
                } else {
                    answeredQuestions.add(qId);
                    currentStreak += 1;

                    // 🕊️ Som especial para sequência perfeita (3+ acertos consecutivos)
                    if (currentStreak >= 3 && soundToggle && soundToggle.checked) {
                        playSound('perfect_sequence');
                    }
                }
            } else {
                // Penalidade por erro: -0.1
                pointsEarned -= 0.1;
                questionErrors[qId] = (questionErrors[qId] || 0) + 1;
                currentStreak = 0; // Reset streak
            }

            score += pointsEarned;
            saveProgress();

            // mostrar referência e texto
            correctAnswerEl.textContent = q.resposta_correta;
            referenceTextEl.textContent = q.referencia || '';
            biblicalTextEl.textContent = q.texto_biblico || '';

            referenceArea.classList.remove('hidden');
            nextBtn.disabled = false;

            // Iniciar temporizador automático para próxima pergunta
            startAutoNextTimer();
        }, 500);
    }

    // Timer control
    function startTimer(seconds) {
        getDOMElements(); // Garante que os elementos DOM estão disponíveis
        stopTimer();
        timeLeft = seconds;
        const total = seconds;
        timerText.textContent = `${timeLeft}s`;
        setTimerVisual(100);

        timer = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft < 0) timeLeft = 0;
            timerText.textContent = `${timeLeft}s`;
            const pct = Math.round((timeLeft / total) * 100);
            setTimerVisual(pct);

            if (timeLeft <= 0) {
                // tempo esgotou: simula escolha vazia para revelar
                clearInterval(timer);
                playSound('timer');
                // Desabilita botões e revela resposta automaticamente
                const firstIncorrect = Array.from(optionsContainer.querySelectorAll('.option-btn')).find(b => !b.dataset.answer);
                // em vez disso, apenas revele a resposta:
                const allBtns = Array.from(optionsContainer.querySelectorAll('.option-btn'));
                allBtns.forEach(b => {
                    if (b.dataset.answer === questions[currentIndex].resposta_correta) b.classList.add('correct');
                });
                correctAnswerEl.textContent = questions[currentIndex].resposta_correta;
                referenceTextEl.textContent = questions[currentIndex].referencia || '';
                biblicalTextEl.textContent = questions[currentIndex].texto_biblico || '';
                referenceArea.classList.remove('hidden');
                nextBtn.disabled = false;
            }
        }, 1000);
    }

    function stopTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    // Funções para temporizador automático
    function startAutoNextTimer() {
        getDOMElements(); // Garante que os elementos DOM estão disponíveis
        stopAutoNextTimer();
        autoNextTimeLeft = 10;
        autoNextCounter.style.display = 'block';
        autoNextText.textContent = autoNextTimeLeft;

        autoNextTimeout = setInterval(() => {
            autoNextTimeLeft -= 1;
            autoNextText.textContent = autoNextTimeLeft;

            if (autoNextTimeLeft <= 0) {
                stopAutoNextTimer();
                // Avançar automaticamente para próxima pergunta
                currentIndex += 1;
                if (currentIndex >= totalQuestions) {
                    finishQuiz();
                } else {
                    renderQuestion();
                }
            }
        }, 1000);
    }

    function stopAutoNextTimer() {
        if (autoNextTimeout) {
            clearInterval(autoNextTimeout);
            autoNextTimeout = null;
        }
        if (autoNextCounter) {
            autoNextCounter.style.display = 'none';
        }
    }

    // Inicializar event listeners quando necessário
    function initEventListeners() {
        getDOMElements(); // Garante que os elementos DOM estão disponíveis

        // Próxima pergunta
        nextBtn.addEventListener('click', () => {
            stopAutoNextTimer(); // Cancelar temporizador automático
            currentIndex += 1;
            if (currentIndex >= totalQuestions) {
                finishQuiz();
            } else {
                renderQuestion();
            }
        });

        // Sair para home
        if (quitBtn) quitBtn.addEventListener('click', () => {
            stopTimer();
            stopAutoNextTimer(); // Parar temporizador automático
            window.showView('home-view');
            // reset quiz view content to original HTML by reloading page or re-rendering minimal
            window.location.reload();
        });
    }

    // Função pública para iniciar quiz
    window.originalStartQuiz = function (filter) {
        console.log('originalStartQuiz chamado com filtro:', filter);
        console.log('window.allQuestions existe:', !!window.allQuestions);
        console.log('window.allQuestions length:', window.allQuestions ? window.allQuestions.length : 'undefined');

        // filtra perguntas a partir do dataset global
        const pool = window.allQuestions || [];
        let selected = [];

        if (filter.type === 'random') {
            selected = shuffleArray(pool.slice()).slice(0, filter.value || 10);
        } else if (filter.type === 'tag') {
            selected = pool.filter(q => (q.tags || []).includes(filter.value));
        } else if (filter.type === 'difficulty') {
            selected = pool.filter(q => Number(q.dificuldade) === Number(filter.value));
        } else if (filter.type === 'study') {
            // Modo estudo: sem timer, todas as perguntas disponíveis
            selected = shuffleArray(pool.slice()).slice(0, filter.value || 10);
        } else {
            selected = pool.slice();
        }

        console.log('Perguntas selecionadas:', selected.length);
        if (selected.length > 0) {
            console.log('Primeira pergunta selecionada:', selected[0]);
        }

        if (!selected.length) {
            alert('Não há perguntas para esse filtro.');
            return;
        }

        // limita a 10 se for grande (pode ser configurado)
        if (filter.type !== 'random' && filter.type !== 'study') selected = shuffleArray(selected).slice(0, 10);

        questions = selected;
        currentIndex = 0;
        score = 0;
        currentStreak = 0;
        correctAnswers = 0; // Reset contador de acertos
        isStudyMode = filter.type === 'study'; // Flag para modo estudo
        totalQuestions = questions.length;

        console.log('Quiz configurado:', { totalQuestions, isStudyMode, currentIndex });

        // Salvar informações do quiz atual para conquistas
        window.currentQuiz = {
            mode: filter.type,
            value: filter.value,
            difficulty: filter.type === 'difficulty' ? filter.value : 1
        };

        // Inicializar event listeners
        initEventListeners();

        // restaura a quiz-view original (útil após resultados)
        window.showView('quiz-view');
        // garantir que quiz view DOM exista antes de renderizar
        setTimeout(() => {
            console.log('Chamando renderQuestion...');
            renderQuestion();
        }, 80);
    };
})();