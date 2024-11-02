import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, web3} from '@coral-xyz/anchor';
import { Wallet } from '@coral-xyz/anchor';
import * as fs from 'fs';
import { Castagne } from '../target/types/castagne';


export const getProgramConfig = async () => {
  const _program = anchor.workspace.Castagne as Program<Castagne>;
  console.log('ANCHOR_WALLET', process.env.ANCHOR_WALLET)
  console.log('ANCHOR_PROVIDER_URL', process.env.ANCHOR_PROVIDER_URL)

  // Load the wallet keypair from the filesystem
  const walletKeyPair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(process.env.ANCHOR_WALLET, "utf-8")))
  );

  // Configure the provider to use the Devnet cluster
  const provider = new AnchorProvider(
    new web3.Connection(process.env.ANCHOR_PROVIDER_URL),
    new Wallet(walletKeyPair),
    {}
  );

  anchor.setProvider(provider);
  const idl = _program.idl;
  const program = new anchor.Program(idl, provider);

  return {provider, program};
}
