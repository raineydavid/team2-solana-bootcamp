use anchor_lang::prelude::*;

declare_id!("C7cbEYPnnrzWzBq23jU3uFj8SBZentWvn3WWR9QjBSga");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod flight_insurance {
    use super::*;

    pub fn create_policy(
        ctx: Context<CreatePolicy>,
        flight_info: FlightInfo,
        premium: u64,
    ) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        let payout_multiplier = 2;

        policy.user = ctx.accounts.user.key();
        policy.flight_info = flight_info;
        policy.premium_paid = premium;
        policy.status = PolicyStatus::Active;
        policy.payout_amount = premium * payout_multiplier;
        policy.created_at = Clock::get()?.unix_timestamp;

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.vault.key(),
            premium,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault.to_account_info(),
            ],
        )?;

        Ok(())
    }

    pub fn settle_policy(ctx: Context<SettlePolicy>) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        let payout = policy.payout_amount;

        require!(
            policy.status == PolicyStatus::Active,
            ErrorCode::NotEligible
        );

        **ctx
            .accounts
            .vault
            .to_account_info()
            .try_borrow_mut_lamports()? -= payout;
        **ctx.accounts.user.try_borrow_mut_lamports()? += payout;

        policy.status = PolicyStatus::PaidOut;

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct FlightInfo {
    pub flight_number: String,
    pub departure_airport: String,
    pub scheduled_departure: String,
}

#[account]
pub struct InsurancePolicy {
    pub policy_id: u64, // Unique identifier for the policy
    pub user: Pubkey,
    pub flight_info: FlightInfo,
    pub payout_amount: u64,
    pub premium_paid: u64,
    pub status: PolicyStatus,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PolicyStatus {
    Active,
    PaidOut,
    Expired,
}

#[derive(Accounts)]
pub struct CreatePolicy<'info, > {
   
    #[account(
        init, 
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + 256,
        seeds = [user.key().as_ref()],
        bump,
    )]
    pub policy: Account<'info, InsurancePolicy>,

     #[account(mut)]
    pub user: Signer<'info, >,

    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettlePolicy<'info> {
    #[account(mut)]
    pub policy: Account<'info, InsurancePolicy>,
    #[account(mut)]
    pub vault: SystemAccount<'info>,
    #[account(mut)]
    pub user: SystemAccount<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The policy is not eligible for settlement.")]
    NotEligible,
}
