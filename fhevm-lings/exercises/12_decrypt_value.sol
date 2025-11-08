// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract DecryptValue {
    // This shows the Decrypting process
    // IMPORTANT: Only decrypt when truly necessary!

    euint32 private secretValue;
    address private owner;

    constructor() {
        owner = msg.sender;
        secretValue = FHE.asEuint32(42); // Secret initial value
    }

    function setSecretValue(uint32 newValue) external {
        require(msg.sender == owner, "Only the owner can define the value");
        // TODO: Convert newValue to euint32 and store in secretValue

    }

    function revealToOwner() external view returns (uint32) {
        require(msg.sender == owner, "Only the owner can define the value");

        // TODO: Descrypt secretValue and return as uint32

    }

    function getEncryptedValue() external view returns (euint32) {
        // Anyone can obtain the encrypted value ( but can't decrypt it!)
        return secretValue;
    }
}
