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
describe("EncryptedCounter", function () {
    it("should implement the increment function", async function () {
        const sourceCode = fs.readFileSync(path.join(__dirname, "../exercises/10_encrypted_counter.sol"), "utf-8");
        const incrementMatch = sourceCode.match(/function\s+increment[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!incrementMatch) {
            throw new Error("Não foi possível encontrar a função 'increment'");
        }
        const incrementBody = incrementMatch[1];
        // Verifica se tem FHE.asEuint32 e uma atribuição ao counter
        const hasFHEConversion = incrementBody.includes("FHE.asEuint32");
        const hasCounterUpdate = incrementBody.includes("counter") && incrementBody.includes("=");
        if (!hasFHEConversion || !hasCounterUpdate) {
            throw new Error("A função 'increment' precisa converter 1 para euint32 e atualizar counter! " +
                "Dica: counter = counter + FHE.asEuint32(1);");
        }
        let contractFactory;
        try {
            contractFactory = await hardhat_1.ethers.getContractFactory("EncryptedCounter");
        }
        catch (e) {
            throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
        }
        const contract = await contractFactory.deploy();
        (0, chai_1.expect)(contract.increment).to.be.a('function');
        (0, chai_1.expect)(contract.add).to.be.a('function');
        (0, chai_1.expect)(contract.getCounter).to.be.a('function');
    });
    it("should implement the add function", async function () {
        const sourceCode = fs.readFileSync(path.join(__dirname, "../exercises/10_encrypted_counter.sol"), "utf-8");
        const addMatch = sourceCode.match(/function\s+add\s*\([^)]*\)\s*external\s*\{([\s\S]*?)\n\s*\}/);
        if (!addMatch) {
            throw new Error("Não foi possível encontrar a função 'add'");
        }
        const addBody = addMatch[1];
        const hasFHEConversion = addBody.includes("FHE.asEuint32");
        const hasCounterUpdate = addBody.includes("counter") && addBody.includes("=");
        if (!hasFHEConversion || !hasCounterUpdate) {
            throw new Error("A função 'add' precisa converter 'value' para euint32 e atualizar counter! " +
                "Dica: counter = counter + FHE.asEuint32(value);");
        }
    });
});
