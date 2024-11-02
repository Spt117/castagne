'use client'

import React, { useState } from 'react'
import { useCastagneProgramAccount } from '../Player/PlayerDataAccess';
import { PublicKey } from '@solana/web3.js';
import { Input } from '../ui-elements/Input';
import { Button } from '../ui-elements/Button';

interface ICreatePlayerForm {
  address?: PublicKey
  username?: string
}

const CreatePlayer = ({ account }: { account: PublicKey }) => {
  const { createPlayer } = useCastagneProgramAccount({ account });
  const [formData, setFormData] = useState<ICreatePlayerForm>({
    address: account,
    username: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formData.username) createPlayer.mutateAsync(formData.username);
}

  return account && (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={`relative flex flex-col lg:p-6 lg:w-[64rem] lg:-border dark:border-slate-700 border-slate-300 rounded-lg`}>
            <h1 className={`text-4xl font-semibold text-center mt-4`}>Ready to play?</h1>

            <p className='text-center text-xl mt-6'>Create your player and enter the game</p>

            <Input props={{
                id: "username", name: "username", placeHolder: "Player name",
                value: formData.username, onChange: handleChange, required: true,
                classes: {
                  box: `mt-6 lg:mt-6`,
                  input: `mt-2 lg:mt-2 text-2xl p-2 lg:p-2 lg:text-2xl text-center`
                }
            }} />

            <div className="mt-8 relative flex font-normal text-2xl lg:text-4xl lg:hover:text-lime-400 gap-4 justify-center">
              <Button props={{}}>Create</Button>
            </div>
        </div>
      </form>

    </div>
  )
}

export default CreatePlayer
