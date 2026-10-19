import { useQuery } from '@tanstack/react-query'
import { omni-stellar-omni-stellar-scavengerClient } from '@/api/client'
import { useContract } from '@/context/ContractContext'
import { getNetworkPassphrase } from '@/lib/stellar'
import { cacheKeys } from '@/lib/cacheKeys'

function useClient() {
  const { config } = useContract()
  return new omni-stellar-omni-stellar-scavengerClient({
    contractId: config.contractId,
    rpcUrl: config.rpcUrl,
    networkPassphrase: getNetworkPassphrase(config.network),
  })
}

export function useParticipantStats(address: string | undefined) {
  const client = useClient()
  return useQuery({
    queryKey: cacheKeys.participantStats(address ?? ''),
    queryFn: () => client.getStats(address!),
    enabled: !!address,
    staleTime: 60_000,
  })
}
