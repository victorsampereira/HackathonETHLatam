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
exports.InteractiveMode = void 0;
const readline = __importStar(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
class InteractiveMode {
    constructor() {
        this.currentExercise = null;
        this.allExercises = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk_1.default.gray('\n '),
        });
        this.setupCommands();
    }
    setExercises(exercises) {
        this.allExercises = exercises;
    }
    setCurrentExercise(exercise) {
        this.currentExercise = exercise;
    }
    setupCommands() {
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
                    console.log(chalk_1.default.yellow('\n Later!\n'));
                    process.exit(0);
                    break;
                case '':
                    // Enter vazio - apenas mostra o prompt novamente
                    break;
                default:
                    console.log(chalk_1.default.red(`Unknown command: "${command}"`));
                    console.log(chalk_1.default.gray('   Press "help" to see available commands.'));
            }
            this.rl.prompt();
        });
    }
    showHint() {
        if (this.currentExercise) {
            console.log(chalk_1.default.yellow('\n Hint:'));
            console.log(chalk_1.default.cyan(`   ${this.currentExercise.hint}`));
        }
        else {
            console.log(chalk_1.default.gray('\n   No current exercise.'));
        }
    }
    async showList() {
        // Importa dinamicamente para evitar dependência circular
        const { isSolved } = await Promise.resolve().then(() => __importStar(require('./exerciseRepo')));
        console.log(chalk_1.default.yellow('\n List of problems:\n'));
        for (let i = 0; i < this.allExercises.length; i++) {
            const exercise = this.allExercises[i];
            const solved = await isSolved(exercise);
            const status = solved ? chalk_1.default.green('✓') : chalk_1.default.gray('○');
            const isCurrent = this.currentExercise?.name === exercise.name;
            const name = isCurrent
                ? chalk_1.default.bold.white(exercise.name) + chalk_1.default.yellow(' ← current')
                : solved
                    ? chalk_1.default.gray(exercise.name)
                    : chalk_1.default.white(exercise.name);
            console.log(`   ${status} ${i + 1}. ${name}`);
        }
        console.log('');
    }
    showHelp() {
        console.log(chalk_1.default.yellow('\n Available commands:\n'));
        console.log(chalk_1.default.white('   tip, t') + chalk_1.default.gray('      - Shows hint '));
        console.log(chalk_1.default.white('   list, l') + chalk_1.default.gray('      - Lists all problems'));
        console.log(chalk_1.default.white('   clear, c') + chalk_1.default.gray('     - Clears screen'));
        console.log(chalk_1.default.white('   next, n') + chalk_1.default.gray('     - Goes to next problem'));
        console.log(chalk_1.default.white('   help, h') + chalk_1.default.gray('      - Shows help panel'));
        console.log(chalk_1.default.white('   quit, q') + chalk_1.default.gray('      - Quits program'));
        console.log('');
    }
    showPromptHelp() {
        console.log(chalk_1.default.gray('Press "help" to see available commands'));
    }
    start() {
        this.showPromptHelp();
        this.rl.prompt();
    }
    updatePrompt(message) {
        if (message) {
            console.log(message);
        }
        this.rl.prompt();
    }
    close() {
        this.rl.close();
    }
}
exports.InteractiveMode = InteractiveMode;
