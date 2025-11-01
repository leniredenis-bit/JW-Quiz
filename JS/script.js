// --- CONFIGURAÇÃO DOS TEMAS ---
// Para adicionar um novo tema, basta adicionar uma nova entrada aqui com 20 itens.
const THEMES = {
    animais: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉'],
    frutas: ['🍎', '🍌', '🍇', '🍓', '🍈', '🍒', '🍑', '🥝', '🥭', '🥥', '🍉', '🍊', '🍋', '🍐', '🍍', '🍇', '🍓', '🍈', '🍒', '🍑'],
    transportes: ['🚗', '🚕', '🚌', '🚑', '🚓', '🚚', '🚜', '🚲', '🛵', '✈️', '🚀', '⛵️', '🛳️', '🚆', '🚁', '🚗', '🚕', '🚌', '🚑', '🚓'],
    peixes: ['🐟', '🐠', '🐡', '🦈', '🐙', '🦑', '🦞', '🦀', '🐚', '🐳', '🐋', '🦭', '🐢', '🐊', '🦎', '🐌', '🦋', '🐛', '🐜', '🦗'],
    aves: ['🐦', '🦅', '🦉', '🦆', '🦜', '🐔', '🐧', '🦚', '🦢', '🦃', '🐓', '🦇', '🐦‍⬛', '🦤', '🐦‍🔥', '🦅', '🦉', '🦆', '🦜', '🐔'],
    numeros: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'],
    objetos: ['📱', '💻', '⌚', '📷', '🎥', '📺', '📻', '💡', '🔋', '🔌', '🛠️', '🔧', '🔨', '🪜', '📏', '📐', '📎', '✂️', '🔒', '🗝️']
};

// --- ELEMENTOS DO DOM ---
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status-display');
const playerButtons = document.querySelectorAll('.player-btn');
const themeSelect = document.getElementById('theme-select');
const difficultySelect = document.getElementById('difficulty-select');
const soundToggle = document.getElementById('sound-toggle');
const startButton = document.getElementById('start-game');

// --- ESTADO DO JOGO ---
let gameState = {
    cards: [],
    firstCard: null,
    secondCard: null,
    lockBoard: false, // Trava o tabuleiro para não virar mais de 2 cartas
    numPlayers: 1,
    currentPlayer: 0, // Índice do jogador atual (0 a 3)
    scores: [],
    pairsFound: 0,
    timer: null,
    timeLeft: 0
};

// --- FUNÇÕES DO JOGO ---

// Gera as cartas e as posiciona no tabuleiro
function createBoard() {
    gameState.pairsFound = 0;
    gameBoard.innerHTML = ''; // Limpa o tabuleiro anterior
    
    const selectedTheme = themeSelect.value;
    const selectedDifficulty = difficultySelect.value;
    const pairsCount = {easy: 10, medium: 15, hard: 20}[selectedDifficulty];
    const themeIcons = THEMES[selectedTheme].slice(0, pairsCount);
    const cardIcons = [...themeIcons, ...themeIcons]; // Duplica os ícones para formar os pares

    // Embaralha as cartas
    cardIcons.sort(() => 0.5 - Math.random());

    gameState.cards = cardIcons.map(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = icon;

        card.innerHTML = `
            <div class="card-face card-front">${icon}</div>
            <div class="card-face card-back">?</div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        return card;
    });
}

// Lógica para virar uma carta
function flipCard() {
    if (gameState.lockBoard) return;
    if (this === gameState.firstCard) return; // Não deixa clicar na mesma carta duas vezes

    this.classList.add('is-flipped');

    if (!gameState.firstCard) {
        gameState.firstCard = this;
        return;
    }

    gameState.secondCard = this;
    gameState.lockBoard = true; // Trava o tabuleiro

    checkForMatch();
}

// Verifica se as duas cartas viradas formam um par
function checkForMatch() {
    const isMatch = gameState.firstCard.dataset.icon === gameState.secondCard.dataset.icon;

    if (isMatch) {
        handleMatch();
    } else {
        unflipCards();
    }
}

// Ação quando um par é encontrado
function handleMatch() {
    gameState.scores[gameState.currentPlayer]++;
    gameState.pairsFound++;

    if (soundToggle.checked) playSound('correct'); // Som divertido para acerto

    gameState.firstCard.removeEventListener('click', flipCard);
    gameState.secondCard.removeEventListener('click', flipCard);
    
    gameState.firstCard.classList.add('is-matched');
    gameState.secondCard.classList.add('is-matched');
    
    resetTurn();
    updateStatus();

    // Verifica se o jogo acabou
    const pairsCount = {easy: 10, medium: 15, hard: 20}[difficultySelect.value];
    if (gameState.pairsFound === pairsCount) {
        setTimeout(endGame, 500);
    }
}

// Ação quando as cartas não formam um par
function unflipCards() {
    if (soundToggle.checked) playSound('incorrect'); // Som grave para erro
    gameState.firstCard.classList.add('shake');
    gameState.secondCard.classList.add('shake');
    setTimeout(() => {
        gameState.firstCard.classList.remove('is-flipped', 'shake');
        gameState.secondCard.classList.remove('is-flipped', 'shake');
        
        nextPlayer();
        resetTurn();
    }, 1200); // Tempo para o jogador ver a segunda carta
}

// Passa o turno para o próximo jogador
function nextPlayer() {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.numPlayers;
    updateStatus();
}

// Reseta as variáveis do turno
function resetTurn() {
    [gameState.firstCard, gameState.secondCard] = [null, null];
    gameState.lockBoard = false;
}

// Atualiza o placar e a mensagem de turno
function updateStatus() {
    let statusText = ``;
    for (let i = 0; i < gameState.numPlayers; i++) {
        statusText += `Jogador ${i + 1}: ${gameState.scores[i]} pontos | `;
    }
    statusText = statusText.slice(0, -2); // Remove o último " | "
    
    if (gameState.numPlayers > 1) {
        statusText += `<br>Vez do Jogador ${gameState.currentPlayer + 1}`;
    }
    
    statusDisplay.innerHTML = statusText;
}

// Atualiza o timer
function updateTimer() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    document.getElementById('timer-text').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Inicia um novo jogo
function startGame() {
    const selectedDifficulty = difficultySelect.value;
    gameState.numPlayers = gameState.numPlayers || 1;
    gameState.scores = Array(gameState.numPlayers).fill(0);
    gameState.currentPlayer = 0;
    gameState.lockBoard = false;

    if (gameState.timer) clearInterval(gameState.timer);

    if (selectedDifficulty === 'hard') {
        gameState.timeLeft = 120; // 2 minutes
        document.getElementById('timer-display').style.display = 'block';
        updateTimer();
        gameState.timer = setInterval(() => {
            gameState.timeLeft--;
            updateTimer();
            if (gameState.timeLeft <= 0) {
                clearInterval(gameState.timer);
                endGame();
            }
        }, 1000);
    } else {
        document.getElementById('timer-display').style.display = 'none';
    }

    createBoard();
    updateStatus();
}

// Finaliza o jogo e anuncia o vencedor
function endGame() {
    if (gameState.timer) clearInterval(gameState.timer);

    // Salvar estatísticas
    const selectedTheme = themeSelect.value;
    const selectedDifficulty = difficultySelect.value;
    const stats = JSON.parse(localStorage.getItem('memoryStats') || '{}');
    stats[selectedTheme] = stats[selectedTheme] || {};
    stats[selectedTheme][selectedDifficulty] = stats[selectedTheme][selectedDifficulty] || { bestTime: Infinity, bestScore: 0 };

    if (gameState.numPlayers === 1 && selectedDifficulty === 'hard') {
        const timeTaken = 120 - gameState.timeLeft;
        if (timeTaken < stats[selectedTheme][selectedDifficulty].bestTime) {
            stats[selectedTheme][selectedDifficulty].bestTime = timeTaken;
        }
    }

    const totalScore = gameState.scores.reduce((a, b) => a + b, 0);
    if (totalScore > stats[selectedTheme][selectedDifficulty].bestScore) {
        stats[selectedTheme][selectedDifficulty].bestScore = totalScore;
    }

    localStorage.setItem('memoryStats', JSON.stringify(stats));

    // Confetes
    showConfetti();

    let winnerMsg = '';
    if (gameState.numPlayers > 1) {
        const maxScore = Math.max(...gameState.scores);
        const winners = gameState.scores
            .map((score, index) => (score === maxScore ? index + 1 : -1))
            .filter(index => index !== -1);
        
        if (winners.length > 1) {
            winnerMsg = `Fim de jogo! Empate entre os jogadores: ${winners.join(' e ')}!`;
        } else {
            winnerMsg = `Fim de jogo! O Jogador ${winners[0]} venceu!`;
        }
    } else {
        winnerMsg = 'Parabéns, você completou o jogo!';
    }
    statusDisplay.innerHTML = winnerMsg;
}

// Event Listeners
startButton.addEventListener('click', startGame);

// Event listeners para botões de jogadores
playerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        playerButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.numPlayers = parseInt(btn.dataset.players);
    });
});

// Mostra confetes
function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti-container');
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 3000);
}