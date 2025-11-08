// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract DecryptValue {
    // Este exercício mostra como DESCRIPTOGRAFAR valores.
    // IMPORTANTE: Só descriptografe quando realmente necessário!
    // A descriptografia quebra a privacidade.

    euint32 private secretValue;
    address private owner;

    constructor() {
        owner = msg.sender;
        secretValue = FHE.asEuint32(42); // Valor secreto inicial
    }

    function setSecretValue(uint32 newValue) external {
        require(msg.sender == owner, "Apenas o dono pode definir o valor");
        // TODO: Converta newValue para euint32 e armazene em secretValue

    }

    function revealToOwner() external view returns (uint32) {
        require(msg.sender == owner, "Apenas o dono pode revelar o valor");

        // TODO: Descriptografe secretValue e retorne como uint32
        // Dica: Use FHE.decrypt(secretValue)
        // NOTA: Em produção, você usaria um sistema de permissões mais robusto!

    }

    function getEncryptedValue() external view returns (euint32) {
        // Qualquer um pode obter o valor encriptado (mas não pode lê-lo!)
        return secretValue;
    }
}
