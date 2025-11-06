// Gerenciador de música de fundo para JW-Quiz
// Requer arquivos mp3 em /audio conforme README.txt

const AUDIO_TRACKS = {
  home:        'audio/home.mp3',
  quizHome:    'audio/quiz-home.mp3',
  quiz:        'audio/quiz.mp3',
  memoryHome:  'audio/memory-home.mp3',
  memoryGame:  'audio/memory-game.mp3'
};

let currentAudio = null;
let currentTrack = '';
let musicEnabled = true;
let musicVolume = 0.2; // 20% do volume

function playMusic(trackKey) {
  if (!AUDIO_TRACKS[trackKey]) return;
  if (currentTrack === trackKey && currentAudio && !currentAudio.paused) return;
  stopMusic();
  currentAudio = new Audio(AUDIO_TRACKS[trackKey]);
  currentAudio.loop = true;
  currentAudio.volume = musicEnabled ? musicVolume : 0;
  currentAudio.play().catch(()=>{});
  currentTrack = trackKey;
}

function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentTrack = '';
  }
}

function setMusicEnabled(enabled) {
  musicEnabled = enabled;
  if (currentAudio) {
    currentAudio.volume = enabled ? musicVolume : 0;
  }
}

function setMusicVolume(vol) {
  musicVolume = Math.max(0, Math.min(1, vol));
  if (currentAudio && musicEnabled) {
    currentAudio.volume = musicVolume;
  }
}

// Expor globalmente
window.playMusic = playMusic;
window.stopMusic = stopMusic;
window.setMusicEnabled = setMusicEnabled;
window.setMusicVolume = setMusicVolume;
window.getMusicEnabled = () => musicEnabled;
window.getMusicVolume = () => musicVolume;
