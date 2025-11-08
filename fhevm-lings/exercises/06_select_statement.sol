// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialLogic {
    // Esta é a função mais importante do FHEVM!
    // É o equivalente a um `if/else` para dados secretos.
    //
    // Se 'condition' (um ebool) for verdadeiro, retorne 'ifTrueValue'.
    // Senão, retorne 'ifFalseValue'.
    function conditionalSelect(
        ebool condition,
        euint32 ifTrueValue,  
        euint32 ifFalseValue
    ) external returns (euint32) {

        // TODO: Implemente a lógica if/else usando FHE.select
        // Dica: FHE.select(condition, ifTrueValue, ifFalseValue)
        return FHE.select(condition, ifTrueValue, ifFalseValue);
    }
}