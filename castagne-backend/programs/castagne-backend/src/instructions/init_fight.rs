use anchor_lang::prelude::*;
use crate::state::config::Config;
use crate::state::player::Player;
use crate::state::fight::{Fight, FightPlayer, GameState};
use crate::constants::FIGHT_LEVEL_LIMIT_IN_PERCENTAGE;
use crate::errors::FightErrorCode;
use crate::PlayerErrorCode;

pub fn init_fight_config(ctx: Context<InitFightConfig>) -> Result<()> {
    // Only owner
    let config = &ctx.accounts.config_pda;
    require!(*ctx.accounts.owner.key == config.owner, PlayerErrorCode::OnlyOwner);

    let fight = &mut ctx.accounts.fight_pda;
    fight.counter = 0;
    Ok(())
}


pub fn init_fight(ctx: Context<InitFight>) -> Result<()> {
    // Player 1 and 2 must be differents
    require!(
        ctx.accounts.player1_pda.user != ctx.accounts.player2_pda.user,
        FightErrorCode::PlayersMustBeDifferent
    );

    // Check that the level between 2 players is not too high
    let player1_xp: u32 = ctx.accounts.player1_pda.attributes.iter().sum();
    let player2_xp: u32 = ctx.accounts.player2_pda.attributes.iter().sum();

    let mut min_level = player1_xp;
    let mut max_level = player2_xp;
    if player1_xp > player2_xp {
        min_level = player2_xp;
        max_level = player1_xp;
    }
    let level_limit = min_level + (min_level * FIGHT_LEVEL_LIMIT_IN_PERCENTAGE as u32 / 100);

    require!(max_level <= level_limit, FightErrorCode::LevelTooHigh);

    // Only owner can update fights
    let config = &ctx.accounts.config_pda;
    require!(*ctx.accounts.owner.key == config.owner, PlayerErrorCode::OnlyOwner);
    // Update player.fights
    ctx.accounts.player1_pda.fights.push(ctx.accounts.fight_pda.counter);
    ctx.accounts.player2_pda.fights.push(ctx.accounts.fight_pda.counter);

    // Update fight player status
    ctx.accounts.fight_player_pda.status = GameState::Initialized;

    // +1 fight.counter
    ctx.accounts.fight_pda.counter += 1;

    Ok(())

}


#[derive(Accounts)]
pub struct InitFightConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<Fight>(),
        seeds = [b"fight", owner.key().as_ref()],
        bump,
    )]
    pub fight_pda: Account<'info, Fight>,

    #[account(
        seeds = [b"config", owner.key().as_ref()],
        bump,
    )]
    pub config_pda: Account<'info, Config>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct InitFight<'info> {
    #[account(mut)]
    pub player1: Signer<'info>,

    #[account(mut)]
        /// CHECK: This is not dangerous because we don't read or write from this account
    pub player2: AccountInfo<'info>,

    #[account()]
        /// CHECK: This is not dangerous because we don't read or write from this account
    pub owner: AccountInfo<'info>,

    #[account(
        init,
        payer = player1,
        space = 8 + 1000,
        seeds = [
            b"fight_player",
            player1.key().as_ref(),
            player2.key().as_ref(),
            &fight_pda.counter.to_le_bytes(),
        ],
        bump,
    )]
    pub fight_player_pda: Account<'info, FightPlayer>,

    #[account(
        mut,
        seeds = [b"player", player1.key().as_ref()],
        bump,
    )]
    pub player1_pda: Account<'info, Player>,

    #[account(
        mut,
        seeds = [b"player", player2.key().as_ref()],
        bump,
    )]
    pub player2_pda: Account<'info, Player>,

    #[account(
        mut,
        seeds = [b"fight", owner.key().as_ref()],
        bump,
    )]
    pub fight_pda: Account<'info, Fight>,

    #[account(
        seeds = [b"config", owner.key().as_ref()],
        bump,
    )]
    pub config_pda: Account<'info, Config>,

    pub system_program: Program<'info, System>,
}