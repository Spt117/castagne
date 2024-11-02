use anchor_lang::prelude::*;

#[account]
pub struct Player {
    pub user: Pubkey,
    pub username: String,
    pub attributes: [u32; 3],
    pub xp: u32,
    pub fights: Vec<u16>,
}
