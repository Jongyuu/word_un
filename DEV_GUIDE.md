# 本地开发指南

## 启动开发环境

### 方法一：使用 Vercel CLI（推荐）

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 登录 Vercel
```bash
vercel login
```

3. 链接项目
```bash
vercel link
```

4. 启动 Vercel 开发服务器（运行 API + 前端）
```bash
vercel dev
```

访问：`http://localhost:3000`

### 方法二：仅前端开发（使用 mock 数据）

如果暂时不需要真实 API：

```bash
npm run dev
```

访问：`http://localhost:5173`

**注意：** 这种方式 API 请求会失败，需要先配置 Supabase 或使用 Vercel Dev。

## 环境变量配置

确保 `.env.local` 文件已配置：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_KEY=eyJxxx...
```

## 常见问题

### API 请求 404
- 确保 Vercel Dev 正在运行
- 检查 `.env.local` 配置是否正确

### 节点数据为空
- 确保 Supabase 数据已导入
- 运行 `npm run import-data` 导入种子数据

### 端口冲突
- Vercel Dev 默认端口 3000
- Vite Dev 默认端口 5173
- 如有冲突，可以修改端口
