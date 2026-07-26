/**
 * useApi — returns a ready-to-use omni-stellar-omni-stellar-scavengerClient built from the current
 * ContractContext config and Stellar network settings.
 *
 * Usage:
 *   const api = useApi()
 *   const { data } = useQuery({ queryKey: ['participant', addr], queryFn: () => api.getParticipant(addr) })
 */
import { useMemo } from 'react'
import { omni-stellar-omni-stellar-scavengerClient } from '@/api/client'
import { useContract } from '@/context/ContractContext'
import { networkConfig } from '@/lib/stellar'

export function useApi(): omni-stellar-omni-stellar-scavengerClient {
  const { config } = useContract()
  return useMemo(
    () =>
      new omni-stellar-omni-stellar-scavengerClient({
        rpcUrl: config.rpcUrl,
        networkPassphrase: networkConfig.networkPassphrase,
        contractId: config.contractId,
      }),
    [config.rpcUrl, config.contractId]
  )
}
