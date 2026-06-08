import type { GraphResponse } from '@/types'

const API_BASE = '/api'

export const graphApi = {
  // 获取初始图谱数据
  async getInitialGraph(): Promise<GraphResponse> {
    const response = await fetch(`${API_BASE}/graph/initial`)
    if (!response.ok) {
      throw new Error('Failed to fetch initial graph')
    }
    return response.json()
  },

  // 获取指定节点的图谱数据
  async getNodeGraph(nodeId: string): Promise<GraphResponse> {
    const response = await fetch(`${API_BASE}/graph/center/${nodeId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch node: ${nodeId}`)
    }
    return response.json()
  }
}
