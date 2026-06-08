# Word Universe - Ubuntu 开发环境快速开始

## 项目信息

- **GitHub**: https://github.com/Jongyuu/word_un
- **在线地址**: https://wordun.vercel.app
- **Supabase 项目**: yowzlvrylcqnjflpxflo

## 在 Ubuntu 上克隆并开始开发

### 1. 克隆项目

```bash
git clone https://github.com/Jongyuu/word_un.git
cd word_un
```

### 2. 安装依赖

```bash
# 安装 Node.js (如果还没有)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装项目依赖
npm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local
nano .env.local
```

填入以下配置：

```env
VITE_SUPABASE_URL=https://yowzlvrylcqnjflpxflo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd3psdnJ5bGNxbmpmbHB4ZmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjM1NTcsImV4cCI6MjA5NjQ5OTU1N30.DBVlYt7vNwsOkMPvvRhjuVI0C-IPA4odV-xEE_Vxg-U
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 5. 使用 Claude Code (可选)

```bash
# 安装 Claude Code CLI
npm install -g @anthropic-ai/claude-code

# 启动 Claude Code
claude
```

## 项目结构

```
word_un/
├── src/                    # React 源代码
│   ├── components/         # UI 组件
│   ├── services/          # Supabase 服务
│   └── App.tsx            # 主应用
├── api/                   # Vercel Serverless API
├── supabase/              # 数据库配置
│   ├── migrations/        # 数据库迁移 SQL
│   └── seed-data/         # 种子数据 (418 nodes + 258 relations)
├── scripts/               # 工具脚本
└── public/                # 静态资源
```

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览生产版本
npm run preview

# 类型检查
npm run type-check

# 数据导入 (需要 SERVICE_KEY)
npm run import-data
```

## Supabase 数据库

已配置并导入数据：
- **418 个节点** (概念词汇)
- **258 个关系** (语义连接)

表结构在 `supabase/migrations/20260608233110_init_word_universe.sql`

## Vercel 部署

项目已配置自动部署：
- 推送到 `master` 分支自动触发
- 生产环境: https://wordun.vercel.app

## 注意事项

1. **敏感信息**: 不要提交 `.env.local` 到 Git
2. **数据完整性**: `nodes-all.json` 已去重，包含 418 个唯一节点
3. **跨平台**: 项目在 Windows 和 Ubuntu 上均可运行

## 故障排除

### 网站显示空白
- 检查浏览器控制台错误
- 确认 Supabase 环境变量正确
- 确认数据库中有数据: 访问 https://supabase.com/dashboard/project/yowzlvrylcqnjflpxflo

### 导入数据失败
- 确保使用 `SUPABASE_SERVICE_KEY` (不是 ANON_KEY)
- 检查网络连接
- 查看 Supabase 日志

## 获取帮助

- GitHub Issues: https://github.com/Jongyuu/word_un/issues
- Supabase Dashboard: https://supabase.com/dashboard/project/yowzlvrylcqnjflpxflo

---

祝开发顺利！🚀
