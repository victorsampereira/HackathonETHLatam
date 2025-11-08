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
describe("BooleanOperations", function () {
    const exercisePath = path.join(__dirname, "../exercises/11_boolean_operations.sol");
    it("should implement the andOperation function", async function () {
        const sourceCode = fs.readFileSync(exercisePath, "utf-8");
        const match = sourceCode.match(/function\s+andOperation[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!match) {
            throw new Error("Não foi possível encontrar a função 'andOperation'");
        }
        const body = match[1];
        const hasReturn = body.includes("return");
        if (!hasReturn) {
            throw new Error("A função 'andOperation' precisa retornar o resultado! " +
                "Dica: Use 'return FHE.and(a, b)' ou 'return a & b'");
        }
    });
    it("should implement the orOperation function", async function () {
        const sourceCode = fs.readFileSync(exercisePath, "utf-8");
        const match = sourceCode.match(/function\s+orOperation[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!match) {
            throw new Error("Não foi possível encontrar a função 'orOperation'");
        }
        const body = match[1];
        const hasReturn = body.includes("return");
        if (!hasReturn) {
            throw new Error("A função 'orOperation' precisa retornar o resultado! " +
                "Dica: Use 'return FHE.or(a, b)' ou 'return a | b'");
        }
    });
    it("should implement the notOperation function", async function () {
        const sourceCode = fs.readFileSync(exercisePath, "utf-8");
        const match = sourceCode.match(/function\s+notOperation[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!match) {
            throw new Error("Não foi possível encontrar a função 'notOperation'");
        }
        const body = match[1];
        const hasReturn = body.includes("return");
        if (!hasReturn) {
            throw new Error("A função 'notOperation' precisa retornar o resultado! " +
                "Dica: Use 'return FHE.not(a)' ou 'return !a'");
        }
    });
    it("should implement the xorOperation function", async function () {
        const sourceCode = fs.readFileSync(exercisePath, "utf-8");
        const match = sourceCode.match(/function\s+xorOperation[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!match) {
            throw new Error("Não foi possível encontrar a função 'xorOperation'");
        }
        const body = match[1];
        const hasReturn = body.includes("return");
        if (!hasReturn) {
            throw new Error("A função 'xorOperation' precisa retornar o resultado! " +
                "Dica: Use 'return FHE.xor(a, b)' ou 'return a ^ b'");
        }
        let contractFactory;
        try {
            contractFactory = await hardhat_1.ethers.getContractFactory("BooleanOperations");
        }
        catch (e) {
            throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
        }
        const contract = await contractFactory.deploy();
        (0, chai_1.expect)(contract.andOperation).to.be.a('function');
        (0, chai_1.expect)(contract.orOperation).to.be.a('function');
        (0, chai_1.expect)(contract.notOperation).to.be.a('function');
        (0, chai_1.expect)(contract.xorOperation).to.be.a('function');
    });
});
