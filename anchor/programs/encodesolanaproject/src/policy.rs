use anchor_lang::prelude::*;

#[account]
pub struct Policy {
    pub authority: Pubkey,
    pub start_slot: u64,
    pub expiration_slot: u64,
    pub threshold: f64,
    pub claimed: bool,
}

impl Policy {
    pub const SIZE: usize = 32 + 8 + 8 + 8 + 1;
}
