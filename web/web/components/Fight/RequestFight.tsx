'use client';

import React from 'react';

import { useFight } from '@/components/hooks/useFight';
import { PublicKey } from '@solana/web3.js';
import usePlayers from '../hooks/usePlayers';
import { BN } from '@coral-xyz/anchor';
import Back from '../back/back';

const RequestFight = ({ account }: { account: PublicKey }) => {
  const players = usePlayers();

  const { initFight, fightCounter, program } = useFight({
    account,
  });

  const selectPlayer = (value: string) => {
    const player2Pda = players.data?.find(
      (player) => player.account.user.toString() === value
    );

    if (value !== account.toString() && player2Pda) {
      const player1Pda = players.data?.find(
        (player) => player.account.user.toString() === account.toString()
      );

      if (player1Pda) {
        const [fightPlayerPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('fight_player'),
            new BN(fightCounter.data?.counter).toArrayLike(Buffer, 'le', 2),
          ],
          program.programId
        );

        initFight.mutateAsync({
          player1: account,
          player2: player2Pda.account.user,
          player1Pda: player1Pda.publicKey,
          player2Pda: player2Pda.publicKey,
          fightPlayerPda: fightPlayerPda,
        });
      }
    }
  };

  return (
    <div>
      <Back url={`/player/${account.toString()}`} />
      <h1 className="my-2 border-b border-slate-600 text-lg text-pink-600">
        Request a fight
      </h1>

      <div className="text-sm mb-8 mt-8">
        {players.data
          ?.filter(
            (player) => player.account.user.toString() !== account.toString()
          )
          .map((player) => (
            <div
              key={player.publicKey.toString()}
              className="text-sm border-b border-slate-700/60 p-1"
            >
              <div className="grid grid-cols-3">
                <div className="text-teal-500">
                  {player.account.username}
                  <small> / {player.account.xp} xp</small>
                </div>
                <div className="grid grid-rows-3">
                  <small>Force: {player.account.attributes[0]}</small>
                  <small>Strength: {player.account.attributes[1]}</small>
                  <small>Robustness: {player.account.attributes[2]}</small>
                </div>
                <div>
                  <button
                    onClick={() => {
                      selectPlayer(player.account.user.toString());
                    }}
                  >
                    Fight with {player.account.username}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RequestFight;
