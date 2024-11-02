import * as anchor from '@coral-xyz/anchor';
import { AnchorError } from '@coral-xyz/anchor';
import { expect } from 'chai';

import { confTestType, getConfTest } from '../helper';

describe.only('init fight', () => {
  let config: confTestType;

  before(async () => {
    config = await getConfTest();
  });

  it('Init a fight config with owner and succedd', async () => {
    await config.program.methods
      .initFightConfig()
      .accounts({
        owner: config.adminWallet.publicKey,
        fight_pda: config.fightPda,
      } as any)
      .rpc();

    let fight = await config.program.account.fight.fetch(config.fightPda);
    expect(fight.counter).to.equal(0);
  });

  // Fight
  it('Init a fight with same players and thrown error', async () => {
    let fightData = await config.program.account.fight.fetch(config.fightPda);

    const [fightPlayerPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('fight_player'),
        new anchor.BN(fightData.counter).toArrayLike(Buffer, 'le', 2),
      ],
      config.program.programId
    );

    try {
      await config.program.methods
        .initFight()
        .accounts({
          player1: config.player1.publicKey,
          player2: config.player1.publicKey,
          fight_player_pda: fightPlayerPda,
          player1_pda: config.player1Pda,
          player2_pda: config.player1Pda,
          fight_pda: config.fightPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([config.player1])
        .rpc();

      expect.fail(
        'Init a fight with same players and thrown error should have failed but it succeded'
      );
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.code).to.equal('PlayersMustBeDifferent');
    }
  });

  it('Init a fight but a player has a level too high and thrown error', async () => {
    let fightData = await config.program.account.fight.fetch(config.fightPda);

    const [fightPlayerPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('fight_player'),
        new anchor.BN(fightData.counter).toArrayLike(Buffer, 'le', 2),
      ],
      config.program.programId
    );

    try {
      // Allocate max xp = 2000 + 1000 to attributes
      await config.program.methods
        .updatePlayer([500, 1500, 1000])
        .accounts({
          user: config.player1.publicKey,
          player: config.player1Pda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([config.player1])
        .rpc();

      // Allocate max xp = 1000 to attributes
      await config.program.methods
        .updatePlayer([250, 250, 500])
        .accounts({
          user: config.player2.publicKey,
          player: config.player2Pda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([config.player2])
        .rpc();

      await config.program.methods
        .initFight()
        .accounts({
          player1: config.player1.publicKey,
          player2: config.player2.publicKey,
          fight_player_pda: fightPlayerPda,
          player1_pda: config.player1Pda,
          player2_pda: config.player2Pda,
          fight_pda: config.fightPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([config.player1])
        .rpc();

      expect.fail(
        'The Init a fight with player has level too high should have failed but it succeded'
      );
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.code).to.equal('LevelTooHigh');
    }
  });

  it('Init a fight and succeed', async () => {
    // Allocate max xp = 1000 to attributes
    await config.program.methods
      .updatePlayer([150, 350, 500])
      .accounts({
        user: config.player3.publicKey,
        player: config.player3Pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([config.player3])
      .rpc();

    let fightData = await config.program.account.fight.fetch(config.fightPda);

    const [fightPlayerPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('fight_player'),
        new anchor.BN(fightData.counter).toArrayLike(Buffer, 'le', 2),
      ],
      config.program.programId
    );

    await config.program.methods
      .initFight()
      .accounts({
        player1: config.player3.publicKey,
        player2: config.player2.publicKey,
        fightPlayerPda: fightPlayerPda,
        player1_pda: config.player3Pda,
        player2_pda: config.player2Pda,
        fight_pda: config.fightPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([config.player3])
      .rpc();

    let player2Data = await config.program.account.player.fetch(
      config.player2Pda
    );
    let player3Data = await config.program.account.player.fetch(
      config.player3Pda
    );

    let fightPlayerData = await config.program.account.fightPlayer.fetch(
      fightPlayerPda
    );

    expect(player2Data.fights[0]).to.equal(0);
    expect(player3Data.fights[0]).to.equal(0);
    expect(fightPlayerData.counter).to.equal(0);

    fightData = await config.program.account.fight.fetch(config.fightPda);
    expect(fightData.counter).to.equal(1);

    expect('initialized' in fightPlayerData.status).to.be.true;
  });
});
