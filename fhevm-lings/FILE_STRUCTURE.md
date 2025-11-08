# FHElings File Structure Guide 📁

This document explains the organized file structure of the FHElings project.

## Directory Overview

```
fhevm-lings/
├──  exercises/       # All learning exercises
├── test/            # Test files for validation
├──  scripts/         # Deployment and utility scripts
├──  docs/            # Documentation and guides
├──  solutions/       # Reference solutions (spoilers!)
├──   src/            # CLI tool source code
├──  Configuration files (root level)
└──  README.md        # Main documentation
```

## Detailed Structure

###  `exercises/` Directory

Contains all the learning exercises in sequential order:

```
exercises/
├── 01_introduction.md           # Introduction to FHElings
├── 02_import_tfhe.sol          # Import FHE library
├── 03_encrypt_euint32.sol      # Encrypt values
├── 04_add_two_euints.sol       # Addition operations
├── 05_comparison.sol           # Comparison operations
├── 06_select_statement.sol     # Conditional logic
├── 07_multiply_euints.sol      # Multiplication
├── 08_subtract_euints.sol      # Subtraction
├── 09_min_max.sol              # Min/Max operations
├── 10_encrypted_counter.sol    # State management
├── 11_boolean_operations.sol   # Boolean logic
├── 12_decrypt_value.sol        # Decryption
├── 13_deploy_voting.sol        # ⭐ FINAL CHALLENGE
├── 13_README.md                # Exercise 13 detailed guide
└── 99_congratulations.md       # Completion message
```

**You work here:** Edit the `.sol` files to complete TODOs

### ✅ `test/` Directory

Automated tests that validate your solutions:

```
test/
├── 02_import_tfhe.test.ts
├── 03_encrypt_euint32.test.ts
├── ...
└── 13_deploy_voting.test.ts    # Final challenge test
```

**How to use:**
```bash
# Test specific exercise
npx hardhat test test/03_encrypt_euint32.test.ts

# Test all
npx hardhat test
```

### 🚀 `scripts/` Directory

Deployment and utility scripts:

```
scripts/
└── deploy-voting.ts            # Deploy exercise 13 to testnet
```

**How to use:**
```bash
npx hardhat run scripts/deploy-voting.ts --network zamaDevnet
```

### 📖 `docs/` Directory

Documentation and comprehensive guides:

```
docs/
├── DEPLOYMENT.md               # Full deployment guide
└── QUICK_START_EXERCISE_13.md  # Exercise 13 quick reference
```

**Purpose:**
- `DEPLOYMENT.md` - Complete testnet deployment instructions
- `QUICK_START_EXERCISE_13.md` - Quick reference for exercise 13

### 💡 `solutions/` Directory

Reference solutions (only look when stuck!):

```
solutions/
└── SOLUTION_13.md              # Complete solution for exercise 13
```

⚠️ **Warning:** Contains spoilers! Try to solve exercises yourself first.

### ⚙️ `src/` Directory

CLI tool source code (you don't need to modify these):

```
src/
├── index.ts            # Main application entry point
├── ui.ts              # User interface and display
├── gamification.ts    # Hints, streaks, statistics
├── compiler.ts        # Compilation logic
├── exerciseRepo.ts    # Exercise management
└── interactive.ts     # Keyboard interaction
```

### 🔧 Configuration Files (Root)

Essential configuration files:

```
fhevm-lings/
├── exercises.json          # Exercise definitions and hints
├── hardhat.config.ts       # Hardhat & network configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # NPM dependencies and scripts
├── .env.example            # Environment variable template
├── .gitignore             # Git ignore rules
├── README.md              # Main project documentation
├── FILE_STRUCTURE.md      # This file
└── check-exercises.js     # Exercise status checker
```

## Exercise 13 Files (Final Challenge)

All files related to the final challenge are clearly organized:

| Location | File | Purpose |
|----------|------|---------|
| `exercises/` | `13_deploy_voting.sol` | **YOUR WORK:** Complete TODOs |
| `exercises/` | `13_README.md` | Detailed exercise instructions |
| `test/` | `13_deploy_voting.test.ts` | Validation tests |
| `scripts/` | `deploy-voting.ts` | Deployment script |
| `docs/` | `DEPLOYMENT.md` | Full deployment guide |
| `docs/` | `QUICK_START_EXERCISE_13.md` | Quick reference |
| `solutions/` | `SOLUTION_13.md` | Complete solution |
| Root | `.env.example` | Environment template |

## Common Workflows

### Working on an Exercise

1. **Open:** `exercises/XX_exercise_name.sol`
2. **Edit:** Complete the TODOs
3. **Save:** Tests run automatically (in watch mode)
4. **Test manually:** `npx hardhat test test/XX_exercise_name.test.ts`

### Deploying Exercise 13

1. **Complete:** `exercises/13_deploy_voting.sol`
2. **Test:** `npx hardhat test test/13_deploy_voting.test.ts`
3. **Read guide:** `docs/QUICK_START_EXERCISE_13.md`
4. **Configure:** Copy `.env.example` to `.env`, add private key
5. **Deploy:** `npx hardhat run scripts/deploy-voting.ts --network zamaDevnet`

### Getting Help

1. **Progressive hints:** Press 't' in CLI
2. **Exercise guide:** Read `exercises/13_README.md`
3. **Deployment help:** Read `docs/DEPLOYMENT.md`
4. **Quick reference:** Read `docs/QUICK_START_EXERCISE_13.md`
5. **Full solution:** Read `solutions/SOLUTION_13.md` (last resort)

## File Naming Conventions

- **Exercises:** `NN_description.sol` or `NN_description.md`
  - `NN` = Two-digit number (01-99)
  - `description` = Brief, descriptive name

- **Tests:** `NN_description.test.ts`
  - Matches the exercise filename

- **Documentation:** `UPPERCASE_NAME.md`
  - Clear, descriptive all-caps names

## Finding Files Quickly

### VS Code Users
Press `Ctrl+P` (or `Cmd+P` on Mac) and type:
- `13_deploy` - Find exercise 13 files
- `DEPLOYMENT` - Find deployment guide
- `SOLUTION` - Find solution files

### Command Line
```bash
# Find exercise 13 files
find . -name "*13*" -not -path "*/node_modules/*"

# Find all documentation
find docs/ -name "*.md"

# Find all solutions
find solutions/ -name "*.md"
```

## Key Points

✅ **Exercises** are in `exercises/` - this is where you work

✅ **Tests** are in `test/` - verify your solutions

✅ **Deployment** scripts are in `scripts/` - deploy to testnet

✅ **Documentation** is in `docs/` - comprehensive guides

✅ **Solutions** are in `solutions/` - only when stuck!

✅ **Exercise 13** has dedicated files in each directory

✅ **Configuration** files are in the root

## Questions?

- Read the main [README.md](README.md)
- Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment
- See [docs/QUICK_START_EXERCISE_13.md](docs/QUICK_START_EXERCISE_13.md) for exercise 13
- Join Zama Discord: https://discord.gg/zama

---

**The structure is designed to be intuitive - each type of file has its own directory!** 🎯
