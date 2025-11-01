// --- CONFIGURAÇÃO DOS TEMAS ---
// Para adicionar um novo tema, basta adicionar uma nova entrada aqui com 15 itens.
const THEMES = {
    animais: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
    frutas: ['🍎', '🍌', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥝', '🥭', '🥥', '🍉', '🍊', '🍋', '🍐'],
    transportes: ['🚗', '🚕', '🚌', '🚑', '🚓', '🚚', '🚜', '🚲', '🛵', '✈️', '🚀', '⛵️', '🛳️', '🚆', '🚁']
};

// --- ELEMENTOS DO DOM ---
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status-display');
const playerCountInput = document.getElementById('player-count');
const themeSelect = document.getElementById('theme-select');
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
    pairsFound: 0
};

// --- FUNÇÕES DO JOGO ---

// Gera as cartas e as posiciona no tabuleiro
function createBoard() {
    gameState.pairsFound = 0;
    gameBoard.innerHTML = ''; // Limpa o tabuleiro anterior
    
    const selectedTheme = themeSelect.value;
    const themeIcons = THEMES[selectedTheme];
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

    playSound('correct'); // Som divertido para acerto

    gameState.firstCard.removeEventListener('click', flipCard);
    gameState.secondCard.removeEventListener('click', flipCard);
    
    gameState.firstCard.classList.add('is-matched');
    gameState.secondCard.classList.add('is-matched');
    
    resetTurn();
    updateStatus();

    // Verifica se o jogo acabou
    if (gameState.pairsFound === 15) {
        setTimeout(endGame, 500);
    }
}

// Ação quando as cartas não formam um par
function unflipCards() {
    playSound('incorrect'); // Som grave para erro
    setTimeout(() => {
        gameState.firstCard.classList.remove('is-flipped');
        gameState.secondCard.classList.remove('is-flipped');
        
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

// Inicia um novo jogo
function startGame() {
    gameState.numPlayers = parseInt(playerCountInput.value);
    gameState.scores = Array(gameState.numPlayers).fill(0);
    gameState.currentPlayer = 0;
    gameState.lockBoard = false;

    createBoard();
    updateStatus();
}

// Finaliza o jogo e anuncia o vencedor
function endGame() {
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

// Inicia o jogo pela primeira vez ao carregar a página
startGame();