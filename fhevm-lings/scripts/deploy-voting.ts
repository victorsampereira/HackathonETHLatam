import { ethers } from "hardhat";

async function main() {
  console.log("\n🚀 Deploying PrivateVoting contract...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  const PrivateVoting = await ethers.getContractFactory("PrivateVoting");
  const voting = await PrivateVoting.deploy();

  await voting.waitForDeployment();
  const contractAddress = await voting.getAddress();

  console.log("✅ PrivateVoting deployed to:", contractAddress);
  console.log("\n📝 Contract Details:");
  console.log("─".repeat(60));
  console.log("Owner:", await voting.owner());
  console.log("Voting Open:", await voting.votingOpen());
  console.log("\n💡 Next Steps:");
  console.log("─".repeat(60));
  console.log("\n1. Vote for Option A:");
  console.log(`   await voting.vote(true)`);
  console.log("\n2. Vote for Option B:");
  console.log(`   await voting.vote(false)`);
  console.log("\n3. Close voting (owner only):");
  console.log(`   await voting.closeVoting()`);
  console.log("\n4. Get results (owner only, after closing):");
  console.log(`   const [votesA, votesB] = await voting.getResults()`);
  console.log("\n5. Get winner (owner only, after closing):");
  console.log(`   const winner = await voting.getWinner()`);
  console.log("\n📚 Documentation: https://docs.zama.ai/fhevm");
  console.log("─".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
