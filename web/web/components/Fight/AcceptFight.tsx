'use client';

import React from 'react';

import { useFight } from '@/components/hooks/useFight';
import { PublicKey } from '@solana/web3.js';

import { BN } from '@coral-xyz/anchor';
import { useFetchFightPlayerByIds } from '../hooks/useFetchMultiple';
import usePlayers from '../hooks/usePlayers';
import Back from '../back/back';
import Link from 'next/link';

const AcceptFight = ({ account }: { account: PublicKey }) => {
  const players = usePlayers();
  const playerFights =
    players.data?.find(
      (player) => player.account.user.toString() === account.toString()
    )?.account.fights || [];

  const { fights, refetch } = useFetchFightPlayerByIds({
    indexes: playerFights,
  });
  const { startFight, program } = useFight({
    account,
    refetch,
  });

  const getFightPlayerPda = (counter: number) => {
    const [fightPlayerPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('fight_player'),
        new BN(counter).toArrayLike(Buffer, 'le', 2),
      ],
      program.programId
    );
    return fightPlayerPda;
  };

  const acceptFight = (fightPlayer: any) => {
    if (fights.length) {
      const fightPlayerPda = getFightPlayerPda(fightPlayer.counter);

      if (fightPlayer) {
        const player1Pda = players.data?.find(
          (player) =>
            player.account.user.toString() === fightPlayer.player1.toString()
        );
        const player2Pda = players.data?.find(
          (player) =>
            player.account.user.toString() === fightPlayer.player2.toString()
        );

        if (player1Pda && player2Pda)
          startFight.mutateAsync({
            counter: fightPlayer.counter,
            player1: fightPlayer.player1.toString(),
            player2: fightPlayer.player2.toString(),
            player1Pda: player1Pda.publicKey,
            player2Pda: player2Pda.publicKey,
            fightPlayerPda: fightPlayerPda,
          });
      }
    }
  };

  const fightVisible = fights?.filter(
    (f) =>
      [f?.player1.toString(), f?.player2.toString()].includes(
        account.toString()
      ) && f?.status.initialized
  );

  return (
    <div>
      <Back url={`/player/${account.toString()}`} />
      <h1 className="my-2 border-b border-slate-600 text-lg text-pink-600">
        Fight in wait
      </h1>

      {fightVisible.length === 0 && (
        <h1 className="text-teal-500">
          No fight in wait! <br />
          <Link href={`/fight/${account.toString()}/request`} className="btn">
            Start a fight
          </Link>
        </h1>
      )}

      <div className="grid md:grid-cols-1 gap-4 text-sm">
        {fightVisible.map((fight, index) => (
          <div
            key={`fight-${index}`}
            className="text-sm border-b border-slate-700/60"
          >
            <div className="grid grid-cols-3">
              <div className="col-span-2 text-teal-500">
                {
                  players.data?.find(
                    (player) =>
                      player.account.user.toString() ===
                      fight?.player1.toString()
                  )?.account.username
                }{' '}
                vs{' '}
                {
                  players.data?.find(
                    (player) =>
                      player.account.user.toString() ===
                      fight?.player2.toString()
                  )?.account.username
                }
              </div>

              {fight?.status.initialized &&
                fight?.player2.toString() === account.toString() && (
                  <button
                    onClick={() => {
                      acceptFight(fight);
                    }}
                  >
                    Accept fight
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptFight;
