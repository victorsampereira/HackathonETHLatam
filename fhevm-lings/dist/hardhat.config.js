"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
require("@fhevm/hardhat-plugin");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, config_1.task)("verify", "Compiles and tests a single exercise")
    .addParam("exercise", "The path to the exercise file")
    .setAction(async (taskArgs, hre) => {
    const exercisePath = taskArgs.exercise;
    const exerciseName = path_1.default.basename(exercisePath, ".sol");
    const testFilePath = path_1.default.join("test", `${exerciseName}.test.ts`);
    if (!fs_1.default.existsSync(testFilePath)) {
        throw new Error(`Test file not found for exercise: ${exercisePath}. Expected at: ${testFilePath}`);
    }
    await hre.run('test', { testFiles: [testFilePath] });
});
const config = {
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
exports.default = config;
