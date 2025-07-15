use anchor_lang::prelude::*;

declare_id!("AcB8bRgojV25gfXDVBXJNwBLY2xsbAE59FCGJSXjWsF5");

#[program]
pub mod insurance {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
    
    pub fn apply(ctx: )
    
    pub fn initialise_policy(ctx: Context<Create>, premium: u64, oracle_pubkey: Pubkey) -> Result<()> {
      let policy: &mut Account<Policy> = &mut ctx.accounts.policy
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = admin, space = 8 + 180)]
    pub policy: Account<'info, Policy>,
    #[account(mut)]
    pub admin: Signer<'info>,    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Payout<'info> {             
    #[account(mut, 
        constraint = 
        ticket.submitter == *winner.key && 
        ticket.idx == lottery.winner_index        
    )]       
    pub lottery: Account<'info, Lottery>,          // To assert winner and withdraw lamports
    #[account(mut)]       
    /// CHECK: Not dangerous as it only receives lamports
    pub winner: AccountInfo<'info>,                // Winner account
    #[account(mut)]                  
    pub ticket: Account<'info, Ticket>,            // Winning PDA
}

#[account]
pub struct Policy {    
    //pub authority: Pubkey, 
    pub oracle: Pubkey, 
    pub insurer: Pubkey,
    pub policyholder: Pubkey,
    pub cover: u64,
    pub premium: u64,
}

#[account]
pub struct Plan {    
    //pub authority: Pubkey, 
    pub oracle: Pubkey, 
    pub insurer: Pubkey,
    //pub policyholder: Pubkey,
    pub cover: u64,
    pub premium: u64,
}
