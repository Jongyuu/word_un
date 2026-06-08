# Word Universe 🌌

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

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

---

## 🎯 开发路线图

### Phase 1: 项目骨架 ✅ 已完成
- [x] 创建 Vite + React + TypeScript 项目
- [x] 安装依赖包
- [x] 定义 TypeScript 类型
- [x] 配置 Tailwind CSS
- [x] 创建组件骨架

### Phase 2: 数据库设计（进行中）
- [ ] 创建 Supabase 项目
- [ ] 设计数据库表结构
- [ ] AI 生成种子数据

### Phase 3: 图谱引擎
- [ ] 集成 React Flow
- [ ] 实现节点切换逻辑
- [ ] 按需加载数据

### Phase 4: UI 交互
- [ ] 节点信息卡片
- [ ] 面包屑导航
- [ ] 动画效果

### Phase 5: 数据扩展
- [ ] AI 生成 500+ 节点

### Phase 6: 部署上线
- [ ] 部署到 Vercel
- [ ] 性能优化

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
