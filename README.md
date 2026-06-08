# Word Universe

一个基于词汇关系的交互式知识图谱可视化项目。

## 项目概述

Word Universe 是一个可视化展示词汇及其关系的知识图谱系统，帮助用户探索词汇之间的语义联系。

## 技术栈

- **前端**: React + TypeScript + Vite
- **UI**: Ant Design + TailwindCSS
- **图谱**: Cytoscape.js
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel

## 数据规模

- **节点数**: 418 个概念词汇
- **关系数**: 258 个语义关系
- **类别**: astronomy, geography, history, science, mythology, literature, animal, plant 等

## 本地开发

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.local` 文件：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

## 数据导入

如果需要重新导入数据到 Supabase：

1. 确保 Supabase 项目已创建并配置好表结构
2. 配置环境变量（需要 SERVICE_KEY）
3. 运行导入脚本：

```bash
npm run import-data
```

## Supabase 数据库

### 表结构

**nodes 表**:
- id (TEXT, PRIMARY KEY)
- type (TEXT)
- label (TEXT)
- label_cn (TEXT)
- definition (TEXT)
- importance (DECIMAL)
- metadata (JSONB)

**relations 表**:
- id (TEXT, PRIMARY KEY)
- source_id (TEXT, FOREIGN KEY)
- target_id (TEXT, FOREIGN KEY)
- type (TEXT)
- strength (DECIMAL)

### Migration

使用 Supabase CLI 推送 migration：

```bash
supabase link --project-ref your_project_ref
supabase db push
```

## 部署

项目已配置 Vercel 自动部署：

- 生产环境: https://wordun.vercel.app
- 每次推送到 `master` 分支会自动触发部署

## 项目结构

```
word_un/
├── src/                    # 源代码
│   ├── components/         # React 组件
│   ├── services/           # API 服务
│   └── App.tsx             # 主应用
├── api/                    # Vercel Serverless Functions
├── supabase/               # Supabase 配置和数据
│   ├── migrations/         # 数据库迁移
│   └── seed-data/          # 种子数据
├── scripts/                # 工具脚本
└── public/                 # 静态资源
```

## 跨平台开发

### Ubuntu/Linux 开发环境

```bash
# 克隆项目
git clone <your-repo-url>
cd word_un

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 Supabase 配置

# 启动开发
npm run dev
```

### 使用 Claude Code

项目完全兼容 Claude Code CLI 和 AI 辅助开发工具。

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！
