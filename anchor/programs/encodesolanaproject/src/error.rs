use anchor_lang::prelude::*;

#[error_code]
pub enum InsuranceError {
    #[msg("Policy trigger condition not met.")]
    ConditionNotMet,

    #[msg("Policy already claimed.")]
    AlreadyClaimed,

    #[msg("Policy expired.")]
    Expired,

    #[msg("Claim attempt too early.")]
    TooEarly,

    #[msg("Invalid result format.")]
    InvalidResultFormat,

    #[msg("Unauthorized user.")]
    Unauthorized,
}