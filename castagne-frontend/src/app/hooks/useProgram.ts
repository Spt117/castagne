import { useMemo } from 'react';
import { Wallet } from '@project-serum/anchor';

import { useConnectionContext } from '../contexts/appContext';
import { getProgram } from '../helpers/program';
import { Program_Ids } from '../constants/program';

export const useProgram = (programId: Program_Ids) => {
  const { connection, wallet } = useConnectionContext();

  const program = useMemo(() => {
    if (connection) {
      return getProgram(programId, connection, wallet as Wallet);
    }
  }, [connection, wallet]);

  return program;
};
