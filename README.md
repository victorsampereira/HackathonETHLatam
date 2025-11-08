# FHElings 🎓

An interactive, hands-on learning tool for **FHEVM (Fully Homomorphic Encryption Virtual Machine)**, inspired by Rustlings.

## What is FHEVM?

FHEVM is a revolutionary technology by [Zama](https://zama.ai) that enables computations on encrypted data without decryption. Build truly private smart contracts where sensitive data remains encrypted on-chain!

## Quick Start

```bash
# Install dependencies
npm install

# Start learning!
npm run watch
```

## Project Structure

```
fhevm-lings/
├── exercises/          # Learning exercises
│   ├── 01_introduction.md
│   ├── 02_import_tfhe.sol
│   ├── 03_encrypt_euint32.sol
│   ├── ...
│   ├── 13_deploy_voting.sol    # Final challenge
│   ├── 13_README.md            # Exercise 13 guide
│   └── 99_congratulations.md
│
├── test/              # Automated tests for each exercise
│   ├── 02_import_tfhe.test.ts
│   ├── 03_encrypt_euint32.test.ts
│   ├── ...
│   └── 13_deploy_voting.test.ts
│
├── scripts/           # Deployment and utility scripts
│   └── deploy-voting.ts        # Deploy exercise 13 to testnet
│
├── docs/              # Documentation
│   └── DEPLOYMENT.md           # Testnet deployment guide
│
├── solutions/         # Reference solutions (spoilers!)
│   └── SOLUTION_13.md          # Exercise 13 solution
│
├── src/               # CLI tool source code
│   ├── index.ts               # Main application
│   ├── ui.ts                  # User interface
│   └── gamification.ts        # Hints, streaks, stats
│
├── exercises.json     # Exercise configuration
├── .env.example      # Environment template
└── hardhat.config.ts # Hardhat configuration
```

## Learning Path

### Basics (Exercises 1-6)
- ✅ **01**: Introduction to FHEVM
- ✅ **02**: Import FHE library
- ✅ **03**: Encrypt values (`FHE.asEuint32`)
- ✅ **04**: Addition on encrypted data
- ✅ **05**: Comparison operations
- ✅ **06**: Conditional logic (`FHE.select`)

### Advanced (Exercises 7-12)
- ✅ **07**: Multiplication
- ✅ **08**: Subtraction
- ✅ **09**: Min/Max operations
- ✅ **10**: Encrypted state management
- ✅ **11**: Boolean operations
- ✅ **12**: Decryption
- ✅ **13**: Deploying a smart contract

### Final Challenge (Exercise 13)
- 🎯 **13**: Build and deploy a complete private voting system to testnet!

## How It Works

1. **Read** the exercise file and understand the task
2. **Write** code to solve the TODOs
3. **Save** the file - tests run automatically
4. **Get feedback** - instant hints if something's wrong
5. **Advance** - press 'n' to go to the next exercise

## Interactive Commands

While working on exercises:

- **t** - Get progressive hints (3 levels)
- **h** - Show help menu
- **n** - Advance to next exercise (after completing current)
- **l** - List all exercises and jump to any one
- **s** - View your statistics and streak
- **c** - Clear terminal
- **q** - Quit

## Features

✨ **Progressive Hints** - Get gentle guidance that becomes more specific

📊 **Statistics & Streaks** - Track your learning progress

🎮 **Gamification** - Earn achievements and encouragement

⚡ **Auto-Testing** - Instant feedback as you code

🎯 **Real Deployment** - Deploy to Zama Devnet testnet

## Exercise 13: Final Challenge

The final exercise is special - you'll build a complete **Private Voting System** and deploy it to the Zama Devnet testnet!

**Quick Access:**
- 📝 Exercise Guide: [exercises/13_README.md](exercises/13_README.md)
- 🚀 Deployment Guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- 💡 Solution Reference: [solutions/SOLUTION_13.md](solutions/SOLUTION_13.md)

**What you'll build:**
- Private voting contract with encrypted vote counts
- Owner-controlled voting periods
- Secure result decryption
- Winner determination

**Deployment Steps:**
1. Complete the exercise locally
2. Get testnet ETH from https://faucet.zama.ai
3. Configure your `.env` file
4. Deploy: `npx hardhat run scripts/deploy-voting.ts --network zamaDevnet`

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## Testing Individual Exercises

```bash
# Test a specific exercise
npx hardhat test test/03_encrypt_euint32.test.ts

# Test all exercises
npx hardhat test

# Check which exercises are solved
node check-exercises.js
```

## Building the CLI Tool

```bash
# Compile TypeScript
npm run build

# Run the compiled version
node dist/index.js
```

## Environment Setup

For deploying to testnet (Exercise 13):

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your private key (without 0x prefix)
# PRIVATE_KEY=your_private_key_here
```

⚠️ **Never commit your `.env` file!** It's already in `.gitignore`.

## Network Configuration

The project is pre-configured for Zama Devnet:

- **Network:** Zama Devnet
- **RPC URL:** https://devnet.zama.ai
- **Chain ID:** 8009
- **Faucet:** https://faucet.zama.ai

Configuration is in [hardhat.config.ts](hardhat.config.ts).

## What You'll Learn

- 🔐 Homomorphic encryption basics
- 🔢 Encrypted arithmetic (add, sub, mul)
- ⚖️ Encrypted comparisons (gt, ge, lt, le)
- 🔀 Conditional logic on encrypted data
- 🔓 Safe decryption patterns
- 🔒 Privacy-preserving smart contracts
- 🚀 Testnet deployment

## Use Cases

FHEVM enables powerful privacy-preserving applications:

- **Private DeFi** - Hidden balances and transaction amounts
- **Confidential Gaming** - Fog of war on blockchain
- **Secret Voting** - Anonymous governance
- **Sealed Auctions** - Bid without revealing amounts
- **Privacy Analytics** - Compute on sensitive data
- **KYC/Compliance** - Verify without revealing

## Resources

- 📚 [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- 🔧 [FHEVM GitHub](https://github.com/zama-ai/fhevm)
- 💬 [Zama Discord Community](https://discord.gg/zama)
- 🎓 [FHEVM Tutorials](https://docs.zama.ai/fhevm/tutorials)

## Contributing

Found a bug or have a suggestion? Open an issue or submit a pull request!

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by [Rustlings](https://github.com/rust-lang/rustlings)
- Built with [FHEVM](https://github.com/zama-ai/fhevm) by [Zama](https://zama.ai)
- Powered by [Hardhat](https://hardhat.org)

---

**Ready to start?** Run `npm run watch` and begin your FHEVM journey! 🚀

**Questions?** Join the [Zama Discord](https://discord.gg/zama)
