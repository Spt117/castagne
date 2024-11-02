use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameState {
    Initialized,
    Active,
    Finished,
    Won { winner: Pubkey },
}

#[account]
pub struct Fight {
    pub counter: u16,
}

#[account]
pub struct FightPlayer {
    pub counter: u16,
    pub status: GameState,
    pub player1: Pubkey,
    pub player2: Pubkey,
    pub rounds: Vec<bool>,
}
