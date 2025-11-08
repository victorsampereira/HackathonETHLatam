import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("HomomorphicOps", function () {
  it("should implement the add function with a return statement", async function () {
    // Lê o código fonte do exercício
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/04_add_two_euints.sol"),
      "utf-8"
    );

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
      throw new Error(
        "A função 'add' precisa retornar a soma de 'a' e 'b'! " +
        "Dica: Você pode usar 'return FHE.add(a, b)' ou simplesmente 'return a + b'"
      );
    }

    // Tenta compilar e fazer deploy
    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("HomomorphicOps");
    } catch (e: any) {
      throw new Error("A compilação falhou. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.add).to.be.a('function');
  });
});
