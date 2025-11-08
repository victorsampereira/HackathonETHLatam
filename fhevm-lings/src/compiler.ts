import execa from 'execa';
import * as path from 'path';
import * as fs from 'fs';

export interface CompileResult {
  success: boolean;
  error?: string;
}

/**
 * Tenta "resolver" um exercício.
 * 1. Procura por um ficheiro .test.ts correspondente.
 * 2. Se sim, corre 'npx hardhat test <ficheiro_teste>'. O sucesso é o teste passar.
 * 3. Se não, volta à lógica antiga: corre 'npx hardhat compile'.
 */
export async function compile(exercisePath: string): Promise<CompileResult> {
  // Constrói o nome do ficheiro de teste (ex: 03_encrypt.sol -> 03_encrypt.test.ts)
  const exerciseName = path.basename(exercisePath, '.sol');
  const testFilePath = path.resolve('test', `${exerciseName}.test.ts`);

  if (fs.existsSync(testFilePath)) {
    // --- MODO TDD (TESTE) ---
    // Encontrámos um ficheiro de teste!
    try {
      // Executa APENAS este teste específico
      await execa('npx', ['hardhat', 'test', testFilePath]);
      
      // Se 'npx hardhat test' passou, o exercício está resolvido.
      return { success: true };
    } catch (e: any) {
      // O teste falhou (o utilizador ainda não corrigiu o .sol).
      // Retornamos o stdout/stderr para mostrar o erro do teste.
      return { success: false, error: e.stdout || e.stderr || e.message };
    }
  } else {
    // --- MODO COMPILAÇÃO (PLANO B) ---
    // (Útil para exercícios simples como '02_import_tfhe')
    try {
      await execa('npx', ['hardhat', 'compile']);
      return { success: true };
    } catch (e: any) {
      // O 'compile' falhou (ex: erro de import)
      return { success: false, error: e.stderr || e.message };
    }
  }
}