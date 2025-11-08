import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("HomomorphicMultiply", function () {
  it("should implement the multiply function with a return statement", async function () {
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/07_multiply_euints.sol"),
      "utf-8"
    );

    const functionMatch = sourceCode.match(/function\s+multiply[\s\S]*?\{([\s\S]*?)\}/);

    if (!functionMatch) {
      throw new Error("Não foi possível encontrar a função 'multiply'");
    }

    const functionBody = functionMatch[1];
    const todoIndex = functionBody.indexOf("TODO");
    const returnIndex = functionBody.indexOf("return ");

    const hasImplementation = returnIndex > -1 &&
                               (todoIndex === -1 || returnIndex > todoIndex);

    if (!hasImplementation) {
      throw new Error(
        "A função 'multiply' precisa retornar o produto de 'a' e 'b'! " +
        "Dica: Use 'return a * b' ou 'return FHE.mul(a, b)'"
      );
    }

    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("HomomorphicMultiply");
    } catch (e: any) {
      throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.multiply).to.be.a('function');
  });
});
