import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 从环境变量读取配置
const supabaseUrl = process.env.VITE_SUPABASE_URL
// 尝试使用 SERVICE_KEY，如果没有则使用 ANON_KEY
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误：缺少 Supabase 环境变量')
  console.log('请确保 .env.local 文件包含：')
  console.log('  VITE_SUPABASE_URL=...')
  console.log('  SUPABASE_SERVICE_KEY=... 或 VITE_SUPABASE_ANON_KEY=...')
  process.exit(1)
}

console.log(`🔑 使用 ${process.env.SUPABASE_SERVICE_KEY ? 'SERVICE_KEY' : 'ANON_KEY'}\n`)

const supabase = createClient(supabaseUrl, supabaseKey)

async function importData() {
  console.log('🚀 开始导入种子数据...\n')

  try {
    // 读取 JSON 文件 - 使用 nodes-all.json (425个节点)
    const nodesPath = path.join(__dirname, '../supabase/seed-data/nodes-all.json')
    const relationsPath = path.join(__dirname, '../supabase/seed-data/relations.json')

    const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf-8'))
    const relations = JSON.parse(fs.readFileSync(relationsPath, 'utf-8'))

    console.log(`📄 读取到 ${nodes.length} 个节点`)
    console.log(`📄 读取到 ${relations.length} 个关系\n`)

    // 先清空现有数据
    console.log('🗑️  清空现有数据...')
    const { error: clearRelError } = await supabase.from('relations').delete().neq('id', '')
    if (clearRelError) {
      console.log('⚠️  清空 relations 表失败（可能为空）:', clearRelError.message)
    } else {
      console.log('✓ relations 表已清空')
    }

    const { error: clearNodeError } = await supabase.from('nodes').delete().neq('id', '')
    if (clearNodeError) {
      console.log('⚠️  清空 nodes 表失败（可能为空）:', clearNodeError.message)
    } else {
      console.log('✓ nodes 表已清空')
    }
    console.log('')

    // 导入节点（使用 upsert 避免重复键错误）
    console.log('📦 导入节点...')
    const { error: nodesError } = await supabase
      .from('nodes')
      .upsert(nodes, { onConflict: 'id' })

    if (nodesError) {
      throw new Error(`节点导入失败: ${nodesError.message}`)
    }

    console.log(`✅ 成功导入 ${nodes.length} 个节点\n`)

    // 导入关系
    console.log('🔗 导入关系...')
    const { error: relationsError } = await supabase
      .from('relations')
      .insert(relations)

    if (relationsError) {
      throw new Error(`关系导入失败: ${relationsError.message}`)
    }

    console.log(`✅ 成功导入 ${relations.length} 个关系\n`)

    // 验证数据
    console.log('🔍 验证数据...')
    const { count: nodeCount } = await supabase
      .from('nodes')
      .select('*', { count: 'exact', head: true })

    const { count: relationCount } = await supabase
      .from('relations')
      .select('*', { count: 'exact', head: true })

    console.log(`✅ 数据库中现有 ${nodeCount} 个节点`)
    console.log(`✅ 数据库中现有 ${relationCount} 个关系\n`)

    console.log('🎉 数据导入完成！')
  } catch (error) {
    console.error('❌ 导入失败:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

importData()
