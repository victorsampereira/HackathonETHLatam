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
describe("DecryptValue", function () {
    const exercisePath = path.join(__dirname, "../exercises/12_decrypt_value.sol");
    it("should implement the setSecretValue function", async function () {
        const sourceCode = fs.readFileSync(exercisePath, "utf-8");
        // Procura pela função setSecretValue
        const match = sourceCode.match(/function\s+setSecretValue[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!match) {
            throw new Error("Não foi possível encontrar a função 'setSecretValue'");
        }
        const body = match[1];
        const hasFHEConversion = body.includes("FHE.asEuint32");
        const hasAssignment = body.includes("secretValue") && body.includes("=");
        if (!hasFHEConversion || !hasAssignment) {
            throw new Error("A função 'setSecretValue' precisa converter newValue e atualizar secretValue! " +
                "Dica: secretValue = FHE.asEuint32(newValue);");
        }
    });
    it("should implement the revealToOwner function", async function () {
        const sourceCode = fs.readFileSync(exercisePath, "utf-8");
        // Procura pela função revealToOwner
        const match = sourceCode.match(/function\s+revealToOwner[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!match) {
            throw new Error("Não foi possível encontrar a função 'revealToOwner'");
        }
        const body = match[1];
        const hasDecrypt = body.includes("FHE.decrypt");
        const hasReturn = body.includes("return");
        if (!hasDecrypt || !hasReturn) {
            throw new Error("A função 'revealToOwner' precisa descriptografar e retornar o valor! " +
                "Dica: return FHE.decrypt(secretValue);");
        }
        let contractFactory;
        try {
            contractFactory = await hardhat_1.ethers.getContractFactory("DecryptValue");
        }
        catch (e) {
            throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
        }
        const contract = await contractFactory.deploy();
        (0, chai_1.expect)(contract.setSecretValue).to.be.a('function');
        (0, chai_1.expect)(contract.revealToOwner).to.be.a('function');
        (0, chai_1.expect)(contract.getEncryptedValue).to.be.a('function');
    });
});
