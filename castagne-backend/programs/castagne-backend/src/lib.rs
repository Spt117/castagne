use anchor_lang::prelude::*;
pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
use instructions::*;

// Run command to get the program_id
// solana-keygen pubkey target/deploy/castagne_backend-keypair.json
declare_id!("DGv5FsFqJsmF5WN4sA5oa9hYp931fApi7ugRC66yEWE4");


#[program]
pub mod castagne_backend {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        initialize_config::initialize_config(ctx)
    }

    pub fn create_player(ctx: Context<CreatePlayer>, username: String) -> Result<()> {
        create_player::create_player(ctx, username)
    }

    pub fn update_player(ctx: Context<UpdatePlayer>, attributes: [u32; 3]) -> Result<()> {
        update_player::update_player(ctx, attributes)
    }

    pub fn update_player_xp(ctx: Context<UpdatePlayerXP>, xp: u32) -> Result<()> {
        update_player_xp::update_player_xp(ctx, xp)
    }
}
