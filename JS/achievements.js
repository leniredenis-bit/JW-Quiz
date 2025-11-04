// JS/achievements.js
const achievementsList = [
    { id: 'first_quiz', name: 'Iniciante Curioso', description: 'Complete seu primeiro quiz.', condition: (stats, quizResult) => stats.totalQuizzes >= 1 },
    { id: 'ten_quizzes', name: 'Estudante Dedicado', description: 'Complete 10 quizzes.', condition: (stats) => stats.totalQuizzes >= 10 },
    { id: 'perfect_score', name: 'Perfeccionista', description: 'Acerte 100% das perguntas em um quiz de pelo menos 10 questões.', condition: (stats, quizResult) => quizResult.accuracy === 100 && quizResult.totalQuestions >= 10 },
    { id: 'genesis_master', name: 'Mestre do Gênesis', description: 'Complete um quiz sobre "gênesis" com mais de 80% de acerto.', condition: (stats, quizResult) => quizResult.mode === 'tag' && quizResult.value === 'gênesis' && quizResult.accuracy >= 80 },
    { id: 'hard_core', name: 'Desafiante', description: 'Complete um quiz no modo difícil.', condition: (stats, quizResult) => quizResult.difficulty === 3 } // Assumindo que 3 é difícil
];

function checkAchievements(quizResult) {
    const stats = JSON.parse(localStorage.getItem('quiz_stats')) || { totalQuizzes: 0 };
    let unlockedAchievements = JSON.parse(localStorage.getItem('unlocked_achievements')) || [];

    achievementsList.forEach(ach => {
        if (!unlockedAchievements.includes(ach.id) && ach.condition(stats, quizResult)) {
            unlockedAchievements.push(ach.id);
            // Use o sistema de Toast existente para notificar
            if(window.Toast) {
                window.Toast.show(`🏆 Conquista Desbloqueada: ${ach.name}`, 'success', 5000);
            }
        }
    });

    localStorage.setItem('unlocked_achievements', JSON.stringify(unlockedAchievements));
}