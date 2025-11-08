import * as fs from 'fs';
import * as path from 'path';
import { compile } from './compiler';
import { ui } from './ui';

const EXERCISES_FILE = 'exercises.json';

export interface Exercise {
  name: string;
  path: string;
  hint: string;
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
    // We can't show verbose output here, so we temporarily disable it
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
