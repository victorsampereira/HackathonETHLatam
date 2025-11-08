// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract BooleanOperations {
    // Assim como temos euint32 para números, temos ebool para booleanos!
    // Podemos fazer operações lógicas (AND, OR, NOT) em ebools.

    function andOperation(ebool a, ebool b) external returns (ebool) {
        // TODO: Retorne a AND b
        // Dica: Use FHE.and(a, b) ou a & b

    }

    function orOperation(ebool a, ebool b) external returns (ebool) {
        // TODO: Retorne a OR b
        // Dica: Use FHE.or(a, b) ou a | b

    }

    function notOperation(ebool a) external returns (ebool) {
        // TODO: Retorne NOT a (negação)
        // Dica: Use FHE.not(a) ou !a

    }

    function xorOperation(ebool a, ebool b) external returns (ebool) {
        // TODO: Retorne a XOR b (ou exclusivo)
        // Dica: Use FHE.xor(a, b) ou a ^ b

    }
}
