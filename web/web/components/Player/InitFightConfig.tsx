'use client'

import React from 'react'
import { PublicKey } from '@solana/web3.js';
import { useFight } from '../hooks/useFight';

const InitFightConfig = ({ account }: { account: PublicKey }) => {
  const { initFightConfig } = useFight({
    account,
  });


  const handleSubmit = () => {
    console.log("init fight config")

    initFightConfig.mutateAsync({owner: account});
}

  return account && (
    <div>
      <button className='bg-slate-950 text-slate-50 rounded border border-slate-700 p-2'
        onClick={() => handleSubmit()}>
          init fight config
      </button>

    </div>
  )
}

export default InitFightConfig
