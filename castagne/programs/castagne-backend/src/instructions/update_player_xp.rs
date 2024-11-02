use anchor_lang::prelude::*;
use crate::state::config::Config;
use crate::state::player::Player;
use crate::errors::PlayerErrorCode;


pub fn update_player_xp(ctx: Context<UpdatePlayerXP>, xp: u32) -> Result<()> {
    let config = &ctx.accounts.config;
    let player = &mut ctx.accounts.player;

    if *ctx.accounts.owner.key != config.owner {
        return err!(PlayerErrorCode::OnlyOwner);
    }

    player.xp = xp;
    Ok(())
}


#[derive(Accounts)]
pub struct UpdatePlayerXP<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub user: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"player", user.key().as_ref()],
        bump,
    )]
    pub player: Account<'info, Player>,

    #[account(
        seeds = [b"config", owner.key().as_ref()],
        bump,
    )]
    pub config: Account<'info, Config>,
}