'use client';

import React from 'react';

import { PublicKey } from '@solana/web3.js';

import usePlayers from '../hooks/usePlayers';
import { useFetchFightPlayerByIds } from '../hooks/useFetchMultiple';
import Back from '../back/back';
import Link from 'next/link';

const HistoryFights = ({ account }: { account: PublicKey }) => {
  const players = usePlayers();

  const playerFights =
    players.data?.find(
      (player) => player.account.user.toString() === account.toString()
    )?.account.fights || [];

  const { fights } = useFetchFightPlayerByIds({
    indexes: playerFights,
  });

  const fightVisible = fights?.filter(
    (f) =>
      (f?.player2.toString() === account.toString() ||
        f?.player1.toString() === account.toString()) &&
      !f?.status.initialized
  );

  return (
    <div>
      <Back url={`/player/${account.toString()}`} />
      <h1 className="my-2 border-b border-slate-600 text-lg text-pink-600">
        History
      </h1>

      {fightVisible.length === 0 && (
        <h1 className="text-teal-500">
          No history fight! <br />
          <Link href={`/fight/${account.toString()}/request`} className="btn">
            Start a fight
          </Link>
        </h1>
      )}

      <div className="grid md:grid-cols-1 gap-4 text-sm">
        {fightVisible.map((fight, index) => {
          const player1 = players.data?.find(
            (player) =>
              player.account.user.toString() === fight?.player1.toString()
          );

          const player2 = players.data?.find(
            (player) =>
              player.account.user.toString() === fight?.player2.toString()
          );

          return (
            <div
              key={`fights-history-${index}`}
              className="text-sm border-b border-slate-700/60"
            >
              <div className="grid grid-cols-3">
                <div>Player 1</div>
                <div className="col-span-2 text-gray-500">
                  {
                    players.data?.find(
                      (player) =>
                        player.account.user.toString() ===
                        fight?.player1.toString()
                    )?.account.username
                  }
                </div>

                <div>Player 2</div>
                <div className="col-span-2 text-gray-500">
                  {
                    players.data?.find(
                      (player) =>
                        player.account.user.toString() ===
                        fight?.player2.toString()
                    )?.account.username
                  }
                </div>

                <div className="text-teal-500">Winner</div>
                <div className="text-teal-500">
                  {String(
                    (fight?.status.initialized && 'initialized') ||
                      (fight?.status.won?.winner.toString() ===
                        fight?.player1.toString() &&
                        player1?.account.username) ||
                      (fight?.status.won?.winner.toString() ===
                        fight?.player2.toString() &&
                        player2?.account.username)
                  )}
                </div>

                <div className="grid text-gray-500">
                  {fight?.rounds.map((round, index) =>
                    round ? (
                      <small key={'round' + index}>
                        Round {index} won by {player1?.account.username}
                      </small>
                    ) : (
                      <small key={'round' + index}>
                        Round {index} won by {player2?.account.username}
                      </small>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryFights;
