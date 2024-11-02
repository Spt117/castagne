use anchor_lang::error_code;

#[error_code]
pub enum PlayerErrorCode {
    #[msg("Not enough xp")]
    NotEnoughXP,

    #[msg("Only owner!")]
    OnlyOwner,
}

#[error_code]
pub enum FightErrorCode {
    #[msg("Level too high!")]
    LevelTooHigh,

    #[msg("Players must be different!")]
    PlayersMustBeDifferent,

    #[msg("Fight must be Initilazed!")]
    PlayersMustBeInitilazed,

    #[msg("Player must exist in fight!")]
    PlayerNotExistInFight,

    #[msg("Player must well configured!")]
    PlayerConfigError,

    #[msg("Player must be signer!")]
    PlayerMustBeSigner,
}
