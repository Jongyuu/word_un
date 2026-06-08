import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请先配置环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function validateData() {
  console.log('🔍 Word Universe - 数据完整性验证\n')

  const issues: string[] = []
  const warnings: string[] = []

  try {
    // 1. 检查节点数据
    console.log('1️⃣ 验证节点数据...')
    const { data: nodes, error: nodesError } = await supabase
      .from('nodes')
      .select('*')

    if (nodesError) throw nodesError

    if (!nodes || nodes.length === 0) {
      issues.push('❌ 节点表为空')
    } else {
      console.log(`   ✅ 找到 ${nodes.length} 个节点`)

      // 检查必填字段
      for (const node of nodes) {
        if (!node.id) issues.push(`❌ 节点缺少 id`)
        if (!node.label) issues.push(`❌ 节点 ${node.id} 缺少 label`)
        if (!node.definition) warnings.push(`⚠️  节点 ${node.id} 缺少 definition`)
        if (node.importance < 0 || node.importance > 1) {
          issues.push(`❌ 节点 ${node.id} 的 importance 超出范围 [0,1]`)
        }
      }

      // 检查节点类型
      const nodeTypes = new Set(nodes.map(n => n.type))
      console.log(`   节点类型: ${Array.from(nodeTypes).join(', ')}`)
    }

    // 2. 检查关系数据
    console.log('\n2️⃣ 验证关系数据...')
    const { data: relations, error: relationsError } = await supabase
      .from('relations')
      .select('*')

    if (relationsError) throw relationsError

    if (!relations || relations.length === 0) {
      issues.push('❌ 关系表为空')
    } else {
      console.log(`   ✅ 找到 ${relations.length} 个关系`)

      // 检查关系完整性
      const nodeIds = new Set(nodes?.map(n => n.id) || [])

      for (const relation of relations) {
        if (!nodeIds.has(relation.source_id)) {
          issues.push(`❌ 关系 ${relation.id} 的 source_id ${relation.source_id} 不存在`)
        }
        if (!nodeIds.has(relation.target_id)) {
          issues.push(`❌ 关系 ${relation.id} 的 target_id ${relation.target_id} 不存在`)
        }
        if (relation.strength < 0 || relation.strength > 1) {
          issues.push(`❌ 关系 ${relation.id} 的 strength 超出范围 [0,1]`)
        }
      }

      // 检查关系类型
      const relationTypes = new Set(relations.map(r => r.type))
      console.log(`   关系类型: ${Array.from(relationTypes).join(', ')}`)
    }

    // 3. 检查孤立节点
    console.log('\n3️⃣ 检查孤立节点...')
    const connectedNodeIds = new Set<string>()
    relations?.forEach(r => {
      connectedNodeIds.add(r.source_id)
      connectedNodeIds.add(r.target_id)
    })

    const orphanNodes = nodes?.filter(n => !connectedNodeIds.has(n.id)) || []
    if (orphanNodes.length > 0) {
      warnings.push(`⚠️  发现 ${orphanNodes.length} 个孤立节点（没有关系）`)
      orphanNodes.slice(0, 5).forEach(n => {
        warnings.push(`     - ${n.label} (${n.id})`)
      })
    } else {
      console.log('   ✅ 所有节点都有连接')
    }

    // 4. 检查重要节点
    console.log('\n4️⃣ 检查重要节点...')
    const importantNodes = nodes?.filter(n => n.importance >= 0.9) || []
    if (importantNodes.length === 0) {
      warnings.push('⚠️  没有高重要性节点 (importance >= 0.9)')
    } else {
      console.log(`   ✅ 找到 ${importantNodes.length} 个高重要性节点`)
    }

    // 打印结果
    console.log('\n' + '='.repeat(50))
    console.log('📋 验证结果\n')

    if (issues.length === 0 && warnings.length === 0) {
      console.log('✅ 所有检查通过！数据完整性良好。\n')
      return
    }

    if (issues.length > 0) {
      console.log('❌ 发现问题:\n')
      issues.forEach(issue => console.log('   ' + issue))
      console.log()
    }

    if (warnings.length > 0) {
      console.log('⚠️  警告:\n')
      warnings.slice(0, 10).forEach(warning => console.log('   ' + warning))
      if (warnings.length > 10) {
        console.log(`   ... 以及其他 ${warnings.length - 10} 个警告`)
      }
      console.log()
    }

    console.log('='.repeat(50) + '\n')

  } catch (error) {
    console.error('❌ 验证失败:', error.message)
    process.exit(1)
  }
}

validateData()
