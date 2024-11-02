'use client';

import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import UpdatePlayer from './UpdatePlayer';

export default function PlayerUpdateRouter() {
  const params = useParams();

  const address = useMemo(() => {
    if (!params.address) {
      return;
    }

    try {
      return new PublicKey(params.address);
    } catch (e) {
      // console.log(`Invalid public key`, e);
    }
  }, [params]);

  if (!address) {
    return <div>Error loading account</div>;
  }

  return <UpdatePlayer account={address} />
}
