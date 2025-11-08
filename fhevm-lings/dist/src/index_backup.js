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
// Esta é a função principal que orquestra tudo
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const allExercises = await (0, exerciseRepo_1.getExercises)();
    // Comando: mostrar dica do exercício atual
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
    // Comando: listar todos os exercícios com status
    if (command === 'list') {
        const exerciseStatuses = await Promise.all(allExercises.map(async (exercise) => ({
            name: exercise.name,
            solved: await (0, exerciseRepo_1.isSolved)(exercise),
        })));
        ui_1.ui.listExercises(exerciseStatuses);
        return;
    }
    // Comando: verificar um exercício específico
    if (command === 'verify') {
        const exerciseName = args[1];
        if (!exerciseName) {
            console.log(chalk_1.default.red('❌ Por favor especifique o nome do exercício.'));
            console.log(chalk_1.default.gray('   Exemplo: npm run watch verify 03_encrypt_euint32'));
            return;
        }
        const exercise = allExercises.find(ex => ex.name === exerciseName);
        if (!exercise) {
            console.log(chalk_1.default.red(`❌ Exercício "${exerciseName}" não encontrado.`));
            return;
        }
        console.log(chalk_1.default.blue(`\n🔄 Verificando ${exercise.name}...\n`));
        const result = await (0, compiler_1.compile)(exercise.path);
        if (result.success) {
            console.log(chalk_1.default.green('✅ Exercício correto!'));
        }
        else {
            console.log(chalk_1.default.red('❌ Exercício ainda incorreto.'));
            ui_1.ui.showHint(exercise.hint);
            if (result.error) {
                console.log(chalk_1.default.gray('\nErro:\n' + result.error));
            }
        }
        return;
    }
    // Default watch mode com atalhos de teclado
    ui_1.ui.welcome();
    let exerciseToRun = await (0, exerciseRepo_1.findNextUnsolved)(allExercises);
    const totalExercises = allExercises.length;
    // Estado compartilhado para navegação
    const navigationState = {
        currentExercise: exerciseToRun,
        shouldAdvance: false,
        shouldJumpTo: null,
        watcher: null,
    };
    // Configura atalhos de teclado com controle de navegação
    setupKeyboardShortcuts(allExercises, navigationState);
    // O loop principal do programa
    while (navigationState.currentExercise != null) {
        const currentExercise = navigationState.currentExercise;
        const currentIndex = allExercises.findIndex(ex => ex.path === currentExercise.path) + 1;
        ui_1.ui.nextChallenge(currentExercise.name, currentIndex, totalExercises);
        showKeyboardHints();
        // Passa o controlo para o "watcher" e espera ação do usuário
        const result = await watchExercise(currentExercise, navigationState);
        if (result.success) {
            ui_1.ui.success(currentExercise.name);
            gamification_1.gamification.resetHintLevel(currentExercise.name);
            // Mostra opção de avançar manualmente
            ui_1.ui.showNextPrompt();
            // Aguarda comando do usuário (n para avançar)
            await waitForNavigation(navigationState);
        }
        else if (result.shouldJumpTo) {
            // Usuário escolheu um exercício da lista
            navigationState.currentExercise = result.shouldJumpTo;
        }
        else {
            break; // Sai do loop
        }
    }
    // Se o loop terminar e não houver exercício, estamos feitos.
    if (!navigationState.currentExercise) {
        ui_1.ui.allDone();
    }
}
/**
 * Mostra dicas de atalhos de teclado
 */
function showKeyboardHints() {
    console.log(chalk_1.default.gray('  Atalhos: ') +
        chalk_1.default.white('h') + chalk_1.default.gray('=dica  ') +
        chalk_1.default.white('n') + chalk_1.default.gray('=próximo  ') +
        chalk_1.default.white('s') + chalk_1.default.gray('=stats  ') +
        chalk_1.default.white('l') + chalk_1.default.gray('=lista  ') +
        chalk_1.default.white('c') + chalk_1.default.gray('=limpar  ') +
        chalk_1.default.white('q') + chalk_1.default.gray('=sair'));
    console.log(chalk_1.default.gray('─'.repeat(50)) + '\n');
}
/**
 * Aguarda navegação do usuário após completar exercício
 */
async function waitForNavigation(navState) {
    return new Promise((resolve) => {
        const originalListener = process.stdin.listeners('keypress')[0];
        const navigationListener = (str, key) => {
            if (key.name === 'n') {
                // Avançar para próximo exercício não resolvido
                navState.shouldAdvance = true;
                process.stdin.removeListener('keypress', navigationListener);
                resolve();
            }
        };
        process.stdin.on('keypress', navigationListener);
    });
}
/**
 * Configura atalhos de teclado para comandos rápidos
 */
function setupKeyboardShortcuts(allExercises, getCurrentExercise) {
    if (process.stdin.isTTY) {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', async (str, key) => {
            if (key.ctrl && key.name === 'c') {
                console.log(chalk_1.default.yellow('\n\n👋 Até logo!\n'));
                process.exit(0);
            }
            switch (key.name) {
                case 'h':
                    // Mostrar dica progressiva
                    const current = getCurrentExercise();
                    if (current) {
                        ui_1.ui.showProgressiveHint(current.name, current.hints);
                    }
                    break;
                case 's':
                    // Mostrar estatísticas
                    gamification_1.gamification.showStats();
                    console.log(chalk_1.default.gray('\n  Pressione qualquer tecla para continuar...\n'));
                    break;
                case 'l':
                    // Mostrar lista
                    console.clear();
                    const exerciseStatuses = await Promise.all(allExercises.map(async (exercise) => ({
                        name: exercise.name,
                        solved: await (0, exerciseRepo_1.isSolved)(exercise),
                    })));
                    ui_1.ui.listExercises(exerciseStatuses);
                    gamification_1.gamification.showStats();
                    console.log(chalk_1.default.gray('\nPressione qualquer tecla para voltar...'));
                    break;
                case 'c':
                    // Limpar tela
                    console.clear();
                    const ex = getCurrentExercise();
                    if (ex) {
                        const idx = allExercises.findIndex(e => e.path === ex.path) + 1;
                        ui_1.ui.nextChallenge(ex.name, idx, allExercises.length);
                        showKeyboardHints();
                    }
                    break;
                case 'q':
                    // Sair
                    console.log(chalk_1.default.yellow('\n\n👋 Até logo!\n'));
                    gamification_1.gamification.showStats();
                    console.log(chalk_1.default.gray('\n'));
                    process.exit(0);
                    break;
            }
        });
    }
}
/**
 * Observa um exercício específico e espera por uma "resolução".
 * Retorna uma Promise que resolve para 'true' quando o desafio é superado.
 */
function watchExercise(exercise) {
    const fullPath = path.resolve(exercise.path);
    return new Promise((resolve) => {
        if (exercise.path.endsWith('.md')) {
            // Desafio .md: Esperar que o ficheiro seja apagado
            ui_1.ui.info(`Para continuar, por favor APAGUE o ficheiro: ${exercise.path}`);
            const watcher = chokidar_1.default.watch(fullPath);
            watcher.on('unlink', () => {
                watcher.close();
                resolve(true);
            });
        }
        else if (exercise.path.endsWith('.sol')) {
            // Desafio .sol: Esperar por uma gravação que compile
            ui_1.ui.showExercisePath(exercise.path);
            const watcher = chokidar_1.default.watch(fullPath);
            const onFileChanged = async (changedPath) => {
                ui_1.ui.compiling();
                const result = await (0, compiler_1.compile)(changedPath);
                if (result.success) {
                    watcher.close();
                    resolve(true);
                }
                else {
                    // A compilação falhou. Mostrar a dica e continuar a observar.
                    ui_1.ui.failure(exercise.hint, result.error);
                }
            };
            // Tenta compilar imediatamente caso o ficheiro já esteja correto
            onFileChanged(fullPath);
            // Ouve por mudanças
            watcher.on('change', onFileChanged);
        }
    });
}
// Inicia a aplicação
main().catch((err) => {
    console.error('Um erro fatal ocorreu:', err);
    process.exit(1);
});
