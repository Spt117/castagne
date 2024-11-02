import * as anchor from '@coral-xyz/anchor';
import { assert, expect } from 'chai';

import { confTestType, getConfTest } from '../helper';

describe.only('player - initializeConfig', () => {
  let config: confTestType;

  before(async () => {
    config = await getConfTest();
  });

  it('Init the config and succeed', async () => {
    await config.program.methods
      .initializeConfig()
      .accounts({
        owner: config.adminWallet.publicKey,
        config: config.configPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

    let resultConfig = await config.program.account.config.fetch(
      config.configPda
    );

    expect(resultConfig.owner.toString()).to.equal(
      config.adminWallet.publicKey.toString()
    );
  });

  it('Init the config twice and thrown error', async () => {
    try {
      await config.program.methods
        .initializeConfig()
        .accounts({
          config: config.configPda,
          systemProgram: anchor.web3.SystemProgram.programId,
          owner: config.adminWallet.publicKey,
        } as any)
        .rpc();

      expect.fail(
        'The second initialize call should have failed but it succeeded'
      );
    } catch (err) {
      assert.instanceOf(err, anchor.web3.SendTransactionError);
      const errMsg = (err as anchor.web3.SendTransactionError).message;
      assert.include(errMsg, 'already in use');
    }
  });
});
