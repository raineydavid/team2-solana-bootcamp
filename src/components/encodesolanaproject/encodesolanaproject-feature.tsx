import { WalletButton } from '../solana/solana-provider'
import { EncodesolanaprojectButtonInitialize, EncodesolanaprojectList, EncodesolanaprojectProgramExplorerLink, EncodesolanaprojectProgramGuard } from './encodesolanaproject-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'
import { getMuyangeTemp } from '../solana/switchboard'
import { useEffect, useState } from 'react'

export default function EncodesolanaprojectFeature() {
  const { account } = useWalletUi()
  const [muyangeTemp, setMuyangeTemp] = useState<number | null>(null)

  useEffect(() => {
    const fetchTemp = async () => {
      const result = await getMuyangeTemp()
      setMuyangeTemp(result)
    }

    fetchTemp()
  }, [])


  return (
    <EncodesolanaprojectProgramGuard>
      <AppHero
        title="Parametric insurance"
        subtitle={
          account
            ? "Explore the parametric insurance. See what's on chain and interact with it"
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
      <div className="text-center pt-4">
        <h2 className={'text-2xl'}>Data feeds (Switchboard)</h2>
        <p><b>Muyange temperature: </b>{muyangeTemp !== null ? `${muyangeTemp}ºc` : 'Loading...'}</p>
      </div>
    </EncodesolanaprojectProgramGuard>
  )
}
