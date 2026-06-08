// 环境变量验证工具

interface EnvConfig {
  supabaseUrl: string
  supabaseAnonKey: string
}

class EnvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvError'
  }
}

/**
 * 验证并获取必需的环境变量
 * @throws {EnvError} 如果必需的环境变量缺失
 */
export function getEnvConfig(): EnvConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const missingVars: string[] = []

  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url_here') {
    missingVars.push('VITE_SUPABASE_URL')
  }

  if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
    missingVars.push('VITE_SUPABASE_ANON_KEY')
  }

  if (missingVars.length > 0) {
    throw new EnvError(
      `缺少必需的环境变量：${missingVars.join(', ')}\n\n` +
      `请按照以下步骤配置：\n` +
      `1. 复制 .env.example 为 .env.local\n` +
      `2. 在 .env.local 中填入您的 Supabase 配置\n` +
      `3. 重启开发服务器\n\n` +
      `详细说明请参考 README.md`
    )
  }

  // 验证 URL 格式
  try {
    new URL(supabaseUrl)
  } catch {
    throw new EnvError(
      `VITE_SUPABASE_URL 格式不正确：${supabaseUrl}\n` +
      `应该是完整的 URL，例如：https://xxxxx.supabase.co`
    )
  }

  return {
    supabaseUrl,
    supabaseAnonKey
  }
}

/**
 * 在应用启动时验证环境变量
 */
export function validateEnv(): void {
  try {
    getEnvConfig()
    console.log('✅ 环境变量验证通过')
  } catch (error) {
    if (error instanceof EnvError) {
      console.error('❌ 环境变量配置错误：\n\n' + error.message)
      throw error
    }
    throw error
  }
}
