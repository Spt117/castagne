# castagne 🥊

[Arnaud Séné](https://github.com/ArnaudSene)
[Michael Gaeta](https://github.com/wi2/)

[DEMO](https://castagne-sigma.vercel.app/)
[Solana explorer](https://explorer.solana.com/address/FvH7Ae6WLxKkb1dt9LZQCSLRhFsiSVvRoj6JR764wt9u?cluster=devnet)

Castagne is a fighting game between 2 players with random management of hitting points.

## 1. Explanation

A player has 3 characteristics, strength, speed and robustness for which he has awarded points.

When the fight begins, the characteristics of the 2 players are added together determining the min and max. The random number is generated in this range. If the number is within player 1's point range, he wins, otherwise player 2 wins.

The match is played in 3 rounds, the winner is the one who wins at least 2 rounds.

The winner receives 100 XP points.
Every 10 matches, players receive 10 XP points regardless of their result.

XP points can be used to modify characteristics.

### Exemple

| Characteristic | player 1 | player 2 | Min | Max             |
| -------------- | -------- | -------- | --- | --------------- |
| Strengh        | 250      | 350      | 0   | 250 + 350 = 600 |

Random for strengh
| Random number | Player 1 | Player 2|
|---------------|----------|---------|
| 127 | Winner | |
| 251 | | Winner |

## 2. Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.0 or higher
- Solana CLI 1.18.9 or higher

### 2.1 Installation

#### Retrieve project from GitHub

```bash
git clone https://github.com/wi2/castagne
cd castagne
```

#### Install dependencies

Anchor program

```bash
cd castagne
npm install
```

Web app

```bash
cd ../web
npm install
```

### 2.2 Setup provider

Select the environment you want to deploy to.

- mainnet
- devnet
- testnet
- localnet

#### localnet

Start the localnet

```bash
# If you want to start from scrach
solana-test-validator --reset

# If you want to continue with previous data
solana-test-validator

# To fund your account
solana airdrop 100

# Show your account
solana account <publicKey>

# or

solana account  ~/.config/solana/<file>.json
```

## 3. App: Build and deploy

### 3.1 Build the contract

```bash
# path castagne/castagne
anchor build
```

### 3.2 Get the program id

```bash
anchor keys list
```

### 3.3 Update file with program id

If the program id is different from the one set inside `lib.rs` replace the program id by the new one.

path `castagne/castagne/programs/castagne-backend/src`
file `lib.rs`

```rust
declare_id!("<new program id>");
```

path `castagne/castagne`
file `anchor.toml`

```toml
[programs.localnet]
castagne = "C7nwDHYxYX2BtKEubo2rc4LScApEekWUtCkNc8YWBSYw"

[programs.devnet]
castagne = "C7nwDHYxYX2BtKEubo2rc4LScApEekWUtCkNc8YWBSYw"

```

### 3.4 Build and sync web app

This build takes into account updating files with the program id
Then synchronize IDL and with web app
This script will copy `castagne/target/idl` and `castagne/target/types` directories to `web/web/context`

```bash
anchor build && anchor run sync
```

### 3.5 deploy

After having updated files, you have to build and deploy

#### 3.5.1 Deploy to Localnet

```bash
# path castagne/castagne
anchor deploy
```

#### 3.5.2 Deploy to devnet | mainnet

##### Save you wallet private key

1. Export your private key from your wallet and save it to a file (in a safe location❗️)
2. Execute `decodeKeypair.ts` to decode and save your private key to a json file (in a safe location❗️)

```bash
# Where:
# ~/.config/solana/devnet-keypair-act1-raw is the private key exported from your wallet
# ~/.config/solana/devnet-keypair-act1.json is the private key decoded

# path castagne/web
npm run decode-keypair ~/.config/solana/devnet-keypair-act1-raw  ~/.config/solana/devnet-keypair-act1.json
```

##### Deploy the contract to devnet

```bash
# path castagne/castagne

anchor deploy --provider.cluster devnet --provider.wallet ~/.config/solana/devnet-keypair-act1.json
```

## 4. Run Unit tests

Run unit test locally with the `solana-test-validator` _stopped_

```bash
anchor test
```

Run unit tests locally with the `solana-test-validator` _running_

```bash
anchor run test
```

## 5. Run some scripts

- Create and update players
- Read players
- init-fight-cfg
- sync (sync IDL and types from program to web app)

```bash
# localnet
anchor run init-config
anchor run init-fight-config
anchor run create-player
anchor run read-player
anchor run sync

# devnet
anchor run init-fight-config \
    --provider.wallet ~/.config/solana/devnet-keypair-act1.json \
    --provider.cluster devnet

```

Script are set in the Anchor.toml file

```toml
[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/castagne/*.ts"
init-config = "ts-node scripts/init_config.ts"
init-fight-config = "ts-node scripts/init_fight.ts"
create-player = "ts-node scripts/create_players.ts"
read-player = "ts-node scripts/read_players.ts"
sync = "cp -r target/idl/ ../web/web/context/idl && cp -r target/types/ ../web/web/context/types"
```

## 4. Run Web App

```bash
npm run dev

# or

npm run build && npm run start
```

[Castagne 👉 http://localhost:3000/ ](http://localhost:3000/)
