import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请先配置环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function showStats() {
  console.log('📊 Word Universe - 数据统计\n')

  try {
    // 总体统计
    console.log('═'.repeat(50))
    console.log('📈 总体统计\n')

    const { count: nodeCount } = await supabase
      .from('nodes')
      .select('*', { count: 'exact', head: true })

    const { count: relationCount } = await supabase
      .from('relations')
      .select('*', { count: 'exact', head: true })

    console.log(`节点总数: ${nodeCount}`)
    console.log(`关系总数: ${relationCount}`)
    console.log(`平均每节点关系数: ${relationCount && nodeCount ? (relationCount / nodeCount).toFixed(2) : 0}`)

    // 节点类型分布
    console.log('\n' + '═'.repeat(50))
    console.log('🏷️  节点类型分布\n')

    const { data: typeStats } = await supabase
      .rpc('count_by_type', {}, { count: 'exact' })
      .catch(async () => {
        // 如果 RPC 不存在，手动查询
        const { data: nodes } = await supabase.from('nodes').select('type')
        const typeCounts: Record<string, number> = {}
        nodes?.forEach(n => {
          typeCounts[n.type] = (typeCounts[n.type] || 0) + 1
        })
        return { data: Object.entries(typeCounts).map(([type, count]) => ({ type, count })) }
      })

    if (typeStats) {
      typeStats.forEach((stat: { type: string; count: number }) => {
        console.log(`  ${stat.type}: ${stat.count} 个`)
      })
    }

    // 关系类型分布
    console.log('\n' + '═'.repeat(50))
    console.log('🔗 关系类型分布\n')

    const { data: relationTypes } = await supabase
      .from('relations')
      .select('type')

    const relationTypeCounts: Record<string, number> = {}
    relationTypes?.forEach(r => {
      relationTypeCounts[r.type] = (relationTypeCounts[r.type] || 0) + 1
    })

    Object.entries(relationTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count} 个`)
      })

    // Top 10 重要节点
    console.log('\n' + '═'.repeat(50))
    console.log('⭐ Top 10 重要节点\n')

    const { data: topNodes } = await supabase
      .from('nodes')
      .select('label, label_cn, importance')
      .order('importance', { ascending: false })
      .limit(10)

    topNodes?.forEach((node, index) => {
      console.log(`  ${index + 1}. ${node.label} (${node.label_cn}) - ${node.importance}`)
    })

    // Top 10 连接最多的节点
    console.log('\n' + '═'.repeat(50))
    console.log('🌟 Top 10 连接最多的节点\n')

    const { data: relations } = await supabase
      .from('relations')
      .select('source_id')

    const connectionCounts: Record<string, number> = {}
    relations?.forEach(r => {
      connectionCounts[r.source_id] = (connectionCounts[r.source_id] || 0) + 1
    })

    const topConnected = Object.entries(connectionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    for (const [nodeId, count] of topConnected) {
      const { data: node } = await supabase
        .from('nodes')
        .select('label, label_cn')
        .eq('id', nodeId)
        .single()

      if (node) {
        console.log(`  ${node.label} (${node.label_cn}): ${count} 个连接`)
      }
    }

    console.log('\n' + '═'.repeat(50) + '\n')

  } catch (error) {
    console.error('❌ 统计失败:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

showStats()
