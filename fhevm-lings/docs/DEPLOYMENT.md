# Deploying to Zama Devnet

Once you complete exercise 13 (PrivateVoting), you can deploy your smart contract to the Zama Devnet testnet!

## Prerequisites

1. **Get testnet ETH**
   - Visit: https://faucet.zama.ai
   - Network: Zama Devnet
   - Enter your wallet address
   - Request test ETH

2. **Configure your environment**

   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your private key (without the 0x prefix):
   ```
   PRIVATE_KEY=your_private_key_here_without_0x_prefix
   ```

   ⚠️ **IMPORTANT**: Never commit your `.env` file or share your private key!

## Network Configuration

The Zama Devnet network is already configured in [hardhat.config.ts](hardhat.config.ts):

```typescript
networks: {
  zamaDevnet: {
    url: "https://devnet.zama.ai",
    accounts: [process.env.PRIVATE_KEY],
    chainId: 8009
  }
}
```

## Deployment Steps

### Option 1: Using the deployment script (Recommended)

```bash
npx hardhat run scripts/deploy-voting.ts --network zamaDevnet
```

This will:
- Deploy the PrivateVoting contract
- Display the contract address
- Show example commands for interacting with the contract

### Option 2: Manual deployment using Hardhat console

```bash
npx hardhat console --network zamaDevnet
```

Then in the console:
```javascript
const PrivateVoting = await ethers.getContractFactory("PrivateVoting");
const voting = await PrivateVoting.deploy();
await voting.waitForDeployment();
console.log("Contract deployed to:", await voting.getAddress());
```

## Interacting with Your Contract

After deployment, you can interact with your contract:

### Vote for Option A
```bash
npx hardhat console --network zamaDevnet
```
```javascript
const voting = await ethers.getContractAt("PrivateVoting", "YOUR_CONTRACT_ADDRESS");
await voting.vote(true); // Vote for Option A
```

### Vote for Option B
```javascript
await voting.vote(false); // Vote for Option B
```

### Close Voting (owner only)
```javascript
await voting.closeVoting();
```

### Get Results (owner only, after closing)
```javascript
const [votesA, votesB] = await voting.getResults();
console.log("Option A:", votesA.toString());
console.log("Option B:", votesB.toString());
```

### Get Winner (owner only, after closing)
```javascript
const winner = await voting.getWinner();
console.log("Winner:", winner ? "Option A" : "Option B");
```

## Verifying Your Deployment

You can verify that your contract is working by:

1. Getting the encrypted vote counts (anyone can call this):
```javascript
const encryptedA = await voting.getEncryptedVotesA();
const encryptedB = await voting.getEncryptedVotesB();
// These return encrypted values - you can see they exist but not their actual values!
```

2. Checking if an address has voted:
```javascript
const hasVoted = await voting.hasVoted("0xYourAddress");
console.log("Has voted:", hasVoted);
```

## Troubleshooting

### Error: "insufficient funds"
- Make sure you requested testnet ETH from the faucet
- Check your balance with: `await ethers.provider.getBalance("YOUR_ADDRESS")`

### Error: "invalid private key"
- Ensure your private key in `.env` doesn't have the `0x` prefix
- Verify the private key is correct (64 characters)

### Error: "Voting is closed"
- The voting has been closed by the owner
- Deploy a new contract instance

### Error: "Already voted"
- This address has already cast a vote
- Use a different address to test multiple votes

## Resources

- 📚 [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- 💬 [Zama Discord Community](https://discord.gg/zama)
- 🔧 [Hardhat Documentation](https://hardhat.org/docs)
- 🌐 [Zama Devnet Explorer](https://explorer.devnet.zama.ai) (if available)

## Next Steps

Congratulations on deploying your first FHEVM contract! 🎉

Consider building more complex applications:
- Multi-option voting systems
- Private auctions
- Confidential gaming (fog of war)
- Privacy-preserving analytics
- Encrypted token balances

Happy building with FHEVM! 🚀
