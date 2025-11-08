// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

/**
 * FINAL CHALLENGE: Private Voting System
 *
 * This is your final exercise! You'll build a complete private voting system
 * that uses all the concepts you've learned:
 * - Encrypted state (euint32)
 * - Arithmetic operations (addition)
 * - Comparisons (greater than)
 * - Conditional logic (select)
 * - Decryption (for results)
 *
 * The system allows users to vote privately on proposals without revealing
 * individual votes. Only the final tally can be decrypted by the owner.
 *
 * There is an auxiliary README for this problem
 */

contract PrivateVoting {
    address public owner;
    bool public votingOpen;

    // Encrypted vote counts for each option
    euint32 private votesOptionA;
    euint32 private votesOptionB;

    // Track who has voted (to prevent double voting)
    mapping(address => bool) public hasVoted;

    constructor() {
        owner = msg.sender;
        votingOpen = true;

        // Initialize vote counts to 0
        votesOptionA = FHE.asEuint32(0);
        votesOptionB = FHE.asEuint32(0);
    }

    /**
     * TODO: Implement the vote function
     *
     * This function should:
     * 1. Check that voting is still open
     * 2. Check that the voter hasn't voted before
     * 3. Increment the appropriate vote counter based on the choice
     * 4. Mark the voter as having voted
     *
     * Hint: Use FHE.select() to choose which counter to increment
     * Hint: You need to convert 1 to euint32 before adding
     */
    function vote(bool choiceA) external {
        require(votingOpen, "Voting is closed");
        require(!hasVoted[msg.sender], "Already voted");

        // TODO: Create an encrypted 1 to add to the vote count


        // TODO: Create an encrypted 0 (for the option not chosen)


        // TODO: Use FHE.select to choose which vote to increment
        // If choiceA is true, increment votesOptionA, otherwise increment votesOptionB


        // TODO: Mark that this address has voted

    }

    /**
     * TODO: Implement the close voting function
     * Only the owner should be able to close voting
     */
    function closeVoting() external {
        // TODO: Check that caller is the owner

        // TODO: Set votingOpen to false

    }

    /**
     * TODO: Implement the get results function
     *
     * This function should:
     * 1. Check that voting is closed
     * 2. Check that caller is the owner
     * 3. Decrypt both vote counts
     * 4. Return them as regular uint32 values
     *
     * Hint: Use FHE.decrypt() to reveal the encrypted values
     */
    function getResults() external view returns (uint32, uint32) {
        require(!votingOpen, "Voting still open");
        require(msg.sender == owner, "Only owner can see results");

        // TODO: Decrypt votesOptionA and votesOptionB and return them

    }

    /**
     * Bonus: Implement get winner function
     * Returns true if Option A won, false if Option B won
     * Can only be called after voting is closed
     */
    function getWinner() external view returns (bool) {
        require(!votingOpen, "Voting still open");
        require(msg.sender == owner, "Only owner can see winner");

        // TODO: Compare votesOptionA and votesOptionB
        // Hint: Use FHE.gt() or FHE.ge() and then decrypt the result

    }

    /**
     * These functions return encrypted vote counts
     * Users can verify voting is working without seeing the actual numbers!
     */
    function getEncryptedVotesA() external view returns (euint32) {
        return votesOptionA;
    }

    function getEncryptedVotesB() external view returns (euint32) {
        return votesOptionB;
    }
}
