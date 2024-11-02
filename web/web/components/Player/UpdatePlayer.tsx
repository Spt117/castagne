'use client';

import React, { useEffect, useState } from 'react';
import { useCastagneProgramAccount } from './PlayerDataAccess';
import { PublicKey } from '@solana/web3.js';
import { Button } from '../ui-elements/Button';
import { Input } from '../ui-elements/Input';
import Back from '../back/back';

interface IUpdatePlayerForm {
  address?: PublicKey;
  speed: number;
  strength: number;
  robustness: number;
}

const UpdatePlayer = ({ account }: { account: PublicKey }) => {
  const { updatePlayer, playerQuery } = useCastagneProgramAccount({ account });
  const [xp, setXp] = useState(0);
  const [formData, setFormData] = useState<IUpdatePlayerForm>({
    address: account,
    speed: 0,
    strength: 0,
    robustness: 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updatePlayer.mutateAsync([
      formData.speed,
      formData.strength,
      formData.robustness,
    ]);
  };

  useEffect(() => {
    const points =
      Number(formData.speed) +
      Number(formData.strength) +
      Number(formData.robustness);
    setXp(Number(playerQuery.data?.xp) - points);
  }, [formData.speed, formData.strength, formData.robustness]);

  useEffect(() => {
    if (playerQuery.data) {
      setXp(playerQuery.data.xp || 0);
      setFormData({
        address: account,
        speed: playerQuery.data.attributes[0] || 0,
        strength: playerQuery.data.attributes[1] || 0,
        robustness: playerQuery.data.attributes[2] || 0,
      });
    }
  }, [playerQuery.data, account]);

  return (
    account && (
      <div>
        <h1 className="text-4xl font-semibold text-center mt-4 gradient-text">
          {playerQuery.data?.username}
        </h1>

        <Back url={`/player/${account.toString()}`} />

        <form onSubmit={handleSubmit}>
          <div
            className={`mt-8 flex flex-col lg:p-6 lg:w-[32rem] lg:-border dark:border-slate-700 border-slate-300 rounded-lg`}
          >
            <h2 className={`text-2xl font-semibold text-center mt-2`}>
              Edit attributes
            </h2>
            <h3 className={`text-2xl font-semibold text-center mt-2`}>
              XP{' '}
              <span
                className={`${
                  xp && xp < 0 ? 'text-pink-600' : 'text-teal-300'
                }`}
              >
                {xp || 0}
              </span>
            </h3>

            <div className="text-center">
              <Input
                props={{
                  id: 'speed',
                  name: 'speed',
                  placeHolder: formData.speed.toString(),
                  label: 'Speed',
                  value: formData.speed.toString(),
                  onChange: handleChange,
                  required: true,
                  classes: {
                    box: `mt-4 lg:mt-6`,
                    input: `mt-2 lg:mt-2 lg:p-2 text-xl lg:text-2xl text-center`,
                  },
                }}
              />

              <Input
                props={{
                  id: 'strength',
                  name: 'strength',
                  placeHolder: formData.strength.toString(),
                  label: 'Strength',
                  value: formData.strength.toString(),
                  onChange: handleChange,
                  required: true,
                  classes: {
                    box: `mt-2 lg:mt-6`,
                    input: `mt-2 lg:p-2 text-xl lg:text-2xl text-center`,
                  },
                }}
              />

              <Input
                props={{
                  id: 'robustness',
                  name: 'robustness',
                  placeHolder: formData.robustness.toString(),
                  label: 'Robustness',
                  value: formData.robustness.toString(),
                  onChange: handleChange,
                  required: true,
                  classes: {
                    box: `mt-2 lg:mt-6`,
                    input: `mt-2 lg:p-2 text-xl lg:text-2xl text-center`,
                  },
                }}
              />
            </div>

            <div className="mt-4 relative flex font-normal text-2xl lg:text-4xl lg:hover:text-lime-400 gap-4 justify-center">
              <Button props={{}}>Update</Button>
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default UpdatePlayer;
