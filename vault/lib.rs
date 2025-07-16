// vault/lib.rs
use anchor_lang::prelude::*;

declare_id!("Vault11111111111111111111111111111111111111");

#[program]
pub mod vault_program {
    use super::*;

    pub fn init_vault(ctx: Context<InitVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.total_deposits = 0;
        vault.yield_rate = 5;
        vault.balance = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user = &mut ctx.accounts.user_account;
        vault.total_deposits += amount;
        vault.balance += amount;
        user.total_deposited += amount;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user = &mut ctx.accounts.user_account;
        require!(vault.balance >= amount, ErrorCode::InsufficientFunds);
        vault.balance -= amount;
        user.total_withdrawn += amount;
        Ok(())
    }

    pub fn init_user(ctx: Context<InitUser>) -> Result<()> {
        let user = &mut ctx.accounts.user_account;
        user.authority = ctx.accounts.authority.key();
        user.total_deposited = 0;
        user.total_withdrawn = 0;
        user.joined_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitVault<'info> {
    #[account(init, payer = payer, space = 8 + 64, seeds = [b"vault"], bump)]
    pub vault: Account<'info, VaultAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, VaultAccount>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub depositor: Signer<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, VaultAccount>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub recipient: Signer<'info>,
}

#[derive(Accounts)]
pub struct InitUser<'info> {
    #[account(init, payer = authority, space = 8 + 128, seeds = [b"user", authority.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct VaultAccount {
    pub total_deposits: u64,
    pub yield_rate: u8,
    pub balance: u64,
}

#[account]
pub struct UserAccount {
    pub authority: Pubkey,
    pub total_deposited: u64,
    pub total_withdrawn: u64,
    pub joined_at: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds in the vault.")]
    InsufficientFunds,
}
