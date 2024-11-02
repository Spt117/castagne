use anchor_lang::{prelude::*, solana_program};
use solana_program::hash::hash;
use solana_program::sysvar::clock::Clock;

use crate::constants::NUMBER_OF_ROUNDS;

pub fn generate_random_number(authority_key: &Pubkey, max: u32) -> Result<u32> {
    // Get the current clock slot
    let clock = Clock::get()?;

    // Combine the slot and authority key to create entropy
    let mut seed = vec![];
    seed.extend_from_slice(&clock.slot.to_le_bytes());
    seed.extend_from_slice(&authority_key.to_bytes());

    // Hash the seed to create a pseudo-random number
    let hash = hash(&seed);

    // Take the first 4 bytes of the hash and convert to u32
    let random_number = u32::from_le_bytes(hash.to_bytes()[..4].try_into().unwrap());

    // Limit the random number to the range [0, max]
    Ok(random_number % (max + 1))
}

pub fn get_winner_by_round(attr1: [u32; 3], attr2: [u32; 3], key: &Pubkey) -> Result<bool> {
    let mut nb_player1_won = 0;

    for index in 0..attr1.len() - 1 {
        let max = attr1[index] + attr2[index];
        let seed = format!("{}{}{}", "random", index, max);
        let authority_key = Pubkey::create_with_seed(key, &seed, key);

        let random_value = generate_random_number(&authority_key.unwrap(), max);

        if random_value.unwrap() <= attr1[index] {
            nb_player1_won += 1;
        }
    }

    Ok(nb_player1_won >= attr1.len() / 2)
}

pub fn get_rounds_winner(attr1: [u32; 3], attr2: [u32; 3], key: &Pubkey) -> Result<Vec<bool>> {
    let mut rounds = Vec::new();

    for index in 0..NUMBER_OF_ROUNDS {
        let seed = format!("{}{}", "round", index);
        let authority_key = Pubkey::create_with_seed(key, &seed, key);
        rounds.push(get_winner_by_round(attr1, attr2, &authority_key.unwrap())?);
    }

    Ok(rounds)
}

pub fn get_winner(rounds: &Vec<bool>, player1: Pubkey, player2: Pubkey) -> Result<Pubkey> {
    let mut player1_win = 0;
    for index in 0..rounds.len() {
        if rounds[index] {
            player1_win += 1;
        }
    }

    let winner = if player1_win > NUMBER_OF_ROUNDS - player1_win {
        player1
    } else {
        player2
    };

    Ok(winner)
}
