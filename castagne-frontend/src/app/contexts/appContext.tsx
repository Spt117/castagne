'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';

type ConfType = {
  connection?: Connection;
  wallet?: AnchorWallet | Wallet;
  setSuccess: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string>>;
};

const ConnectionContext = createContext({} as ConfType);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    console.log(error, success);
  }, [error, success]);

  return (
    <ConnectionContext.Provider
      value={{
        connection,
        wallet,
        setSuccess,
        setError,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionContext = () => {
  return useContext(ConnectionContext);
};
