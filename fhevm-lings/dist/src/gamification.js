"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamification = void 0;
const chalk_1 = __importDefault(require("chalk"));
// Sistema de streak (sequência de sucessos)
let currentStreak = 0;
let bestStreak = 0;
let totalAttempts = 0;
let failedAttempts = 0;
// Nível de dica atual para cada exercício
const hintLevels = new Map();
exports.gamification = {
    // Incrementa streak ao completar exercício
    incrementStreak: () => {
        currentStreak++;
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
        }
    },
    // Reseta streak ao desistir
    resetStreak: () => {
        currentStreak = 0;
    },
    // Registra tentativa
    recordAttempt: (success) => {
        totalAttempts++;
        if (!success) {
            failedAttempts++;
        }
    },
    // Obtém estatísticas
    getStats: () => ({
        currentStreak,
        bestStreak,
        totalAttempts,
        failedAttempts,
        successRate: totalAttempts > 0 ? ((totalAttempts - failedAttempts) / totalAttempts * 100).toFixed(1) : '0.0'
    }),
    // Próximo nível de dica
    getNextHintLevel: (exerciseName) => {
        const current = hintLevels.get(exerciseName) || 0;
        const next = Math.min(current + 1, 2); // Máximo 3 níveis (0, 1, 2)
        hintLevels.set(exerciseName, next);
        return next;
    },
    // Reseta nível de dica
    resetHintLevel: (exerciseName) => {
        hintLevels.set(exerciseName, 0);
    },
    // Mensagens motivacionais baseadas em contexto
    getEncouragementMessage: (context) => {
        const failures = [
            "💪 Não desista! Todo expert já foi iniciante.",
            "🎯 Você está perto! Revise o código com calma.",
            "🧠 Erro é parte do aprendizado. Tente novamente!",
            "⚡ Persista! FHE é complexo, mas você consegue!",
            "🔥 Cada erro te aproxima da solução!",
            "🌟 Respire fundo e tente uma abordagem diferente.",
            "💡 Às vezes a solução é mais simples do que parece!",
            "🚀 Programadores de verdade fazem muitas tentativas!",
        ];
        const hints = [
            "💭 Aqui vai uma dica útil:",
            "🎓 Deixa eu te ajudar com isso:",
            "🔍 Preste atenção nesta dica:",
            "💡 Isso pode te dar um insight:",
            "🗝️ A chave está aqui:",
            "📚 Veja se isso ajuda:",
        ];
        const successes = [
            "🎉 Incrível! Você dominou este conceito!",
            "⚡ Fantástico! Você está arrasando!",
            "🌟 Perfeito! Continue assim!",
            "🔥 Excelente trabalho! Próximo desafio!",
            "💎 Brilhante! Você é um natural em FHE!",
            "🎯 Acertou em cheio! Parabéns!",
            "🚀 Impressionante! Rumo ao próximo nível!",
            "✨ Você está mandando muito bem!",
        ];
        const streaks = [
            "🔥 Você está em CHAMAS! 🔥",
            "⚡ SEQUÊNCIA IMPARÁVEL! ⚡",
            "🌟 MODO EXPERT ATIVADO! 🌟",
            "💎 BRILHANTE! CONTINUE! 💎",
            "🎯 PRECISÃO ABSOLUTA! 🎯",
        ];
        switch (context) {
            case 'failure':
                return failures[Math.floor(Math.random() * failures.length)];
            case 'hint':
                return hints[Math.floor(Math.random() * hints.length)];
            case 'success':
                return successes[Math.floor(Math.random() * successes.length)];
            case 'streak':
                return streaks[Math.floor(Math.random() * streaks.length)];
        }
    },
    // Fatos curiosos sobre FHE
    getFHEFact: () => {
        const facts = [
            "🔐 FHE permite computações em dados encriptados sem nunca descriptografá-los!",
            "🌍 FHE pode revolucionar a privacidade na blockchain e cloud computing!",
            "🎓 O conceito de FHE foi proposto por Craig Gentry em 2009.",
            "⚡ Com FHE, você pode somar números sem saber quais são!",
            "🏥 FHE pode permitir análise médica sem expor dados sensíveis dos pacientes.",
            "🗳️ Votação eletrônica verdadeiramente privada é possível com FHE!",
            "💰 Você pode fazer leilões selados totalmente on-chain com FHE!",
            "🎮 Games on-chain podem ter informação oculta (fog of war) com FHE!",
            "🔮 FHE é considerado o 'Santo Graal' da criptografia!",
            "📊 Com FHE, empresas podem analisar dados sem ver o conteúdo real!",
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    },
    // Mostra estatísticas
    showStats: () => {
        const stats = exports.gamification.getStats();
        console.log(chalk_1.default.cyan('\n📊 Suas Estatísticas:'));
        console.log(chalk_1.default.gray('  ├─ ') + chalk_1.default.white('Sequência atual: ') + chalk_1.default.yellow(`${stats.currentStreak} 🔥`));
        console.log(chalk_1.default.gray('  ├─ ') + chalk_1.default.white('Melhor sequência: ') + chalk_1.default.green(`${stats.bestStreak} ⭐`));
        console.log(chalk_1.default.gray('  ├─ ') + chalk_1.default.white('Total de tentativas: ') + chalk_1.default.blue(stats.totalAttempts));
        console.log(chalk_1.default.gray('  └─ ') + chalk_1.default.white('Taxa de sucesso: ') + chalk_1.default.magenta(`${stats.successRate}%`));
    },
    // Mostra dificuldade do exercício
    showDifficulty: (difficulty = 1) => {
        const stars = '⭐'.repeat(difficulty) + '☆'.repeat(3 - difficulty);
        const level = difficulty === 1 ? 'Fácil' : difficulty === 2 ? 'Médio' : 'Difícil';
        console.log(chalk_1.default.gray(`  Dificuldade: ${stars} ${level}`));
    },
    // Animação de celebração
    celebrate: (exerciseName) => {
        const stats = exports.gamification.getStats();
        console.log('\n' + chalk_1.default.green('▓'.repeat(50)));
        console.log(chalk_1.default.bold.green('\n  ✨ ' + exports.gamification.getEncouragementMessage('success') + ' ✨'));
        console.log(chalk_1.default.green(`\n  ${exerciseName} `) + chalk_1.default.gray('foi resolvido com sucesso!'));
        if (currentStreak >= 3) {
            console.log(chalk_1.default.yellow(`\n  🔥 ${exports.gamification.getEncouragementMessage('streak')}`));
            console.log(chalk_1.default.yellow(`  Sequência de ${currentStreak} exercícios! 🔥`));
        }
        // Fato curioso ocasional (30% de chance)
        if (Math.random() < 0.3) {
            console.log(chalk_1.default.cyan('\n  💡 Você sabia?'));
            console.log(chalk_1.default.gray('  ' + exports.gamification.getFHEFact()));
        }
        console.log(chalk_1.default.gray('\n  Preparando próximo exercício...\n'));
        console.log(chalk_1.default.green('▓'.repeat(50)));
    }
};
