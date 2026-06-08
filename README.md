# Word Universe 🌌

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](CHANGELOG.md)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **知识探索宇宙** - 在探索中自然学习英语

Word Universe 不是传统的背单词工具，而是一个知识探索游乐场。通过点击节点探索知识图谱，在好奇心驱动下自然接触和学习英语单词。

---

## ✨ 核心特性

- 🌐 **知识图谱可视化** - 像星系一样展示单词关系网络
- 🎮 **游戏化探索** - 点击节点，发现新世界
- 🚀 **无限扩展** - 支持 1000+ 节点，AI 持续生成内容
- 💫 **流畅动画** - 节点展开、切换的丝滑体验
- 📱 **响应式设计** - 支持桌面端和移动端

---

## 🏗️ 技术栈

### 前端
- **React 18** + **TypeScript** - 类型安全的组件化开发
- **Vite** - 极速开发构建工具
- **@xyflow/react** - 强大的图谱渲染引擎
- **Zustand** - 轻量级状态管理
- **TanStack Query** - 智能数据缓存
- **Tailwind CSS** - 快速样式开发
- **Framer Motion** - 流畅动画效果

### 后端
- **Vercel Functions** - Serverless API
- **Supabase** - PostgreSQL 数据库（500MB 免费）

### 部署
- **Vercel** - 免费托管，自动 HTTPS
- **GitHub Actions** - CI/CD（未来）

---

## 📁 项目结构

```
word-universe/
├── src/
│   ├── types/           # TypeScript 类型定义
│   ├── components/      # React 组件
│   │   ├── Graph/      # 图谱相关组件
│   │   ├── InfoCard/   # 信息卡片组件
│   │   └── Navigation/ # 导航组件
│   ├── store/          # Zustand 状态管理
│   ├── api/            # API 客户端
│   ├── hooks/          # 自定义 Hooks
│   └── utils/          # 工具函数
├── api/                # Vercel Functions API
├── supabase/           # 数据库迁移和种子数据
├── PRODUCT_DESIGN.md   # 产品设计文档
└── TECH_ARCHITECTURE.md # 技术架构文档
```

---

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 pnpm
- Supabase 账号（免费）

### 步骤 1：克隆项目

```bash
git clone https://github.com/Jongyuu/word_un.git
cd word_un
```

### 步骤 2：安装依赖

```bash
npm install
```

### 步骤 3：配置环境变量

**方法一：使用配置向导（推荐）**

```bash
npm run setup
```

按照提示输入 Supabase 项目信息即可自动配置。

**方法二：手动配置**

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local` 文件，填入你的 Supabase 密钥：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

> 💡 如何获取密钥？查看 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 步骤 4：初始化数据库

1. 创建 Supabase 项目（如果还没有）
2. 运行数据库迁移（参考 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)）
3. 导入种子数据：

```bash
npm run import-data
```

### 步骤 5：测试配置

```bash
npm run test:setup
```

确认看到：
- ✅ 环境变量已配置
- ✅ Supabase 连接成功
- ✅ 节点数量: 425
- ✅ 关系数量: 258+

### 步骤 6：启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`，开始探索知识宇宙！🌌

---

## 🛠️ 可用脚本

```bash
npm run dev           # 启动开发服务器
npm run build         # 构建生产版本
npm run preview       # 预览构建产物

npm run setup         # 环境配置向导
npm run test:setup    # 测试环境配置
npm run import-data   # 导入种子数据
npm run deploy:check  # 部署前检查
```

---

## 🎯 开发路线图

### Phase 1: 项目骨架 ✅ 已完成
- [x] 创建 Vite + React + TypeScript 项目
- [x] 安装依赖包
- [x] 定义 TypeScript 类型
- [x] 配置 Tailwind CSS
- [x] 创建组件骨架

### Phase 2: 数据库设计 ✅ 已完成
- [x] 创建 Supabase 项目
- [x] 设计数据库表结构
- [x] AI 生成种子数据
- [x] 环境配置工具

### Phase 3: 图谱引擎 ✅ 已完成
- [x] 集成 React Flow
- [x] 实现节点切换逻辑
- [x] 按需加载数据

### Phase 4: UI 交互 ✅ 已完成
- [x] 节点信息卡片
- [x] 面包屑导航
- [x] 动画效果

### Phase 5: 数据扩展 ✅ 已完成
- [x] 50+ 初始节点
- [x] AI 生成 425+ 节点（10 个领域并行生成）

### Phase 6: 部署上线（进行中）
- [x] 部署准备完成（代码已推送到 GitHub）
- [ ] 性能优化
- [ ] CI/CD 配置

---

## 📝 设计文档

- [产品设计文档](./PRODUCT_DESIGN.md) - 产品定位、MVP 范围、交互流程
- [技术架构文档](./TECH_ARCHITECTURE.md) - 技术选型、数据库设计、API 设计

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 开源协议

MIT License

---

## 🌟 致谢

本项目使用以下开源项目：
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Flow](https://reactflow.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**让学习像探索宇宙一样充满乐趣！** 🚀
