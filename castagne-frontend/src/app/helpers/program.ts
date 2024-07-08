import { AnchorProvider, Idl, Program, Wallet } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';

import { Program_Ids, CONF_PROGRAM } from '../constants/program';
import { CommitmentType } from '../constants/types';

const mockWallet = () => {
  return {};
};

export const getProgram = (
  type: Program_Ids,
  connection: Connection,
  wallet: Wallet | undefined,
  commitment: CommitmentType = 'confirmed'
) => {
  const provider = new AnchorProvider(
    connection,
    wallet ?? (mockWallet as any),
    { commitment }
  );

  const program = new Program(
    CONF_PROGRAM[type].idl as Idl,
    CONF_PROGRAM[type].programId,
    provider
  );
  return program;
};
