const { execSync } = require('child_process');
const fs = require('fs');

const exercisesData = JSON.parse(fs.readFileSync('exercises.json', 'utf-8'));

console.log('\n🔍 Verificando status de cada exercício:\n');

for (const exercise of exercisesData.exercises) {
  if (exercise.path.endsWith('.md')) {
    const exists = fs.existsSync(exercise.path);
    const status = !exists ? '✅ Resolvido (arquivo deletado)' : '❌ Não resolvido (arquivo existe)';
    console.log(`${exercise.name}: ${status}`);
  } else if (exercise.path.endsWith('.sol')) {
    const testFile = `test/${exercise.name}.test.ts`;

    if (fs.existsSync(testFile)) {
      try {
        execSync(`npx hardhat test ${testFile}`, { stdio: 'pipe' });
        console.log(`${exercise.name}: ✅ Resolvido (teste passou)`);
      } catch (e) {
        console.log(`${exercise.name}: ❌ Não resolvido (teste falhou)`);
      }
    } else {
      console.log(`${exercise.name}: ⚠️  Sem teste (assumindo não resolvido)`);
    }
  }
}

console.log('\n');
