// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract EncryptedCounter {
    // Este exercício mostra como trabalhar com ESTADO encriptado.
    // O contador é privado - ninguém pode ver seu valor!

    euint32 private counter;

    constructor() {
        // Inicializa o contador com 0 encriptado
        counter = FHE.asEuint32(0);
    }

    function increment() external {
        // TODO: Incremente o contador em 1
        // Dica 1: Você precisa criar um euint32 com valor 1
        // Dica 2: Use FHE.asEuint32(1) e depois adicione ao counter
        // Dica 3: Atualize a variável counter com o novo valor

    }

    function add(uint32 value) external {
        // TODO: Adicione 'value' ao contador
        // Dica 1: Converta 'value' para euint32
        // Dica 2: Adicione ao counter e atualize counter

    }

    function getCounter() external view returns (euint32) {
        // Esta função retorna o contador (ainda encriptado!)
        return counter;
    }
}
