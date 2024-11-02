use anchor_lang::prelude::*;
use crate::state::config::Config;


pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
    let game_config = &mut ctx.accounts.game_config;
    game_config.owner = *ctx.accounts.owner.key;
    Ok(())
}


#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + 32,
        seeds = [b"config", owner.key().as_ref()],
        bump,
    )]
    pub game_config: Account<'info, Config>,

    pub system_program: Program<'info, System>,
}
