import { PublicKey } from '@solana/web3.js';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function useGetParamAddress() {
  const params = useParams();
  const [error, setError] = useState(false);

  const address = useMemo(() => {
    if (!params.address) {
      return;
    }

    try {
      return new PublicKey(params.address);
    } catch (e) {
      setError(true);
      // console.log(`Invalid public key`, e);
    }
  }, [params]);

  return { publicKey: address, error };
}
