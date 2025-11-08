import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("ConfidentialLogic", function () {
  it("should implement conditionalSelect with a return statement", async function () {
    // Lê o código fonte do exercício
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/06_select_statement.sol"),
      "utf-8"
    );

    // Verifica se há um return statement DEPOIS do TODO (no corpo da função)
    const functionMatch = sourceCode.match(/function\s+conditionalSelect[\s\S]*?\{([\s\S]*?)\}/);
    
    if (!functionMatch) {
      throw new Error("Não foi possível encontrar a função 'conditionalSelect'");
    }
    
    const functionBody = functionMatch[1];
    const todoIndex = functionBody.indexOf("TODO");
    const returnIndex = functionBody.indexOf("return ");
    
    // Verifica se há um return DEPOIS do TODO
    const hasImplementation = returnIndex > -1 && 
                               (todoIndex === -1 || returnIndex > todoIndex);

    if (!hasImplementation) {
      throw new Error(
        "A função 'conditionalSelect' precisa retornar o resultado da seleção condicional! " +
        "Dica: Use 'return FHE.select(condition, ifTrueValue, ifFalseValue)'"
      );
    }

    // Tenta compilar e fazer deploy
    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("ConfidentialLogic");
    } catch (e: any) {
      throw new Error("A compilação falhou. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.conditionalSelect).to.be.a('function');
  });
});
