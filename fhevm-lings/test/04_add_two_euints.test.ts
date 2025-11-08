import { expect } from "chai";
import { ethers } from "hardhat";
import { createFhevmInstance } from "fhevmjs"; // Importa a biblioteca cliente

it("should add two encrypted numbers", async function () {
  // 1. Faz o deploy do contrato do exercício
  const contractFactory = await ethers.getContractFactory("HomomorphicOps");
  const contract = await contractFactory.deploy();

  // 2. Cria uma instância FHEVM (cliente)
  const instance = await createFhevmInstance(ethers.provider);
  const { publicKey } = instance.generateKeypair();

  // 3. Encripta os inputs (no cliente!)
  const enc_a = instance.encrypt32(10, publicKey);
  const enc_b = instance.encrypt32(20, publicKey);

  // 4. Chama a função do contrato
  const enc_result = await contract.add(enc_a, enc_b);

  // 5. Descriptografa o resultado
  const result = instance.decrypt(enc_result);

  // 6. Verifica se está correto!
  expect(result).to.equal(30);
});