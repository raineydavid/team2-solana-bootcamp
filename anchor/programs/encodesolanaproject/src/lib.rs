#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

#[program]
pub mod encodesolanaproject {
    use super::*;

    pub fn close(_ctx: Context<CloseEncodesolanaproject>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.encodesolanaproject.count = ctx.accounts.encodesolanaproject.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.encodesolanaproject.count = ctx.accounts.encodesolanaproject.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeEncodesolanaproject>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.encodesolanaproject.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEncodesolanaproject<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Encodesolanaproject::INIT_SPACE,
  payer = payer
    )]
    pub encodesolanaproject: Account<'info, Encodesolanaproject>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseEncodesolanaproject<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub encodesolanaproject: Account<'info, Encodesolanaproject>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub encodesolanaproject: Account<'info, Encodesolanaproject>,
}

#[account]
#[derive(InitSpace)]
pub struct Encodesolanaproject {
    count: u8,
}
