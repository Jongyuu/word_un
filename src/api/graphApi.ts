import type { GraphResponse } from '@/types'

const API_BASE = '/api'
const REQUEST_TIMEOUT = 10000 // 10 秒超时

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public userMessage?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchWithTimeout(url: string, timeout = REQUEST_TIMEOUT): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'Request timeout',
        408,
        '请求超时，请检查网络连接后重试'
      )
    }
    throw error
  }
}

export const graphApi = {
  // 获取初始图谱数据
  async getInitialGraph(): Promise<GraphResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/graph/initial`)

      if (!response.ok) {
        throw new ApiError(
          `Failed to fetch initial graph: ${response.status}`,
          response.status,
          response.status === 404
            ? '未找到初始图谱数据，请联系管理员'
            : response.status === 500
            ? '服务器错误，请稍后重试'
            : '加载图谱失败，请刷新页面重试'
        )
      }

      const data = await response.json()

      // 验证返回数据结构
      if (!data.centerNode || !Array.isArray(data.neighbors)) {
        throw new ApiError(
          'Invalid graph data structure',
          undefined,
          '图谱数据格式错误，请联系管理员'
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      // 网络连接错误
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Network error',
          undefined,
          '网络连接失败，请检查您的网络设置'
        )
      }

      throw new ApiError(
        'Unknown error fetching initial graph',
        undefined,
        '未知错误，请刷新页面重试'
      )
    }
  },

  // 获取指定节点的图谱数据
  async getNodeGraph(nodeId: string): Promise<GraphResponse> {
    if (!nodeId || typeof nodeId !== 'string') {
      throw new ApiError(
        'Invalid node ID',
        400,
        '节点 ID 无效'
      )
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE}/graph/center/${nodeId}`)

      if (!response.ok) {
        throw new ApiError(
          `Failed to fetch node: ${nodeId} (${response.status})`,
          response.status,
          response.status === 404
            ? `未找到节点 "${nodeId}"，可能已被删除`
            : response.status === 500
            ? '服务器错误，请稍后重试'
            : `加载节点 "${nodeId}" 失败`
        )
      }

      const data = await response.json()

      // 验证返回数据结构
      if (!data.centerNode || !Array.isArray(data.neighbors)) {
        throw new ApiError(
          'Invalid graph data structure',
          undefined,
          '图谱数据格式错误，请联系管理员'
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      // 网络连接错误
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Network error',
          undefined,
          '网络连接失败，请检查您的网络设置'
        )
      }

      throw new ApiError(
        `Unknown error fetching node: ${nodeId}`,
        undefined,
        '未知错误，请重试'
      )
    }
  }
}

export { ApiError }
