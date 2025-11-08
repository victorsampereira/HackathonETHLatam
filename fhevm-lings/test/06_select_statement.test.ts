import { expect } from "chai";
import { ethers } from "hardhat";
import { createFhevmInstance } from "fhevmjs";

describe("ConfidentialLogic", function () {
  let instance;
  let contract;
  let publicKey;

  before(async function () {
    const contractFactory = await ethers.getContractFactory("ConfidentialLogic");
    contract = await contractFactory.deploy();

    instance = await createFhevmInstance(ethers.provider);
    const keypair = instance.generateKeypair();
    publicKey = keypair.publicKey;
  });

  it("should return ifTrueValue when condition is true", async function () {
    const enc_condition = instance.encryptBool(true, publicKey);
    const enc_ifTrue = instance.encrypt32(111, publicKey);
    const enc_ifFalse = instance.encrypt32(222, publicKey);

    const enc_result = await contract.conditionalSelect(enc_condition, enc_ifTrue, enc_ifFalse);
    const result = instance.decrypt(enc_result);

    expect(result).to.equal(111);
  });

  it("should return ifFalseValue when condition is false", async function () {
    const enc_condition = instance.encryptBool(false, publicKey);
    const enc_ifTrue = instance.encrypt32(111, publicKey);
    const enc_ifFalse = instance.encrypt32(222, publicKey);

    const enc_result = await contract.conditionalSelect(enc_condition, enc_ifTrue, enc_ifFalse);
    const result = instance.decrypt(enc_result);

    expect(result).to.equal(222);
  });
});
