use anchor_lang::prelude::*;

use crate::policy::Policy;

#[derive(Accounts)]
#[instruction(threshold: f64, duration_slots: u64)]
pub struct CreatePolicy<'info> {
    #[account(init, payer = authority, space = 8 + Policy::SIZE)]
    pub policy: Account<'info, Policy>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimPayout<'info> {
    #[account(mut, has_one = authority)]
    pub policy: Account<'info, Policy>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: PDA that holds funds — basic mut check
    #[account(mut)]
    pub vault: AccountInfo<'info>,

    /// CHECK: Function Result account produced by switchboard-on-demand
    /// Assumes validation is done off-chain for now (you could extend this)
    pub function_result: AccountInfo<'info>,
}
