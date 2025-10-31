// js/pointsCalc.js
// Funções de cálculo de pontos (solo/competitivo).
// Implementação front-end; repita no servidor para evitar fraudes.

export function calculateSoloPoints({
  correct,
  totalTime = 18,
  timeTaken = 0,
  streak = 0,
  difficulty = 1,
  maxDifficulty = 5,
  wrongAttemptsOnThisQuestion = 0,
  config = {}
}) {
  const cfg = Object.assign({
    basePoint: 1.0,
    maxFeatureFraction: 0.1,   // cada característica até 0.1
    secondsPerSpeedTick: 1,    // 0.01 por segundo sobrando
    maxSpeedSeconds: 10,
    wrongPenaltyPerAttempt: 0.1,
    maxNegativePerQuestion: -1.0,
    applyDifficultyBonus: true
  }, config);

  let breakdown = { base: 0, speedBonus: 0, streakBonus: 0, difficultyBonus: 0 };
  let penalties = 0;

  if (!correct) {
    penalties = cfg.wrongPenaltyPerAttempt;
    return {
      awarded: -penalties,
      breakdown: { base: 0, speedBonus: 0, streakBonus: 0, difficultyBonus: 0 },
      penalties: -penalties
    };
  }

  breakdown.base = cfg.basePoint;

  const timeRemaining = Math.max(0, Math.floor(totalTime - timeTaken));
  const speedSeconds = Math.min(cfg.maxSpeedSeconds, timeRemaining);
  breakdown.speedBonus = Math.min(cfg.maxFeatureFraction, speedSeconds * 0.01);

  const streakPartial = Math.min(0.09, Math.max(0, (streak - 1) * 0.01));
  const extraIf10 = (streak >= 10) ? 0.01 : 0;
  breakdown.streakBonus = streakPartial + extraIf10;

  if (cfg.applyDifficultyBonus) {
    const norm = Math.max(0, Math.min(1, (difficulty - 1) / Math.max(1, maxDifficulty - 1)));
    breakdown.difficultyBonus = parseFloat((cfg.maxFeatureFraction * norm).toFixed(3));
  }

  let positive = breakdown.base + breakdown.speedBonus + breakdown.streakBonus + breakdown.difficultyBonus;
  penalties = wrongAttemptsOnThisQuestion * cfg.wrongPenaltyPerAttempt;
  const net = positive - penalties;
  const capped = Math.max(cfg.maxNegativePerQuestion, net);

  return {
    awarded: parseFloat(capped.toFixed(3)),
    breakdown: {
      base: parseFloat(breakdown.base.toFixed(3)),
      speedBonus: parseFloat(breakdown.speedBonus.toFixed(3)),
      streakBonus: parseFloat(breakdown.streakBonus.toFixed(3)),
      difficultyBonus: parseFloat(breakdown.difficultyBonus.toFixed(3))
    },
    penalties: parseFloat(penalties.toFixed(3)),
    raw: { positive, net }
  };
}

export function sumPointsForRound(questionResults = []) {
  return questionResults.reduce((s, q) => s + (q.awarded || 0), 0);
}
