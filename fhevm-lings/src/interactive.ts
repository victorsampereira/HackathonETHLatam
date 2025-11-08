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
      prompt: chalk.gray('\n⚡ '),
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
        case 'hint':
        case 'h':
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
        case '?':
          this.showHelp();
          break;

        case 'quit':
        case 'exit':
        case 'q':
          console.log(chalk.yellow('\n👋 Até logo!\n'));
          process.exit(0);
          break;

        case '':
          // Enter vazio - apenas mostra o prompt novamente
          break;

        default:
          console.log(chalk.red(`❌ Comando desconhecido: "${command}"`));
          console.log(chalk.gray('   Digite "help" para ver comandos disponíveis.'));
      }

      this.rl.prompt();
    });
  }

  private showHint() {
    if (this.currentExercise) {
      console.log(chalk.yellow('\n💡 Dica:'));
      console.log(chalk.cyan(`   ${this.currentExercise.hint}`));
    } else {
      console.log(chalk.gray('\n   Nenhum exercício ativo no momento.'));
    }
  }

  private async showList() {
    // Importa dinamicamente para evitar dependência circular
    const { isSolved } = await import('./exerciseRepo');

    console.log(chalk.yellow('\n📋 Lista de Exercícios:\n'));

    for (let i = 0; i < this.allExercises.length; i++) {
      const exercise = this.allExercises[i];
      const solved = await isSolved(exercise);
      const status = solved ? chalk.green('✓') : chalk.gray('○');
      const isCurrent = this.currentExercise?.name === exercise.name;
      const name = isCurrent
        ? chalk.bold.white(exercise.name) + chalk.yellow(' ← atual')
        : solved
        ? chalk.gray(exercise.name)
        : chalk.white(exercise.name);

      console.log(`   ${status} ${i + 1}. ${name}`);
    }
    console.log('');
  }

  private showHelp() {
    console.log(chalk.yellow('\n📚 Comandos Disponíveis:\n'));
    console.log(chalk.white('   hint, h') + chalk.gray('      - Mostrar dica do exercício atual'));
    console.log(chalk.white('   list, l') + chalk.gray('      - Listar todos os exercícios'));
    console.log(chalk.white('   clear, c') + chalk.gray('     - Limpar a tela'));
    console.log(chalk.white('   help, ?') + chalk.gray('      - Mostrar esta ajuda'));
    console.log(chalk.white('   quit, q') + chalk.gray('      - Sair do programa'));
    console.log('');
  }

  private showPromptHelp() {
    console.log(chalk.gray('Digite "help" para ver comandos disponíveis'));
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
