use crate::state::player::Player;
use crate::{constants::PLAYER_ATTRIBUTES_INIT, constants::PLAYER_XP_INIT};
use anchor_lang::prelude::*;

pub fn create_player(ctx: Context<CreatePlayer>, username: String) -> Result<()> {
    let player = &mut ctx.accounts.player;
    player.user = *ctx.accounts.user.key;
    player.username = username;
    player.attributes = PLAYER_ATTRIBUTES_INIT;
    player.xp = PLAYER_XP_INIT;
    Ok(())
}

#[derive(Accounts)]
pub struct CreatePlayer<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + std::mem::size_of::<Player>() + 1000,
        seeds = [b"player", user.key().as_ref()],
        bump,
    )]
    pub player: Account<'info, Player>,

    pub system_program: Program<'info, System>,
}
