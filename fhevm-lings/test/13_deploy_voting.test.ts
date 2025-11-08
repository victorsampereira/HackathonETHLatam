import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("PrivateVoting - Final Challenge", function () {
  it("should implement all required functions", async function () {
    const sourceCode = fs.readFileSync(
      path.join(__dirname, "../exercises/13_deploy_voting.sol"),
      "utf-8"
    );

    // Check vote function implementation
    const voteMatch = sourceCode.match(/function\s+vote[\s\S]*?\{([\s\S]*?)\n\s*\}/);
    if (!voteMatch) {
      throw new Error("Vote function not found");
    }

    const voteBody = voteMatch[1];

    // Must have FHE.asEuint32
    if (!voteBody.includes("FHE.asEuint32")) {
      throw new Error(
        "Vote function must use FHE.asEuint32 to convert values! " +
        "Hint: You need to convert 1 and 0 to euint32"
      );
    }

    // Must have FHE.select or conditional logic
    if (!voteBody.includes("FHE.select") && !voteBody.includes("if")) {
      throw new Error(
        "Vote function must use FHE.select or if/else to choose which vote to increment! " +
        "Hint: Use FHE.select(condition, valueIfTrue, valueIfFalse)"
      );
    }

    // Must mark voter as having voted
    if (!voteBody.includes("hasVoted")) {
      throw new Error(
        "Vote function must mark the voter as having voted! " +
        "Hint: hasVoted[msg.sender] = true"
      );
    }

    // Check closeVoting function
    const closeMatch = sourceCode.match(/function\s+closeVoting[\s\S]*?\{([\s\S]*?)\n\s*\}/);
    if (!closeMatch) {
      throw new Error("closeVoting function not found");
    }

    const closeBody = closeMatch[1];
    if (!closeBody.includes("owner") || !closeBody.includes("require")) {
      throw new Error(
        "closeVoting must check that caller is the owner! " +
        "Hint: require(msg.sender == owner, \"Only owner\")"
      );
    }

    // Check getResults function
    const resultsMatch = sourceCode.match(/function\s+getResults[\s\S]*?\{([\s\S]*?)\n\s*\}/);
    if (!resultsMatch) {
      throw new Error("getResults function not found");
    }

    const resultsBody = resultsMatch[1];
    if (!resultsBody.includes("FHE.decrypt")) {
      throw new Error(
        "getResults must decrypt the vote counts! " +
        "Hint: Use FHE.decrypt(votesOptionA) and FHE.decrypt(votesOptionB)"
      );
    }

    if (!resultsBody.includes("return")) {
      throw new Error(
        "getResults must return the decrypted vote counts! " +
        "Hint: return (FHE.decrypt(votesOptionA), FHE.decrypt(votesOptionB))"
      );
    }

    // Try to compile
    let contractFactory;
    try {
      contractFactory = await ethers.getContractFactory("PrivateVoting");
    } catch (e: any) {
      throw new Error("Compilation failed. Check your implementation. " + e.message);
    }

    // Try to deploy locally
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    // Verify contract interface
    expect(contract.vote).to.be.a('function');
    expect(contract.closeVoting).to.be.a('function');
    expect(contract.getResults).to.be.a('function');
    expect(contract.getWinner).to.be.a('function');

    console.log("\n✅ All function checks passed!");
    console.log("\n🎉 CONGRATULATIONS! You've completed the final challenge!");
    console.log("\n📝 DEPLOYMENT INSTRUCTIONS:");
    console.log("─".repeat(60));
    console.log("\n1. Get testnet ETH:");
    console.log("   Visit: https://faucet.zama.ai");
    console.log("   Network: Zama Devnet");
    console.log("\n2. Configure your wallet:");
    console.log("   Add to hardhat.config.ts:");
    console.log('   networks: {');
    console.log('     zamaDevnet: {');
    console.log('       url: "https://devnet.zama.ai",');
    console.log('       accounts: [process.env.PRIVATE_KEY],');
    console.log('       chainId: 8009');
    console.log('     }');
    console.log('   }');
    console.log("\n3. Create .env file:");
    console.log("   PRIVATE_KEY=your_private_key_here");
    console.log("\n4. Deploy to testnet:");
    console.log("   npx hardhat run scripts/deploy-voting.ts --network zamaDevnet");
    console.log("\n5. Interact with your contract:");
    console.log("   - Vote: contract.vote(true) or contract.vote(false)");
    console.log("   - Close voting: contract.closeVoting()");
    console.log("   - Get results: contract.getResults()");
    console.log("\n📚 Documentation:");
    console.log("   https://docs.zama.ai/fhevm");
    console.log("\n" + "─".repeat(60));
  });
});
