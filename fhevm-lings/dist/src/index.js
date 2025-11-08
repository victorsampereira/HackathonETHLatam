#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
const chokidar_1 = __importDefault(require("chokidar"));
const chalk_1 = __importDefault(require("chalk"));
const ui_1 = require("./ui");
const exerciseRepo_1 = require("./exerciseRepo");
const compiler_1 = require("./compiler");
const gamification_1 = require("./gamification");
// Estado global de navegação
let currentWatcher = null;
let awaitingNavigation = false;
// Cache de status dos exercícios (para acelerar lista)
const exerciseStatusCache = new Map();
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const allExercises = await (0, exerciseRepo_1.getExercises)();
    // Comando: mostra dica do exercício atual
    if (command === 'hint') {
        const currentExercise = await (0, exerciseRepo_1.findNextUnsolved)(allExercises);
        if (currentExercise) {
            ui_1.ui.showHint(currentExercise.hint);
        }
        else {
            ui_1.ui.allDone();
        }
        return;
    }
    // lista todos os exercícios com status
    if (command === 'list') {
        const exerciseStatuses = await Promise.all(allExercises.map(async (exercise) => ({
            name: exercise.name,
            solved: await (0, exerciseRepo_1.isSolved)(exercise),
        })));
        ui_1.ui.listExercises(exerciseStatuses);
        return;
    }
    // verifica um exercício específico
    if (command === 'verify') {
        const exerciseName = args[1];
        if (!exerciseName) {
            console.log(chalk_1.default.red(' Please specify an existing problem.'));
            console.log(chalk_1.default.gray('   Example: npm run watch verify 03_encrypt_euint32'));
            return;
        }
        const exercise = allExercises.find(ex => ex.name === exerciseName);
        if (!exercise) {
            console.log(chalk_1.default.red(`Problem "${exerciseName}" not found.`));
            return;
        }
        console.log(chalk_1.default.blue(`\n Verifying ${exercise.name}...\n`));
        const result = await (0, compiler_1.compile)(exercise.path);
        if (result.success) {
            console.log(chalk_1.default.green('Problem solved!'));
        }
        else {
            console.log(chalk_1.default.red(' Exercise is still incorrect.'));
            ui_1.ui.showHint(exercise.hint);
            if (result.error) {
                console.log(chalk_1.default.gray('\nError:\n' + result.error));
            }
        }
        return;
    }
    // Default watch mode com atalhos de teclado
    ui_1.ui.welcome();
    console.log(chalk_1.default.cyan('\n  Press Enter to start...'));
    // Aguarda Enter para começar
    await waitForEnter();
    // Inicializa cache de forma otimizada (lazy loading)
    console.log(chalk_1.default.gray('\n  Loading exercises state...\n'));
    // Carrega apenas até encontrar o primeiro não resolvido (muito mais rápido!)
    let currentExercise = null;
    for (const exercise of allExercises) {
        const solved = await (0, exerciseRepo_1.isSolved)(exercise);
        exerciseStatusCache.set(exercise.name, solved);
        if (!solved && !currentExercise) {
            currentExercise = exercise;
            // Carrega o resto em background sem bloquear
            Promise.all(allExercises.slice(allExercises.indexOf(exercise) + 1).map(async (ex) => {
                const s = await (0, exerciseRepo_1.isSolved)(ex);
                exerciseStatusCache.set(ex.name, s);
            }));
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
        const currentIndex = allExercises.findIndex(ex => ex.path === currentExercise.path) + 1;
        ui_1.ui.nextChallenge(currentExercise.name, currentIndex, totalExercises);
        showKeyboardHints();
        // Observa o exercício e espera por sucesso ou navegação
        const success = await watchExercise(currentExercise);
        if (success) {
            // Atualiza cache para marcar exercício como resolvido
            exerciseStatusCache.set(currentExercise.name, true);
            ui_1.ui.success(currentExercise.name);
            gamification_1.gamification.resetHintLevel(currentExercise.name);
            // Aguarda comando 'n' para avançar
            ui_1.ui.showNextPrompt();
            awaitingNavigation = true;
            const nextExercise = await waitForNext(allExercises, currentExercise);
            awaitingNavigation = false;
            currentExercise = nextExercise;
        }
        else {
            break; // Sai se watcher falhar
        }
    }
    // Todos os exercícios completos
    if (!currentExercise) {
        ui_1.ui.allDone();
    }
}
/**
 * Aguarda usuário pressionar Enter
 */
async function waitForEnter() {
    return new Promise((resolve) => {
        const listener = (_str, key) => {
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
    console.log(chalk_1.default.gray('  Shortcuts: ') +
        chalk_1.default.white('t') + chalk_1.default.gray('=hint  ') +
        chalk_1.default.white('n') + chalk_1.default.gray('=next  ') +
        chalk_1.default.white('s') + chalk_1.default.gray('=stats  ') +
        chalk_1.default.white('l') + chalk_1.default.gray('=list (choose exercise)  ') +
        chalk_1.default.white('c') + chalk_1.default.gray('=clear  ') +
        chalk_1.default.white('h') + chalk_1.default.gray('=help  ') +
        chalk_1.default.white('q') + chalk_1.default.gray('=quit'));
    console.log(chalk_1.default.gray('─'.repeat(50)) + '\n');
}
/**
 * Mostra a tela de ajuda completa.
 */
function showHelp() {
    console.clear();
    console.log(chalk_1.default.bold.blue('FHElings Help'));
    console.log(chalk_1.default.gray('─'.repeat(50)) + '\n');
    console.log(chalk_1.default.bold.yellow('How to:'));
    console.log('FHElings is an interactive learning platform.');
    console.log(chalk_1.default.bold.white('\n Keyboard Shortcuts'));
    console.log(`  ${chalk_1.default.cyan('t')} - ${chalk_1.default.gray('Hint')}:   Shows a hint for the current problem.`);
    console.log(`  ${chalk_1.default.cyan('n')} - ${chalk_1.default.gray('Next')}:   GOes to the next problem.`);
    console.log(`  ${chalk_1.default.cyan('l')} - ${chalk_1.default.gray('List')}:   Shows a list with all available problems.`);
    console.log(`  ${chalk_1.default.cyan('s')} - ${chalk_1.default.gray('Stats')}:  Shows your learning stats.`);
    console.log(`  ${chalk_1.default.cyan('c')} - ${chalk_1.default.gray('Clear')}:  Clears the screen.`);
    console.log(`  ${chalk_1.default.cyan('h')} - ${chalk_1.default.gray('Help')}:   Shows this help menu.`);
    console.log(`  ${chalk_1.default.cyan('q')} - ${chalk_1.default.gray('Quit')}:   Quits the program (also Ctrl^C).`);
    console.log(chalk_1.default.gray('\n' + '─'.repeat(50)));
    console.log(chalk_1.default.gray('  Press any key to return...'));
}
/**
 * Aguarda comando 'n' para avançar ao próximo exercício
 */
async function waitForNext(allExercises, currentExercise) {
    return new Promise((resolve) => {
        let selectedExercise = null;
        const navigationListener = async (str, key) => {
            if (awaitingNavigation && key.name === 'n') {
                // Avançar para próximo não resolvido
                const nextUnsolved = await (0, exerciseRepo_1.findNextUnsolved)(allExercises);
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
function setupKeyboardShortcuts(allExercises, getCurrentExercise, setCurrentExercise) {
    if (process.stdin.isTTY) {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', async (str, key) => {
            if (key.ctrl && key.name === 'c') {
                console.log(chalk_1.default.yellow('\n\n See you soon!\n'));
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
                        ui_1.ui.showProgressiveHint(current.name, current.hints);
                    }
                    break;
                case 's':
                    gamification_1.gamification.showStats();
                    console.log(chalk_1.default.gray('\n  Press any key to continue...\n'));
                    await waitForKeypress();
                    console.clear();
                    const exS = getCurrentExercise();
                    if (exS) {
                        const idx = allExercises.findIndex(e => e.path === exS.path) + 1;
                        ui_1.ui.nextChallenge(exS.name, idx, allExercises.length);
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
                            ui_1.ui.nextChallenge(exL.name, idxL, allExercises.length);
                            showKeyboardHints();
                        }
                    }
                    break;
                case 'c':
                    console.clear();
                    const ex = getCurrentExercise();
                    if (ex) {
                        const idx = allExercises.findIndex(e => e.path === ex.path) + 1;
                        ui_1.ui.nextChallenge(ex.name, idx, allExercises.length);
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
                        ui_1.ui.nextChallenge(exH.name, idxH, allExercises.length);
                        showKeyboardHints();
                    }
                    break;
                case 'q':
                    console.log(chalk_1.default.yellow('\n\n Bye bye!\n'));
                    gamification_1.gamification.showStats();
                    console.log(chalk_1.default.gray('\n'));
                    process.exit(0);
                    break;
            }
        });
    }
}
/**
 * Waits for a single keypress
 */
async function waitForKeypress() {
    return new Promise((resolve) => {
        const listener = (str, key) => {
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
async function showExerciseListWithSelection(allExercises, setCurrentExercise) {
    console.clear();
    // Usa cache para status dos exercícios (muito mais rápido!)
    const exerciseStatuses = allExercises.map((exercise, index) => ({
        name: exercise.name,
        solved: exerciseStatusCache.get(exercise.name) || false,
        index: index + 1
    }));
    ui_1.ui.listExercises(exerciseStatuses.map(e => ({ name: e.name, solved: e.solved })));
    gamification_1.gamification.showStats();
    console.log(chalk_1.default.yellow('\n  💡 Type the exercise number (1-' + allExercises.length + ') or press Enter to return:'));
    console.log(chalk_1.default.gray('  '));
    // Lê input do usuário
    const input = await readLineInput();
    if (input && !isNaN(Number(input))) {
        const selectedIndex = Number(input) - 1;
        if (selectedIndex >= 0 && selectedIndex < allExercises.length) {
            const selectedExercise = allExercises[selectedIndex];
            console.log(chalk_1.default.green(`\n  ✓ Going to: ${selectedExercise.name}\n`));
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
        }
        else {
            console.log(chalk_1.default.red('\n  ❌ Invalid number!'));
            await new Promise(resolve => setTimeout(resolve, 1000));
            return false;
        }
    }
    return false;
}
/**
 * Lê uma linha de input do usuário
 */
async function readLineInput() {
    return new Promise((resolve) => {
        let input = '';
        const inputListener = (str, key) => {
            if (key.name === 'return') {
                process.stdin.removeListener('keypress', inputListener);
                console.log(); // Nova linha
                resolve(input);
            }
            else if (key.name === 'backspace') {
                if (input.length > 0) {
                    input = input.slice(0, -1);
                    process.stdout.write('\b \b');
                }
            }
            else if (str && str >= '0' && str <= '9') {
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
function watchExercise(exercise) {
    const fullPath = path.resolve(exercise.path);
    return new Promise((resolve) => {
        if (exercise.path.endsWith('.md')) {
            ui_1.ui.info(`To continue, please delete the file: ${exercise.path}`);
            const watcher = chokidar_1.default.watch(fullPath);
            currentWatcher = watcher;
            watcher.on('unlink', () => {
                watcher.close();
                currentWatcher = null;
                resolve(true);
            });
        }
        else if (exercise.path.endsWith('.sol')) {
            ui_1.ui.showExercisePath(exercise.path);
            const watcher = chokidar_1.default.watch(fullPath);
            currentWatcher = watcher;
            const onFileChanged = async (changedPath) => {
                ui_1.ui.compiling();
                const result = await (0, compiler_1.compile)(changedPath);
                if (result.success) {
                    watcher.close();
                    currentWatcher = null;
                    resolve(true);
                }
                else {
                    ui_1.ui.failure(exercise.hint, result.error);
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
