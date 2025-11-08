# ⚡ fhevm-lings

> Aprenda FHEVM (Fully Homomorphic Encryption Virtual Machine) através de pequenos exercícios interativos!

Inspirado no [rustlings](https://github.com/rust-lang/rustlings), o `fhevm-lings` é uma forma divertida e prática de aprender criptografia homomórfica com a blockchain usando FHEVM da Zama.

## 🎯 O que você vai aprender

- ✅ Importar e usar a biblioteca FHE
- ✅ Encriptar dados on-chain (euint32, ebool, etc.)
- ✅ Realizar operações homomórficas (adição, comparação)
- ✅ Implementar lógica condicional em dados encriptados
- ✅ Construir contratos inteligentes com privacidade

## 📦 Instalação

### Pré-requisitos
- Node.js v18 ou superior
- npm ou yarn

### Passos

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/SEU_USER/fhevm-lings.git
   cd fhevm-lings
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

## 🚀 Como Usar

### Modo Observador (Watch Mode)

O modo padrão que observa seus arquivos e testa automaticamente:

```bash
npm run watch```

Isso iniciará o modo interativo que:
1. Mostra o exercício atual
2. Aguarda você editar o arquivo
3. Automaticamente compila e testa quando você salva
4. Avança para o próximo exercício quando você acertar!

### Outros Comandos

Você pode usar estes comandos **a qualquer momento**, inclusive enquanto o modo watch está rodando:

```bash
# Ver lista de todos os exercícios e progresso (em nova janela do terminal)
npm run watch list

# Mostrar dica do exercício atual (em nova janela do terminal)
npm run watch hint

# Verificar um exercício específico
npm run watch verify 03_encrypt_euint32
```

**Dica:** Abra uma segunda janela do terminal para executar comandos como `list` e `hint` sem interromper o modo watch!

### 📸 Preview da Experiência

**Terminal Limpo e Organizado:**
```
──────────────────────────────────────────────────

⚡fhevm-lings Exercício Atual
  Progresso: 4/7
  ████████████████░░░░░░░░░░░░░░ 57%

  📝 04_add_two_euints
  Aguardando mudanças no arquivo...

──────────────────────────────────────────────────
```

**Feedback ao Salvar:**
```
⚡fhevm-lings 🔄 Compilando e testando...

⚡fhevm-lings ❌ Teste falhou!
  ├─ O exercício ainda não está correto.
  └─ Corrija o código e salve o arquivo novamente.

  💡 Dica:
     Você pode usar 'return FHE.add(a, b)' ou simplesmente 'return a + b'
```

**Lista de Progresso:**
```
⚡fhevm-lings 📋 Lista de Exercícios

  ✓ ✅ 01: 01_introduction
  ✓ ✅ 02: 02_import_tfhe
  ✓ ✅ 03: 03_encrypt_euint32
  ○ 📝 04: 04_add_two_euints ← atual
  ...

  Progresso Geral:
  █████████████████░░░░░░░░░░░░░░ 57%
  4 de 7 exercícios completos
```

## 📚 Estrutura dos Exercícios

Os exercícios estão organizados em ordem de dificuldade crescente:

1. **01_introduction** - Introdução ao fhevm-lings
2. **02_import_tfhe** - Importar a biblioteca FHE
3. **03_encrypt_euint32** - Encriptar um número uint32
4. **04_add_two_euints** - Adicionar dois números encriptados
5. **05_comparison** - Comparar números encriptados
6. **06_select_statement** - Lógica condicional (if/else)
7. **99_congratulations** - Parabéns! 🎉

## 💡 Dicas

- 🔍 Leia os comentários nos arquivos .sol - eles contêm dicas importantes
- 📖 Use `npm run watch hint` se ficar preso
- ✅ Os testes verificam se sua implementação está correta
- 🚀 Não tenha medo de experimentar!

## 🎨 Interface Melhorada (Rustlings-Style!)

Inspirado no rustlings, o fhevm-lings oferece uma experiência de aprendizado moderna e intuitiva:

- ✨ **Interface colorida e limpa** - Terminal sempre organizado, sem poluição visual
- 📊 **Barra de progresso visual** - Veja seu avanço em tempo real com percentual
- 💬 **Mensagens de erro estruturadas** - Erros formatados em árvore com dicas direcionadas
- ⚡ **Feedback instantâneo** - Compilação e testes automáticos ao salvar
- 🎯 **Comandos úteis** - `list`, `hint`, `verify` disponíveis a qualquer momento
- 🧹 **Terminal auto-limpante** - Cada exercício começa com tela limpa
- 🎨 **Feedback visual aprimorado** - Cores e emojis para melhor compreensão

## 🛠️ Tecnologias

- [FHEVM](https://docs.zama.ai/fhevm) - Fully Homomorphic Encryption Virtual Machine by Zama
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Solidity](https://soliditylang.org/) - Smart contract language
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Chalk](https://github.com/chalk/chalk) - Terminal styling

## 📖 Recursos Adicionais

- [Documentação FHEVM](https://docs.zama.ai/fhevm)
- [Zama GitHub](https://github.com/zama-ai)
- [Exemplos FHEVM](https://github.com/zama-ai/fhevm)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novos exercícios
- Melhorar a documentação
- Compartilhar feedback

## 📝 Licença

Unlicense - Domínio público

## 🌟 Créditos

Inspirado em [rustlings](https://github.com/rust-lang/rustlings) - A great way to learn Rust!

---

**Feito com ❤️ para a comunidade FHEVM**
