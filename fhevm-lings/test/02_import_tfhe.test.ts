import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("BasicImports", function () {
  it("should import the FHE library", async function () {
    // First, check that the import statement exists in the source code
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/02_import_tfhe.sol"),
      "utf-8"
    );

    // Check if the FHE import is present
    if (!sourceCode.includes('import "@fhevm/solidity/lib/FHE.sol"') &&
        !sourceCode.includes("import '@fhevm/solidity/lib/FHE.sol'")) {
      throw new Error(
        "Missing FHE library import! " +
        'Add: import "@fhevm/solidity/lib/FHE.sol"; at the top of the file.'
      );
    }

    // Now try to compile and deploy
    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("BasicImports");
    } catch (e: any) {
      throw new Error(
        "Compilation failed. Check your import statement. " + e.message
      );
    }

    // Deploy the contract
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    // Call the function to verify it works
    const result = await contract.testImport();

    // The function should return an encrypted value (euint32)
    expect(result).to.not.be.undefined;
  });
});