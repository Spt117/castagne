// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Castagne } from './types/castagne';
import CastagneIDL from './idl/castagne.json';

// Re-export the generated IDL and type
export { Castagne, CastagneIDL };

// The programId is imported from the program IDL.
export const CASTAGNE_PROGRAM_ID = new PublicKey(CastagneIDL.address);

// This is a helper function to get the Castagne Anchor program.
export function getCastagneProgram(provider: AnchorProvider) {
  return new Program(CastagneIDL as Castagne, provider);
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getCastagneProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Castagne program on devnet and testnet.
      return CASTAGNE_PROGRAM_ID;
    case 'mainnet-beta':
    default:
      return CASTAGNE_PROGRAM_ID;
  }
}
