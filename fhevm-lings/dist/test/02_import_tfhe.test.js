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
describe("BasicImports", function () {
    it("should import the FHE library", async function () {
        // First, check that the import statement exists in the source code
        const sourceCode = fs.readFileSync(path.join(__dirname, "../exercises/02_import_tfhe.sol"), "utf-8");
        // Check if the FHE import is present
        if (!sourceCode.includes('import "@fhevm/solidity/lib/FHE.sol"') &&
            !sourceCode.includes("import '@fhevm/solidity/lib/FHE.sol'")) {
            throw new Error("Missing FHE library import! " +
                'Add: import "@fhevm/solidity/lib/FHE.sol"; at the top of the file.');
        }
        // Now try to compile and deploy
        let contractFactory;
        try {
            contractFactory = await hardhat_1.ethers.getContractFactory("BasicImports");
        }
        catch (e) {
            throw new Error("Compilation failed. Check your import statement. " + e.message);
        }
        // Deploy the contract
        const contract = await contractFactory.deploy();
        await contract.waitForDeployment();
        // Call the function to verify it works
        const result = await contract.testImport();
        // The function should return an encrypted value (euint32)
        (0, chai_1.expect)(result).to.not.be.undefined;
    });
});
