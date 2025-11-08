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
    console.log(chalk.gray('\nLearn FHEVM correcting small exercises!\n'));

    console.log(chalk.yellow(' Keyboard Shortcuts:'));
    console.log(chalk.gray('  • ') + chalk.white('h') + chalk.gray(' - Progressive tips (3 levels)'));
    console.log(chalk.gray('  • ') + chalk.white('n') + chalk.gray(' - Advance to next exercise'));
    console.log(chalk.gray('  • ') + chalk.white('s') + chalk.gray(' - See your stats'));
    console.log(chalk.gray('  • ') + chalk.white('l') + chalk.gray(' - List exercises'));
    console.log(chalk.gray('  • ') + chalk.white('c') + chalk.gray(' - Clears screen'));
    console.log(chalk.gray('  • ') + chalk.white('q') + chalk.gray(' - Quit program'));

    console.log(chalk.yellow('\n CLI Commands (in another terminal):'));
    console.log(chalk.gray('  • ') + chalk.white('npm run watch list') + chalk.gray(' - Lists all exercises'));
    console.log(chalk.gray('  • ') + chalk.white('npm run watch hint') + chalk.gray(' - Shows tip on current exercise'));
    console.log(chalk.gray('  • ') + chalk.white('npm run watch verify <nome>') + chalk.gray(' - CHecks specific exercise'));
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

    console.log(chalk.gray('\n   Tip: Press ') + chalk.white('h') + chalk.gray(' to see progressive tips'));
    console.log(chalk.gray('  Awaiting next try...\n'));
  },

  showHint: (hint: string) => {
    console.log(`\n${LOG_PREFIX} ${chalk.bold.white(' Tip:')}`);
    console.log(chalk.cyan(`  ${hint}\n`));
  },

  showProgressiveHint: (exerciseName: string, hints?: string[]) => {
    const level = gamification.getNextHintLevel(exerciseName);

    console.log(chalk.yellow(`\n${gamification.getEncouragementMessage('hint')}`));

    if (hints && hints.length > 0 && level < hints.length) {
      console.log(chalk.cyan(`\n  Tip level ${level + 1}/${hints.length}:`));
      console.log(chalk.white(`  ${hints[level]}\n`));

      if (level < hints.length - 1) {
        console.log(chalk.gray(`  Press 'h' again for remaining (${hints.length - level - 1} tips)\n`));
      } else {
        console.log(chalk.yellow(`  This was the most specific tip!\n`));
      }
    } else {
      // Fallback para hint simples
      console.log(chalk.cyan(`\n  Tip:`));
      console.log(chalk.white(`  You can find the FHEVM documentation here: https://docs.zama.org/protocol.\n`));
    }
  },

  showNextPrompt: () => {
    console.log(chalk.yellow('\n  Press ') + chalk.white.bold('n') + chalk.yellow(' to advance to the next exercise'));
    console.log(chalk.gray('     or ') + chalk.white('l') + chalk.gray(' to choose an specific exercise\n'));
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
      const icon = exercise.solved ? '✅' : '📝';

      console.log(`  ${status} ${icon} ${chalk.gray(`${String(index + 1).padStart(2, '0')}:`)} ${name}`);
    });

    const solved = exercises.filter(e => e.solved).length;
    const total = exercises.length;

    console.log('\n' + chalk.gray('─'.repeat(50)));
    console.log(`\n  ${chalk.bold('Progresso Geral:')}`);
    console.log(`  ${createProgressBar(solved, total, 40)}`);
    console.log(chalk.gray(`  ${solved} de ${total} exercícios completos\n`));
  },

  allDone: () => {
    console.clear();
    console.log(chalk.bold.green('\n🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊'));
    console.log(chalk.bold.green('\n          ✨ Congratulations! ✨'));
    console.log(chalk.bold.green('\n🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊\n'));

    console.log(chalk.green('  🎉 Você completou TODOS os exercícios do fhevm-lings!'));
    console.log(chalk.white('\n  Você aprendeu sobre:'));
    console.log(chalk.cyan('    ✓ Importar a biblioteca FHE'));
    console.log(chalk.cyan('    ✓ Encriptar dados (euint32)'));
    console.log(chalk.cyan('    ✓ Operações homomórficas (adição)'));
    console.log(chalk.cyan('    ✓ Comparações encriptadas'));
    console.log(chalk.cyan('    ✓ Lógica condicional (FHE.select)'));

    console.log(chalk.gray('\n  Agora você está pronto para construir aplicações'));
    console.log(chalk.gray('  com criptografia homomórfica usando FHEVM! 🚀\n'));

    console.log(chalk.yellow('  Próximos passos:'));
    console.log(chalk.white('    • Explore a documentação: ') + chalk.blue('https://docs.zama.ai/fhevm'));
    console.log(chalk.white('    • Construa seu próprio projeto com FHEVM'));
    console.log(chalk.white('    • Compartilhe o que você aprendeu!\n'));
  },

  info: (message: string) => {
    console.log(`${LOG_PREFIX} ${chalk.gray(message)}`);
  },

  showExercisePath: (path: string) => {
    console.log(chalk.gray(`  Arquivo: ${path}`));
  },

  separator: () => {
    console.log(chalk.gray('─'.repeat(50)));
  }
};