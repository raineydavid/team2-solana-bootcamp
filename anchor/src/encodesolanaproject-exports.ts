// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Encodesolanaproject, ENCODESOLANAPROJECT_DISCRIMINATOR, ENCODESOLANAPROJECT_PROGRAM_ADDRESS, getEncodesolanaprojectDecoder } from './client/js'
import EncodesolanaprojectIDL from '../target/idl/encodesolanaproject.json'

export type EncodesolanaprojectAccount = Account<Encodesolanaproject, string>

// Re-export the generated IDL and type
export { EncodesolanaprojectIDL }

// This is a helper function to get the program ID for the Encodesolanaproject program depending on the cluster.
export function getEncodesolanaprojectProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Encodesolanaproject program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return ENCODESOLANAPROJECT_PROGRAM_ADDRESS
  }
}

export * from './client/js'

export function getEncodesolanaprojectProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getEncodesolanaprojectDecoder(),
    filter: getBase58Decoder().decode(ENCODESOLANAPROJECT_DISCRIMINATOR),
    programAddress: ENCODESOLANAPROJECT_PROGRAM_ADDRESS,
  })
}
