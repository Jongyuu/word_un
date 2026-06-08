import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请先配置环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function backupData() {
  console.log('📦 开始备份数据...\n')

  try {
    // 备份节点
    console.log('1️⃣ 备份节点数据...')
    const { data: nodes, error: nodesError } = await supabase
      .from('nodes')
      .select('*')
      .order('id')

    if (nodesError) throw nodesError

    // 备份关系
    console.log('2️⃣ 备份关系数据...')
    const { data: relations, error: relationsError } = await supabase
      .from('relations')
      .select('*')
      .order('id')

    if (relationsError) throw relationsError

    // 创建备份目录
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    // 生成文件名（带时间戳）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const nodesFile = path.join(backupDir, `nodes_${timestamp}.json`)
    const relationsFile = path.join(backupDir, `relations_${timestamp}.json`)

    // 写入文件
    fs.writeFileSync(nodesFile, JSON.stringify(nodes, null, 2))
    fs.writeFileSync(relationsFile, JSON.stringify(relations, null, 2))

    console.log(`\n✅ 备份完成！`)
    console.log(`   节点: ${nodes?.length || 0} 个`)
    console.log(`   关系: ${relations?.length || 0} 个`)
    console.log(`\n📁 备份文件:`)
    console.log(`   ${nodesFile}`)
    console.log(`   ${relationsFile}\n`)

  } catch (error) {
    console.error('❌ 备份失败:', error.message)
    process.exit(1)
  }
}

backupData()
