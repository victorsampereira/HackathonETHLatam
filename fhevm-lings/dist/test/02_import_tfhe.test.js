"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("BasicImports", function () {
    it("should deploy the contract successfully", async function () {
        // O objetivo deste teste é *apenas* verificar se o contrato
        // pode ser "deployado". Se o 'import' no .sol estiver errado,
        // o 'getContractFactory' falhará a compilação.
        let contractFactory;
        try {
            contractFactory = await hardhat_1.ethers.getContractFactory("BasicImports");
        }
        catch (e) {
            // Captura o erro se a compilação falhar
            throw new Error("A compilação falhou. Você corrigiu o 'import' no '02_import_tfhe.sol'? " + e.message);
        }
        // Se a fábrica foi criada, tenta fazer o deploy
        const contract = await contractFactory.deploy();
        // Se chegou aqui, o deploy funcionou
        (0, chai_1.expect)(await contract.testImport()).to.equal(true);
    });
});
