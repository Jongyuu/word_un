// 核心数据类型
export interface Node {
  id: string
  label: string
  labelCn?: string
  type: 'word' | 'topic' | 'root' | 'concept'
  importance: number
  isCenter?: boolean
  definition?: string
  metadata?: {
    etymology?: string
    category?: string
    tags?: string[]
    [key: string]: string | number | boolean | string[] | undefined
  }
  createdAt?: string
}

export interface Relation {
  id: string
  source: string
  target: string
  type: string
  strength: number
  label?: string
}

// 导出 API 相关类型
export * from './api'
