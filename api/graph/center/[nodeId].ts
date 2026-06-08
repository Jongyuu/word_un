import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { nodeId } = req.query

  if (!nodeId || typeof nodeId !== 'string') {
    return res.status(400).json({ error: 'Invalid nodeId parameter' })
  }

  try {
    // 获取中心节点
    const { data: centerNode, error: centerError } = await supabase
      .from('nodes')
      .select('*')
      .eq('id', nodeId)
      .single()

    if (centerError || !centerNode) {
      return res.status(404).json({ error: 'Node not found' })
    }

    // 获取邻居节点
    const { data: relations, error: relationsError } = await supabase
      .from('relations')
      .select('target_id, type, strength')
      .eq('source_id', nodeId)
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
