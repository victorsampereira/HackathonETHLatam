// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialComparison {
    // Queremos saber se 'a' é maior ou igual a 'b'.
    // O resultado também deve ser secreto (um 'ebool').
    function isGreaterOrEqual(euint32 a, euint32 b) external returns (ebool) {

        // TODO: Retorne um ebool que seja 'true' se a >= b
        // Dica: Não pode usar `a >= b`. Use FHE.ge(a, b) ou FHE.gte(a, b)
        return FHE.ge(a,b);
    }
}