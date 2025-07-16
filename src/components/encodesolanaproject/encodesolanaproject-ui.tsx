import { ellipsify } from '@wallet-ui/react'
import {
  useEncodesolanaprojectAccountsQuery,
  useEncodesolanaprojectCloseMutation,
  useEncodesolanaprojectDecrementMutation,
  useEncodesolanaprojectIncrementMutation,
  useEncodesolanaprojectInitializeMutation,
  useEncodesolanaprojectProgram,
  useEncodesolanaprojectProgramId,
  useEncodesolanaprojectSetMutation,
} from './encodesolanaproject-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { EncodesolanaprojectAccount } from '@project/anchor'
import { ReactNode } from 'react'

export function EncodesolanaprojectProgramExplorerLink() {
  const programId = useEncodesolanaprojectProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function EncodesolanaprojectList() {
  const encodesolanaprojectAccountsQuery = useEncodesolanaprojectAccountsQuery()

  if (encodesolanaprojectAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!encodesolanaprojectAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {encodesolanaprojectAccountsQuery.data?.map((encodesolanaproject) => (
        <EncodesolanaprojectCard key={encodesolanaproject.address} encodesolanaproject={encodesolanaproject} />
      ))}
    </div>
  )
}

export function EncodesolanaprojectProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useEncodesolanaprojectProgram()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function EncodesolanaprojectCard({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Encodesolanaproject: {encodesolanaproject.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={encodesolanaproject.address} label={ellipsify(encodesolanaproject.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <EncodesolanaprojectButtonIncrement encodesolanaproject={encodesolanaproject} />
          <EncodesolanaprojectButtonSet encodesolanaproject={encodesolanaproject} />
          <EncodesolanaprojectButtonDecrement encodesolanaproject={encodesolanaproject} />
          <EncodesolanaprojectButtonClose encodesolanaproject={encodesolanaproject} />
        </div>
      </CardContent>
    </Card>
  )
}

export function EncodesolanaprojectButtonInitialize() {
  const mutationInitialize = useEncodesolanaprojectInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Smart Contract {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function EncodesolanaprojectButtonIncrement({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  const incrementMutation = useEncodesolanaprojectIncrementMutation({ encodesolanaproject })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function EncodesolanaprojectButtonSet({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  const setMutation = useEncodesolanaprojectSetMutation({ encodesolanaproject })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', encodesolanaproject.data.count.toString() ?? '0')
        if (!value || parseInt(value) === encodesolanaproject.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function EncodesolanaprojectButtonDecrement({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  const decrementMutation = useEncodesolanaprojectDecrementMutation({ encodesolanaproject })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function EncodesolanaprojectButtonClose({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  const closeMutation = useEncodesolanaprojectCloseMutation({ encodesolanaproject })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
