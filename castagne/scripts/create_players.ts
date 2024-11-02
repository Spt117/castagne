import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Castagne } from "../target/types/castagne";
import { getProgramConfig } from "./config";
const fs = require('fs');

// set this variable to disable warnings
// export NODE_NO_WARNINGS=1


const create_players = async (
  program: anchor.Program<Castagne>
): Promise<anchor.web3.Keypair[]> => {

  console.log('\n👉Creating players ...');
  const usernames = ['bob', 'alice', 'lol', 'La Brute', 'Crados'];
  const players: anchor.web3.Keypair[] = [];

  for (const username of usernames) {
    console.log('▸ 👉Creating', username);

    const player: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    let tx = await program.provider.connection.requestAirdrop(player.publicKey, 10_000_000_000);
    await program.provider.connection.confirmTransaction(tx);

    const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player"), player.publicKey.toBuffer()],
      program.programId
    );

    players.push(player);

    await program.methods
      .createPlayer(username)
      .accounts({
        user: player.publicKey,
        player: playerPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([player])
      .rpc();

      let _player = await program.account.player.fetch(playerPda);
      console.table({
        username: _player.username,
        user: _player.user.toString(),
        xp: _player.xp,
        attributes: _player.attributes.toString(),
      });
  }

  let _players = await program.account.player.all();
  console.log('Total players:', _players.length);
  return players;
}

const update_players = async (
  program: anchor.Program<Castagne>,
  players: anchor.web3.Keypair[]
) => {
  console.log('\n👉Updating players ...');
  for (const player of players) {
    const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player"), player.publicKey.toBuffer()],
      program.programId
    );

    let playerData = await program.account.player.fetch(playerPda);
    console.log('▸ 👉Updating', playerData.username);

    let attributes = [];
    let xp = playerData.xp;

    for (let i = 0; i < playerData.attributes.length; i++) {
      const number = Math.floor(Math.random() * xp);
      attributes.push(number);
      xp -= number;
    }
    attributes[playerData.attributes.length -1] += xp;

    await program.methods
      .updatePlayer(attributes)
      .accounts({
        user: player.publicKey,
        player: playerPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([player])
      .rpc();

      console.log('▸ Player updated:');
      let _player = await program.account.player.fetch(playerPda);
      console.table({
        username: _player.username,
        user: _player.user.toString(),
        xp: _player.xp,
        attributes: _player.attributes.toString(),
      });
  }
}

const action = async (
  program: anchor.Program<Castagne>,
  provider: anchor.AnchorProvider
) => {
  // Admin account
  const adminWallet = provider.wallet as anchor.Wallet
  const balance = await anchor.getProvider().connection.getBalance(adminWallet.publicKey);

  // fund account if needed
  if (balance < 1e8) {
    console.log("▸ Fund account :", adminWallet.publicKey.toString());
    let txairdropAdminWallet = await program.provider.connection.requestAirdrop(
      adminWallet.publicKey, 10_000_000_000);
    await program.provider.connection.confirmTransaction(txairdropAdminWallet);
  }

  console.log("▸ admin     :", adminWallet.publicKey.toString());
  console.log("▸ balance   :", balance);
  console.log("▸ program id:", program.idl.address);

  const players: anchor.web3.Keypair[] = await create_players(program);
  await update_players(program, players);
}

const main = async () => {

  const {program, provider} = await getProgramConfig();

  try {
    const version = await program.provider.connection.getVersion();
    console.log("🟢Node is running with version");
    console.table(version);
    console.log("\n▸ Provider  :", provider.connection.rpcEndpoint)

    await action(program, provider);

  } catch (err) {
      console.log("🔴Fatal error!", err);
  }
}

main()
