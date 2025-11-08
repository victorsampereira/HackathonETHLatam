import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

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
      throw new Error(
        "A função 'andOperation' precisa retornar o resultado! " +
        "Dica: Use 'return FHE.and(a, b)' ou 'return a & b'"
      );
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
      throw new Error(
        "A função 'orOperation' precisa retornar o resultado! " +
        "Dica: Use 'return FHE.or(a, b)' ou 'return a | b'"
      );
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
      throw new Error(
        "A função 'notOperation' precisa retornar o resultado! " +
        "Dica: Use 'return FHE.not(a)' ou 'return !a'"
      );
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
      throw new Error(
        "A função 'xorOperation' precisa retornar o resultado! " +
        "Dica: Use 'return FHE.xor(a, b)' ou 'return a ^ b'"
      );
    }

    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("BooleanOperations");
    } catch (e: any) {
      throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.andOperation).to.be.a('function');
    expect(contract.orOperation).to.be.a('function');
    expect(contract.notOperation).to.be.a('function');
    expect(contract.xorOperation).to.be.a('function');
  });
});
