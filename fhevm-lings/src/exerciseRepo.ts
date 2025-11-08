import * as fs from 'fs';
import * as path from 'path';
import { compile } from './compiler';
import { ui } from './ui';

const EXERCISES_FILE = 'exercises.json';

export interface Exercise {
  name: string;
  path: string;
  hint: string;
  hints?: string[];
  difficulty?: number;
}

export async function getExercises(): Promise<Exercise[]> {
  const content = await fs.promises.readFile(EXERCISES_FILE, 'utf-8');
  const data = JSON.parse(content);
  return data.exercises;
}

export async function isSolved(exercise: Exercise): Promise<boolean> {
  if (exercise.path.endsWith('.md')) {
    const fullPath = path.resolve(exercise.path);
    return !fs.existsSync(fullPath);
  } else if (exercise.path.endsWith('.sol')) {
    
    const originalInfo = ui.info;
    ui.info = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    const result = await compile(exercise.path);
    ui.info = originalInfo;
    return result.success;
  }
  return false;
}

export async function findNextUnsolved(exercises: Exercise[]): Promise<Exercise | null> {
  for (const exercise of exercises) {
    if (!(await isSolved(exercise))) {
      return exercise;
    }
  }
  return null;
}

export async function findNextUnsolvedAfter(exercises: Exercise[], currentExercise: Exercise): Promise<Exercise | null> {
  const currentIndex = exercises.findIndex(ex => ex.path === currentExercise.path);

  // Search for next unsolved exercise after the current one
  for (let i = currentIndex + 1; i < exercises.length; i++) {
    if (!(await isSolved(exercises[i]))) {
      return exercises[i];
    }
  }

  return null; // No more unsolved exercises
}
