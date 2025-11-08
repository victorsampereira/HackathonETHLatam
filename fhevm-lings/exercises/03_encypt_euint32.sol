// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract EncryptData {
    // Esta função recebe um número normal (plaintext)
    // e deve retornar o seu equivalente encriptado.
    function encrypt(uint32 myValue) external view returns (euint32) {
        
        // TODO: Retorne o 'myValue' como um euint32 encriptado
        // Dica: A função que procura é FHE.asEuint32(...)
        euint32 encValue = FHE.asEuint32(myValue);
        return encValue;
    }
} 