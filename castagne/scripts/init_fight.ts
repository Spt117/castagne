import * as anchor from "@coral-xyz/anchor";
import { Castagne } from "../target/types/castagne";
import { getProgramConfig } from "./config";

// set this variable to disable warnings
// export NODE_NO_WARNINGS=1


const init_fight_cfg = async (
  program: anchor.Program<Castagne>,
  adminWallet: anchor.Wallet
) => {
  const [fightPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('fight')],
    program.programId
  );

  console.log("\n▸ Init fight config (pda):", fightPda.toString());
  console.log('▸ SystemProgram.programId:', anchor.web3.SystemProgram.programId.toString())

  try {
    console.log("👉Initiating fight config ...");
    const tx = await program.methods
      .initFightConfig()
      .accounts({
        owner: adminWallet.publicKey,
        fightPda: fightPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

      await anchor.getProvider().connection.confirmTransaction(tx, "confirmed");
      console.log("🟢Init fight Tx  :", tx);
  } catch (err) {
    const errMsg = (err as anchor.web3.SendTransactionError).message;

    if (errMsg.includes("already in use")) {
      console.log("🔵Fight config already initiated!");
    } else {
      console.log("🔴Fight config unknown error!", err);
    }
  }
}


const action = async (
  program: anchor.Program<Castagne>,
  provider: anchor.AnchorProvider
) => {
  // Admin account
  const adminWallet: anchor.Wallet = provider.wallet as anchor.Wallet
  const balance = await anchor.getProvider().connection.getBalance(adminWallet.publicKey);

  // fund account if needed
  if (balance < 1e8 && provider.connection.rpcEndpoint === "http://127.0.0.1:8899") {
    console.log("▸ Fund account :", adminWallet.publicKey.toString());
    let txairdropAdminWallet = await program.provider.connection.requestAirdrop(
      adminWallet.publicKey, 10_000_000_000);
    await program.provider.connection.confirmTransaction(txairdropAdminWallet);
  }

  console.log("▸ admin     :", adminWallet.publicKey.toString());
  console.log("▸ balance   :", balance);
  console.log("▸ program id:", program.idl.address);

  await init_fight_cfg(program, adminWallet);
  console.log("")
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
    console.log("🔴Fatal error!\n", err);
  }
}

main()
