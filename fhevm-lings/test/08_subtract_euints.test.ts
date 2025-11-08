import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("HomomorphicSubtract", function () {
  it("should implement the subtract function with a return statement", async function () {
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/08_subtract_euints.sol"),
      "utf-8"
    );

    const functionMatch = sourceCode.match(/function\s+subtract[\s\S]*?\{([\s\S]*?)\}/);

    if (!functionMatch) {
      throw new Error("Não foi possível encontrar a função 'subtract'");
    }

    const functionBody = functionMatch[1];
    const todoIndex = functionBody.indexOf("TODO");
    const returnIndex = functionBody.indexOf("return ");

    const hasImplementation = returnIndex > -1 &&
                               (todoIndex === -1 || returnIndex > todoIndex);

    if (!hasImplementation) {
      throw new Error(
        "A função 'subtract' precisa retornar a diferença entre 'a' e 'b'! " +
        "Dica: Use 'return a - b' ou 'return FHE.sub(a, b)'"
      );
    }

    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("HomomorphicSubtract");
    } catch (e: any) {
      throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.subtract).to.be.a('function');
  });
});
