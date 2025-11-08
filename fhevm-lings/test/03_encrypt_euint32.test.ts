import { expect } from "chai";
import { ethers } from "hardhat";
import { createFhevmInstance } from "fhevmjs"; // O import correto

describe("EncryptData", function () {
  let instance;
  let contract;

  before(async function () {
    // Deploy o contrato
    const contractFactory = await ethers.getContractFactory("EncryptData");
    contract = await contractFactory.deploy();

    // Cria a instância FHEVM
    instance = await createFhevmInstance(ethers.provider);
    // Gera o par de chaves
    instance.generateKeypair(); // A ortografia correta
  });

  it("should encrypt a uint32 to an euint32", async function () {
    const valueToEncrypt = 123;

    // Chama a função
    const encryptedResult = await contract.encrypt(valueToEncrypt);

    // Descriptografa o resultado
    const decryptedResult = instance.decrypt(encryptedResult);

    // Verifica
    expect(decryptedResult).to.equal(valueToEncrypt);
  });
});