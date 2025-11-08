import { HardhatUserConfig, task } from "hardhat/config";
import "@fhevm/hardhat-plugin";
import path from "path";
import fs from "fs";

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
};

export default config;