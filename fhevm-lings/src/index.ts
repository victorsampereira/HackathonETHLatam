import * as path from 'path';
import * as readline from 'readline';
import chokidar from 'chokidar';
import chalk from 'chalk';
import { ui } from './ui';
import { getExercises, findNextUnsolved, isSolved, Exercise } from './exerciseRepo';
import { compile } from './compiler';
import { gamification } from './gamification';

// Estado global de navegação
let currentWatcher: chokidar.FSWatcher | null = null;
let awaitingNavigation = false;

// Cache de status dos exercícios (para acelerar lista)
const exerciseStatusCache = new Map<string, boolean>();

// Esta é a função principal que orquestra tudo
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const allExercises = await getExercises();

  // Comando: mostrar dica do exercício atual
  if (command === 'hint') {
    const currentExercise = await findNextUnsolved(allExercises);
    if (currentExercise) {
      ui.showHint(currentExercise.hint);
    } else {
      ui.allDone();
    }
    return;
  }

  // Comando: listar todos os exercícios com status
  if (command === 'list') {
    const exerciseStatuses = await Promise.all(
      allExercises.map(async (exercise) => ({
        name: exercise.name,
        solved: await isSolved(exercise),
      }))
    );
    ui.listExercises(exerciseStatuses);
    return;
  }

  // Comando: verificar um exercício específico
  if (command === 'verify') {
    const exerciseName = args[1];
    if (!exerciseName) {
      console.log(chalk.red('❌ Por favor especifique o nome do exercício.'));
      console.log(chalk.gray('   Exemplo: npm run watch verify 03_encrypt_euint32'));
      return;
    }

    const exercise = allExercises.find(ex => ex.name === exerciseName);
    if (!exercise) {
      console.log(chalk.red(`❌ Exercício "${exerciseName}" não encontrado.`));
      return;
    }

    console.log(chalk.blue(`\n🔄 Verificando ${exercise.name}...\n`));
    const result = await compile(exercise.path);

    if (result.success) {
      console.log(chalk.green('✅ Exercício correto!'));
    } else {
      console.log(chalk.red('❌ Exercício ainda incorreto.'));
      ui.showHint(exercise.hint);
      if (result.error) {
        console.log(chalk.gray('\nErro:\n' + result.error));
      }
    }
    return;
  }

  // Default watch mode com atalhos de teclado
  ui.welcome();

  let currentExercise = await findNextUnsolved(allExercises);
  const totalExercises = allExercises.length;

  // Configura atalhos de teclado
  setupKeyboardShortcuts(allExercises, () => currentExercise, (newExercise) => {
    currentExercise = newExercise;
  });

  // O loop principal do programa
  while (currentExercise != null) {
    const currentIndex = allExercises.findIndex(ex => ex.path === currentExercise!.path) + 1;
    ui.nextChallenge(currentExercise.name, currentIndex, totalExercises);
    showKeyboardHints();

    // Observa o exercício e espera por sucesso ou navegação
    const success = await watchExercise(currentExercise);

    if (success) {
      ui.success(currentExercise.name);
      gamification.resetHintLevel(currentExercise.name);

      // Aguarda comando 'n' para avançar
      ui.showNextPrompt();
      awaitingNavigation = true;
      const nextExercise = await waitForNext(allExercises, currentExercise);
      awaitingNavigation = false;

      currentExercise = nextExercise;
    } else {
      break; // Sai se watcher falhar
    }
  }

  // Todos os exercícios completos
  if (!currentExercise) {
    ui.allDone();
  }
}

/**
 * Mostra dicas de atalhos de teclado
 */
function showKeyboardHints() {
  console.log(chalk.gray('  Atalhos: ') +
    chalk.white('h') + chalk.gray('=dica  ') +
    chalk.white('n') + chalk.gray('=próximo  ') +
    chalk.white('s') + chalk.gray('=stats  ') +
    chalk.white('l') + chalk.gray('=lista (escolha exercício)  ') +
    chalk.white('c') + chalk.gray('=limpar  ') +
    chalk.white('q') + chalk.gray('=sair'));
  console.log(chalk.gray('─'.repeat(50)) + '\n');
}

/**
 * Aguarda comando 'n' para avançar ao próximo exercício
 */
async function waitForNext(allExercises: Exercise[], currentExercise: Exercise): Promise<Exercise | null> {
  return new Promise((resolve) => {
    let selectedExercise: Exercise | null = null;

    const navigationListener = async (str: string, key: any) => {
      if (awaitingNavigation && key.name === 'n') {
        // Avançar para próximo não resolvido
        const nextUnsolved = await findNextUnsolved(allExercises);
        selectedExercise = nextUnsolved;
        process.stdin.removeListener('keypress', navigationListener);
        resolve(selectedExercise);
      }
    };

    process.stdin.on('keypress', navigationListener);
  });
}

/**
 * Configura atalhos de teclado para comandos rápidos
 */
function setupKeyboardShortcuts(
  allExercises: Exercise[],
  getCurrentExercise: () => Exercise | null,
  setCurrentExercise: (ex: Exercise | null) => void
) {
  if (process.stdin.isTTY) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', async (str, key) => {
      if (key.ctrl && key.name === 'c') {
        console.log(chalk.yellow('\n\n👋 Até logo!\n'));
        process.exit(0);
      }

      // Não processar outros comandos se estamos aguardando navegação
      if (awaitingNavigation && key.name !== 'n') {
        return;
      }

      switch (key.name) {
        case 'h':
          const current = getCurrentExercise();
          if (current) {
            ui.showProgressiveHint(current.name, current.hints);
          }
          break;

        case 's':
          gamification.showStats();
          console.log(chalk.gray('\n  Pressione qualquer tecla para continuar...\n'));
          break;

        case 'l':
          // Mostrar lista e permitir seleção
          await showExerciseListWithSelection(allExercises, setCurrentExercise);
          break;

        case 'c':
          console.clear();
          const ex = getCurrentExercise();
          if (ex) {
            const idx = allExercises.findIndex(e => e.path === ex.path) + 1;
            ui.nextChallenge(ex.name, idx, allExercises.length);
            showKeyboardHints();
          }
          break;

        case 'q':
          console.log(chalk.yellow('\n\n👋 Até logo!\n'));
          gamification.showStats();
          console.log(chalk.gray('\n'));
          process.exit(0);
          break;
      }
    });
  }
}

/**
 * Mostra lista de exercícios e permite seleção
 */
async function showExerciseListWithSelection(
  allExercises: Exercise[],
  setCurrentExercise: (ex: Exercise | null) => void
): Promise<void> {
  console.clear();

  // Usa cache para status dos exercícios (muito mais rápido!)
  const exerciseStatuses = allExercises.map((exercise, index) => ({
    name: exercise.name,
    solved: exerciseStatusCache.get(exercise.name) || false,
    index: index + 1
  }));

  ui.listExercises(exerciseStatuses.map(e => ({ name: e.name, solved: e.solved })));
  gamification.showStats();

  console.log(chalk.yellow('\n  💡 Digite o número do exercício (1-' + allExercises.length + ') ou pressione Enter para voltar:'));
  console.log(chalk.gray('  '));

  // Lê input do usuário
  const input = await readLineInput();

  if (input && !isNaN(Number(input))) {
    const selectedIndex = Number(input) - 1;
    if (selectedIndex >= 0 && selectedIndex < allExercises.length) {
      const selectedExercise = allExercises[selectedIndex];
      console.log(chalk.green(`\n  ✓ Indo para: ${selectedExercise.name}\n`));

      // Fecha watcher atual se existir
      if (currentWatcher) {
        currentWatcher.close();
        currentWatcher = null;
      }

      setCurrentExercise(selectedExercise);

      // Pequeno delay para o usuário ver a mensagem
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(chalk.red('\n  ❌ Número inválido!'));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Lê uma linha de input do usuário
 */
async function readLineInput(): Promise<string> {
  return new Promise((resolve) => {
    let input = '';

    const inputListener = (str: string, key: any) => {
      if (key.name === 'return') {
        process.stdin.removeListener('keypress', inputListener);
        console.log(); // Nova linha
        resolve(input);
      } else if (key.name === 'backspace') {
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else if (str && str >= '0' && str <= '9') {
        input += str;
        process.stdout.write(str);
      }
    };

    process.stdin.on('keypress', inputListener);
  });
}

/**
 * Observa um exercício específico e espera por uma "resolução".
 */
function watchExercise(exercise: Exercise): Promise<boolean> {
  const fullPath = path.resolve(exercise.path);

  return new Promise((resolve) => {
    if (exercise.path.endsWith('.md')) {
      ui.info(`Para continuar, por favor APAGUE o ficheiro: ${exercise.path}`);
      const watcher = chokidar.watch(fullPath);
      currentWatcher = watcher;

      watcher.on('unlink', () => {
        watcher.close();
        currentWatcher = null;
        resolve(true);
      });

    } else if (exercise.path.endsWith('.sol')) {
      ui.showExercisePath(exercise.path);
      const watcher = chokidar.watch(fullPath);
      currentWatcher = watcher;

      const onFileChanged = async (changedPath: string) => {
        ui.compiling();
        const result = await compile(changedPath);

        if (result.success) {
          watcher.close();
          currentWatcher = null;
          resolve(true);
        } else {
          ui.failure(exercise.hint, result.error);
        }
      };

      // Tenta compilar imediatamente
      onFileChanged(fullPath);

      // Ouve mudanças
      watcher.on('change', onFileChanged);
    }
  });
}

// Inicia a aplicação
main().catch((err) => {
  console.error('Um erro fatal ocorreu:', err);
  process.exit(1);
});
