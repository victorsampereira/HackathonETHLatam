import chalk from 'chalk';

// Sistema de streak (sequência de sucessos)
let currentStreak = 0;
let bestStreak = 0;
let totalAttempts = 0;
let failedAttempts = 0;

// Nível de dica atual para cada exercício
const hintLevels = new Map<string, number>();

export const gamification = {
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
  recordAttempt: (success: boolean) => {
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
  getNextHintLevel: (exerciseName: string): number => {
    const current = hintLevels.get(exerciseName) || 0;
    const next = Math.min(current + 1, 2); // Máximo 3 níveis (0, 1, 2)
    hintLevels.set(exerciseName, next);
    return next;
  },

  // Reseta nível de dica
  resetHintLevel: (exerciseName: string) => {
    hintLevels.set(exerciseName, 0);
  },

  // Mensagens motivacionais baseadas em contexto
  getEncouragementMessage: (context: 'failure' | 'hint' | 'success' | 'streak'): string => {
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
  getFHEFact: (): string => {
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
    const stats = gamification.getStats();
    console.log(chalk.cyan('\n Your Stats:'));
    console.log(chalk.gray('  ├─ ') + chalk.white('Current streak: ') + chalk.yellow(`${stats.currentStreak} `));
    console.log(chalk.gray('  ├─ ') + chalk.white('Best streak: ') + chalk.green(`${stats.bestStreak} `));
    console.log(chalk.gray('  ├─ ') + chalk.white('Total tries: ') + chalk.blue(stats.totalAttempts));
    console.log(chalk.gray('  └─ ') + chalk.white('SUcess rate: ') + chalk.magenta(`${stats.successRate}%`));
  },

  // Mostra dificuldade do exercício
  showDifficulty: (difficulty: number = 1) => {
    const stars = ''.repeat(difficulty) + '☆'.repeat(3 - difficulty);
    const level = difficulty === 1 ? 'East' : difficulty === 2 ? 'Medium' : 'Hard';
    console.log(chalk.gray(`  Difficulty: ${stars} ${level}`));
  },

  // Animação de celebração
  celebrate: (exerciseName: string) => {
    const stats = gamification.getStats();
    console.log('\n' + chalk.green('▓'.repeat(50)));
    console.log(chalk.bold.green('\n   ' + gamification.getEncouragementMessage('success') + ' '));
    console.log(chalk.green(`\n  ${exerciseName} `) + chalk.gray('was solved with sucess!'));

    if (currentStreak >= 3) {
      console.log(chalk.yellow(`\n   ${gamification.getEncouragementMessage('streak')}`));
      console.log(chalk.yellow(`  Streak of ${currentStreak} problems! `));
    }

    // Fato curioso ocasional (30% de chance)
    if (Math.random() < 0.3) {
      console.log(chalk.cyan('\n  Did you know?'));
      console.log(chalk.gray('  ' + gamification.getFHEFact()));
    }

    console.log(chalk.gray('\n  Awaiting next problem...\n'));
    console.log(chalk.green('▓'.repeat(50)));
  }
};
