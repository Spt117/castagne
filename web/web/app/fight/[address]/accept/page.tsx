'use client';

import AcceptFight from '@/components/Fight/AcceptFight';
import useGetParamAddress from '@/components/hooks/useGetParamAddress';
import React from 'react';

const Page = () => {
  const { publicKey, error } = useGetParamAddress();

  if (error) return <div>error</div>;

  if (!publicKey) return null;

  return <AcceptFight account={publicKey} />;
};

export default Page;
