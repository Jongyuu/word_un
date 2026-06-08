import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 获取 importance 最高的节点
    const { data: centerNode, error: centerError } = await supabase
      .from('nodes')
      .select('*')
      .order('importance', { ascending: false })
      .limit(1)
      .single()

    if (centerError || !centerNode) {
      return res.status(404).json({ error: 'No nodes found' })
    }

    // 获取该节点的邻居
    const { data: relations, error: relationsError } = await supabase
      .from('relations')
      .select('target_id, type, strength')
      .eq('source_id', centerNode.id)
      .order('strength', { ascending: false })
      .limit(12)

    if (relationsError) {
      return res.status(500).json({ error: relationsError.message })
    }

    const targetIds = relations?.map(r => r.target_id) || []

    if (targetIds.length === 0) {
      return res.status(200).json({ centerNode, neighbors: [] })
    }

    const { data: neighborNodes, error: nodesError } = await supabase
      .from('nodes')
      .select('*')
      .in('id', targetIds)

    if (nodesError) {
      return res.status(500).json({ error: nodesError.message })
    }

    const neighbors = neighborNodes?.map(node => {
      const relation = relations?.find(r => r.target_id === node.id)
      return {
        node,
        relation: { type: relation?.type, strength: relation?.strength }
      }
    }) || []

    res.status(200).json({ centerNode, neighbors })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: errorMessage })
  }
}
