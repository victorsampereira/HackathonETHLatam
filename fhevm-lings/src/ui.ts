import chalk from 'chalk';
import { gamification } from './gamification';

const LOG_PREFIX = chalk.blue('FHElings ---');

// Função helper para criar barra de progresso
function createProgressBar(current: number, total: number, width: number = 30): string {
  const percentage = Math.floor((current / total) * 100);
  const filled = Math.floor((current / total) * width);
  const empty = width - filled;

  const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  return `${bar} ${percentage}%`;
}

export const ui = {
  welcome: () => {
    console.clear();
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║                                       ║'));
    console.log(chalk.bold.cyan('║       ') + chalk.bold.white(' Welcome to FHElings!  ') + chalk.bold.cyan('         ║'));
    console.log(chalk.bold.cyan('║                                       ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════╝'));
    console.log(chalk.gray('\nLearn FHEVM by solving interactive exercises!\n'));

    console.log(chalk.white.bold(' How it works:'));
    console.log(chalk.gray('  1. ') + chalk.white('Read the exercise') + chalk.gray(' - Each file has a TODO comment'));
    console.log(chalk.gray('  2. ') + chalk.white('Write your solution') + chalk.gray(' - Fill in the missing code'));
    console.log(chalk.gray('  3. ') + chalk.white('Save the file') + chalk.gray(' - Auto-tested instantly!'));
    console.log(chalk.gray('  4. ') + chalk.white('Get feedback') + chalk.gray(' - Hints if something is wrong'));
    console.log(chalk.gray('  5. ') + chalk.white('Press ') + chalk.yellow('n') + chalk.gray(' to advance to next exercise\n'));

    console.log(chalk.yellow(' Keyboard Shortcuts:'));
    console.log(chalk.gray('  • ') + chalk.white('t') + chalk.gray(' - Progressive hints (3 levels)'));
    console.log(chalk.gray('  • ') + chalk.white('n') + chalk.gray(' - Advance to next exercise (after completing)'));
    console.log(chalk.gray('  • ') + chalk.white('s') + chalk.gray(' - View your statistics'));
    console.log(chalk.gray('  • ') + chalk.white('l') + chalk.gray(' - List and choose exercise'));
    console.log(chalk.gray('  • ') + chalk.white('c') + chalk.gray(' - Clear screen'));
    console.log(chalk.gray('  • ') + chalk.white('h') + chalk.gray(' - Help menu'));
    console.log(chalk.gray('  • ') + chalk.white('q') + chalk.gray(' - Quit program'));

    console.log(chalk.yellow('\n CLI Commands (in another terminal):'));
    console.log(chalk.gray('  • ') + chalk.white('npm run watch list') + chalk.gray(' - Lists all exercises'));
    console.log(chalk.gray('  • ') + chalk.white('npm run watch hint') + chalk.gray(' - Shows hint for current exercise'));
    console.log(chalk.gray('  • ') + chalk.white('npm run watch verify <name>') + chalk.gray(' - Verifies specific exercise'));
    console.log(chalk.gray('\n' + '─'.repeat(50) + '\n'));
  },

  nextChallenge: (exerciseName: string, currentIndex: number, totalExercises: number, clearScreen: boolean = true) => {
    if (clearScreen) {
      console.clear();
    }
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`\n${LOG_PREFIX} ${chalk.bold.yellow('Current exercise')}`);
    console.log(chalk.gray(`  Progress: ${currentIndex}/${totalExercises}`));
    console.log(`  ${createProgressBar(currentIndex - 1, totalExercises)}`);
    console.log(`\n  ${chalk.bold.white(exerciseName)}`);
    console.log(chalk.gray('  Awaiting changes on the file...\n'));
  },

  compiling: () => {
    // Limpa TODO o terminal antes de compilar para evitar acúmulo de erros
    console.clear();
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`${LOG_PREFIX} ${chalk.blue(' Compiling and testing...')}`);
    console.log(chalk.gray('─'.repeat(50)) + '\n');
  },

  success: (exerciseName: string) => {
    gamification.incrementStreak();
    gamification.recordAttempt(true);
    gamification.celebrate(exerciseName);
  },

  failure: (hint: string, error?: string, exerciseName?: string) => {
    gamification.recordAttempt(false);

    console.log(chalk.red(' Test failed!'));
    console.log(chalk.red('  ├─ The exercise still isnt correct.'));
    console.log(chalk.red('  └─ Check your code then save the file again.\n'));

    // Mensagem motivacional
    console.log(chalk.magenta('  ' + gamification.getEncouragementMessage('failure')));

    console.log(chalk.yellow('\n   Tip:'));
    console.log(chalk.cyan('     ' + hint));

    if (error) {
      // Extrai a mensagem de erro principal
      const errorMatch = error.match(/Error: (.+?)(?:\n|$)/);
      if (errorMatch) {
        console.log(chalk.gray('\n  ** Error ** : ') + chalk.white(errorMatch[1]));
      }

      // Mostra apenas as linhas mais relevantes do erro
      const errorLines = error.split('\n').filter(line => {
        return line.includes('AssertionError') ||
               line.includes('expected') ||
               line.includes('actual');
      });

      if (errorLines.length > 0) {
        console.log(chalk.gray('\n  Details:'));
        errorLines.slice(0, 3).forEach(line => {
          console.log(chalk.gray('     ' + line.trim()));
        });
      }
    }

    console.log(chalk.gray('\n   💭 Tip: Press ') + chalk.white('t') + chalk.gray(' to see progressive hints'));
    console.log(chalk.gray('  Waiting for next attempt...\n'));
  },

  showHint: (hint: string) => {
    console.log(`\n${LOG_PREFIX} ${chalk.bold.white(' Tip:')}`);
    console.log(chalk.cyan(`  ${hint}\n`));
  },

  showProgressiveHint: (exerciseName: string, hints?: string[]) => {
    const level = gamification.getNextHintLevel(exerciseName);

    console.log(chalk.yellow(`\n${gamification.getEncouragementMessage('hint')}`));

    if (hints && hints.length > 0 && level < hints.length) {
      console.log(chalk.cyan(`\n  Hint level ${level + 1}/${hints.length}:`));
      console.log(chalk.white(`  ${hints[level]}\n`));

      if (level < hints.length - 1) {
        console.log(chalk.gray(`  Press 't' again for more specific hint (${hints.length - level - 1} remaining)\n`));
      } else {
        console.log(chalk.yellow(`  This was the most specific hint!\n`));
      }
    } else {
      // Fallback para hint simples
      console.log(chalk.cyan(`\n  Tip:`));
      console.log(chalk.white(`  You can find the FHEVM documentation here: https://docs.zama.org/protocol.\n`));
    }
  },

  showNextPrompt: () => {
    console.log(chalk.yellow('\n  Press ') + chalk.white.bold('n') + chalk.yellow(' to advance to the next exercise'));
    console.log(chalk.gray('     or ') + chalk.white('l') + chalk.gray(' to choose an specific problem\n'));
  },

  listExercises: (exercises: { name: string; solved: boolean }[]) => {
    console.clear();
    console.log(`\n${LOG_PREFIX} ${chalk.bold.yellow('Exercise list')}\n`);
    console.log(chalk.gray('─'.repeat(50)) + '\n');

    exercises.forEach((exercise, index) => {
      const status = exercise.solved ? chalk.green('✓') : chalk.yellow('○');
      const name = exercise.solved
        ? chalk.gray.strikethrough(exercise.name)
        : chalk.white(exercise.name);
      const icon = exercise.solved ? 'y' : 'n';

      console.log(`  ${status} ${icon} ${chalk.gray(`${String(index + 1).padStart(2, '0')}:`)} ${name}`);
    });

    const solved = exercises.filter(e => e.solved).length;
    const total = exercises.length;

    console.log('\n' + chalk.gray('─'.repeat(50)));
    console.log(`\n  ${chalk.bold('General Progress:')}`);
    console.log(`  ${createProgressBar(solved, total, 40)}`);
    console.log(chalk.gray(`  ${solved} out of ${total} exercises made\n`));
  },

  allDone: () => {
    console.clear();
    console.log(chalk.bold.cyan('\n=═══════════════════════════════════════='));
    console.log(chalk.bold.green('\n           Congratulations!!!'));
    console.log(chalk.bold.cyan('\n=═══════════════════════════════════════='));

    console.log(chalk.green('  You have completod all of FHElings exercises!'));
    console.log(chalk.white('\n  You now know how to:'));
    console.log(chalk.cyan('    ✓ Import the FHE library'));
    console.log(chalk.cyan('    ✓ Encrypt data (euint32)'));
    console.log(chalk.cyan('    ✓ Homomorphic operations (adittion, subtraction, multiplication)'));
    console.log(chalk.cyan('    ✓ Encrypted comparisons'));
    console.log(chalk.cyan('    ✓ Conditional Logic '));

    console.log(chalk.gray('\n  You know have the basic concepts to build '));
    console.log(chalk.gray('  using FHEVM`s homomorphic cryptography! \n'));

    console.log(chalk.yellow('  Next steps:'));
    console.log(chalk.white('    • Explore the documentation: https://docs.zama.org/protocol') + chalk.blue(''));
    console.log(chalk.white('    • Build your first project with FHEVM'));
    console.log(chalk.white('    • Share what you`ve learned!\n'));
  },

  info: (message: string) => {
    console.log(`${LOG_PREFIX} ${chalk.gray(message)}`);
  },

  showExercisePath: (path: string) => {
    console.log(chalk.gray(`  File: ${path}`));
  },

  separator: () => {
    console.log(chalk.gray('─'.repeat(50)));
  }
};