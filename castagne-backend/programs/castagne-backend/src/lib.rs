use anchor_lang::prelude::*;

declare_id!("GNmXt5Lp6RXYyZKCpTBvcv5oPiEh2TzgSPiL9h43uBa3");

#[program]
pub mod castagne_backend {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
