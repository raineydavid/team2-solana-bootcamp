import SwitchboardProgram from "@switchboard-xyz/sbv2-lite";
import * as anchor from "@coral-xyz/anchor";
import {CrossbarClient} from "@switchboard-xyz/common";

// uses devnet by default
const connection = new anchor.web3.Connection("https://api.devnet.solana.com", "confirmed");
const sbv2 = await SwitchboardProgram.load(connection);

const muyangeAggPubKey = "CmThezziTDhGHSX7PcPA17a2srK3aLWhyAyZZwT4UTeV";

// TEMP_MUYANGE_KIGALI_RWANDA (CmThe...4UTeV)
// https://ondemand.switchboard.xyz/solana/devnet/feed/CmThezziTDhGHSX7PcPA17a2srK3aLWhyAyZZwT4UTeV
const muyangeTempAggregator = new anchor.web3.PublicKey(
    muyangeAggPubKey
);

export const getMuyangeTemp = async () => {
    const crossbar = new CrossbarClient("https://crossbar.switchboard.xyz");
    const results = await crossbar.simulateSolanaFeeds(
        "devnet", // network "mainnet" | "devnet"
        [muyangeAggPubKey] // feed pubkeys as base58
    );

    return results[0].results[0];

    // const accountInfo = await sbv2.program.provider.connection.getAccountInfo(
    //     muyangeTempAggregator
    // );
    // if (!accountInfo) {
    //     throw new Error(`failed to fetch account info`);
    // }

    // const latestResult = sbv2.fetchAggregatorLatestValue(muyangeTempAggregator)

    // // Get latest value if its been updated in the last 300 seconds
    // if (latestResult === null) {
    //     throw new Error(`failed to fetch latest result for aggregator`);
    // }

    // return latestResult;
};
