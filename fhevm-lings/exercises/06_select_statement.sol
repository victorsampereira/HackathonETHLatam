// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialLogic {
    // This function is one of the most importants in FHEVM!
    // It`s the equivalend of an `if/else` for encrypted data.
    //
    // If 'condition' (ebool) is true, return 'ifTrueValue'.
    // If not, 'ifFalseValue'.
    function conditionalSelect(
        ebool condition,
        euint32 ifTrueValue,  
        euint32 ifFalseValue
    ) external returns (euint32) {

        // TODO: Implement the  if/else logic
    }
}