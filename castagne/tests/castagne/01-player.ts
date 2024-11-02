import * as anchor from '@coral-xyz/anchor';
import { expect } from 'chai';
import { AnchorError, ProgramErrorStack } from '@coral-xyz/anchor';
import { PLAYER_XP_INIT, confTestType, getConfTest } from '../helper';

describe.only('player - create & update', () => {
  let config: confTestType;

  before(async () => {
    config = await getConfTest();
  });

  it('Create players and succeed', async () => {
    await config.program.methods
      .createPlayer(config.userName1)
      .accounts({
        user: config.player1.publicKey,
        player: config.player1Pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([config.player1])
      .rpc();

    await config.program.methods
      .createPlayer(config.userName2)
      .accounts({
        user: config.player2.publicKey,
        player: config.player2Pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([config.player2])
      .rpc();

    await config.program.methods
      .createPlayer(config.userName3)
      .accounts({
        user: config.player3.publicKey,
        player: config.player3Pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([config.player3])
      .rpc();

    let players = await config.program.account.player.all();
    let player = await config.program.account.player.fetch(config.player1Pda);

    expect(players.length).to.equal(3);
    expect(player.user.toString()).to.equal(
      config.player1.publicKey.toString()
    );
    expect(player.username).to.equal(config.userName1);
    expect(player.attributes.length).to.equal(3);
    expect(player.attributes.reduce((partialSum, a) => partialSum + a, 0) == 0);
    expect(player.xp).to.equal(PLAYER_XP_INIT);
    expect(player.fights.length).to.equal(0);
  });

  it('Updates player attributes and succeed', async () => {
    const attributes = [250, 250, 500];
    await config.program.methods
      .updatePlayer(attributes)
      .accounts({
        user: config.player1.publicKey,
        player: config.player1Pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([config.player1])
      .rpc();

    let player = await config.program.account.player.fetch(config.player1Pda);

    expect(player.attributes[0]).to.equal(250);
    expect(player.attributes[1]).to.equal(250);
    expect(player.attributes[2]).to.equal(500);
    expect(player.xp).to.equal(0);
  });

  it('Create players twice failed', async () => {
    try {
      await config.program.methods
        .createPlayer(config.userName1)
        .accounts({
          user: config.player1.publicKey,
          player: config.player1Pda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([config.player1])
        .rpc();

        expect.fail('Create players twice failed');

    } catch (_err) {
      expect(_err.transactionLogs.some(message => message.includes('already in use'))).to.be.true
    }

  });

  it('Updates player attributes and succeed', async () => {
    const attributes = [250, 250, 500];
    await config.program.methods
      .updatePlayer(attributes)
      .accounts({
        user: config.player1.publicKey,
        player: config.player1Pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([config.player1])
      .rpc();

    let player = await config.program.account.player.fetch(config.player1Pda);

    expect(player.attributes[0]).to.equal(250);
    expect(player.attributes[1]).to.equal(250);
    expect(player.attributes[2]).to.equal(500);
    expect(player.xp).to.equal(0);
  });

  it('Updates player xp by admin only and succeed', async () => {
    const xp = 2000;
    await config.program.methods
      .updatePlayerXp(xp)
      .accounts({
        owner: config.adminWallet.publicKey,
        user: config.player1.publicKey,
        player: config.player1Pda,
        config: config.configPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

    let player = await config.program.account.player.fetch(config.player1Pda);

    expect(player.xp).to.equal(2000);
  });
});
