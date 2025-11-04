/* =================
   MEMORY GAME THEMES
   ================= */
// Para adicionar um novo tema, basta adicionar uma nova entrada aqui com 20 itens.
const THEMES = {
    animais: [
        { name: 'Cachorro', emoji: '🐶' },
        { name: 'Gato', emoji: '🐱' },
        { name: 'Rato', emoji: '🐭' },
        { name: 'Hamster', emoji: '🐹' },
        { name: 'Coelho', emoji: '🐰' },
        { name: 'Raposa', emoji: '🦊' },
        { name: 'Urso', emoji: '🐻' },
        { name: 'Panda', emoji: '🐼' },
        { name: 'Coalá', emoji: '🐨' },
        { name: 'Tigre', emoji: '🐯' },
        { name: 'Leão', emoji: '🦁' },
        { name: 'Vaca', emoji: '🐮' },
        { name: 'Porco', emoji: '🐷' },
        { name: 'Sapo', emoji: '🐸' },
        { name: 'Macaco', emoji: '🐵' },
        { name: 'Galinha', emoji: '🐔' },
        { name: 'Pinguim', emoji: '🐧' },
        { name: 'Pássaro', emoji: '🐦' },
        { name: 'Pato', emoji: '🦆' },
        { name: 'Coruja', emoji: '🦉' }
    ],
    frutas: [
        { name: 'Maçã', emoji: '🍎' },
        { name: 'Banana', emoji: '🍌' },
        { name: 'Uva', emoji: '🍇' },
        { name: 'Morango', emoji: '🍓' },
        { name: 'Melão', emoji: '🍈' },
        { name: 'Cereja', emoji: '🍒' },
        { name: 'Pêssego', emoji: '🍑' },
        { name: 'Kiwi', emoji: '🥝' },
        { name: 'Manga', emoji: '🥭' },
        { name: 'Coco', emoji: '🥥' },
        { name: 'Melancia', emoji: '🍉' },
        { name: 'Laranja', emoji: '🍊' },
        { name: 'Limão', emoji: '🍋' },
        { name: 'Pêra', emoji: '🍐' },
        { name: 'Abacaxi', emoji: '🍍' },
        { name: 'Abacate', emoji: '🥑' },
        { name: 'Amora', emoji: '🫐' },
        { name: 'Figo', emoji: '🥒' },
        { name: 'Romã', emoji: '🍅' },
        { name: 'Tangerina', emoji: '🍊' }
    ],
    transportes: [
        { name: 'Carro', emoji: '🚗' },
        { name: 'Táxi', emoji: '🚕' },
        { name: 'Ônibus', emoji: '🚌' },
        { name: 'Ambulância', emoji: '🚑' },
        { name: 'Polícia', emoji: '🚓' },
        { name: 'Caminhão', emoji: '🚚' },
        { name: 'Trator', emoji: '🚜' },
        { name: 'Bicicleta', emoji: '🚲' },
        { name: 'Moto', emoji: '🏍️' },
        { name: 'Avião', emoji: '✈️' },
        { name: 'Foguete', emoji: '🚀' },
        { name: 'Barco', emoji: '⛵' },
        { name: 'Navio', emoji: '🚢' },
        { name: 'Trem', emoji: '🚂' },
        { name: 'Helicóptero', emoji: '🚁' },
        { name: 'Patinete', emoji: '🛴' },
        { name: 'Monociclo', emoji: '🚲' },
        { name: 'Teleférico', emoji: '🚠' },
        { name: 'Trólebus', emoji: '🚎' },
        { name: 'Vagão', emoji: '🚃' }
    ],
    peixes: [
        { name: 'Peixe', emoji: '🐟' },
        { name: 'Peixe Tropical', emoji: '🐠' },
        { name: 'Baiacu', emoji: '🐡' },
        { name: 'Tubarão', emoji: '🦈' },
        { name: 'Polvo', emoji: '🐙' },
        { name: 'Lula', emoji: '🦑' },
        { name: 'Lagosta', emoji: '🦞' },
        { name: 'Caranguejo', emoji: '🦀' },
        { name: 'Concha', emoji: '🐚' },
        { name: 'Baleia', emoji: '🐋' },
        { name: 'Orca', emoji: '🐳' },
        { name: 'Foca', emoji: '🦭' },
        { name: 'Tartaruga', emoji: '🐢' },
        { name: 'Crocodilo', emoji: '🐊' },
        { name: 'Lagarto', emoji: '🦎' },
        { name: 'Sapo', emoji: '🐸' },
        { name: 'Rã', emoji: '🐸' },
        { name: 'Salamandra', emoji: '🦎' },
        { name: 'Enguia', emoji: '🐍' },
        { name: 'Estrela-do-mar', emoji: '⭐' }
    ],
    aves: [
        { name: 'Pássaro', emoji: '🐦' },
        { name: 'Águia', emoji: '🦅' },
        { name: 'Coruja', emoji: '🦉' },
        { name: 'Pato', emoji: '🦆' },
        { name: 'Papagaio', emoji: '🦜' },
        { name: 'Galinha', emoji: '🐔' },
        { name: 'Pinguim', emoji: '🐧' },
        { name: 'Pavão', emoji: '🦚' },
        { name: 'Cisne', emoji: '🦢' },
        { name: 'Peru', emoji: '🦃' },
        { name: 'Galo', emoji: '🐓' },
        { name: 'Morcego', emoji: '🦇' },
        { name: 'Pardal', emoji: '🐦' },
        { name: 'Dodô', emoji: '🦤' },
        { name: 'Fênix', emoji: '🔥' },
        { name: 'Flamingo', emoji: '🦩' },
        { name: 'Tucano', emoji: '🦜' },
        { name: 'Arara', emoji: '🦜' },
        { name: 'Canário', emoji: '🐤' },
        { name: 'Pombo', emoji: '🕊️' }
    ],
    numeros: [
        { name: 'Um', emoji: '1️⃣' },
        { name: 'Dois', emoji: '2️⃣' },
        { name: 'Três', emoji: '3️⃣' },
        { name: 'Quatro', emoji: '4️⃣' },
        { name: 'Cinco', emoji: '5️⃣' },
        { name: 'Seis', emoji: '6️⃣' },
        { name: 'Sete', emoji: '7️⃣' },
        { name: 'Oito', emoji: '8️⃣' },
        { name: 'Nove', emoji: '9️⃣' },
        { name: 'Dez', emoji: '🔟' },
        { name: 'Zero', emoji: '0️⃣' },
        { name: 'Onze', emoji: '🔢' },
        { name: 'Doze', emoji: '🔢' },
        { name: 'Vinte', emoji: '🔢' },
        { name: 'Cem', emoji: '💯' },
        { name: 'Mil', emoji: '🔢' },
        { name: 'Sinal de +', emoji: '➕' },
        { name: 'Sinal de -', emoji: '➖' },
        { name: 'Sinal de x', emoji: '✖️' },
        { name: 'Sinal de ÷', emoji: '➗' }
    ],
    objetos: [
        { name: 'Celular', emoji: '📱' },
        { name: 'Computador', emoji: '💻' },
        { name: 'Relógio', emoji: '⌚' },
        { name: 'Câmera', emoji: '📷' },
        { name: 'Câmera de Vídeo', emoji: '📹' },
        { name: 'Televisão', emoji: '📺' },
        { name: 'Rádio', emoji: '📻' },
        { name: 'Lâmpada', emoji: '💡' },
        { name: 'Bateria', emoji: '🔋' },
        { name: 'Tomada', emoji: '🔌' },
        { name: 'Caixa de Ferramentas', emoji: '🧰' },
        { name: 'Chave Inglesa', emoji: '🔧' },
        { name: 'Martelo', emoji: '🔨' },
        { name: 'Escada', emoji: '🪜' },
        { name: 'Régua', emoji: '📏' },
        { name: 'Esquadro', emoji: '📐' },
        { name: 'Clips', emoji: '📎' },
        { name: 'Tesoura', emoji: '✂️' },
        { name: 'Cadeado', emoji: '🔒' },
        { name: 'Chave', emoji: '🔑' }
    ],
    natureza: [
        { name: 'Cerejeira', emoji: '🌸' },
        { name: 'Flor', emoji: '🌺' },
        { name: 'Girassol', emoji: '🌻' },
        { name: 'Margarida', emoji: '🌼' },
        { name: 'Rosa', emoji: '🌹' },
        { name: 'Folha', emoji: '🍃' },
        { name: 'Trevo', emoji: '☘️' },
        { name: 'Árvore', emoji: '🌳' },
        { name: 'Pinheiro', emoji: '🌲' },
        { name: 'Palmeira', emoji: '🌴' },
        { name: 'Cacto', emoji: '🌵' },
        { name: 'Trigo', emoji: '🌾' },
        { name: 'Broto', emoji: '🌱' },
        { name: 'Cogumelo', emoji: '🍄' },
        { name: 'Castanha', emoji: '🌰' },
        { name: 'Vulcão', emoji: '🌋' },
        { name: 'Montanha', emoji: '⛰️' },
        { name: 'Lua', emoji: '🌙' },
        { name: 'Sol', emoji: '☀️' },
        { name: 'Arco-íris', emoji: '🌈' }
    ]
};

/* ================================================
   MEMORY GAME 2.0 - CENTRALIZED STATE & MODERN PATTERNS
   ================================================ */

// --- DOM ELEMENTS (Cached for performance) ---
const DOM = {
    gameBoard: document.getElementById('game-board'),
    statusDisplay: document.getElementById('status-display'),
    themeSelect: document.getElementById('theme-select'),
    soundToggle: document.getElementById('sound-toggle'),
    timerDisplay: document.getElementById('timer-display'),
    timerText: document.getElementById('timer-text'),
    memoryView: document.getElementById('memory-view'),
    memoryConfig: document.getElementById('memory-config'),
    memoryGame: document.getElementById('memory-game')
};

// --- CENTRALIZED GAME STATE ---
const gameState = {
    // Card management
    cards: [],
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    
    // Game progress
    pairsFound: 0,
    totalPairs: 0,
    
    // Player management
    numPlayers: 1,
    currentPlayer: 0,
    scores: [0],
    
    // Timer (hard mode)
    timer: null,
    timeLeft: 0,
    
    // Settings
    difficulty: 'medium',
    theme: 'animais',
    soundEnabled: true,
    
    // Game status
    isGameActive: false,
    
    // Reset function
    reset() {
        this.cards = [];
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.pairsFound = 0;
        this.totalPairs = 0;
        this.currentPlayer = 0;
        this.scores = Array(this.numPlayers).fill(0);
        this.timeLeft = 0;
        this.isGameActive = false;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
};

/* ================================================
   NAVIGATION & VIEW MANAGEMENT
   ================================================ */
/**
 * Hides all memory game subviews
 */
function hideAllMemorySubviews() {
    DOM.memoryConfig?.classList.remove('active');
    DOM.memoryGame?.classList.remove('active');
}

/**
 * Shows memory menu (alias for config)
 */
function showMemoryMenu() {
    showMemoryConfig();
}

/**
 * Shows configuration screen
 */
function showMemoryConfig() {
    hideAllMemorySubviews();
    DOM.memoryConfig?.classList.add('active');
}

/**
 * Shows game board screen
 */
function showMemoryGame() {
    hideAllMemorySubviews();
    DOM.memoryGame?.classList.add('active');
}

// Export functions to global scope for main.js
window.showMemoryMenu = showMemoryMenu;
window.showMemoryConfig = showMemoryConfig;
window.showMemoryGame = showMemoryGame;

/* ================================================
   GAME BOARD MANAGEMENT
   ================================================ */

/**
 * Difficulty settings
 */
const DIFFICULTY_CONFIG = {
    easy: { pairs: 10, time: 0 },
    medium: { pairs: 15, time: 0 },
    hard: { pairs: 20, time: 120 }
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Creates and renders the game board
 */
function createBoard() {
    if (!DOM.gameBoard) return;
    
    // Clear previous board
    DOM.gameBoard.innerHTML = '';
    
    // Get configuration
    const { pairs } = DIFFICULTY_CONFIG[gameState.difficulty];
    gameState.totalPairs = pairs;
    gameState.pairsFound = 0;
    
    // Get theme items and create pairs with unique IDs
    const themeItems = THEMES[gameState.theme].slice(0, pairs);
    
    // Add pairId to each item before duplicating
    const itemsWithIds = themeItems.map((item, index) => ({
        ...item,
        pairId: index
    }));
    
    // Duplicate items to create pairs
    const cardItems = shuffleArray([...itemsWithIds, ...itemsWithIds]);
    
    // Create card elements
    const fragment = document.createDocumentFragment();
    
    gameState.cards = cardItems.map(item => {
        const card = createCardElement(item);
        fragment.appendChild(card);
        return card;
    });
    
    DOM.gameBoard.appendChild(fragment);
}

/**
 * Creates a single card element
 * @param {Object} item - Card data {name, emoji, pairId}
 * @returns {HTMLElement} Card element
 */
function createCardElement(item) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.pairId = item.pairId; // Use the pairId from the item
    card.dataset.icon = item.emoji;
    card.dataset.name = item.name;
    
    card.innerHTML = `
        <div class="memory-card-front">
            <div class="memory-animal">${item.emoji}</div>
            <div class="memory-name">${item.name}</div>
        </div>
        <div class="memory-card-back">🎯</div>
    `;
    
    card.addEventListener('click', flipCard);
    return card;
}

/* ================================================
   CARD FLIP LOGIC
   ================================================ */

/**
 * Handles card flip interaction
 */
function flipCard() {
    // Guard clauses
    if (gameState.lockBoard) return;
    if (this === gameState.firstCard) return;
    if (this.classList.contains('matched')) return;
    
    // Flip the card
    this.classList.add('flipped');
    playSound('flip');
    
    // First card selection
    if (!gameState.firstCard) {
        gameState.firstCard = this;
        return;
    }
    
    // Second card selection
    gameState.secondCard = this;
    gameState.lockBoard = true;
    
    checkForMatch();
}

/**
 * Checks if two flipped cards match
 */
function checkForMatch() {
    const isMatch = gameState.firstCard.dataset.pairId === gameState.secondCard.dataset.pairId;
    
    if (isMatch) {
        handleMatch();
    } else {
        handleMismatch();
    }
}

/**
 * Handles when cards match
 */
function handleMatch() {
    // Update scores
    gameState.scores[gameState.currentPlayer]++;
    gameState.pairsFound++;
    
    // Visual feedback
    gameState.firstCard.classList.add('matched');
    gameState.secondCard.classList.add('matched');
    
    // Audio feedback
    playSound('correct');
    
    // Reset for next turn
    resetTurn();
    updateStatus();
    
    // Check for game completion
    if (gameState.pairsFound === gameState.totalPairs) {
        setTimeout(endGame, 500);
    }
}

/**
 * Handles when cards don't match
 */
function handleMismatch() {
    playSound('incorrect');
    
    // Visual feedback
    gameState.firstCard.classList.add('shake');
    gameState.secondCard.classList.add('shake');
    
    // Unflip after delay
    setTimeout(() => {
        gameState.firstCard.classList.remove('flipped', 'shake');
        gameState.secondCard.classList.remove('flipped', 'shake');
        
        // Next player's turn (if multiplayer)
        if (gameState.numPlayers > 1) {
            nextPlayer();
        }
        
        resetTurn();
    }, 1200);
}

/* ================================================
   GAME STATE MANAGEMENT
   ================================================ */

/**
 * Passes turn to next player (multiplayer)
 */
function nextPlayer() {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.numPlayers;
    updateStatus();
}

/**
 * Resets turn variables
 */
function resetTurn() {
    gameState.firstCard = null;
    gameState.secondCard = null;
    gameState.lockBoard = false;
}

/**
 * Updates score display and current player
 */
function updateStatus() {
    if (!DOM.statusDisplay) return;
    
    // Build score text
    const scores = gameState.scores
        .map((score, i) => `Jogador ${i + 1}: ${score} pontos`)
        .join(' | ');
    
    // Add turn indicator for multiplayer
    const turnText = gameState.numPlayers > 1 
        ? `<br>Vez do Jogador ${gameState.currentPlayer + 1}`
        : '';
    
    DOM.statusDisplay.innerHTML = scores + turnText;
}

/**
 * Updates timer display (hard mode)
 */
function updateTimer() {
    if (!DOM.timerText) return;
    
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    DOM.timerText.textContent = timeString;
}

/**
 * Starts the countdown timer (hard mode)
 */
function startTimer() {
    const { time } = DIFFICULTY_CONFIG[gameState.difficulty];
    
    if (time === 0) {
        DOM.timerDisplay?.classList.add('hidden');
        return;
    }
    
    gameState.timeLeft = time;
    DOM.timerDisplay?.classList.remove('hidden');
    updateTimer();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimer();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            endGame();
        }
    }, 1000);
}

/* ================================================
   GAME LIFECYCLE
   ================================================ */

/**
 * Starts a new game
 */
function startGame() {
    // Reset state
    gameState.reset();
    
    // Initialize scores
    gameState.scores = Array(gameState.numPlayers).fill(0);
    gameState.isGameActive = true;
    
    // Create board
    createBoard();
    
    // Start timer if needed
    startTimer();
    
    // Update display
    updateStatus();
}

/**
 * Ends the game and shows results
 */
function endGame() {
    gameState.isGameActive = false;
    
    // Stop timer
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    // Audio feedback
    playSound('game_complete');
    
    // Save statistics
    saveGameStats();
    
    // Visual celebration
    showConfetti();
    
    // Display winner message
    displayWinner();
}

/**
 * Saves game statistics to localStorage
 */
function saveGameStats() {
    try {
        const stats = JSON.parse(localStorage.getItem('memoryStats') || '{}');
        const { theme, difficulty, numPlayers, scores, timeLeft } = gameState;
        
        // Initialize theme stats
        if (!stats[theme]) stats[theme] = {};
        if (!stats[theme][difficulty]) {
            stats[theme][difficulty] = { bestTime: Infinity, bestScore: 0 };
        }
        
        // Update best time (single player, hard mode only)
        if (numPlayers === 1 && difficulty === 'hard') {
            const timeTaken = DIFFICULTY_CONFIG.hard.time - timeLeft;
            if (timeTaken < stats[theme][difficulty].bestTime) {
                stats[theme][difficulty].bestTime = timeTaken;
            }
        }
        
        // Update best score
        const totalScore = scores.reduce((a, b) => a + b, 0);
        if (totalScore > stats[theme][difficulty].bestScore) {
            stats[theme][difficulty].bestScore = totalScore;
        }
        
        localStorage.setItem('memoryStats', JSON.stringify(stats));
    } catch (error) {
        console.error('Failed to save stats:', error);
    }
}

/**
 * Displays winner message
 */
function displayWinner() {
    if (!DOM.statusDisplay) return;
    
    let message = '';
    
    if (gameState.numPlayers > 1) {
        const maxScore = Math.max(...gameState.scores);
        const winners = gameState.scores
            .map((score, index) => score === maxScore ? index + 1 : -1)
            .filter(index => index !== -1);
        
        message = winners.length > 1
            ? `Fim de jogo! Empate entre os jogadores: ${winners.join(' e ')}!`
            : `Fim de jogo! O Jogador ${winners[0]} venceu!`;
    } else {
        message = 'Parabéns, você completou o jogo!';
    }
    
    DOM.statusDisplay.innerHTML = message;
}

/* ================================================
   EVENT LISTENERS & INITIALIZATION
   ================================================ */

/**
 * Sets up player selection buttons
 */
function setupPlayerButtons() {
    const buttons = document.querySelectorAll('.memory-player-btn, .config-btn[data-players]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Update state
            gameState.numPlayers = parseInt(this.dataset.players) || 1;
        });
    });
}

/**
 * Sets up difficulty selection buttons
 */
function setupDifficultyButtons() {
    const buttons = document.querySelectorAll('.memory-difficulty-btn, .config-btn[data-difficulty]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Update state
            gameState.difficulty = this.dataset.difficulty || 'medium';
        });
    });
}

/**
 * Sets up theme selection
 */
function setupThemeSelect() {
    if (!DOM.themeSelect) return;
    
    DOM.themeSelect.addEventListener('change', function() {
        gameState.theme = this.value;
    });
}

/**
 * Sets up sound toggle
 */
function setupSoundToggle() {
    if (!DOM.soundToggle) return;
    
    DOM.soundToggle.addEventListener('change', function() {
        gameState.soundEnabled = this.checked;
    });
    
    // Initialize state
    gameState.soundEnabled = DOM.soundToggle.checked;
}

/**
 * Sets up navigation buttons using event delegation
 */
function setupNavigation() {
    console.log('🔧 Setting up navigation...');
    
    if (!DOM.memoryView) {
        console.error('❌ DOM.memoryView not found!');
        return;
    }
    
    // Event delegation for navigation buttons
    DOM.memoryView.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;
        
        console.log('🔘 Button clicked:', button.id);
        
        const handlers = {
            'start-game': () => {
                e.preventDefault();
                console.log('▶️ Starting game...');
                startGame();
                showMemoryGame();
            },
            'back-to-config': () => {
                e.preventDefault();
                console.log('⬅️ Back to config...');
                showMemoryConfig();
            },
            'restart-game': () => {
                e.preventDefault();
                console.log('🔄 Restarting game...');
                startGame();
            },
            'back-from-memory': () => {
                e.preventDefault();
                console.log('🏠 Back to welcome...');
                // Navigate back to welcome screen
                const welcomeView = document.getElementById('welcome-view');
                const memoryView = document.getElementById('memory-view');
                if (welcomeView && memoryView) {
                    memoryView.classList.remove('active');
                    welcomeView.classList.add('active');
                }
            }
        };
        
        const handler = handlers[button.id];
        if (handler) {
            handler();
        } else {
            console.warn('⚠️ No handler for button:', button.id);
        }
    });
    
    // Direct event listener as backup for start button
    const startBtn = document.getElementById('start-game');
    if (startBtn) {
        console.log('✅ Start button found, adding direct listener');
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Direct start button clicked!');
            startGame();
            showMemoryGame();
        });
    } else {
        console.error('❌ Start button NOT found!');
    }
    
    console.log('✅ Navigation setup complete');
}

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    console.log('🎮 Initializing Memory Game...');
    console.log('DOM Elements:', {
        memoryView: !!DOM.memoryView,
        gameBoard: !!DOM.gameBoard,
        startButton: !!document.getElementById('start-game')
    });
    
    setupPlayerButtons();
    setupDifficultyButtons();
    setupThemeSelect();
    setupSoundToggle();
    setupNavigation();
    
    console.log('✅ Memory Game initialized!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    initializeEventListeners();
});

/* ================================================
   VISUAL EFFECTS
   ================================================ */

/**
 * Shows confetti animation
 */
function showConfetti() {
    const container = document.createElement('div');
    container.classList.add('confetti-container');
    
    // Create confetti pieces
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        fragment.appendChild(confetti);
    }
    
    container.appendChild(fragment);
    document.body.appendChild(container);
    
    // Clean up after animation
    setTimeout(() => {
        container.remove();
    }, 3000);
}

/* ================================================
   AUDIO SYSTEM (Web Audio API)
   ================================================ */

/**
 * Audio configurations for different sound types
 */
const SOUND_CONFIG = {
    flip: {
        type: 'square',
        frequency: 800,
        gain: 0.08,
        duration: 0.1
    },
    correct: {
        type: 'sine',
        notes: [783.99, 1046.50, 1318.51], // G5, C6, E6
        gain: 0.15,
        duration: 0.4,
        interval: 0.1
    },
    incorrect: {
        type: 'triangle',
        startFreq: 220.00, // A3
        endFreq: 110.00,   // A2
        gain: 0.12,
        duration: 0.3
    },
    game_complete: {
        type: 'sine',
        notes: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6
        gain: 0.1,
        duration: 0.2,
        interval: 0.15
    }
};

/**
 * Plays a sound using Web Audio API
 * @param {string} type - Sound type (flip, correct, incorrect, game_complete)
 */
function playSound(type) {
    if (!gameState.soundEnabled) return;
    
    try {
        const config = SOUND_CONFIG[type];
        if (!config) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (config.notes) {
            playNoteSequence(audioContext, config);
        } else if (config.startFreq && config.endFreq) {
            playSlidingNote(audioContext, config);
        } else {
            playSimpleNote(audioContext, config);
        }
    } catch (error) {
        // Silently fail if Web Audio API is not supported
        console.warn('Audio not supported:', error);
    }
}

/**
 * Plays a simple note
 */
function playSimpleNote(audioContext, config) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(config.gain, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + config.duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + config.duration);
}

/**
 * Plays a sliding note (pitch change)
 */
function playSlidingNote(audioContext, config) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.startFreq, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(config.endFreq, audioContext.currentTime + config.duration);
    gainNode.gain.setValueAtTime(config.gain, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + config.duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + config.duration);
}

/**
 * Plays a sequence of notes
 */
function playNoteSequence(audioContext, config) {
    config.notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const startTime = audioContext.currentTime + (index * config.interval);
        const endTime = startTime + config.duration;
        
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(config.gain, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}
