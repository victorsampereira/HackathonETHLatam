// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract MinMaxOperations {
    // FHEVM oferece funções úteis para encontrar o mínimo e máximo
    // entre dois valores encriptados, sem revelar qual é qual!

    function minimum(euint32 a, euint32 b) external returns (euint32) {
        // TODO: Retorne o menor valor entre a e b
        // Dica: Use FHE.min(a, b)

    }

    function maximum(euint32 a, euint32 b) external returns (euint32) {
        // TODO: Retorne o maior valor entre a e b
        // Dica: Use FHE.max(a, b)

    }
}
