'use client';

import ListFights from '@/components/Fight/ListFight';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

const Page = () => {
  const { publicKey } = useWallet();

  if (!publicKey) return null;

  return <ListFights account={publicKey} />;
};

export default Page;
