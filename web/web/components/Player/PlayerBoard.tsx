'use client'

import React from 'react'
import { useCastagneProgramAccount } from '../Player/PlayerDataAccess';
import { PublicKey } from '@solana/web3.js';
import GetPlayer from './GetPlayer';
import CreatePlayer from './CreatePlayer';


const PlayerBoard = ({ account }: { account: PublicKey }) => {
  const { playerQuery } = useCastagneProgramAccount({account});

  return account && (
    <div>
      {playerQuery.data ?
        <div>
          <GetPlayer key={`player-${account.toString()}`} account={account}/>
        </div>
      :
        <CreatePlayer key={`create-player-${account.toString()}`} account={account}/>
      }
    </div>
  )
}

export default PlayerBoard

