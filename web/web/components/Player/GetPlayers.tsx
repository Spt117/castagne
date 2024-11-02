'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { useCastagneProgram } from '../Player/PlayerDataAccess';


const GetPlayers = () => {
  const { publicKey } = useWallet();
  const { players } = useCastagneProgram();

  return publicKey ? (
    <div>
      <h1 className='my-2 border-b border-slate-600 text-lg text-pink-600'>All players</h1>

      <div className="grid md:grid-cols-1 gap-4 text-sm">
        {players.data?.map((player: any) => (
          <div key={player.account.user.toString()} className='text-sm border-b border-slate-700/60'>
          <div className='grid grid-cols-2'>
              <div>Username</div>
              <div className='text-teal-500'>{player.account.username}</div>

              <div>Key</div>
              <div className='text-teal-500 truncate max-w-xs'>{player.account.user.toString()}</div>
          </div>

          <h2 className='font-bold'>Attributes</h2>
          <div className='grid grid-cols-2'>
              <div>Force</div><div className='text-teal-500'>{player.account.attributes[0]}</div>
              <div>Strength</div><div className='text-teal-500'>{player.account.attributes[1]}</div>
              <div>Robusteness</div><div className='text-teal-500'>{player.account.attributes[2]}</div>
              <div>XP</div><div className='text-teal-500'>{player.account.xp}</div>
          </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}

export default GetPlayers
