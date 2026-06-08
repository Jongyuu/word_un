# Word Universe v0.1.0 🌌

**发布日期**: 2024-12-08

## 🎉 首个正式版本

Word Universe 是一个知识探索宇宙，通过交互式知识图谱帮助用户在探索中自然学习英语。

---

## ✨ 核心特性

### 🌐 知识图谱可视化
- 基于 React Flow 的强大图谱引擎
- 圆形布局算法，节点环绕中心展示
- 支持 1000+ 节点的流畅渲染
- 动态加载，按需获取数据

### 🎮 交互体验
- **单击节点** - 查看详细信息
- **双击节点** - 切换为新的中心节点
- **面包屑导航** - 追踪探索路径
- **返回按钮** - 回到上一个节点
- **拖拽和缩放** - 自由探索图谱

### 🎨 视觉设计
- 节点类型颜色区分（word/topic/root/concept）
- 关系类型颜色编码（6 种关系类型）
- 节点大小反映重要性
- 流畅的动画效果

### 📊 数据内容
- **50 个核心节点** - 涵盖 8 大主题
  - 天文、地理、历史、科学
  - 神话、文学、动物、植物
- **258 个关系** - 6 种关系类型
  - contains（包含）、related（相关）
  - derived（派生）、synonym（同义）
  - antonym（反义）、used_in（应用）

---

## 🛠️ 开发工具

### 环境配置
```bash
npm run setup        # 交互式环境配置向导
npm run test:setup   # 测试 Supabase 连接
```

### 数据管理
```bash
npm run import-data  # 导入种子数据
npm run backup       # 备份数据库
npm run stats        # 数据统计分析
npm run validate     # 数据完整性验证
```

### 质量检查
```bash
npm run build        # 构建生产版本
npm run perf         # 性能检查
npm run deploy:check # 部署前检查
```

---

## 📚 技术栈

- **前端**: React 18 + TypeScript + Vite
- **图谱**: @xyflow/react 12.11
- **状态**: Zustand + TanStack Query
- **样式**: Tailwind CSS + Framer Motion
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel Functions

---

## 📖 文档

- [README.md](../README.md) - 快速开始
- [PRODUCT_DESIGN.md](../PRODUCT_DESIGN.md) - 产品设计
- [TECH_ARCHITECTURE.md](../TECH_ARCHITECTURE.md) - 技术架构
- [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) - 数据库配置
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南
- [CHANGELOG.md](../CHANGELOG.md) - 完整变更日志

---

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/Jongyuu/word_un.git
cd word_un
npm install
```

### 2. 配置环境
```bash
npm run setup
```

### 3. 启动开发
```bash
npm run dev
```

访问 http://localhost:5173 开始探索！

---

## 🎯 下一步计划

- [ ] 数据扩展至 500+ 节点
- [ ] 节点搜索功能
- [ ] 收藏和历史记录
- [ ] 多语言支持
- [ ] 性能优化
- [ ] 单元测试和 E2E 测试

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

查看 [贡献指南](../CONTRIBUTING.md) 了解更多。

---

## 📄 开源协议

MIT License - 详见 [LICENSE](../LICENSE)

---

**让学习像探索宇宙一样充满乐趣！** 🚀
