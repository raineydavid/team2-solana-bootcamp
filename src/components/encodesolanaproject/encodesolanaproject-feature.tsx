import { WalletButton } from '../solana/solana-provider'
import { EncodesolanaprojectButtonInitialize, EncodesolanaprojectList, EncodesolanaprojectProgramExplorerLink, EncodesolanaprojectProgramGuard } from './encodesolanaproject-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function EncodesolanaprojectFeature() {
  const { account } = useWalletUi()

  return (
    <EncodesolanaprojectProgramGuard>
      <AppHero
        title="Encodesolanaproject"
        subtitle={
          account
            ? "Initialize a new encodesolanaproject onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <EncodesolanaprojectProgramExplorerLink />
        </p>
        {account ? (
          <EncodesolanaprojectButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <EncodesolanaprojectList /> : null}
    </EncodesolanaprojectProgramGuard>
  )
}
