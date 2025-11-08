"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamification = void 0;
const chalk_1 = __importDefault(require("chalk"));
// Sistema de streak (sequência de sucessos)
let currentStreak = 0;
let bestStreak = 0;
let totalAttempts = 0;
let failedAttempts = 0;
// Nível de dica atual para cada exercício
const hintLevels = new Map();
exports.gamification = {
    // Incrementa streak ao completar exercício
    incrementStreak: () => {
        currentStreak++;
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
        }
    },
    // Reseta streak ao desistir
    resetStreak: () => {
        currentStreak = 0;
    },
    // Registra tentativa
    recordAttempt: (success) => {
        totalAttempts++;
        if (!success) {
            failedAttempts++;
        }
    },
    // Obtém estatísticas
    getStats: () => ({
        currentStreak,
        bestStreak,
        totalAttempts,
        failedAttempts,
        successRate: totalAttempts > 0 ? ((totalAttempts - failedAttempts) / totalAttempts * 100).toFixed(1) : '0.0'
    }),
    // Próximo nível de dica
    getNextHintLevel: (exerciseName) => {
        const current = hintLevels.get(exerciseName) || 0;
        const next = Math.min(current + 1, 2); // Máximo 3 níveis (0, 1, 2)
        hintLevels.set(exerciseName, next);
        return next;
    },
    // Reseta nível de dica
    resetHintLevel: (exerciseName) => {
        hintLevels.set(exerciseName, 0);
    },
    // Mensagens motivacionais baseadas em contexto
    getEncouragementMessage: (context) => {
        const failures = [
            " Keep going! Even experts were once beginners.",
            " You're close! Revise your code calmly.",
            " Making mistakes are a part of it. Try again!",
            "Persevere! FHE is complex, but you can do it!",
            "Each mistake gets you close to success!",
            "Take a deep breath and try a different approach.",
        ];
        const hints = [
            " Here's a useful tip:",
            " Let me help you with this:",
            " Pay attention to this hint:",
            " Here's a small insight:",
            " See if this can help you",
        ];
        const successes = [
            " Incredible! You really understood the concept!",
            "Fantastic! You're killing it!",
            " Perfect! Keep rocking!",
            " Excelent work! Next challenge!",
            " Brilliant! You're a natural at FHE!",
            " Right on the money! Congratulations!",
            " Impressivee! Onto the next level!",
        ];
        const streaks = [
            " You're on FIRE! ",
            " UNKILLABLE STREAK! ",
            " EXPERT MODE ACTIVATED! ",
            " BRILLIANT! KEEP GOING! ",
            " ABSOLUTE PRECISION! ",
        ];
        switch (context) {
            case 'failure':
                return failures[Math.floor(Math.random() * failures.length)];
            case 'hint':
                return hints[Math.floor(Math.random() * hints.length)];
            case 'success':
                return successes[Math.floor(Math.random() * successes.length)];
            case 'streak':
                return streaks[Math.floor(Math.random() * streaks.length)];
        }
    },
    // Fatos curiosos sobre FHE
    getFHEFact: () => {
        const facts = [
            " FHE allow computation on encrypted data without having to decrypt!",
            " FHE can revolutionize confiability on blockchain and cloud computing!",
            " THe concept of FHE was proposed by Craig Gentry in 2009.",
            " With FHE, you can add numbers without even knowing what they are!",
            " You can make blind auctions with FHE!",
            " FHE is considered the 'Holy Grail' of crypto!",
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    },
    // Mostra estatísticas
    showStats: () => {
        const stats = exports.gamification.getStats();
        console.log(chalk_1.default.cyan('\n Your Stats:'));
        console.log(chalk_1.default.gray('  ├─ ') + chalk_1.default.white('Current streak: ') + chalk_1.default.yellow(`${stats.currentStreak} `));
        console.log(chalk_1.default.gray('  ├─ ') + chalk_1.default.white('Best streak: ') + chalk_1.default.green(`${stats.bestStreak} `));
        console.log(chalk_1.default.gray('  ├─ ') + chalk_1.default.white('Total tries: ') + chalk_1.default.blue(stats.totalAttempts));
        console.log(chalk_1.default.gray('  └─ ') + chalk_1.default.white('SUcess rate: ') + chalk_1.default.magenta(`${stats.successRate}%`));
    },
    // Mostra dificuldade do exercício
    showDifficulty: (difficulty = 1) => {
        const stars = ''.repeat(difficulty) + '☆'.repeat(3 - difficulty);
        const level = difficulty === 1 ? 'East' : difficulty === 2 ? 'Medium' : 'Hard';
        console.log(chalk_1.default.gray(`  Difficulty: ${stars} ${level}`));
    },
    // Animação de celebração
    celebrate: (exerciseName) => {
        const stats = exports.gamification.getStats();
        console.log('\n' + chalk_1.default.green('▓'.repeat(50)));
        console.log(chalk_1.default.bold.green('\n   ' + exports.gamification.getEncouragementMessage('success') + ' '));
        console.log(chalk_1.default.green(`\n  ${exerciseName} `) + chalk_1.default.gray('was solved with sucess!'));
        if (currentStreak >= 3) {
            console.log(chalk_1.default.yellow(`\n   ${exports.gamification.getEncouragementMessage('streak')}`));
            console.log(chalk_1.default.yellow(`  Streak of ${currentStreak} problems! `));
        }
        // Fato curioso ocasional (30% de chance)
        if (Math.random() < 0.3) {
            console.log(chalk_1.default.cyan('\n  Did you know?'));
            console.log(chalk_1.default.gray('  ' + exports.gamification.getFHEFact()));
        }
        console.log(chalk_1.default.gray('\n  Awaiting next problem...\n'));
        console.log(chalk_1.default.green('▓'.repeat(50)));
    }
};
