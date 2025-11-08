import  execa  from 'execa';
import * as path from 'path';
import * as fs from 'fs';

export interface CompileResult {
  success: boolean;
  error?: string;
  stdout?: string;
}

/**
 * Tenta "resolver" um exercício.
 * 1. Procura por um ficheiro .test.ts correspondente.
 * 2. Se sim, corre 'npx hardhat test <ficheiro_teste>'.
 * 3. Se não, volta à lógica antiga: corre 'npx hardhat compile'.
 */
export async function compile(exercisePath: string): Promise<CompileResult> {
  // Constrói o nome do ficheiro de teste
  const exerciseName = path.basename(exercisePath, '.sol');
  const testFilePath = path.resolve('test', `${exerciseName}.test.ts`);

  if (fs.existsSync(testFilePath)) {
    // --- MODO TDD (TESTE) ---
    try {
      const result = await execa('npx', ['hardhat', 'test', testFilePath], {
        reject: false,
        all: true
      });
      
      if (result.exitCode === 0) {
        return { success: true, stdout: result.all };
      } else {
        return { 
          success: false, 
          error: result.all || result.stderr || 'Test Failed'
        };
      }
    } catch (e: any) {
      return { 
        success: false, 
        error: e.all || e.stdout || e.stderr || e.message 
      };
    }
  } else {
    // --- MODO COMPILAÇÃO (PLANO B) ---
    try {
      const result = await execa('npx', ['hardhat', 'compile'], {
        reject: false,
        all: true
      });
      
      if (result.exitCode === 0) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.all || result.stderr || 'Compilation Failed'
        };
      }
    } catch (e: any) {
      return { 
        success: false, 
        error: e.all || e.stderr || e.message 
      };
    }
  }
}