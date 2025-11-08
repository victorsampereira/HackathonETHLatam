// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialComparison {
    // We wish to find if 'a' is greater or equal than 'b'
    // The result should also be encrypted (an 'ebool')
    function isGreaterOrEqual(euint32 a, euint32 b) external returns (ebool) {

        // TODO: Return an ebool that's 'true' if a >= b
    }
}