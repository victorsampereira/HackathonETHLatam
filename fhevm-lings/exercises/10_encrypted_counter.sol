// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract EncryptedCounter {
    // This problem shows how to deal with the encrypted state.
    // The counter is private - no one can see its value!

    euint32 private counter;

    constructor() {
        // TODO: Initialize the counter with encrypted 0
    }

    function increment() external {
        // TODO: Increment the counter by 1
    }

    function add(uint32 value) external {
        // TODO: Adicione 'value' to the counter

    }

    function getCounter() external view returns (euint32) {
        // Getter for the counter (Still encrypted)
        return counter;
    }
}
