import type { Node } from './index'

export interface GraphResponse {
  centerNode: Node
  neighbors: Array<{
    node: Node
    relation: {
      type: string
      strength: number
    }
  }>
}
