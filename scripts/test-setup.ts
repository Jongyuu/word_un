import { createClient } from '@supabase/supabase-js'

async function testSetup() {
  console.log('🧪 Word Universe - 环境测试\n')

  // 1. 检查环境变量
  console.log('1️⃣ 检查环境变量...')
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ 环境变量未配置')
    console.log('请配置 .env.local 文件\n')
    return
  }

  console.log('✅ 环境变量已配置\n')

  // 2. 测试 Supabase 连接
  console.log('2️⃣ 测试 Supabase 连接...')
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { count: nodeCount } = await supabase
      .from('nodes')
      .select('*', { count: 'exact', head: true })

    const { count: relationCount } = await supabase
      .from('relations')
      .select('*', { count: 'exact', head: true })

    console.log(`✅ Supabase 连接成功`)
    console.log(`   节点数量: ${nodeCount}`)
    console.log(`   关系数量: ${relationCount}\n`)

    if (nodeCount === 0) {
      console.log('⚠️  数据库为空，需要导入种子数据')
      console.log('   运行: npm run import-data\n')
    }

  } catch (error) {
    console.log('❌ Supabase 连接失败:', error.message)
  }

  // 3. 测试初始图谱 API
  console.log('3️⃣ 测试初始图谱数据...')
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: centerNode } = await supabase
      .from('nodes')
      .select('*')
      .order('importance', { ascending: false })
      .limit(1)
      .single()

    if (centerNode) {
      console.log(`✅ 初始节点: ${centerNode.label} (${centerNode.label_cn})`)

      const { data: relations } = await supabase
        .from('relations')
        .select('target_id')
        .eq('source_id', centerNode.id)
        .limit(12)

      console.log(`   邻居数量: ${relations?.length || 0}\n`)
    }

  } catch (error) {
    console.log('❌ 数据查询失败:', error.message)
  }

  console.log('🎉 测试完成！')
}

testSetup()
