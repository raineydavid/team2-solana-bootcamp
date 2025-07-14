import {
  EncodesolanaprojectAccount,
  getCloseInstruction,
  getEncodesolanaprojectProgramAccounts,
  getEncodesolanaprojectProgramId,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { generateKeyPairSigner } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useEncodesolanaprojectProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getEncodesolanaprojectProgramId(cluster.id), [cluster])
}

export function useEncodesolanaprojectProgram() {
  const { client, cluster } = useWalletUi()
  const programId = useEncodesolanaprojectProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function useEncodesolanaprojectInitializeMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const encodesolanaproject = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, encodesolanaproject }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['encodesolanaproject', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useEncodesolanaprojectDecrementMutation({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  const invalidateAccounts = useEncodesolanaprojectAccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ encodesolanaproject: encodesolanaproject.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useEncodesolanaprojectIncrementMutation({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  const invalidateAccounts = useEncodesolanaprojectAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ encodesolanaproject: encodesolanaproject.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useEncodesolanaprojectSetMutation({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  const invalidateAccounts = useEncodesolanaprojectAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async (value: number) =>
      await signAndSend(
        getSetInstruction({
          encodesolanaproject: encodesolanaproject.address,
          value,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useEncodesolanaprojectCloseMutation({ encodesolanaproject }: { encodesolanaproject: EncodesolanaprojectAccount }) {
  const invalidateAccounts = useEncodesolanaprojectAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, encodesolanaproject: encodesolanaproject.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useEncodesolanaprojectAccountsQuery() {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useEncodesolanaprojectAccountsQueryKey(),
    queryFn: async () => await getEncodesolanaprojectProgramAccounts(client.rpc),
  })
}

function useEncodesolanaprojectAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useEncodesolanaprojectAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

function useEncodesolanaprojectAccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['encodesolanaproject', 'accounts', { cluster }]
}
