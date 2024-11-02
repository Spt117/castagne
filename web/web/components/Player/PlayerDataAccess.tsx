'use client';

import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAnchorProvider } from '../solana/solana-provider';
import { useCluster } from '../cluster/cluster-data-access';
import { useCustomToast, useTransactionToast } from '../ui/ui-layout';
import {
  getCastagneProgram,
  getCastagneProgramId,
} from '@/context/castagne-exports';

export function useCastagneProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getCastagneProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getCastagneProgram(provider);

  const players = useQuery({
    queryKey: ['player', 'all', { cluster }],
    queryFn: () => program.account.player.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  return {
    program,
    programId,
    players,
    getProgramAccount,
  };
}

export const useCastagneProgramAccount = ({
  account,
}: {
  account: PublicKey;
}) => {
  const { cluster } = useCluster();
  const { program } = useCastagneProgram();
  const transactionToast = useTransactionToast();
  const customToast = useCustomToast();

  const [playerPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('player'), account.toBuffer()],
    program.programId
  );

  const playerQuery = useQuery({
    queryKey: ['player', 'fetch', { cluster, account }],
    queryFn: () => program.account.player.fetch(playerPda),
  });

  const createPlayer = useMutation({
    mutationKey: ['player', 'create_player', { cluster, account }],
    mutationFn: (username: string) =>
      program.methods
        .createPlayer(username)
        .accountsStrict({
          user: account,
          player: playerPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc(),
    onSuccess: (tx) => {
      console.log('tx', tx);
      transactionToast(tx);
      return playerQuery.refetch();
    },
    onError: (err) => {
      const errorData = JSON.parse(
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );

      if (
        errorData.logs.some((message: string | string[]) =>
          message.includes('already in use')
        )
      ) {
        customToast('Player already created with this address!');
      }
    },
  });

  const updatePlayer = useMutation({
    mutationKey: ['player', 'update_player', { cluster, account }],
    mutationFn: (attributes: number[]) =>
      program.methods
        .updatePlayer(attributes)
        .accountsStrict({
          user: account,
          player: playerPda,
        })
        .rpc(),
    onSuccess: (tx) => {
      console.log('tx', tx);
      transactionToast(tx);
      window.history.back();
      return playerQuery.refetch();
    },
    onError: (err) => {
      customToast(err.message);
      console.error('err', err);
    },
  });

  return {
    createPlayer,
    updatePlayer,
    playerQuery,
  };
};
