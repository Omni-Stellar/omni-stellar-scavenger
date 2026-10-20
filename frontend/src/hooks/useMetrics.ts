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

export function useMetrics() {
  const client = useClient()
  return useQuery({
    queryKey: cacheKeys.metrics(),
    queryFn: () => client.getMetrics(),
    staleTime: 2 * 60_000,
  })
}
