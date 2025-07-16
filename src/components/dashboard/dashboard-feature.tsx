import { AppHero } from '@/components/app-hero'

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solana.com/developers/cookbook/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
]

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="gm 👋" subtitle="Encode x Solana bootcamp project: Solana Parametric insurance" />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <p>This is a basic example of a parametric insurance service running on Solana</p>
          <p>The application uses <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="https://ondemand.switchboard.xyz/">Switchboard</a> as an Oracle, which provides weather information</p>
        </div>
      </div>
    </div>
  )
}
