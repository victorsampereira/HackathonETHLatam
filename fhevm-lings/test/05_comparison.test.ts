import { expect } from "chai";
import { ethers } from "hardhat";
import { createFhevmInstance } from "fhevmjs";

describe("ConfidentialComparison", function () {
  let instance;
  let contract;
  let publicKey;

  before(async function () {
    const contractFactory = await ethers.getContractFactory("ConfidentialComparison");
    contract = await contractFactory.deploy();

    instance = await createFhevmInstance(ethers.provider);
    const keypair = instance.generateKeypair();
    publicKey = keypair.publicKey;
  });

  it("should return true when a > b", async function () {
    const enc_a = instance.encrypt32(100, publicKey);
    const enc_b = instance.encrypt32(50, publicKey);

    const enc_result = await contract.isGreaterOrEqual(enc_a, enc_b);
    const result = instance.decrypt(enc_result);

    expect(result).to.equal(1); // 1 represents true for decrypted ebool
  });

  it("should return false when a < b", async function () {
    const enc_a = instance.encrypt32(50, publicKey);
    const enc_b = instance.encrypt32(100, publicKey);

    const enc_result = await contract.isGreaterOrEqual(enc_a, enc_b);
    const result = instance.decrypt(enc_result);

    expect(result).to.equal(0); // 0 represents false
  });

  it("should return true when a == b", async function () {
    const enc_a = instance.encrypt32(100, publicKey);
    const enc_b = instance.encrypt32(100, publicKey);

    const enc_result = await contract.isGreaterOrEqual(enc_a, enc_b);
    const result = instance.decrypt(enc_result);

    expect(result).to.equal(1); // 1 represents true
  });
});
