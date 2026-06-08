import { useQuery } from '@tanstack/react-query'
import { graphApi } from '@/api/graphApi'

export function useInitialGraph() {
  return useQuery({
    queryKey: ['graph', 'initial'],
    queryFn: () => graphApi.getInitialGraph(),
    staleTime: 5 * 60 * 1000, // 5 分钟
    retry: 2
  })
}

export function useNodeGraph(nodeId: string | null) {
  return useQuery({
    queryKey: ['graph', 'node', nodeId],
    queryFn: () => graphApi.getNodeGraph(nodeId!),
    enabled: !!nodeId,
    staleTime: 5 * 60 * 1000,
    retry: 2
  })
}
