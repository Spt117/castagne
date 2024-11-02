'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react';
import { useCastagneProgram } from '../Player/PlayerDataAccess';
import { ExplorerLink } from '../cluster/cluster-ui';
import { AppHero, ellipsify } from '../ui/ui-layout';
import InitFightConfig from '../Player/InitFightConfig';


const HelperFight = () => {
  const { publicKey } = useWallet();
  const { programId } = useCastagneProgram();

  return publicKey && (
    <div>
      <AppHero title="Helper Fight" subtitle={''}>
        <p className="mb-6">
          Program ID:
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>

        <InitFightConfig
          key={`create-player-${publicKey.toString()}`}
          account={publicKey}
        />

      </AppHero>
    </div>
  )
}

export default HelperFight
