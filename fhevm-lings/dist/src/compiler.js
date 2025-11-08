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
exports.compile = compile;
const execa_1 = __importDefault(require("execa"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * Tenta "resolver" um exercício.
 * 1. Procura por um ficheiro .test.ts correspondente.
 * 2. Se sim, corre 'npx hardhat test <ficheiro_teste>'.
 * 3. Se não, volta à lógica antiga: corre 'npx hardhat compile'.
 */
async function compile(exercisePath) {
    // Constrói o nome do ficheiro de teste
    const exerciseName = path.basename(exercisePath, '.sol');
    const testFilePath = path.resolve('test', `${exerciseName}.test.ts`);
    if (fs.existsSync(testFilePath)) {
        // --- MODO TDD (TESTE) ---
        try {
            const result = await (0, execa_1.default)('npx', ['hardhat', 'test', testFilePath], {
                reject: false,
                all: true
            });
            if (result.exitCode === 0) {
                return { success: true, stdout: result.all };
            }
            else {
                return {
                    success: false,
                    error: result.all || result.stderr || 'Test Failed'
                };
            }
        }
        catch (e) {
            return {
                success: false,
                error: e.all || e.stdout || e.stderr || e.message
            };
        }
    }
    else {
        // --- MODO COMPILAÇÃO (PLANO B) ---
        try {
            const result = await (0, execa_1.default)('npx', ['hardhat', 'compile'], {
                reject: false,
                all: true
            });
            if (result.exitCode === 0) {
                return { success: true };
            }
            else {
                return {
                    success: false,
                    error: result.all || result.stderr || 'Compilation Failed'
                };
            }
        }
        catch (e) {
            return {
                success: false,
                error: e.all || e.stderr || e.message
            };
        }
    }
}
