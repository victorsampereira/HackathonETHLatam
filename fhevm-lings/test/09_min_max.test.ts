import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("MinMaxOperations", function () {
  it("should implement the minimum function with a return statement", async function () {
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/09_min_max.sol"),
      "utf-8"
    );

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
      throw new Error(
        "A função 'minimum' precisa retornar o menor valor! " +
        "Dica: Use 'return FHE.min(a, b)'"
      );
    }

    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("MinMaxOperations");
    } catch (e: any) {
      throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.minimum).to.be.a('function');
    expect(contract.maximum).to.be.a('function');
  });

  it("should implement the maximum function with a return statement", async function () {
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/09_min_max.sol"),
      "utf-8"
    );

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
      throw new Error(
        "A função 'maximum' precisa retornar o maior valor! " +
        "Dica: Use 'return FHE.max(a, b)'"
      );
    }
  });
});
