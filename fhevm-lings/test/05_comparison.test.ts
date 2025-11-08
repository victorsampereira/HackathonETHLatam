import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("ConfidentialComparison", function () {
  it("should implement isGreaterOrEqual with a return statement", async function () {
    // Lê o código fonte do exercício
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/05_comparison.sol"),
      "utf-8"
    );

    // Verifica se há um return statement DEPOIS do TODO (no corpo da função)
    const functionMatch = sourceCode.match(/function\s+isGreaterOrEqual[\s\S]*?\{([\s\S]*?)\}/);
    
    if (!functionMatch) {
      throw new Error("Não foi possível encontrar a função 'isGreaterOrEqual'");
    }
    
    const functionBody = functionMatch[1];
    const todoIndex = functionBody.indexOf("TODO");
    const returnIndex = functionBody.indexOf("return ");
    
    // Verifica se há um return DEPOIS do TODO
    const hasImplementation = returnIndex > -1 && 
                               (todoIndex === -1 || returnIndex > todoIndex);

    if (!hasImplementation) {
      throw new Error(
        "A função 'isGreaterOrEqual' precisa retornar a comparação entre 'a' e 'b'! " +
        "Dica: Use 'return FHE.ge(a, b)' ou 'return FHE.gte(a, b)'"
      );
    }

    // Tenta compilar e fazer deploy
    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("ConfidentialComparison");
    } catch (e: any) {
      throw new Error("A compilação falhou. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.isGreaterOrEqual).to.be.a('function');
  });
});
