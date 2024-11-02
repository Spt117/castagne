'use client';

import HistoryFights from '@/components/Fight/HistoryFight';
import useGetParamAddress from '@/components/hooks/useGetParamAddress';

import React from 'react';

const Page = () => {
  const { publicKey, error } = useGetParamAddress();

  if (error) return <div>error</div>;

  if (!publicKey) return null;

  return <HistoryFights account={publicKey} />;
};

export default Page;
