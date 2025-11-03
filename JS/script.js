// --- CONFIGURAÇÃO DOS TEMAS ---
// Para adicionar um novo tema, basta adicionar uma nova entrada aqui com 20 itens.
const THEMES = {
    animais: [
        { name: 'Cachorro', emoji: '🐶' }, { name: 'Gato', emoji: '🐱' }, { name: 'Rato', emoji: '🐭' }, { name: 'Hamster', emoji: '🐹' },
        { name: 'Coelho', emoji: '🐰' }, { name: 'Raposa', emoji: '🦊' }, { name: 'Urso', emoji: '🐻' }, { name: 'Panda', emoji: '🐼' },
        { name: 'Coalá', emoji: '🐨' }, { name: 'Tigre', emoji: '🐯' }, { name: 'Leão', emoji: '🦁' }, { name: 'Vaca', emoji: '🐮' },
        { name: 'Porco', emoji: '🐷' }, { name: 'Sapo', emoji: '🐸' }, { name: 'Macaco', emoji: '🐵' }, { name: 'Galinha', emoji: '🐔' },
        { name: 'Pinguim', emoji: '🐧' }, { name: 'Pássaro', emoji: '🐦' }, { name: 'Pato', emoji: '🦆' }, { name: 'Coruja', emoji: '🦉' },
        { name: 'Lobo', emoji: '🐺' }, { name: 'Javali', emoji: '🐗' }, { name: 'Cavalo', emoji: '🐴' }, { name: 'Unicórnio', emoji: '🦄' },
        { name: 'Abelha', emoji: '🐝' }, { name: 'Lagarta', emoji: '🐛' }, { name: 'Borboleta', emoji: '🦋' }, { name: 'Lesma', emoji: '🐌' },
        { name: 'Joaninha', emoji: '🐞' }, { name: 'Formiga', emoji: '🐜' }
    ],
    frutas: [
        { name: 'Maçã', emoji: '�' }, { name: 'Banana', emoji: '�' }, { name: 'Uva', emoji: '�' }, { name: 'Morango', emoji: '🍓' },
        { name: 'Melão', emoji: '🍈' }, { name: 'Cereja', emoji: '�' }, { name: 'Pêssego', emoji: '�' }, { name: 'Kiwi', emoji: '🥝' },
        { name: 'Manga', emoji: '🥭' }, { name: 'Coco', emoji: '🥥' }, { name: 'Melancia', emoji: '�' }, { name: 'Laranja', emoji: '�' },
        { name: 'Limão', emoji: '🍋' }, { name: 'Pêra', emoji: '�' }, { name: 'Abacaxi', emoji: '�' }
    ],
    transportes: [
        { name: 'Carro', emoji: '�' }, { name: 'Táxi', emoji: '�' }, { name: 'Ônibus', emoji: '�' }, { name: 'Ambulância', emoji: '�' },
        { name: 'Carro de Polícia', emoji: '�' }, { name: 'Caminhão', emoji: '�' }, { name: 'Trator', emoji: '�' }, { name: 'Bicicleta', emoji: '�' },
        { name: 'Moto', emoji: '�' }, { name: 'Avião', emoji: '✈️' }, { name: 'Foguete', emoji: '�' }, { name: 'Barco', emoji: '⛵️' },
        { name: 'Navio', emoji: '🛳️' }, { name: 'Trem', emoji: '🚆' }, { name: 'Helicóptero', emoji: '🚁' }
    ],
    peixes: [
        { name: 'Peixe', emoji: '🐟' }, { name: 'Peixe Tropical', emoji: '�' }, { name: 'Baiacu', emoji: '�' }, { name: 'Tubarão', emoji: '�' },
        { name: 'Polvo', emoji: '�' }, { name: 'Lula', emoji: '🦑' }, { name: 'Lagosta', emoji: '🦞' }, { name: 'Caranguejo', emoji: '�' },
        { name: 'Concha', emoji: '🐚' }, { name: 'Baleia', emoji: '�' }, { name: 'Orca', emoji: '�' }, { name: 'Foca', emoji: '�' },
        { name: 'Tartaruga', emoji: '🐢' }, { name: 'Crocodilo', emoji: '🐊' }, { name: 'Lagarto', emoji: '🦎' }
    ],
    aves: [
        { name: 'Pássaro', emoji: '🐦' }, { name: 'Águia', emoji: '�' }, { name: 'Coruja', emoji: '�' }, { name: 'Pato', emoji: '🦆' },
        { name: 'Papagaio', emoji: '�' }, { name: 'Galinha', emoji: '�' }, { name: 'Pinguim', emoji: '�' }, { name: 'Pavão', emoji: '🦚' },
        { name: 'Cisne', emoji: '�' }, { name: 'Peru', emoji: '�' }, { name: 'Galo', emoji: '�' }, { name: 'Morcego', emoji: '�' },
        { name: 'Pardal', emoji: '�‍⬛' }, { name: 'Dodô', emoji: '🦤' }, { name: 'Fênix', emoji: '🐦‍🔥' }
    ],
    numeros: [
        { name: 'Um', emoji: '1️⃣' }, { name: 'Dois', emoji: '2️⃣' }, { name: 'Três', emoji: '3️⃣' }, { name: 'Quatro', emoji: '4️⃣' },
        { name: 'Cinco', emoji: '5️⃣' }, { name: 'Seis', emoji: '6️⃣' }, { name: 'Sete', emoji: '7️⃣' }, { name: 'Oito', emoji: '8️⃣' },
        { name: 'Nove', emoji: '9️⃣' }, { name: 'Dez', emoji: '🔟' }, { name: 'Zero', emoji: '0️⃣' }
    ],
    objetos: [
        { name: 'Celular', emoji: '📱' }, { name: 'Computador', emoji: '💻' }, { name: 'Relógio', emoji: '⌚' }, { name: 'Câmera', emoji: '📷' },
        { name: 'Câmera de Vídeo', emoji: '🎥' }, { name: 'Televisão', emoji: '�' }, { name: 'Rádio', emoji: '�' }, { name: 'Lâmpada', emoji: '�' },
        { name: 'Bateria', emoji: '�' }, { name: 'Tomada', emoji: '🔌' }, { name: 'Caixa de Ferramentas', emoji: '🛠️' }, { name: 'Chave Inglesa', emoji: '�' },
        { name: 'Martelo', emoji: '�' }, { name: 'Escada', emoji: '🪜' }, { name: 'Régua', emoji: '�' }, { name: 'Esquadro', emoji: '�' },
        { name: 'Clips', emoji: '�' }, { name: 'Tesoura', emoji: '✂️' }, { name: 'Cadeado', emoji: '�' }, { name: 'Chave', emoji: '�️' }
    ],
    natureza: [
        { name: 'Flor de Cerejeira', emoji: '🌸' }, { name: 'Flor', emoji: '🌺' }, { name: 'Girassol', emoji: '�' }, { name: 'Flor', emoji: '�' },
        { name: 'Rosa', emoji: '�' }, { name: 'Margarida', emoji: '�' }, { name: 'Folha', emoji: '�' }, { name: 'Trevo', emoji: '�' },
        { name: 'Árvore', emoji: '�' }, { name: 'Pinheiro', emoji: '�' }, { name: 'Palmeira', emoji: '�' }, { name: 'Cacto', emoji: '�' },
        { name: 'Trigo', emoji: '�' }, { name: 'Broto', emoji: '�' }, { name: 'Cogumelo', emoji: '�' }, { name: 'Castanha', emoji: '�' }
    ]
};

// --- ELEMENTOS DO DOM ---
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status-display');
const playerButtons = document.querySelectorAll('.player-btn');
const themeSelect = document.getElementById('theme-select');
const difficultySelect = document.getElementById('difficulty-select');
const soundToggle = document.getElementById('sound-toggle');
const startButton = document.getElementById('start-game');

// Estado do jogo da memória
let gameState = {
    cards: [],
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    pairsFound: 0,
    numPlayers: 1,
    currentPlayer: 0,
    scores: [0],
    timer: null,
    timeLeft: 0
};

// Elementos das sub-views
const memoryMenu = null; // Removido - não existe mais
const memoryConfig = document.getElementById('memory-config');
const memoryGame = document.getElementById('memory-game');
const configGameBtn = null; // Removido - não existe mais
const backToMenuBtn = null; // Removido - não existe mais
const backToConfigBtn = document.getElementById('back-to-config');
const restartGameBtn = document.getElementById('restart-game');

// Função auxiliar para debug - mostra a cadeia de elementos pai
function getParentChain(element) {
    const chain = [];
    let current = element;
    while (current && current !== document.body) {
        chain.push(`${current.tagName}${current.id ? '#' + current.id : ''}${current.className ? '.' + current.className.split(' ').join('.') : ''}`);
        current = current.parentElement;
    }
    return chain.join(' > ');
}

// --- FUNÇÕES DE NAVEGAÇÃO DAS SUB-VIEWS ---
function hideAllMemorySubviews() {
    memoryConfig.classList.remove('active');
    memoryGame.classList.remove('active');
}

function showMemoryMenu() {
    showMemoryConfig();
}

function showMemoryConfig() {
    hideAllMemorySubviews();
    memoryConfig.classList.add('active');
}

function showMemoryGame() {
    hideAllMemorySubviews();
    memoryGame.classList.add('active');
}

// Tornar funções globais para serem acessíveis pelo main.js
window.showMemoryMenu = showMemoryMenu;
window.showMemoryConfig = showMemoryConfig;
window.showMemoryGame = showMemoryGame;

// --- FUNÇÕES DO JOGO ---

// Gera as cartas e as posiciona no tabuleiro
function createBoard() {
    gameState.pairsFound = 0;
    gameBoard.innerHTML = ''; // Limpa o tabuleiro anterior
    
    const selectedTheme = themeSelect.value;
    const selectedDifficulty = difficultySelect.value;
    const pairsCount = {easy: 10, medium: 15, hard: 20}[selectedDifficulty];
    
    const themeItems = THEMES[selectedTheme].slice(0, pairsCount);
    const cardItems = [...themeItems, ...themeItems]; // Duplica os itens para formar os pares

    // Embaralha as cartas
    cardItems.sort(() => 0.5 - Math.random());

    gameState.cards = cardItems.map(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = item.emoji; // Mantém compatibilidade com código existente
        card.dataset.name = item.name;

        card.innerHTML = `
            <div class="card-face card-front">
                <div class="card-emoji">${item.emoji}</div>
                <div class="card-name">${item.name}</div>
            </div>
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

    // 🔄 Pop click: som leve para virar carta
    if (soundToggle.checked) playSound('flip');

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

    // Adicionar checkmark verde nas cartas
    const checkmark1 = document.createElement('div');
    checkmark1.className = 'card-checkmark';
    checkmark1.innerHTML = '✓';
    gameState.firstCard.appendChild(checkmark1);

    const checkmark2 = document.createElement('div');
    checkmark2.className = 'card-checkmark';
    checkmark2.innerHTML = '✓';
    gameState.secondCard.appendChild(checkmark2);

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
        document.getElementById('timer-display').style.display = 'flex';
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

    // 🎉 Short fanfarra: som celebratório para fim do jogo
    if (soundToggle.checked) playSound('game_complete');

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

// Aguardar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // Usar event delegation para garantir que os cliques funcionem mesmo em elementos inicialmente ocultos
    const memoryView = document.getElementById('memory-view');

    if (memoryView) {
        memoryView.addEventListener('click', function(e) {

            if (e.target.id === 'config-game-btn') {
                e.preventDefault();
            } else if (e.target.id === 'back-to-menu') {
                e.preventDefault();
            } else if (e.target.id === 'start-game') {
                e.preventDefault();
                startGame();
                showMemoryGame();
            } else if (e.target.id === 'back-to-config') {
                e.preventDefault();
                showMemoryConfig();
            } else if (e.target.id === 'restart-game') {
                e.preventDefault();
                startGame();
                showMemoryGame();
            }
        });
    }

    // Verificar se os elementos das sub-views existem

    // Adicionar funcionalidade aos botões de jogadores
    setupPlayerButtons();
});

// Configurar botões de jogadores
function setupPlayerButtons() {
    const playerButtons = document.querySelectorAll('.player-btn');
    playerButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            playerButtons.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            this.classList.add('active');

            // Atualizar número de jogadores no gameState
            const numPlayers = parseInt(this.dataset.players);
            gameState.numPlayers = numPlayers;
        });
    });
}

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

// Função para tocar sons (placeholder - pode ser substituído por arquivos de áudio reais)
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'correct') {
            // ✨ Sparkle ding: som mágico e brilhante para par encontrado
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime); // Sol5
            oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.1); // Dó6
            oscillator.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.2); // Mi6
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.4);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.4);
        } else if (type === 'incorrect') {
            // 🎵 Pluck down: som descendente suave para erro
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(220.00, audioContext.currentTime); // Lá3
            oscillator.frequency.exponentialRampToValueAtTime(110.00, audioContext.currentTime + 0.3); // Lá2
            gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } else if (type === 'flip') {
            // 🔄 Pop click: som rápido e leve para virar carta
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } else if (type === 'game_complete') {
            // 🎉 Short fanfarra: sequência celebratória para fim do jogo
            const notes = [523.25, 659.25, 783.99, 1046.50]; // Dó5, Mi5, Sol5, Dó6
            notes.forEach((freq, index) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
                gain.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + index * 0.15 + 0.2);
                osc.start(audioContext.currentTime + index * 0.15);
                osc.stop(audioContext.currentTime + index * 0.15 + 0.2);
            });
        }
    } catch (e) {
        // Silently fail if Web Audio API is not supported
    }
}