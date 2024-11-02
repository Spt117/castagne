'use client';

import RequestFight from '@/components/Fight/RequestFight';
import useGetParamAddress from '@/components/hooks/useGetParamAddress';

import React from 'react';

const Page = () => {
  const { publicKey, error } = useGetParamAddress();

  if (error) return <div>error</div>;

  if (!publicKey) return null;

  return <RequestFight account={publicKey} />;
};

export default Page;
