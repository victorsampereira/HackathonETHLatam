import chalk from 'chalk';

const LOG_PREFIX = chalk.blue('⚡fhevm-lings');

export const ui = {
  welcome: () => {
    console.log(chalk.bold.blue('========================'));
    console.log(chalk.bold.blue('  Bem-vindo ao fhevm-lings!'));
    console.log(chalk.bold.blue('========================'));
    console.log('A observar os seus ficheiros...');
  },

  nextChallenge: (exerciseName: string, currentIndex: number, totalExercises: number) => {
    const progress = `(${currentIndex}/${totalExercises})`;
    console.log(`\n${LOG_PREFIX} ${chalk.yellow(`Próximo desafio ${progress}:`)}`);
    console.log(chalk.bold.yellowBright(`  ${exerciseName}`));
  },

  compiling: () => {
    console.log(`${LOG_PREFIX} ${chalk.gray('A detectar mudanças... A compilar...')}`);
  },

  success: (exerciseName: string) => {
    console.log(`${LOG_PREFIX} ${chalk.green('SUCESSO!')}`);
    console.log(chalk.green(`  O exercício ${chalk.bold(exerciseName)} foi compilado com sucesso.`));
  },

  failure: (hint: string, error?: string) => {
    console.log(`${LOG_PREFIX} ${chalk.red('ERRO! Tente novamente.')}`);
    console.log(chalk.bold.white('  Dica: ') + chalk.cyan(hint));
    if (error) {
      // Opcional: Mostrar erro detalhado
      console.log(chalk.gray(error));
    }
  },

  showHint: (hint: string) => {
    console.log(chalk.bold.white('  Dica: ') + chalk.cyan(hint));
  },

  listExercises: (exercises: { name: string; solved: boolean }[]) => {
    console.log(chalk.bold.yellow('Estado dos Exercícios:'));
    for (const exercise of exercises) {
      const status = exercise.solved ? chalk.green('[x]') : chalk.gray('[ ]');
      console.log(`  ${status} ${exercise.name}`);
    }
  },

  allDone: () => {
    console.log(`\n${LOG_PREFIX} ${chalk.bold.green('✨ PARABÉNS! ✨')}`);
    console.log(chalk.green('Você completou todos os exercícios!'));
  },

  info: (message: string) => {
    console.log(`${LOG_PREFIX} ${chalk.gray(message)}`);
  }
};