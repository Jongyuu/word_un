import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupWizard() {
  console.log('🌌 Word Universe - 环境配置向导\n')
  console.log('此向导将帮助您配置 Supabase 连接\n')

  try {
    // 检查是否已有配置
    const envPath = path.join(process.cwd(), '.env.local')
    const envExists = fs.existsSync(envPath)

    if (envExists) {
      const content = fs.readFileSync(envPath, 'utf-8')
      if (content.includes('https://') && content.includes('eyJ')) {
        console.log('⚠️  检测到已有配置文件\n')
        const overwrite = await question('是否要重新配置？(y/n): ')
        if (overwrite.toLowerCase() !== 'y') {
          console.log('保持现有配置，退出向导')
          rl.close()
          return
        }
      }
    }

    console.log('📝 请提供以下信息（从 Supabase Dashboard 获取）\n')
    console.log('访问：https://supabase.com/dashboard/project/_/settings/api\n')

    const supabaseUrl = await question('1️⃣ Supabase Project URL: ')
    const anonKey = await question('2️⃣ Supabase Anon Key: ')
    const serviceKey = await question('3️⃣ Supabase Service Key (可选，用于后端): ')

    // 验证输入
    if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
      throw new Error('Project URL 必须以 https:// 开头')
    }

    if (!anonKey || !anonKey.startsWith('eyJ')) {
      throw new Error('Anon Key 格式不正确（应该以 eyJ 开头）')
    }

    // 写入配置文件
    const envContent = `# Supabase 配置
# 由 setup-wizard 自动生成于 ${new Date().toISOString()}

VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${anonKey}

${serviceKey ? `SUPABASE_SERVICE_KEY=${serviceKey}` : '# SUPABASE_SERVICE_KEY=（后端 API 需要）'}
`

    fs.writeFileSync(envPath, envContent)
    console.log('\n✅ 配置文件已创建：.env.local')

    // 测试连接
    console.log('\n🔍 测试 Supabase 连接...')
    const testCmd = 'npm run test:setup'
    console.log(`运行：${testCmd}\n`)

    // 提示下一步
    console.log('✨ 配置完成！')
    console.log('\n下一步操作：')
    console.log('1. npm run test:setup - 测试连接')
    console.log('2. npm run import-data - 导入种子数据')
    console.log('3. npm run dev - 启动开发服务器\n')

  } catch (error) {
    console.error('\n❌ 错误：', (error as Error).message)
  } finally {
    rl.close()
  }
}

setupWizard()
