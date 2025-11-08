// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract MinMaxOperations {
    // FHEVM offers useful functions for finding min and max
    // between two encrypted values, without revealing which is which!

    function minimum(euint32 a, euint32 b) external returns (euint32) {
        // TODO: Return the smaller value between a an b

    }

    function maximum(euint32 a, euint32 b) external returns (euint32) {
        // TODO: Return the greater value between a and b
    }
}
