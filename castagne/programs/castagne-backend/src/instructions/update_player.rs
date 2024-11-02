use anchor_lang::prelude::*;
pub use crate::state::player::Player;
pub use crate::errors::PlayerErrorCode;


pub fn update_player(ctx: Context<UpdatePlayer>, attributes: [u32; 3]) -> Result<()> {
    let player = &mut ctx.accounts.player;
    let attributes_total: u32 = attributes.iter().sum();
    let player_attributes: u32 = player.attributes.iter().sum();
    let player_xp_total: u32 = player.xp + player_attributes;

    if player_xp_total < attributes_total {
        return err!(PlayerErrorCode::NotEnoughXP);
    }

    // Reset xp
    player.xp += player_attributes;

    // 0 Speed ​
    // 1 Strength
    // 2 Robustness
    player.attributes = attributes;

    // Update xp
    player.xp -= attributes_total;
    Ok(())
}


#[derive(Accounts)]
pub struct UpdatePlayer<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"player", user.key().as_ref()],
        bump,
    )]
    pub player: Account<'info, Player>,
}
