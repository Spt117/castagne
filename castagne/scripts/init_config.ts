import * as anchor from "@coral-xyz/anchor";
import { Castagne } from "../target/types/castagne";
import { getProgramConfig } from './config';

// set this variable to disable warnings
// export NODE_NO_WARNINGS=1


const setConfig = async (
  program: anchor.Program<Castagne>,
  adminWallet: anchor.Wallet
) => {
  // Define config PDA
  let [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("config"),
      adminWallet.publicKey.toBuffer()
    ],
    program.programId
  );

  console.log("\n▸ Set adminWallet:", adminWallet.publicKey.toString());
  console.log("▸ Set configPda  :", configPda.toString());

  // Set config
  try {
    console.log("👉Setting Config ...");
    const tx = await program.methods
      .initializeConfig()
      .accounts(
        {
          owner: adminWallet.publicKey,
          config: configPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any
      )
      .rpc();

    await anchor.getProvider().connection.confirmTransaction(tx, "confirmed");
    console.log("🟢Config set Tx  :", tx);
  } catch (err) {
    const errMsg = (err as anchor.web3.SendTransactionError).message;
    if (errMsg.includes("already in use")) {
      console.log("🔵Config already set!");
    } else {
      console.log("🔴Config unknown error!", err);
    }
  }
}

const getConfig = async (
  program: anchor.Program<Castagne>,
  adminWallet: anchor.Wallet
) => {
  // Define config PDA
  let [configPda, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("config"), adminWallet.publicKey.toBuffer()],
    program.programId
  );

  console.log("\n▸ Get adminWallet:", adminWallet.publicKey.toString());
  console.log("▸ Get configPda  :", configPda.toString());

  try {
    let resultConfig = await program.account.config.fetch(configPda);
    console.log("🟢Config Owner   :", resultConfig.owner.toString());
  } catch (err) {
    console.log("🔴Error getting config owner !", err);
  }
}

const init_fight = async (
  program: anchor.Program<Castagne>,
  adminWallet: anchor.Wallet
) => {
  const [fightPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('fight')],
    program.programId
  );

  console.log("\n▸ Init fight config (pda):", fightPda.toString());

  try {
    console.log("👉Initiating fight config ...");
    const tx = await program.methods
      .initFightConfig()
      .accounts({
        owner: adminWallet.publicKey,
        fightPda: fightPda,
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
  provider: anchor.AnchorProvider,
  program: anchor.Program<Castagne>
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

  await setConfig(program, adminWallet);
  await getConfig(program, adminWallet);
  await init_fight(program, adminWallet);
  console.log("")
}


const main = async () => {
  const {program, provider} = await getProgramConfig();

  try {
    const version = await program.provider.connection.getVersion();
    console.log("🟢Node is running with version");
    console.table(version);
    console.log("\n▸ Provider  :", provider.connection.rpcEndpoint)

    await action(provider, program);
  } catch (err) {
    console.log("🔴Node not running!\n", err);
  }
}

main()
