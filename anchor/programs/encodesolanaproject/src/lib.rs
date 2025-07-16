#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod error;
use error::*;
mod policy;
use policy::*;
mod account_contexts;
use account_contexts::*;

declare_id!("FhZ9uosXTYBmMDFa6FZqiacK79VBW6PDpeDmvKLzj8ag");

#[program]
pub mod parametric_insurance {
    use super::*;

    pub fn create_policy(ctx: Context<CreatePolicy>, threshold: f64, duration_slots: u64) -> Result<()> {
        let clock = Clock::get()?;
        let policy = &mut ctx.accounts.policy;

        policy.authority = *ctx.accounts.authority.key;
        policy.start_slot = clock.slot;
        policy.expiration_slot = clock.slot + duration_slots;
        policy.threshold = threshold;
        policy.claimed = false;

        Ok(())
    }

    pub fn claim_payout(ctx: Context<ClaimPayout>) -> Result<()> {
        let clock = Clock::get()?;
        let policy = &mut ctx.accounts.policy;

        // Check ownership
        require_keys_eq!(policy.authority, ctx.accounts.authority.key(), InsuranceError::Unauthorized);

        // Check time
        require!(clock.slot >= policy.start_slot, InsuranceError::TooEarly);
        require!(clock.slot <= policy.expiration_slot, InsuranceError::Expired);

        // Check already claimed
        require!(!policy.claimed, InsuranceError::AlreadyClaimed);

        // === NEW: Read temperature from Function Result Account ===
        let result_data = ctx.accounts.function_result.try_borrow_data()?;
        let temp_bytes = &result_data[8..16]; // Adjust offset if needed
        let temperature = f64::from_le_bytes(temp_bytes.try_into().map_err(|_| error!(InsuranceError::InvalidResultFormat))?);

        // Check condition met
        require!(temperature > policy.threshold, InsuranceError::ConditionNotMet);

        // Payout (transfer from vault to user - simplified)
        let amount = 1_000_000; // 0.001 SOL
        **ctx.accounts.vault.try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.authority.try_borrow_mut_lamports()? += amount;

        policy.claimed = true;

        Ok(())
    }
}
