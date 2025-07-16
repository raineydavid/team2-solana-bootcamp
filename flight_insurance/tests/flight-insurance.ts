import * as anchor from "@coral-xyz/anchor";
import { FlightInsurance } from "../target/types/flight_insurance";
import { assert } from "chai";
import { SystemProgram } from "@solana/web3.js";

describe("flight_insurance", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .FlightInsurance as anchor.Program<FlightInsurance>;
  const user = provider.wallet;

  let policyPda: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;

  const flightInfo = {
    flightNumber: "AI123",
    departureAirport: "LOS",
    scheduledDeparture: "2025-07-16T08:00:00Z",
  };

  const premium = new anchor.BN(5000);

  before(async () => {
    [policyPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [user.publicKey.toBuffer()],
      program.programId
    );

    [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    );
  });
  console.log(program.methods.createPolicy.toString());

  it("creates a policy and stores data correctly", async () => {
    await program.methods
      .createPolicy(flightInfo, premium)
      .accounts({
        user: user.publicKey,
        policy: policyPda,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Fetch and check the account
    const policyAccount = await program.account.insurancePolicy.fetch(
      policyPda
    );

    assert.strictEqual(
      policyAccount.user.toBase58(),
      user.publicKey.toBase58()
    );
    assert.strictEqual(policyAccount.flightInfo.flightNumber, "AI123");
    assert.strictEqual(
      policyAccount.premiumPaid.toNumber(),
      premium.toNumber()
    );
    assert.strictEqual(
      policyAccount.payoutAmount.toNumber(),
      premium.toNumber() * 2
    );
  });
});
