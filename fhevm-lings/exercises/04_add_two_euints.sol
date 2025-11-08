// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract HomomorphicOps {
    // This function receives two already encrypted numbers
    // and returns it`s encrypted sum
    function add(euint32 a, euint32 b) external returns (euint32) {

        // TODO: Return the homomorphic sum of a and b
    }
}