'use client';

import React, { useState } from 'react';

import { useFight } from '@/components/hooks/useFight';
import { PublicKey } from '@solana/web3.js';

import { Input } from '../ui-elements/Input';
import { Button } from '../ui-elements/Button';

import { BN } from '@coral-xyz/anchor';
import usePlayers from '../hooks/usePlayers';

interface IInitFightForm {
  player1: PublicKey;
  player2: PublicKey;
  fightPlayerPda: PublicKey;
  player1Pda: PublicKey;
  player2Pda: PublicKey;
}

const ListFights = ({ account }: { account: PublicKey }) => {
  const players = usePlayers();
  const { fightsQuery, initFight, startFight, fightCounter, program } =
    useFight({
      account,
    });
  const [formData, setFormData] = useState<IInitFightForm | null>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
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
        setFormData({
          player1: account,
          player2: player2Pda.account.user,
          player1Pda: player1Pda.publicKey,
          player2Pda: player2Pda.publicKey,
          fightPlayerPda: fightPlayerPda,
        });
      } else {
        setFormData(null);
      }
    }
  };

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData) initFight.mutateAsync(formData);
    setFormData(null);
  };

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
    if (fightsQuery.data) {
      let counter = 0;
      let fightPlayerPda = getFightPlayerPda(counter);
      while (fightPlayerPda.toString() !== fightPlayer.publicKey.toString()) {
        counter++;
        fightPlayerPda = getFightPlayerPda(counter);
      }

      if (fightPlayer) {
        const player1Pda = players.data?.find(
          (player) =>
            player.account.user.toString() ===
            fightPlayer.account.player1.toString()
        );
        const player2Pda = players.data?.find(
          (player) =>
            player.account.user.toString() ===
            fightPlayer.account.player2.toString()
        );

        if (player1Pda && player2Pda)
          startFight.mutateAsync({
            counter,
            player1: fightPlayer.account.player1.toString(),
            player2: fightPlayer.account.player2.toString(),
            player1Pda: player1Pda.publicKey,
            player2Pda: player2Pda.publicKey,
            fightPlayerPda: fightPlayerPda,
          });
      }
    }
  };

  return (
    <div>
      <h1 className="my-2 border-b border-slate-600 text-lg text-pink-600">
        All fights
      </h1>

      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex flex-col w-[24rem]
          border dark:border-slate-700 border-slate-300 rounded-lg p-6`}
        >
          <h1 className={`font-semibold`}>Fight</h1>
          <p className="text-sm mt-3">Init a fight</p>

          <Input
            props={{
              id: 'player',
              name: 'player',
              placeHolder: 'player key',
              label: 'player key',
              onChange: handleChange,
              required: true,
              classes: { box: `mt-6`, input: `mt-2` },
            }}
          />

          <div className="mt-8 relative flex font-normal text-sm gap-4 justify-end">
            <Button props={{}}>Request a fight</Button>
          </div>
        </div>
      </form>

      <div className="grid md:grid-cols-5 gap-4 text-sm mb-8 mt-8">
        {players.data
          ?.filter(
            (player) => player.account.user.toString() !== account.toString()
          )
          .map((player) => (
            <div
              key={player.publicKey.toString()}
              className="text-sm border border-slate-700/60 p-4"
            >
              <div className="grid grid-cols-3">
                <div className="col-span-2 text-teal-500">
                  <button
                    onClick={() => {
                      selectPlayer(player.account.user.toString());
                    }}
                  >
                    {player.account.username}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="grid md:grid-cols-1 gap-4 text-sm">
        {fightsQuery.data?.reverse().map((fight, index) => (
          <div
            key={fight.publicKey.toString()}
            className="text-sm border-b border-slate-700/60"
          >
            <div className="grid grid-cols-3">
              <div className="col-span-3 text-teal-500">
                {fight.account.counter} - {fight.publicKey.toString()}
              </div>
              <div>player 1</div>
              <div className="col-span-2 text-teal-500">
                {
                  players.data?.find(
                    (player) =>
                      player.account.user.toString() ===
                      fight.account.player1.toString()
                  )?.account.username
                }
                <small> - {fight.account.player1.toString()}</small>
              </div>

              <div>player 2</div>
              <div className="col-span-2 text-teal-500">
                {
                  players.data?.find(
                    (player) =>
                      player.account.user.toString() ===
                      fight.account.player2.toString()
                  )?.account.username
                }
                <small> - {fight.account.player2.toString()}</small>
              </div>

              <div>status</div>
              <div className="text-teal-500">
                {String(
                  (fight.account.status.initialized && 'initialized') ||
                    (fight.account.status.won?.winner.toString() ===
                      fight.account.player1.toString() &&
                      'player1 won') ||
                    (fight.account.status.won?.winner.toString() ===
                      fight.account.player2.toString() &&
                      'player2 won')
                )}
              </div>
              {fight.account.status.initialized &&
                fight.account.player2.toString() === account.toString() && (
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

export default ListFights;
