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

    // DOM - só buscar quando necessário
    let progressEl, questionTextEl, optionsContainer, timerBarElem, timerText, referenceArea, correctAnswerEl, referenceTextEl, biblicalTextEl, nextBtn, quitBtn;

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
        }
    }

    // Audio feedback
    function playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (type === 'correct') {
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } else if (type === 'wrong') {
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } else if (type === 'timer') {
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
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
    function showResults() {
        getDOMElements(); // Garante que os elementos DOM estão disponíveis
        // construir tela de resultados simples
        const total = totalQuestions;
        const html = `
            <div style="text-align:center;padding:1rem;">
                <h2>Resultado</h2>
                <p style="font-size:1.1rem">Você marcou <strong>${score.toFixed(2)}</strong> pontos em ${total} perguntas.</p>
                <p>Streak máximo: ${currentStreak}</p>
                <button id="play-again" class="btn btn-primary">Jogar Novamente</button>
                <button id="back-home" class="btn btn-link">Voltar</button>
            </div>
        `;
        // mostrar em quiz-view (substitui conteúdo)
        const quizView = document.getElementById('quiz-view');
        quizView.innerHTML = html;
        document.getElementById('play-again').addEventListener('click', () => window.location.reload());
        document.getElementById('back-home').addEventListener('click', () => window.showView('home-view'));
    }

    // Exibe pergunta atual
    function renderQuestion() {
        getDOMElements(); // Garante que os elementos DOM estão disponíveis

        referenceArea.classList.add('hidden');
        nextBtn.disabled = true;

        const q = questions[currentIndex];
        if (!q) {
            showResults();
            return;
        }

        // Atualiza progresso
        progressEl.textContent = `Pergunta ${currentIndex + 1} de ${totalQuestions}`;

        // Exibe pergunta
        questionTextEl.textContent = q.pergunta;

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

        // Calcula tempo e inicia countdown
        const seconds = calculateTimeForQuestion(q.pergunta);
        startTimer(seconds);
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
            // parar timer
            stopTimer();

            const chosen = btn.dataset.answer;
            const correct = q.resposta_correta;
            const isCorrect = chosen === correct;
            const timeAllocated = calculateTimeForQuestion(q.pergunta);
            const timeRemaining = timeLeft;
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
                // Base: 1 ponto
                pointsEarned += 1;

                // Bônus velocidade: até 0.1, 0.01 por segundo restante (máx 10s)
                const speedBonus = Math.min(10, timeRemaining) * 0.01;
                pointsEarned += speedBonus;

                // Bônus streak: 0.01 por acerto consecutivo a partir do 2º
                if (currentStreak >= 1) {
                    pointsEarned += currentStreak * 0.01;
                }

                // Bônus dificuldade: até 0.1 dependendo da dificuldade
                const diffBonus = (q.dificuldade - 1) * 0.033; // 0 para fácil, ~0.066 para médio, ~0.1 para difícil
                pointsEarned += diffBonus;

                // Verificar se já foi acertada antes
                if (answeredQuestions.has(qId)) {
                    pointsEarned = 0; // Não ganha pontos por perguntas já acertadas
                } else {
                    answeredQuestions.add(qId);
                    currentStreak += 1;
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

    // Inicializar event listeners quando necessário
    function initEventListeners() {
        getDOMElements(); // Garante que os elementos DOM estão disponíveis

        // Próxima pergunta
        nextBtn.addEventListener('click', () => {
            currentIndex += 1;
            if (currentIndex >= totalQuestions) {
                showResults();
            } else {
                renderQuestion();
            }
        });

        // Sair para home
        if (quitBtn) quitBtn.addEventListener('click', () => {
            stopTimer();
            window.showView('home-view');
            // reset quiz view content to original HTML by reloading page or re-rendering minimal
            window.location.reload();
        });
    }

    // Função pública para iniciar quiz
    window.originalStartQuiz = function (filter) {
        // filtra perguntas a partir do dataset global
        const pool = window.allQuestions || [];
        let selected = [];

        if (filter.type === 'random') {
            selected = shuffleArray(pool.slice()).slice(0, filter.value || 10);
        } else if (filter.type === 'tag') {
            selected = pool.filter(q => (q.tags || []).includes(filter.value));
        } else if (filter.type === 'difficulty') {
            selected = pool.filter(q => Number(q.dificuldade) === Number(filter.value));
        } else {
            selected = pool.slice();
        }

        if (!selected.length) {
            alert('Não há perguntas para esse filtro.');
            return;
        }

        // limita a 10 se for grande (pode ser configurado)
        if (filter.type !== 'random') selected = shuffleArray(selected).slice(0, 10);

        questions = selected;
        currentIndex = 0;
        score = 0;
        currentStreak = 0;
        totalQuestions = questions.length;

        // Inicializar event listeners
        initEventListeners();

        // restaura a quiz-view original (útil após resultados)
        window.showView('quiz-view');
        // garantir que quiz view DOM exista antes de renderizar
        setTimeout(() => renderQuestion(), 80);
    };
})();