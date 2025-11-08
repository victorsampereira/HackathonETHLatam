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
describe("MinMaxOperations", function () {
    it("should implement the minimum function with a return statement", async function () {
        const sourceCode = fs.readFileSync(path.join(__dirname, "../exercises/09_min_max.sol"), "utf-8");
        const minMatch = sourceCode.match(/function\s+minimum[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!minMatch) {
            throw new Error("Não foi possível encontrar a função 'minimum'");
        }
        const minBody = minMatch[1];
        const todoIndex = minBody.indexOf("TODO");
        const returnIndex = minBody.indexOf("return ");
        const hasMinImplementation = returnIndex > -1 &&
            (todoIndex === -1 || returnIndex > todoIndex);
        if (!hasMinImplementation) {
            throw new Error("A função 'minimum' precisa retornar o menor valor! " +
                "Dica: Use 'return FHE.min(a, b)'");
        }
        let contractFactory;
        try {
            contractFactory = await hardhat_1.ethers.getContractFactory("MinMaxOperations");
        }
        catch (e) {
            throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
        }
        const contract = await contractFactory.deploy();
        (0, chai_1.expect)(contract.minimum).to.be.a('function');
        (0, chai_1.expect)(contract.maximum).to.be.a('function');
    });
    it("should implement the maximum function with a return statement", async function () {
        const sourceCode = fs.readFileSync(path.join(__dirname, "../exercises/09_min_max.sol"), "utf-8");
        const maxMatch = sourceCode.match(/function\s+maximum[\s\S]*?\{([\s\S]*?)\n\s*\}/);
        if (!maxMatch) {
            throw new Error("Não foi possível encontrar a função 'maximum'");
        }
        const maxBody = maxMatch[1];
        const todoIndex = maxBody.lastIndexOf("TODO");
        const returnIndex = maxBody.lastIndexOf("return ");
        const hasMaxImplementation = returnIndex > -1 &&
            (todoIndex === -1 || returnIndex > todoIndex);
        if (!hasMaxImplementation) {
            throw new Error("A função 'maximum' precisa retornar o maior valor! " +
                "Dica: Use 'return FHE.max(a, b)'");
        }
    });
});
