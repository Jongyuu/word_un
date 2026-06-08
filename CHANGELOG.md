# 更新日志

本文档记录了 Word Universe 项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.1.0] - 2024-12-08

### 新增
- 🎉 项目初始化
- 📦 完整的技术栈配置（React 18 + TypeScript + Vite）
- 🗄️ Supabase 数据库集成
- 🌐 React Flow 图谱可视化引擎
- 🎨 Tailwind CSS 样式系统
- 📊 50 个初始节点 + 258 个关系
- 🔌 Vercel Functions API 端点
- 🎯 完整的 UI 交互组件
- 🛠️ 开发工具链（setup, backup, stats, validate 等）
- 📝 完整的项目文档

### 功能特性

#### 核心功能
- ✨ 知识图谱可视化展示
- 🖱️ 单击节点查看详情
- 🔄 双击节点切换中心
- 🧭 面包屑导航和历史记录
- 🔙 返回按钮
- 🎨 自定义节点样式（类型颜色区分）
- 🔗 自定义连线样式（关系类型颜色编码）
- 📱 响应式设计

#### UI 组件
- NodeInfoCard - 节点信息抽屉卡片
- CustomNode - 自定义节点组件
- CustomEdge - 自定义连线组件
- Breadcrumb - 面包屑导航
- BackButton - 返回按钮
- RelationTags - 关系标签
- LoadingSpinner - 加载动画

#### 开发工具
- `npm run setup` - 环境配置向导
- `npm run test:setup` - 环境测试
- `npm run import-data` - 数据导入
- `npm run backup` - 数据备份
- `npm run stats` - 数据统计
- `npm run deploy:check` - 部署检查
- `npm run validate` - 数据验证
- `npm run perf` - 性能检查

### 技术架构
- **前端框架**: React 18.3.1
- **构建工具**: Vite 5.4.21
- **语言**: TypeScript 5.6.2
- **图谱引擎**: @xyflow/react 12.11.0
- **状态管理**: Zustand 5.0.14
- **数据缓存**: TanStack Query 5.101.0
- **样式**: Tailwind CSS 3.4.19
- **动画**: Framer Motion 11.18.2
- **数据库**: Supabase 2.107.0
- **部署**: Vercel

### 文档
- README.md - 项目说明和快速开始
- PRODUCT_DESIGN.md - 产品设计文档
- TECH_ARCHITECTURE.md - 技术架构文档
- SUPABASE_SETUP.md - 数据库配置指南
- DEV_GUIDE.md - 本地开发指南
- PROJECT_PROGRESS.md - 项目进度追踪
- CONTRIBUTING.md - 贡献指南
- CHANGELOG.md - 更新日志

### 基础设施
- GitHub Actions CI/CD 配置
- Issue 模板（Bug 报告、功能请求）
- PR 模板
- MIT License
- 完整的 package.json 元数据

---

## [未发布]

### 计划中
- [ ] 数据扩展（500+ 节点）
- [ ] 节点搜索功能
- [ ] 收藏/历史记录
- [ ] 导出图谱功能
- [ ] 多语言支持
- [ ] 性能优化
- [ ] 单元测试
- [ ] E2E 测试

---

[0.1.0]: https://github.com/Jongyuu/word_un/releases/tag/v0.1.0
