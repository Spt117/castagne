import { PublicKey } from '@solana/web3.js';

import { IDL_PLAYER, IDL_BATTLE, IDL_STATS } from './idl';

const PROGRAM_PLAYER_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_PLAYER_ID as string
);
const PROGRAM_BATTLE_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_BATTLE_ID as string
);
const PROGRAM_STATS_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_STATS_ID as string
);

export enum Program_Ids {
  PROGRAM_PLAYER_ID,
  PROGRAM_BATTLE_ID,
  PROGRAM_STATS_ID,
}

export const CONF_PROGRAM = {
  [Program_Ids.PROGRAM_PLAYER_ID]: {
    idl: IDL_PLAYER,
    programId: PROGRAM_PLAYER_ID,
  },
  [Program_Ids.PROGRAM_BATTLE_ID]: {
    idl: IDL_BATTLE,
    programId: PROGRAM_BATTLE_ID,
  },
  [Program_Ids.PROGRAM_STATS_ID]: {
    idl: IDL_STATS,
    programId: PROGRAM_STATS_ID,
  },
};
