# Solution for Exercise 13: Private Voting

⚠️ **WARNING**: Try to solve this exercise on your own first! Only look at this solution if you're completely stuck.

## Complete Solution

Here's the complete implementation of the PrivateVoting contract:

### vote() function

```solidity
function vote(bool choiceA) external {
    require(votingOpen, "Voting is closed");
    require(!hasVoted[msg.sender], "Already voted");

    // Create an encrypted 1 to add to the vote count
    euint32 one = FHE.asEuint32(1);

    // Create an encrypted 0 (for the option not chosen)
    euint32 zero = FHE.asEuint32(0);

    // Use FHE.select to choose which vote to increment
    // If choiceA is true, increment votesOptionA, otherwise increment votesOptionB
    euint32 incrementA = FHE.select(choiceA, one, zero);
    euint32 incrementB = FHE.select(choiceA, zero, one);

    votesOptionA = votesOptionA + incrementA;
    votesOptionB = votesOptionB + incrementB;

    // Mark that this address has voted
    hasVoted[msg.sender] = true;
}
```

**Alternative solution using if/else:**

```solidity
function vote(bool choiceA) external {
    require(votingOpen, "Voting is closed");
    require(!hasVoted[msg.sender], "Already voted");

    euint32 one = FHE.asEuint32(1);

    if (choiceA) {
        votesOptionA = votesOptionA + one;
    } else {
        votesOptionB = votesOptionB + one;
    }

    hasVoted[msg.sender] = true;
}
```

### closeVoting() function

```solidity
function closeVoting() external {
    // Check that caller is the owner
    require(msg.sender == owner, "Only owner");

    // Set votingOpen to false
    votingOpen = false;
}
```

### getResults() function

```solidity
function getResults() external view returns (uint32, uint32) {
    require(!votingOpen, "Voting still open");
    require(msg.sender == owner, "Only owner can see results");

    // Decrypt votesOptionA and votesOptionB and return them
    return (FHE.decrypt(votesOptionA), FHE.decrypt(votesOptionB));
}
```

### getWinner() function (Bonus)

```solidity
function getWinner() external view returns (bool) {
    require(!votingOpen, "Voting still open");
    require(msg.sender == owner, "Only owner can see winner");

    // Compare votesOptionA and votesOptionB
    ebool aWins = FHE.gt(votesOptionA, votesOptionB);

    // Decrypt and return the result
    return FHE.decrypt(aWins);
}
```

**Alternative solution (more efficient):**

```solidity
function getWinner() external view returns (bool) {
    require(!votingOpen, "Voting still open");
    require(msg.sender == owner, "Only owner can see winner");

    // Decrypt both and compare
    uint32 countA = FHE.decrypt(votesOptionA);
    uint32 countB = FHE.decrypt(votesOptionB);

    return countA > countB;
}
```

## Key Concepts Used

1. **FHE.asEuint32()** - Convert public uint32 to encrypted euint32
2. **FHE.select()** - Homomorphic conditional selection
3. **FHE.decrypt()** - Reveal encrypted values (only when necessary!)
4. **FHE.gt()** - Homomorphic greater-than comparison
5. **Access Control** - Using require() to restrict functions to owner
6. **State Management** - Managing encrypted state variables

## Testing Your Solution

Run the test to verify your implementation:

```bash
npx hardhat test test/13_deploy_voting.test.ts
```

If all tests pass, you'll see deployment instructions!

## Understanding the Privacy Model

- **During voting**: All vote counts remain encrypted on-chain
- **Individual votes**: Never revealed, even to the contract owner
- **Vote verification**: Users can verify voting is working via encrypted values
- **Results**: Only decrypted after voting closes, and only visible to owner
- **Privacy guarantee**: No one can see individual votes or running totals

This is the power of FHEVM! 🔒✨
