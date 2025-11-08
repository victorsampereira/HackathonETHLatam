"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ui = void 0;
const chalk_1 = __importDefault(require("chalk"));
const gamification_1 = require("./gamification");
const LOG_PREFIX = chalk_1.default.blue('⚡fhevm-lings');
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
        console.log(chalk_1.default.bold.cyan('║  ') + chalk_1.default.bold.white('⚡ Bem-vindo ao fhevm-lings! ⚡') + chalk_1.default.bold.cyan('  ║'));
        console.log(chalk_1.default.bold.cyan('║                                       ║'));
        console.log(chalk_1.default.bold.cyan('╚═══════════════════════════════════════╝'));
        console.log(chalk_1.default.gray('\nAprenda FHEVM corrigindo pequenos exercícios!\n'));
        console.log(chalk_1.default.yellow('⌨️  Atalhos de Teclado:'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('h') + chalk_1.default.gray(' - Dicas progressivas (3 níveis)'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('n') + chalk_1.default.gray(' - Avançar para próximo exercício (após completar)'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('s') + chalk_1.default.gray(' - Ver suas estatísticas'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('l') + chalk_1.default.gray(' - Listar e escolher exercício'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('c') + chalk_1.default.gray(' - Limpar a tela'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('q') + chalk_1.default.gray(' - Sair do programa'));
        console.log(chalk_1.default.yellow('\n📚 Comandos CLI (em outro terminal):'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('npm run watch list') + chalk_1.default.gray(' - Lista todos os exercícios'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('npm run watch hint') + chalk_1.default.gray(' - Mostra dica do exercício atual'));
        console.log(chalk_1.default.gray('  • ') + chalk_1.default.white('npm run watch verify <nome>') + chalk_1.default.gray(' - Verifica exercício específico'));
        console.log(chalk_1.default.gray('\n' + '─'.repeat(50) + '\n'));
    },
    nextChallenge: (exerciseName, currentIndex, totalExercises, clearScreen = true) => {
        if (clearScreen) {
            console.clear();
        }
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(`\n${LOG_PREFIX} ${chalk_1.default.bold.yellow('Exercício Atual')}`);
        console.log(chalk_1.default.gray(`  Progresso: ${currentIndex}/${totalExercises}`));
        console.log(`  ${createProgressBar(currentIndex - 1, totalExercises)}`);
        console.log(`\n  📝 ${chalk_1.default.bold.white(exerciseName)}`);
        console.log(chalk_1.default.gray('  Aguardando mudanças no arquivo...\n'));
    },
    compiling: () => {
        // Limpa TODO o terminal antes de compilar para evitar acúmulo de erros
        console.clear();
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(`${LOG_PREFIX} ${chalk_1.default.blue('🔄 Compilando e testando...')}`);
        console.log(chalk_1.default.gray('─'.repeat(50)) + '\n');
    },
    success: (exerciseName) => {
        gamification_1.gamification.incrementStreak();
        gamification_1.gamification.recordAttempt(true);
        gamification_1.gamification.celebrate(exerciseName);
    },
    failure: (hint, error, exerciseName) => {
        gamification_1.gamification.recordAttempt(false);
        console.log(`${LOG_PREFIX} ${chalk_1.default.red('❌ Teste falhou!')}`);
        console.log(chalk_1.default.red('  ├─ O exercício ainda não está correto.'));
        console.log(chalk_1.default.red('  └─ Corrija o código e salve o arquivo novamente.\n'));
        // Mensagem motivacional
        console.log(chalk_1.default.magenta('  ' + gamification_1.gamification.getEncouragementMessage('failure')));
        console.log(chalk_1.default.yellow('\n  💡 Dica:'));
        console.log(chalk_1.default.cyan('     ' + hint));
        if (error) {
            // Extrai a mensagem de erro principal
            const errorMatch = error.match(/Error: (.+?)(?:\n|$)/);
            if (errorMatch) {
                console.log(chalk_1.default.gray('\n  ⚠️  Erro: ') + chalk_1.default.white(errorMatch[1]));
            }
            // Mostra apenas as linhas mais relevantes do erro
            const errorLines = error.split('\n').filter(line => {
                return line.includes('AssertionError') ||
                    line.includes('expected') ||
                    line.includes('actual');
            });
            if (errorLines.length > 0) {
                console.log(chalk_1.default.gray('\n  Detalhes:'));
                errorLines.slice(0, 3).forEach(line => {
                    console.log(chalk_1.default.gray('     ' + line.trim()));
                });
            }
        }
        console.log(chalk_1.default.gray('\n  💭 Dica: Pressione ') + chalk_1.default.white('h') + chalk_1.default.gray(' para ver dicas progressivas'));
        console.log(chalk_1.default.gray('  Aguardando próxima tentativa...\n'));
    },
    showHint: (hint) => {
        console.log(`\n${LOG_PREFIX} ${chalk_1.default.bold.white('💡 Dica:')}`);
        console.log(chalk_1.default.cyan(`  ${hint}\n`));
    },
    showProgressiveHint: (exerciseName, hints) => {
        const level = gamification_1.gamification.getNextHintLevel(exerciseName);
        console.log(chalk_1.default.yellow(`\n${gamification_1.gamification.getEncouragementMessage('hint')}`));
        if (hints && hints.length > 0 && level < hints.length) {
            console.log(chalk_1.default.cyan(`\n  📝 Dica Nível ${level + 1}/${hints.length}:`));
            console.log(chalk_1.default.white(`  ${hints[level]}\n`));
            if (level < hints.length - 1) {
                console.log(chalk_1.default.gray(`  💡 Pressione 'h' novamente para dica mais específica (${hints.length - level - 1} restantes)\n`));
            }
            else {
                console.log(chalk_1.default.yellow(`  ⭐ Esta foi a dica mais específica!\n`));
            }
        }
        else {
            // Fallback para hint simples
            console.log(chalk_1.default.cyan(`\n  💡 Dica:`));
            console.log(chalk_1.default.white(`  Use a biblioteca FHE para resolver este exercício.\n`));
        }
    },
    showNextPrompt: () => {
        console.log(chalk_1.default.yellow('\n  ⏭️  Pressione ') + chalk_1.default.white.bold('n') + chalk_1.default.yellow(' para avançar ao próximo exercício'));
        console.log(chalk_1.default.gray('     ou ') + chalk_1.default.white('l') + chalk_1.default.gray(' para escolher um exercício específico\n'));
    },
    listExercises: (exercises) => {
        console.clear();
        console.log(`\n${LOG_PREFIX} ${chalk_1.default.bold.yellow('📋 Lista de Exercícios')}\n`);
        console.log(chalk_1.default.gray('─'.repeat(50)) + '\n');
        exercises.forEach((exercise, index) => {
            const status = exercise.solved ? chalk_1.default.green('✓') : chalk_1.default.yellow('○');
            const name = exercise.solved
                ? chalk_1.default.gray.strikethrough(exercise.name)
                : chalk_1.default.white(exercise.name);
            const icon = exercise.solved ? '✅' : '📝';
            console.log(`  ${status} ${icon} ${chalk_1.default.gray(`${String(index + 1).padStart(2, '0')}:`)} ${name}`);
        });
        const solved = exercises.filter(e => e.solved).length;
        const total = exercises.length;
        console.log('\n' + chalk_1.default.gray('─'.repeat(50)));
        console.log(`\n  ${chalk_1.default.bold('Progresso Geral:')}`);
        console.log(`  ${createProgressBar(solved, total, 40)}`);
        console.log(chalk_1.default.gray(`  ${solved} de ${total} exercícios completos\n`));
    },
    allDone: () => {
        console.clear();
        console.log(chalk_1.default.bold.green('\n🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊'));
        console.log(chalk_1.default.bold.green('\n          ✨ PARABÉNS! ✨'));
        console.log(chalk_1.default.bold.green('\n🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊\n'));
        console.log(chalk_1.default.green('  🎉 Você completou TODOS os exercícios do fhevm-lings!'));
        console.log(chalk_1.default.white('\n  Você aprendeu sobre:'));
        console.log(chalk_1.default.cyan('    ✓ Importar a biblioteca FHE'));
        console.log(chalk_1.default.cyan('    ✓ Encriptar dados (euint32)'));
        console.log(chalk_1.default.cyan('    ✓ Operações homomórficas (adição)'));
        console.log(chalk_1.default.cyan('    ✓ Comparações encriptadas'));
        console.log(chalk_1.default.cyan('    ✓ Lógica condicional (FHE.select)'));
        console.log(chalk_1.default.gray('\n  Agora você está pronto para construir aplicações'));
        console.log(chalk_1.default.gray('  com criptografia homomórfica usando FHEVM! 🚀\n'));
        console.log(chalk_1.default.yellow('  Próximos passos:'));
        console.log(chalk_1.default.white('    • Explore a documentação: ') + chalk_1.default.blue('https://docs.zama.ai/fhevm'));
        console.log(chalk_1.default.white('    • Construa seu próprio projeto com FHEVM'));
        console.log(chalk_1.default.white('    • Compartilhe o que você aprendeu!\n'));
    },
    info: (message) => {
        console.log(`${LOG_PREFIX} ${chalk_1.default.gray(message)}`);
    },
    showExercisePath: (path) => {
        console.log(chalk_1.default.gray(`  Arquivo: ${path}`));
    },
    separator: () => {
        console.log(chalk_1.default.gray('─'.repeat(50)));
    }
};
