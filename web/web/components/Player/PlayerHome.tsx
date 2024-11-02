'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { redirect } from 'next/navigation';

export default function PlayerHome() {
  const { publicKey } = useWallet();

  if (publicKey) {
    return redirect(`/player/${publicKey.toString()}`);
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        Select your wallet and connect an acocunt in order to enter the game
      </div>
    </div>
  );
}
