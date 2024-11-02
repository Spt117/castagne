'use client';

import { getCastagneProgram } from '@/context/castagne-exports';
import { useAnchorProvider } from '@/components/solana/solana-provider';
import { useCluster } from '@/components/cluster/cluster-data-access';

export function useCastagneProgram() {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const program = getCastagneProgram(provider);

  return {
    cluster,
    program,
  };
}
