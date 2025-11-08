# Exercise 13 Quick Start Guide 🚀

This guide will help you complete and deploy the final challenge - a private voting system!

## File Locations

All files related to Exercise 13 are organized intuitively:

```
fhevm-lings/
│
├── exercises/
│   ├── 13_deploy_voting.sol    ← YOUR WORK: Complete the TODOs here
│   └── 13_README.md            ← GUIDE: Detailed exercise instructions
│
├── test/
│   └── 13_deploy_voting.test.ts ← TEST: Run to verify your solution
│
├── scripts/
│   └── deploy-voting.ts         ← DEPLOY: Use this to deploy to testnet
│
├── docs/
│   ├── DEPLOYMENT.md            ← HELP: Full deployment instructions
│   └── QUICK_START_EXERCISE_13.md ← You are here!
│
├── solutions/
│   └── SOLUTION_13.md           ← REFERENCE: Only if you're stuck!
│
└── .env.example                 ← TEMPLATE: Copy to .env for deployment
```

## Step-by-Step Workflow

### 1️⃣ Complete the Exercise Locally

**File to edit:** `exercises/13_deploy_voting.sol`

Open the file and find the TODO comments. You need to implement:
- ✅ `vote(bool choiceA)` - Cast a private vote
- ✅ `closeVoting()` - Close voting (owner only)
- ✅ `getResults()` - Get decrypted results (owner only)
- ✅ `getWinner()` - Determine the winner (bonus)

**Need help?**
- Read the detailed guide: `exercises/13_README.md`
- Use progressive hints: Press 't' in the CLI
- Check the solution (last resort): `solutions/SOLUTION_13.md`

### 2️⃣ Test Your Solution

**Command:**
```bash
npx hardhat test test/13_deploy_voting.test.ts
```

**Expected output when correct:**
```
✅ All function checks passed!
🎉 CONGRATULATIONS! You've completed the final challenge!

📝 DEPLOYMENT INSTRUCTIONS:
(Shows testnet deployment steps)
```

### 3️⃣ Get Testnet ETH

Before deployment, you need test tokens:

1. Visit: https://faucet.zama.ai
2. Enter your wallet address
3. Request testnet ETH
4. Wait for confirmation

### 4️⃣ Configure Environment

**Create .env file:**
```bash
cp .env.example .env
```

**Edit .env** and add your private key (without 0x prefix):
```env
PRIVATE_KEY=your_private_key_without_0x_prefix
```

⚠️ **IMPORTANT:** Never share or commit your `.env` file!

### 5️⃣ Deploy to Testnet

**File to use:** `scripts/deploy-voting.ts`

**Command:**
```bash
npx hardhat run scripts/deploy-voting.ts --network zamaDevnet
```

**Expected output:**
```
🚀 Deploying PrivateVoting contract...
Deploying with account: 0x...
Account balance: 0.5 ETH

✅ PrivateVoting deployed to: 0x...

📝 Contract Details:
Owner: 0x...
Voting Open: true

💡 Next Steps:
(Shows interaction examples)
```

### 6️⃣ Interact with Your Contract

After deployment, use Hardhat console:

```bash
npx hardhat console --network zamaDevnet
```

**Vote for Option A:**
```javascript
const voting = await ethers.getContractAt("PrivateVoting", "YOUR_CONTRACT_ADDRESS");
await voting.vote(true);
```

**Vote for Option B:**
```javascript
await voting.vote(false);
```

**Close Voting (owner only):**
```javascript
await voting.closeVoting();
```

**Get Results (owner only):**
```javascript
const [votesA, votesB] = await voting.getResults();
console.log("Option A:", votesA.toString());
console.log("Option B:", votesB.toString());
```

## Common Issues & Solutions

### ❌ Test fails: "Vote function must use FHE.asEuint32"
**Solution:** You need to convert public values (1 and 0) to encrypted values using `FHE.asEuint32()`

### ❌ Test fails: "Vote function must use FHE.select"
**Solution:** Use `FHE.select(condition, valueIfTrue, valueIfFalse)` to choose which vote counter to increment

### ❌ Test fails: "Vote function must mark the voter as having voted"
**Solution:** Add `hasVoted[msg.sender] = true;` in your vote function

### ❌ Deployment error: "insufficient funds"
**Solution:** Get more testnet ETH from https://faucet.zama.ai

### ❌ Deployment error: "invalid private key"
**Solution:** Ensure your `.env` file has the private key without the `0x` prefix

## File Purposes Summary

| File | Purpose | When to Use |
|------|---------|-------------|
| `exercises/13_deploy_voting.sol` | Your implementation | Work on TODOs |
| `exercises/13_README.md` | Detailed instructions | Understand requirements |
| `test/13_deploy_voting.test.ts` | Test validation | Verify solution |
| `scripts/deploy-voting.ts` | Deployment script | Deploy to testnet |
| `docs/DEPLOYMENT.md` | Full deployment guide | Detailed deployment help |
| `solutions/SOLUTION_13.md` | Complete solution | Only when stuck |
| `.env.example` | Environment template | Set up deployment |

## Next Steps After Deployment

🎉 Congratulations on completing FHElings!

**Share Your Achievement:**
- Post on Twitter with #FHEVM
- Join Zama Discord and share your contract address
- Explore building more advanced applications

**Learn More:**
- Read the FHEVM documentation: https://docs.zama.ai/fhevm
- Explore example projects: https://github.com/zama-ai/fhevm
- Join the community: https://discord.gg/zama

---

Need more help? See the full deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
