import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("EncryptedCounter", function () {
  it("should implement the increment function", async function () {
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/10_encrypted_counter.sol"),
      "utf-8"
    );

    const incrementMatch = sourceCode.match(/function\s+increment[\s\S]*?\{([\s\S]*?)\n\s*\}/);

    if (!incrementMatch) {
      throw new Error("Não foi possível encontrar a função 'increment'");
    }

    const incrementBody = incrementMatch[1];

    // Verifica se tem FHE.asEuint32 e uma atribuição ao counter
    const hasFHEConversion = incrementBody.includes("FHE.asEuint32");
    const hasCounterUpdate = incrementBody.includes("counter") && incrementBody.includes("=");

    if (!hasFHEConversion || !hasCounterUpdate) {
      throw new Error(
        "A função 'increment' precisa converter 1 para euint32 e atualizar counter! " +
        "Dica: counter = counter + FHE.asEuint32(1);"
      );
    }

    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("EncryptedCounter");
    } catch (e: any) {
      throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.increment).to.be.a('function');
    expect(contract.add).to.be.a('function');
    expect(contract.getCounter).to.be.a('function');
  });

  it("should implement the add function", async function () {
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/10_encrypted_counter.sol"),
      "utf-8"
    );

    const addMatch = sourceCode.match(/function\s+add\s*\([^)]*\)\s*external\s*\{([\s\S]*?)\n\s*\}/);

    if (!addMatch) {
      throw new Error("Não foi possível encontrar a função 'add'");
    }

    const addBody = addMatch[1];

    const hasFHEConversion = addBody.includes("FHE.asEuint32");
    const hasCounterUpdate = addBody.includes("counter") && addBody.includes("=");

    if (!hasFHEConversion || !hasCounterUpdate) {
      throw new Error(
        "A função 'add' precisa converter 'value' para euint32 e atualizar counter! " +
        "Dica: counter = counter + FHE.asEuint32(value);"
      );
    }
  });
});
