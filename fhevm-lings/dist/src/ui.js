"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ui = void 0;
const chalk_1 = __importDefault(require("chalk"));
const gamification_1 = require("./gamification");
const LOG_PREFIX = chalk_1.default.blue('FHElings ---');
// Função helper para criar barra de progresso
function createProgressBar(current, total, width = 30) {
    const percentage = Math.floor((current / total) * 100);
    const filled = Math.floor((current / total) * width);
    const empty = width - filled;
    const bar = chalk_1.default.green('█'.repeat(filled)) + chalk_1.default.gray('░'.repeat(empty));
    return `${bar} ${percentage}%`;
}
exports.ui = {
    welcome: () => {
        console.clear();
        console.log(chalk_1.default.bold.cyan('\n╔═══════════════════════════════════════╗'));
        console.log(chalk_1.default.bold.cyan('║                                       ║'));
        console.log(chalk_1.default.bold.cyan('║       ') + chalk_1.default.bold.white(' Welcome to FHElings!  ') + chalk_1.default.bold.cyan('         ║'));
        console.log(chalk_1.default.bold.cyan('║                                       ║'));
        console.log(chalk_1.default.bold.cyan('╚═══════════════════════════════════════╝'));
        console.log(chalk_1.default.gray('\nLearn FHEVM by solving interactive exercises!\n'));
        console.log(chalk_1.default.white.bold(' How it works:'));
        console.log(chalk_1.default.gray('  1. ') + chalk_1.default.white('Read the exercise') + chalk_1.default.gray(' - Each file has a TODO comment'));
        console.log(chalk_1.default.gray('  2. ') + chalk_1.default.white('Write your solution') + chalk_1.default.gray(' - Fill in the missing code'));
        console.log(chalk_1.default.gray('  3. ') + chalk_1.default.white('Save the file') + chalk_1.default.gray(' - Auto-tested instantly!'));
        console.log(chalk_1.default.gray('  4. ') + chalk_1.default.white('Get feedback') + chalk_1.default.gray(' - Hints if something is wrong'));
        console.log(chalk_1.default.gray('  5. ') + chalk_1.default.white('Press ') + chalk_1.default.yellow('n') + chalk_1.default.gray(' to advance to next exercise\n'));
        console.log(chalk_1.default.yellow(' Keyboard Shortcuts:'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('t') + chalk_1.default.gray(' - Progressive hints (3 levels)'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('n') + chalk_1.default.gray(' - Advance to next exercise (after completing)'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('s') + chalk_1.default.gray(' - View your statistics'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('l') + chalk_1.default.gray(' - List and choose exercise'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('c') + chalk_1.default.gray(' - Clear screen'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('h') + chalk_1.default.gray(' - Help menu'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('q') + chalk_1.default.gray(' - Quit program'));
        console.log(chalk_1.default.yellow('\n CLI Commands (in another terminal):'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('npm run watch list') + chalk_1.default.gray(' - Lists all exercises'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('npm run watch hint') + chalk_1.default.gray(' - Shows hint for current exercise'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('npm run watch verify <name>') + chalk_1.default.gray(' - Verifies specific exercise'));
        console.log(chalk_1.default.gray('\n' + '─'.repeat(50) + '\n'));
    },
    nextChallenge: (exerciseName, currentIndex, totalExercises, clearScreen = true) => {
        if (clearScreen) {
            console.clear();
        }
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(`\n${LOG_PREFIX} ${chalk_1.default.bold.yellow('Current exercise')}`);
        console.log(chalk_1.default.gray(`  Progress: ${currentIndex}/${totalExercises}`));
        console.log(`  ${createProgressBar(currentIndex - 1, totalExercises)}`);
        console.log(`\n  ${chalk_1.default.bold.white(exerciseName)}`);
        console.log(chalk_1.default.gray('  Awaiting changes on the file...\n'));
    },
    compiling: () => {
        // Limpa TODO o terminal antes de compilar para evitar acúmulo de erros
        console.clear();
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(`${LOG_PREFIX} ${chalk_1.default.blue(' Compiling and testing...')}`);
        console.log(chalk_1.default.gray('─'.repeat(50)) + '\n');
    },
    success: (exerciseName) => {
        gamification_1.gamification.incrementStreak();
        gamification_1.gamification.recordAttempt(true);
        gamification_1.gamification.celebrate(exerciseName);
    },
    failure: (hint, error, exerciseName) => {
        gamification_1.gamification.recordAttempt(false);
        console.log(chalk_1.default.red(' Test failed!'));
        console.log(chalk_1.default.red('  ├─ The exercise still isnt correct.'));
        console.log(chalk_1.default.red('  └─ Check your code then save the file again.\n'));
        // Mensagem motivacional
        console.log(chalk_1.default.magenta('  ' + gamification_1.gamification.getEncouragementMessage('failure')));
        console.log(chalk_1.default.yellow('\n   Tip:'));
        console.log(chalk_1.default.cyan('     ' + hint));
        if (error) {
            // Extrai a mensagem de erro principal
            const errorMatch = error.match(/Error: (.+?)(?:\n|$)/);
            if (errorMatch) {
                console.log(chalk_1.default.gray('\n  ** Error ** : ') + chalk_1.default.white(errorMatch[1]));
            }
            // Mostra apenas as linhas mais relevantes do erro
            const errorLines = error.split('\n').filter(line => {
                return line.includes('AssertionError') ||
                    line.includes('expected') ||
                    line.includes('actual');
            });
            if (errorLines.length > 0) {
                console.log(chalk_1.default.gray('\n  Details:'));
                errorLines.slice(0, 3).forEach(line => {
                    console.log(chalk_1.default.gray('     ' + line.trim()));
                });
            }
        }
        console.log(chalk_1.default.gray('\n   💭 Tip: Press ') + chalk_1.default.white('t') + chalk_1.default.gray(' to see progressive hints'));
        console.log(chalk_1.default.gray('  Waiting for next attempt...\n'));
    },
    showHint: (hint) => {
        console.log(`\n${LOG_PREFIX} ${chalk_1.default.bold.white(' Tip:')}`);
        console.log(chalk_1.default.cyan(`  ${hint}\n`));
    },
    showProgressiveHint: (exerciseName, hints) => {
        const level = gamification_1.gamification.getNextHintLevel(exerciseName);
        console.log(chalk_1.default.yellow(`\n${gamification_1.gamification.getEncouragementMessage('hint')}`));
        if (hints && hints.length > 0 && level < hints.length) {
            console.log(chalk_1.default.cyan(`\n  Hint level ${level + 1}/${hints.length}:`));
            console.log(chalk_1.default.white(`  ${hints[level]}\n`));
            if (level < hints.length - 1) {
                console.log(chalk_1.default.gray(`  💡 Press 't' again for more specific hint (${hints.length - level - 1} remaining)\n`));
            }
            else {
                console.log(chalk_1.default.yellow(`  ⭐ This was the most specific hint!\n`));
            }
        }
        else {
            // Fallback para hint simples
            console.log(chalk_1.default.cyan(`\n  Tip:`));
            console.log(chalk_1.default.white(`  You can find the FHEVM documentation here: https://docs.zama.org/protocol.\n`));
        }
    },
    showNextPrompt: () => {
        console.log(chalk_1.default.yellow('\n  Press ') + chalk_1.default.white.bold('n') + chalk_1.default.yellow(' to advance to the next exercise'));
        console.log(chalk_1.default.gray('     or ') + chalk_1.default.white('l') + chalk_1.default.gray(' to choose an specific problem\n'));
    },
    listExercises: (exercises) => {
        console.clear();
        console.log(`\n${LOG_PREFIX} ${chalk_1.default.bold.yellow('Exercise list')}\n`);
        console.log(chalk_1.default.gray('─'.repeat(50)) + '\n');
        exercises.forEach((exercise, index) => {
            const status = exercise.solved ? chalk_1.default.green('✓') : chalk_1.default.yellow('○');
            const name = exercise.solved
                ? chalk_1.default.gray.strikethrough(exercise.name)
                : chalk_1.default.white(exercise.name);
            const icon = exercise.solved ? 'y' : 'n';
            console.log(`  ${status} ${icon} ${chalk_1.default.gray(`${String(index + 1).padStart(2, '0')}:`)} ${name}`);
        });
        const solved = exercises.filter(e => e.solved).length;
        const total = exercises.length;
        console.log('\n' + chalk_1.default.gray('─'.repeat(50)));
        console.log(`\n  ${chalk_1.default.bold('General Progress:')}`);
        console.log(`  ${createProgressBar(solved, total, 40)}`);
        console.log(chalk_1.default.gray(`  ${solved} out of ${total} exercises made\n`));
    },
    allDone: () => {
        console.clear();
        console.log(chalk_1.default.bold.cyan('\n=═══════════════════════════════════════='));
        console.log(chalk_1.default.bold.green('\n           Congratulations!!!'));
        console.log(chalk_1.default.bold.cyan('\n=═══════════════════════════════════════='));
        console.log(chalk_1.default.green('  You have completod all of FHElings exercises!'));
        console.log(chalk_1.default.white('\n  You now know how to:'));
        console.log(chalk_1.default.cyan('    ✓ Import the FHE library'));
        console.log(chalk_1.default.cyan('    ✓ Encrypt data (euint32)'));
        console.log(chalk_1.default.cyan('    ✓ Homomorphic operations (adittion, subtraction, multiplication)'));
        console.log(chalk_1.default.cyan('    ✓ Encrypted comparisons'));
        console.log(chalk_1.default.cyan('    ✓ Conditional Logic '));
        console.log(chalk_1.default.gray('\n  You know have the basic concepts to build '));
        console.log(chalk_1.default.gray('  using FHEVM`s homomorphic cryptography! \n'));
        console.log(chalk_1.default.yellow('  Next steps:'));
        console.log(chalk_1.default.white('    • Explore the documentation: https://docs.zama.org/protocol') + chalk_1.default.blue(''));
        console.log(chalk_1.default.white('    • Build your first project with FHEVM'));
        console.log(chalk_1.default.white('    • Share what you`ve learned!\n'));
    },
    info: (message) => {
        console.log(`${LOG_PREFIX} ${chalk_1.default.gray(message)}`);
    },
    showExercisePath: (path) => {
        console.log(chalk_1.default.gray(`  File: ${path}`));
    },
    separator: () => {
        console.log(chalk_1.default.gray('─'.repeat(50)));
    }
};
