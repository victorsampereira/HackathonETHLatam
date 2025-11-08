import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("DecryptValue", function () {
  const exercisePath = path.join(__dirname, "../exercises/12_decrypt_value.sol");

  it("should implement the setSecretValue function", async function () {
    const sourceCode = fs.readFileSync(exercisePath, "utf-8");

    // Procura pela função setSecretValue
    const match = sourceCode.match(/function\s+setSecretValue[\s\S]*?\{([\s\S]*?)\n\s*\}/);

    if (!match) {
      throw new Error("Não foi possível encontrar a função 'setSecretValue'");
    }

    const body = match[1];
    const hasFHEConversion = body.includes("FHE.asEuint32");
    const hasAssignment = body.includes("secretValue") && body.includes("=");

    if (!hasFHEConversion || !hasAssignment) {
      throw new Error(
        "A função 'setSecretValue' precisa converter newValue e atualizar secretValue! " +
        "Dica: secretValue = FHE.asEuint32(newValue);"
      );
    }
  });

  it("should implement the revealToOwner function", async function () {
    const sourceCode = fs.readFileSync(exercisePath, "utf-8");

    // Procura pela função revealToOwner
    const match = sourceCode.match(/function\s+revealToOwner[\s\S]*?\{([\s\S]*?)\n\s*\}/);

    if (!match) {
      throw new Error("Não foi possível encontrar a função 'revealToOwner'");
    }

    const body = match[1];
    const hasDecrypt = body.includes("FHE.decrypt");
    const hasReturn = body.includes("return");

    if (!hasDecrypt || !hasReturn) {
      throw new Error(
        "A função 'revealToOwner' precisa descriptografar e retornar o valor! " +
        "Dica: return FHE.decrypt(secretValue);"
      );
    }

    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("DecryptValue");
    } catch (e: any) {
      throw new Error("A compilação falhou. Verifique sua implementação. " + e.message);
    }

    const contract = await contractFactory.deploy();
    expect(contract.setSecretValue).to.be.a('function');
    expect(contract.revealToOwner).to.be.a('function');
    expect(contract.getEncryptedValue).to.be.a('function');
  });
});
