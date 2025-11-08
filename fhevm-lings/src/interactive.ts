import * as readline from 'readline';
import chalk from 'chalk';
import { ui } from './ui';
import { Exercise } from './exerciseRepo';

export class InteractiveMode {
  private rl: readline.Interface;
  private currentExercise: Exercise | null = null;
  private allExercises: Exercise[] = [];

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.gray('\n '),
    });

    this.setupCommands();
  }

  setExercises(exercises: Exercise[]) {
    this.allExercises = exercises;
  }

  setCurrentExercise(exercise: Exercise | null) {
    this.currentExercise = exercise;
  }

  private setupCommands() {
    this.rl.on('line', async (input) => {
      const command = input.trim().toLowerCase();

      switch (command) {
        case 'tip':
        case 't':
          this.showHint();
          break;

        case 'list':
        case 'l':
          await this.showList();
          break;
        case 'clear':
        case 'c':
          console.clear();
          this.showPromptHelp();
          break;
        case 'help':
        case 'h':
          this.showHelp();
          break;

        case 'exit':
        case 'q':
          console.log(chalk.yellow('\n Later!\n'));
          process.exit(0);
          break;

        case '':
          // Enter vazio - apenas mostra o prompt novamente
          break;

        default:
          console.log(chalk.red(`Unknown command: "${command}"`));
          console.log(chalk.gray('   Press "help" to see available commands.'));
      }

      this.rl.prompt();
    });
  }

  private showHint() {
    if (this.currentExercise) {
      console.log(chalk.yellow('\n Hint:'));
      console.log(chalk.cyan(`   ${this.currentExercise.hint}`));
    } else {
      console.log(chalk.gray('\n   No current exercise.'));
    }
  }

  private async showList() {
    // Importa dinamicamente para evitar dependência circular
    const { isSolved } = await import('./exerciseRepo');

    console.log(chalk.yellow('\n List of problems:\n'));

    for (let i = 0; i < this.allExercises.length; i++) {
      const exercise = this.allExercises[i];
      const solved = await isSolved(exercise);
      const status = solved ? chalk.green('✓') : chalk.gray('○');
      const isCurrent = this.currentExercise?.name === exercise.name;
      const name = isCurrent
        ? chalk.bold.white(exercise.name) + chalk.yellow(' ← current')
        : solved
        ? chalk.gray(exercise.name)
        : chalk.white(exercise.name);

      console.log(`   ${status} ${i + 1}. ${name}`);
    }
    console.log('');
  }

  private showHelp() {
    console.log(chalk.yellow('\n Available commands:\n'));
    console.log(chalk.white('   tip, t') + chalk.gray('      - Shows hint '));
    console.log(chalk.white('   list, l') + chalk.gray('      - Lists all problems'));
    console.log(chalk.white('   clear, c') + chalk.gray('     - Clears screen'));
    console.log(chalk.white('   next, n') + chalk.gray('     - Goes to next problem'));
    console.log(chalk.white('   help, h') + chalk.gray('      - Shows help panel'));
    console.log(chalk.white('   quit, q') + chalk.gray('      - Quits program'));
    console.log('');
  }

  private showPromptHelp() {
    console.log(chalk.gray('Press "help" to see available commands'));
  }

  start() {
    this.showPromptHelp();
    this.rl.prompt();
  }

  updatePrompt(message?: string) {
    if (message) {
      console.log(message);
    }
    this.rl.prompt();
  }

  close() {
    this.rl.close();
  }
}
