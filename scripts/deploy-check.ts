import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

async function deployCheck() {
  console.log('🚀 Word Universe - 部署准备检查\n')

  const checks = {
    passed: [] as string[],
    failed: [] as string[],
    warnings: [] as string[]
  }

  // 1. 检查环境变量
  console.log('1️⃣ 检查环境变量...')
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    checks.failed.push('❌ .env.local 文件不存在')
  } else {
    const content = fs.readFileSync(envPath, 'utf-8')
    if (!content.includes('https://') || !content.includes('eyJ')) {
      checks.failed.push('❌ .env.local 配置不完整')
    } else {
      checks.passed.push('✅ 环境变量配置正确')
    }
  }

  // 2. 检查 TypeScript 编译
  console.log('2️⃣ 检查 TypeScript 编译...')
  const { execSync } = require('child_process')
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' })
    checks.passed.push('✅ TypeScript 编译通过')
  } catch (error) {
    checks.failed.push('❌ TypeScript 编译失败')
  }

  // 3. 检查构建产物
  console.log('3️⃣ 检查项目构建...')
  try {
    execSync('npm run build', { stdio: 'pipe' })
    if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
      checks.passed.push('✅ 项目构建成功')
    } else {
      checks.failed.push('❌ dist 目录未生成')
    }
  } catch (error) {
    checks.failed.push('❌ 项目构建失败')
  }

  // 4. 检查数据库连接
  console.log('4️⃣ 检查数据库连接...')
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { count } = await supabase
        .from('nodes')
        .select('*', { count: 'exact', head: true })

      if (count && count > 0) {
        checks.passed.push(`✅ 数据库连接正常（${count} 个节点）`)
      } else {
        checks.warnings.push('⚠️  数据库为空，需要导入数据')
      }
    } catch (error) {
      checks.failed.push('❌ 数据库连接失败')
    }
  }

  // 5. 检查关键文件
  console.log('5️⃣ 检查关键文件...')
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'vercel.json',
    'api/graph/initial.ts',
    'api/graph/center/[nodeId].ts',
    'src/components/Graph/GraphCanvas.tsx'
  ]

  let allFilesExist = true
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      checks.failed.push(`❌ 缺少文件：${file}`)
      allFilesExist = false
    }
  }
  if (allFilesExist) {
    checks.passed.push('✅ 所有关键文件存在')
  }

  // 打印结果
  console.log('\n' + '='.repeat(50))
  console.log('📊 检查结果\n')

  if (checks.passed.length > 0) {
    console.log('✅ 通过的检查：')
    checks.passed.forEach(msg => console.log('   ' + msg))
    console.log()
  }

  if (checks.warnings.length > 0) {
    console.log('⚠️  警告：')
    checks.warnings.forEach(msg => console.log('   ' + msg))
    console.log()
  }

  if (checks.failed.length > 0) {
    console.log('❌ 失败的检查：')
    checks.failed.forEach(msg => console.log('   ' + msg))
    console.log()
  }

  console.log('='.repeat(50))

  if (checks.failed.length === 0) {
    console.log('\n🎉 所有检查通过！可以开始部署。')
    console.log('\n运行以下命令部署到 Vercel：')
    console.log('   vercel --prod\n')
    return 0
  } else {
    console.log('\n❌ 部署检查未通过，请先修复上述问题。\n')
    return 1
  }
}

deployCheck().then(process.exit)
