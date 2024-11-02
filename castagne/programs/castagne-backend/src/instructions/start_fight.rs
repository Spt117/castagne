use crate::constants::{PARTICIPATE_NB, PARTICIPATE_XP, WON_XP};
use crate::errors::FightErrorCode;
use crate::helpers::{get_rounds_winner, get_winner};
use crate::state::fight::{FightPlayer, GameState};
use crate::state::player::Player;
use anchor_lang::prelude::*;

pub fn start_fight(ctx: Context<StartFight>, counter: u16) -> Result<()> {
    // Player must exist in fight
    require!(
        ctx.accounts.player1_pda.fights.contains(&counter)
            && ctx.accounts.player2_pda.fights.contains(&counter),
        FightErrorCode::PlayerNotExistInFight
    );

    // Fight must be Initilazed
    require!(
        ctx.accounts.fight_player_pda.status == GameState::Initialized,
        FightErrorCode::PlayersMustBeInitilazed
    );

    let player1 = &ctx.accounts.player1;
    let player2 = &ctx.accounts.player2;

    let player1_pda = &mut ctx.accounts.player1_pda;
    let player2_pda = &mut ctx.accounts.player2_pda;

    // Update fight player status
    ctx.accounts.fight_player_pda.status = GameState::Active;

    // recompense participation
    if player1_pda.fights.len() % PARTICIPATE_NB == 0 {
        player1_pda.xp += PARTICIPATE_XP;
    }
    if player2_pda.fights.len() % PARTICIPATE_NB == 0 {
        player2_pda.xp += PARTICIPATE_XP;
    }

    // 1 seul round pour le moment
    let rounds_result =
        get_rounds_winner(player1_pda.attributes, player2_pda.attributes, &player2.key).unwrap();

    let winner = get_winner(&rounds_result, player1.key(), player2.key())?;

    ctx.accounts.fight_player_pda.rounds = rounds_result;

    // Update fight player status and xp
    if winner == player1.key() {
        ctx.accounts.fight_player_pda.status = GameState::Won {
            winner: player1.key(),
        };
        player1_pda.xp += WON_XP;
    } else {
        ctx.accounts.fight_player_pda.status = GameState::Won {
            winner: player2.key(),
        };
        player2_pda.xp += WON_XP;
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(counter: u16)]
pub struct StartFight<'info> {
    #[account(mut)]
    pub player2: Signer<'info>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub player1: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [
            b"fight_player",
            &counter.to_le_bytes(),
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
}
