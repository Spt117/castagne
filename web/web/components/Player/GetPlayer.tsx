'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCastagneProgramAccount } from '../Player/PlayerDataAccess';
import { PublicKey } from '@solana/web3.js';
import Link from 'next/link';

const GetPlayer = ({ account }: { account: PublicKey }) => {
  const { publicKey } = useWallet();
  const { playerQuery } = useCastagneProgramAccount({ account });

  return (
    publicKey && (
      <div>
        <h1 className="text-4xl font-semibold text-center mt-4 gradient-text">
          {playerQuery.data?.username}
        </h1>

        <div
          key={publicKey.toString()}
          className="text-md lg:text-xl mt-6 lg:mt-6"
        >
          <h2 className="font-bold pb-2 text-center text-lg">
            <span className="border-b border-slate-500">Attributes</span>
            <span className="ml-2 font-normal hover:text-lime-300">
              <Link href={`/update-player/${account.toString()}`}>(Edit)</Link>
            </span>
          </h2>

          <div className="grid grid-cols-2">
            <div className="text-right pr-4">XP</div>
            <div className="text-teal-500">{playerQuery.data?.xp}</div>
            <div className="text-right pr-4">Force</div>
            <div className="text-teal-500">
              {playerQuery.data?.attributes[0]}
            </div>
            <div className="text-right pr-4">Strength</div>
            <div className="text-teal-500">
              {playerQuery.data?.attributes[1]}
            </div>
            <div className="text-right pr-4">Robustness</div>
            <div className="text-teal-500">
              {playerQuery.data?.attributes[2]}
            </div>
          </div>
        </div>

        <div className="text-md lg:text-xl mt-6 lg:mt-6">
          <div className="grid gap-1">
            <Link href={`/fight/${account.toString()}/accept`} className="btn">
              fights waiting
            </Link>
            <Link href={`/fight/${account.toString()}/request`} className="btn">
              Start a fight
            </Link>
            <Link href={`/fight/${account.toString()}/history`} className="btn">
              History
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default GetPlayer;
