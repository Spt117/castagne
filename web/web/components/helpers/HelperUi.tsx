'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react';
import { useCastagneProgram } from '../Player/PlayerDataAccess';
import { WalletButton } from '../solana/solana-provider';
import { ExplorerLink } from '../cluster/cluster-ui';
import { AppHero, ellipsify, useCustomToast } from '../ui/ui-layout';
import GetPlayers from '../Player/GetPlayers';
import CreatePlayer from '../Player/CreatePlayer';
import GetPlayer from '../Player/GetPlayer'
import UpdatePlayer from '../Player/UpdatePlayer';

const HelperUi = () => {
  const customToast = useCustomToast();
  const { publicKey } = useWallet();
  const { programId } = useCastagneProgram();

  return publicKey ? (
    <div>
      <AppHero title="Helper" subtitle={''}>
        <p className="mb-6">
          Program ID:
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
      </AppHero>

      <CreatePlayer
        key={`create-player-${publicKey.toString()}`}
        account={publicKey}
      />

      <UpdatePlayer
        key={`update-player-attributes-${publicKey.toString()}`}
        account={publicKey}
      />

      <GetPlayer account={publicKey}/>

      <GetPlayers />

      <button className='bg-slate-950 text-slate-50 rounded border border-slate-700 p-2'
        onClick={() => customToast("Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe rerum harum porro! Temporibus suscipit pariatur rem! Animi harum illo itaque nihil qui, illum laudantium cupiditate ea labore, voluptate quibusdam quia." || "")}>
          Toast me
      </button>
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

export default HelperUi
