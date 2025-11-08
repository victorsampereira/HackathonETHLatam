import * as fs from 'fs';
import * as path from 'path';
import chokidar from 'chokidar';
import { ui } from './ui';
import { getExercises, findNextUnsolved, isSolved, Exercise } from './exerciseRepo';
import { compile } from './compiler';

// Esta é a função principal que orquestra tudo
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const allExercises = await getExercises();

  if (command === 'hint') {
    const currentExercise = await findNextUnsolved(allExercises);
    if (currentExercise) {
      ui.showHint(currentExercise.hint);
    } else {
      ui.allDone();
    }
    return; // Exit after showing hint
  }

  if (command === 'list') {
    const exerciseStatuses = await Promise.all(
      allExercises.map(async (exercise) => ({
        name: exercise.name,
        solved: await isSolved(exercise),
      }))
    );
    ui.listExercises(exerciseStatuses);
    return; // Exit after listing
  }

  // Default watch mode
  ui.welcome();
  let exerciseToRun = await findNextUnsolved(allExercises);
  const totalExercises = allExercises.length;

  // O loop principal do programa

    while (exerciseToRun != null) {
        // --- INÍCIO DA CORREÇÃO ---
        // Criamos uma 'const' para que o TypeScript saiba que não é nula
        // dentro deste 'scope' do loop.
        const currentExercise = exerciseToRun; 
        
        const currentIndex = allExercises.findIndex(ex => ex.path === currentExercise.path) + 1;
        ui.nextChallenge(currentExercise.name, currentIndex, totalExercises);

        // Passa o controlo para o "watcher" e espera que ele resolva
        const success = await watchExercise(currentExercise); // Use a nova 'const'

        if (success) {
        ui.success(currentExercise.name); // Use a nova 'const'
        // Tenta encontrar o próximo desafio e re-atribui à variável 'let'
        exerciseToRun = await findNextUnsolved(allExercises);
        } else {
        break; // Sai do loop se 'watchExercise' falhar
        }
        // --- FIM DA CORREÇÃO ---
    }

    // Se o loop terminar e não houver 'exerciseToRun', estamos feitos.
    if (!exerciseToRun) {
        ui.allDone();
    }
    }

/**
 * Observa um exercício específico e espera por uma "resolução".
 * Retorna uma Promise que resolve para 'true' quando o desafio é superado.
 */
function watchExercise(exercise: Exercise): Promise<boolean> {
  const fullPath = path.resolve(exercise.path);

  return new Promise((resolve) => {
    if (exercise.path.endsWith('.md')) {
      // Desafio .md: Esperar que o ficheiro seja apagado
      ui.info(`Para continuar, por favor APAGUE o ficheiro: ${exercise.path}`);
      const watcher = chokidar.watch(fullPath);
      
      watcher.on('unlink', (path) => {
        watcher.close();
        resolve(true);
      });

    } else if (exercise.path.endsWith('.sol')) {
      // Desafio .sol: Esperar por uma gravação que compile
      ui.info(`Por favor edite e grave o ficheiro: ${exercise.path}`);
      const watcher = chokidar.watch(fullPath);

      const onFileChanged = async (path: string) => {
        ui.compiling();
        const result = await compile(path);

        if (result.success) {
          watcher.close();
          resolve(true);
        } else {
          // A compilação falhou. Mostrar a dica e continuar a observar.
          ui.failure(exercise.hint, result.error);
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