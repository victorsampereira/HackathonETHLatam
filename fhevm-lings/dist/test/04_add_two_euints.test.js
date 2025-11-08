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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
describe("HomomorphicOps", function () {
    it("should implement the add function with a return statement", async function () {
        // Lê o código fonte do exercício
        const sourceCode = fs.readFileSync(path.join(__dirname, "../exercises/04_add_two_euints.sol"), "utf-8");
        // Verifica se há um return statement DEPOIS do TODO (no corpo da função)
        const functionMatch = sourceCode.match(/function\s+add[\s\S]*?\{([\s\S]*?)\}/);
        if (!functionMatch) {
            throw new Error("Não foi possível encontrar a função 'add'");
        }
        const functionBody = functionMatch[1];
        const todoIndex = functionBody.indexOf("TODO");
        const returnIndex = functionBody.indexOf("return ");
        // Verifica se há um return DEPOIS do TODO
        const hasImplementation = returnIndex > -1 &&
            (todoIndex === -1 || returnIndex > todoIndex);
        if (!hasImplementation) {
            throw new Error("A função 'add' precisa retornar a soma de 'a' e 'b'! " +
                "Dica: Você pode usar 'return FHE.add(a, b)' ou simplesmente 'return a + b'");
        }
        // Tenta compilar e fazer deploy
        let contractFactory;
        try {
            contractFactory = await hardhat_1.ethers.getContractFactory("HomomorphicOps");
        }
        catch (e) {
            throw new Error("A compilação falhou. " + e.message);
        }
        const contract = await contractFactory.deploy();
        (0, chai_1.expect)(contract.add).to.be.a('function');
    });
});
