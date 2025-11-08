import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("EncryptData", function () {
  it("should implement the encrypt function with a return statement", async function () {
    // Lê o código fonte do exercício
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/03_encrypt_euint32.sol"),
      "utf-8"
    );

    // Verifica se há um return statement DEPOIS do TODO (no corpo da função)
    const functionMatch = sourceCode.match(/function\s+encrypt[\s\S]*?\{([\s\S]*?)\}/);
    
    if (!functionMatch) {
      throw new Error("Não foi possível encontrar a função 'encrypt'");
    }
    
    const functionBody = functionMatch[1];
    const todoIndex = functionBody.indexOf("TODO");
    const returnIndex = functionBody.indexOf("return ");
    
    // Verifica se há um return DEPOIS do TODO
    const hasImplementation = returnIndex > -1 && 
                               (todoIndex === -1 || returnIndex > todoIndex);

    if (!hasImplementation) {
      throw new Error(
        "A função 'encrypt' precisa retornar 'myValue' encriptado! " +
        "Dica: Use 'return FHE.asEuint32(myValue)'"
      );
    }

    // Tenta compilar e fazer deploy
    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("EncryptData");
    } catch (e: any) {
      throw new Error("A compilação falhou. Verifique se implementou a função 'encrypt' corretamente. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.encrypt).to.be.a('function');
  });
});
