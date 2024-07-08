'use client';

import { createContext, useEffect, useContext, ReactNode } from 'react';

import { Program_Ids } from '../constants/program';
import { useProgram } from '../hooks/useProgram';

export const BattleContext = createContext({});

export const BattleProvider = ({ children }: { children: ReactNode }) => {
  const program = useProgram(Program_Ids.PROGRAM_BATTLE_ID);

  useEffect(() => {
    if (program?.programId) {
      console.log('ready program battle', program?.programId, program);
    }
  }, [program?.programId]);

  return <BattleContext.Provider value={{}}>{children}</BattleContext.Provider>;
};

export const useBattleContext = () => {
  return useContext(BattleContext);
};
