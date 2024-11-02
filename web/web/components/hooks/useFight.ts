'use client';

import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useCastagneProgram } from './useCastagneProgram';
import { useCustomToast, useTransactionToast } from '@/components/ui/ui-layout';

export const useFight = ({
  account,
  refetch,
}: {
  account: PublicKey;
  refetch?: () => Promise<any>;
}) => {
  const { cluster, program } = useCastagneProgram();

  const transactionToast = useTransactionToast();
  const customToast = useCustomToast();

  const [fightPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('fight')],
    program.programId
  );

  const fightCounter = useQuery({
    queryKey: ['fight', 'fetch', { cluster }],
    queryFn: () => program.account.fight.fetch(fightPda),
  });

  const fightQuery = useQuery({
    queryKey: ['fight', 'fetch', { cluster, account }],
    queryFn: () => program.account.fightPlayer.fetch(fightPda),
  });

  const fightsQuery = useQuery({
    queryKey: ['fight', 'all', { cluster }],
    queryFn: () => program.account.fightPlayer.all(),
  });

  const initFightConfig = useMutation({
    mutationKey: ['fight', 'init_fight_config', { cluster, account }],
    mutationFn: ({ owner }: { owner: PublicKey }) =>
      program.methods
        .initFightConfig()
        .accountsStrict({
          owner,
          fightPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc(),
    onSuccess: (tx) => {
      console.log('tx', tx);
      transactionToast(tx);
      fightCounter.refetch();
      return fightsQuery.refetch();
    },
    onError: (err) => {
      customToast(err.message);
      console.log('err', err);
    },
  });

  const initFight = useMutation({
    mutationKey: ['fight', 'init_fight', { cluster, account }],
    mutationFn: ({
      player1,
      player2,
      fightPlayerPda,
      player1Pda,
      player2Pda,
    }: {
      player1: PublicKey;
      player2: PublicKey;
      fightPlayerPda: PublicKey;
      player1Pda: PublicKey;
      player2Pda: PublicKey;
    }) =>
      program.methods
        .initFight()
        .accountsStrict({
          player1,
          player2,
          fightPlayerPda,
          player1Pda,
          player2Pda,
          fightPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc(),
    onSuccess: (tx) => {
      console.log('tx', tx);
      transactionToast(tx);
      customToast('New fight initialized', true);

      fightCounter.refetch();
      return refetch?.();
    },
    onError: (err) => {
      customToast(err.message);
      console.log('err', err);
    },
  });

  const startFight = useMutation({
    mutationFn: ({
      player1,
      player2,
      fightPlayerPda,
      player1Pda,
      player2Pda,
      counter,
    }: {
      player1: PublicKey;
      player2: PublicKey;
      fightPlayerPda: PublicKey;
      player1Pda: PublicKey;
      player2Pda: PublicKey;
      counter: number;
    }) =>
      program.methods
        .startFight(counter)
        .accountsStrict({
          player1,
          player2,
          fightPlayerPda,
          player1Pda,
          player2Pda,
        })
        .rpc(),
    onSuccess: (tx) => {
      console.log('tx', tx);
      transactionToast(tx);
      customToast('Fight terminated', true);
      return refetch?.();
    },
    onError: (err) => {
      customToast(err.message);
      console.error('err', err);
    },
  });

  return {
    initFight,
    startFight,
    fightCounter,
    fightQuery,
    fightsQuery,
    program,
    initFightConfig,
  };
};
