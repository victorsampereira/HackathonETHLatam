#!/usr/bin/env node

import * as fs from 'fs';
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


async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const allExercises = await getExercises();

  // Comando: mostra dica do exercício atual
  if (command === 'hint') {
    const currentExercise = await findNextUnsolved(allExercises);
    if (currentExercise) {
      ui.showHint(currentExercise.hint);
    } else {
      ui.allDone();
    }
    return;
  }

  // lista todos os exercícios com status
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

  // verifica um exercício específico
  if (command === 'verify') {
    const exerciseName = args[1];
    if (!exerciseName) {
      console.log(chalk.red(' Please specify an existing problem.'));
      console.log(chalk.gray('   Example: npm run watch verify 03_encrypt_euint32'));
      return;
    }

    const exercise = allExercises.find(ex => ex.name === exerciseName);
    if (!exercise) {
      console.log(chalk.red(`Problem "${exerciseName}" not found.`));
      return;
    }

    console.log(chalk.blue(`\n Verifying ${exercise.name}...\n`));
    const result = await compile(exercise.path);

    if (result.success) {
      console.log(chalk.green('Problem solved!'));
    } else {
      console.log(chalk.red(' Exercise is still incorrect.'));
      ui.showHint(exercise.hint);
      if (result.error) {
        console.log(chalk.gray('\nError:\n' + result.error));
      }
    }
    return;
  }

  // Default watch mode com atalhos de teclado
  ui.welcome();

  console.log(chalk.cyan('\n  Press Enter to start...'));

  // Aguarda Enter para começar
  await waitForEnter();

  // Inicializa cache de forma otimizada (lazy loading)
  console.log(chalk.gray('\n  Loading exercises state...\n'));

  // Carrega apenas até encontrar o primeiro não resolvido (muito mais rápido!)
  let currentExercise: Exercise | null = null;
  for (const exercise of allExercises) {
    const solved = await isSolved(exercise);
    exerciseStatusCache.set(exercise.name, solved);

    if (!solved && !currentExercise) {
      currentExercise = exercise;
      // Carrega o resto em background sem bloquear
      Promise.all(
        allExercises.slice(allExercises.indexOf(exercise) + 1).map(async (ex) => {
          const s = await isSolved(ex);
          exerciseStatusCache.set(ex.name, s);
        })
      );
      break;
    }
  }

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
      // Atualiza cache para marcar exercício como resolvido
      exerciseStatusCache.set(currentExercise.name, true);

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
 * Aguarda usuário pressionar Enter
 */
async function waitForEnter(): Promise<void> {
  return new Promise((resolve) => {
    const listener = (_str: string, key: any) => {
      if (key.name === 'return') {
        process.stdin.removeListener('keypress', listener);
        resolve();
      }
    };

    if (process.stdin.isTTY) {
      readline.emitKeypressEvents(process.stdin);
      if (!process.stdin.isRaw) {
        process.stdin.setRawMode(true);
      }
    }

    process.stdin.on('keypress', listener);
  });
}

/**
 * Mostra dicas de atalhos de teclado
 */
function showKeyboardHints() {
  console.log(chalk.gray('  Shortcuts: ') +
    chalk.white('t') + chalk.gray('=hint  ') +
    chalk.white('n') + chalk.gray('=next  ') +
    chalk.white('s') + chalk.gray('=stats  ') +
    chalk.white('l') + chalk.gray('=list (choose exercise)  ') +
    chalk.white('c') + chalk.gray('=clear  ') +
    chalk.white('h') + chalk.gray('=help  ') +
    chalk.white('q') + chalk.gray('=quit'));
  console.log(chalk.gray('─'.repeat(50)) + '\n');
}

/**
 * Mostra a tela de ajuda completa.
 */
function showHelp() {
  console.clear();
  console.log(chalk.bold.blue('FHElings Help'));
  console.log(chalk.gray('─'.repeat(50)) + '\n');
  
  console.log(chalk.bold.yellow('How to:'));
  console.log('FHElings is an interactive learning platform.');

  console.log(chalk.bold.white('\n Keyboard Shortcuts'));
  console.log(`  ${chalk.cyan('t')} - ${chalk.gray('Hint')}:   Shows a hint for the current problem.`);
  console.log(`  ${chalk.cyan('n')} - ${chalk.gray('Next')}:   GOes to the next problem.`);
  console.log(`  ${chalk.cyan('l')} - ${chalk.gray('List')}:   Shows a list with all available problems.`);
  console.log(`  ${chalk.cyan('s')} - ${chalk.gray('Stats')}:  Shows your learning stats.`);
  console.log(`  ${chalk.cyan('c')} - ${chalk.gray('Clear')}:  Clears the screen.`);
  console.log(`  ${chalk.cyan('h')} - ${chalk.gray('Help')}:   Shows this help menu.`);
  console.log(`  ${chalk.cyan('q')} - ${chalk.gray('Quit')}:   Quits the program (also Ctrl^C).`);

  console.log(chalk.gray('\n' + '─'.repeat(50)));
  console.log(chalk.gray('  Press any key to return...'));
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
        console.log(chalk.yellow('\n\n See you soon!\n'));
        process.exit(0);
      }

      // Não processar outros comandos se estamos aguardando navegação
      if (awaitingNavigation && key.name !== 'n') {
        return;
      }

      switch (key.name) {
        case 't':
          const current = getCurrentExercise();
          if (current) {
            ui.showProgressiveHint(current.name, current.hints);
          }
          break;

        case 's':
          gamification.showStats();
          console.log(chalk.gray('\n  Press any key to continue...\n'));
          await waitForKeypress();

          console.clear();
          const exS = getCurrentExercise();
          if (exS) {
            const idx = allExercises.findIndex(e => e.path === exS.path) + 1;
            ui.nextChallenge(exS.name, idx, allExercises.length);
            showKeyboardHints();
          }
          break;

        case 'l':
          // Mostrar lista e permitir seleção
          const changed = await showExerciseListWithSelection(allExercises, setCurrentExercise);
          if (changed) {
            // Redraw current exercise after selection
            console.clear();
            const exL = getCurrentExercise();
            if (exL) {
              const idxL = allExercises.findIndex(e => e.path === exL.path) + 1;
              ui.nextChallenge(exL.name, idxL, allExercises.length);
              showKeyboardHints();
            }
          }
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
        case 'h':
          console.clear();
          showHelp();
          await waitForKeypress();
          
          console.clear();
          const exH = getCurrentExercise();
          if (exH) {
            const idxH = allExercises.findIndex(e => e.path === exH.path) + 1;
            ui.nextChallenge(exH.name, idxH, allExercises.length);
            showKeyboardHints();
          }
          break;
  


        case 'q':
          console.log(chalk.yellow('\n\n Bye bye!\n'));
          gamification.showStats();
          console.log(chalk.gray('\n'));
          process.exit(0);
          break;
      }
    });
  }
}

/**
 * Waits for a single keypress
 */
async function waitForKeypress(): Promise<void> {
  return new Promise((resolve) => {
    const listener = (str: string, key: any) => {
      process.stdin.removeListener('keypress', listener);
      resolve();
    };
    process.stdin.once('keypress', listener);
  });
}

/**
 * Mostra lista de exercícios e permite seleção
 * Retorna true se um exercício foi selecionado
 */
async function showExerciseListWithSelection(
  allExercises: Exercise[],
  setCurrentExercise: (ex: Exercise | null) => void
): Promise<boolean> {
  console.clear();

  // Usa cache para status dos exercícios (muito mais rápido!)
  const exerciseStatuses = allExercises.map((exercise, index) => ({
    name: exercise.name,
    solved: exerciseStatusCache.get(exercise.name) || false,
    index: index + 1
  }));

  ui.listExercises(exerciseStatuses.map(e => ({ name: e.name, solved: e.solved })));
  gamification.showStats();

  console.log(chalk.yellow('\n  💡 Type the exercise number (1-' + allExercises.length + ') or press Enter to return:'));
  console.log(chalk.gray('  '));

  // Lê input do usuário
  const input = await readLineInput();

  if (input && !isNaN(Number(input))) {
    const selectedIndex = Number(input) - 1;
    if (selectedIndex >= 0 && selectedIndex < allExercises.length) {
      const selectedExercise = allExercises[selectedIndex];
      console.log(chalk.green(`\n  ✓ Going to: ${selectedExercise.name}\n`));

      // Fecha watcher atual se existir
      if (currentWatcher) {
        await currentWatcher.close();
        currentWatcher = null;
      }

      // Atualiza para o exercício selecionado
      setCurrentExercise(selectedExercise);

      // Pequeno delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } else {
      console.log(chalk.red('\n  ❌ Invalid number!'));
      await new Promise(resolve => setTimeout(resolve, 1000));
      return false;
    }
  }
  return false;
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
      ui.info(`To continue, please delete the file: ${exercise.path}`);
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