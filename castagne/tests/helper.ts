import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Castagne } from '../target/types/castagne';
import { AnchorProvider } from '@coral-xyz/anchor/dist/cjs/provider';

export const PLAYER_XP_INIT = 1000;

export type confTestType = {
  userName1: string;
  userName2: string;
  userName3: string;
  program: anchor.Program<Castagne>;
  adminWallet: anchor.Wallet;
  player1: anchor.web3.Keypair;
  player2: anchor.web3.Keypair;
  player3: anchor.web3.Keypair;
  configPda: anchor.web3.PublicKey;
  fightPda: anchor.web3.PublicKey;
  player1Pda: anchor.web3.PublicKey;
  player2Pda: anchor.web3.PublicKey;
  player3Pda: anchor.web3.PublicKey;
};
const userName1 = 'bob';
const userName2 = 'alice';
const userName3 = 'lol';

const program = anchor.workspace.Castagne as Program<Castagne>;
const provider: AnchorProvider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const adminWallet = provider.wallet as anchor.Wallet;
const player1: anchor.web3.Keypair = anchor.web3.Keypair.generate();
const player2: anchor.web3.Keypair = anchor.web3.Keypair.generate();
const player3: anchor.web3.Keypair = anchor.web3.Keypair.generate();

const [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from('config'), adminWallet.publicKey.toBuffer()],
  program.programId
);

const [fightPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from('fight')],
  program.programId
);

const [player1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from('player'), player1.publicKey.toBuffer()],
  program.programId
);

const [player2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from('player'), player2.publicKey.toBuffer()],
  program.programId
);

const [player3Pda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from('player'), player3.publicKey.toBuffer()],
  program.programId
);

export async function getConfTest(): Promise<confTestType> {
  // airdrop
  let txairdropPlayer1 = await program.provider.connection.requestAirdrop(
    player1.publicKey,
    10_000_000_000
  );
  let txairdropPlayer2 = await program.provider.connection.requestAirdrop(
    player2.publicKey,
    10_000_000_000
  );
  let txairdropPlayer3 = await program.provider.connection.requestAirdrop(
    player3.publicKey,
    10_000_000_000
  );

  await program.provider.connection.confirmTransaction(txairdropPlayer1);
  await program.provider.connection.confirmTransaction(txairdropPlayer2);
  await program.provider.connection.confirmTransaction(txairdropPlayer3);

  return {
    userName1,
    userName2,
    userName3,

    program,

    adminWallet,
    player1,
    player2,
    player3,

    configPda,
    fightPda,
    player1Pda,
    player2Pda,
    player3Pda,
  };
}
