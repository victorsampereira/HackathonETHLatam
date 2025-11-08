import { HardhatUserConfig, task } from "hardhat/config";
import "@fhevm/hardhat-plugin";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

task("verify", "Compiles and tests a single exercise")
  .addParam("exercise", "The path to the exercise file")
  .setAction(async (taskArgs, hre) => {
    const exercisePath = taskArgs.exercise;
    const exerciseName = path.basename(exercisePath, ".sol");
    
    const testFilePath = path.join("test", `${exerciseName}.test.ts`);

    if (!fs.existsSync(testFilePath)) {
      throw new Error(`Test file not found for exercise: ${exercisePath}. Expected at: ${testFilePath}`);
    }

    await hre.run('test', { testFiles: [testFilePath] });
  });

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  // Diz ao hardhat para procurar os contratos na pasta 'exercises'
  paths: {
    sources: "./exercises"
  },
  networks: {
    // Zama Devnet configuration for deploying to testnet
    zamaDevnet: {
      url: "https://devnet.zama.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8009
    }
  }
};

export default config;