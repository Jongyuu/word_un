# 开发者入门指南 👋

欢迎加入 Word Universe 项目！本指南将帮助您快速上手。

---

## 📋 准备工作清单

在开始之前，请确保您已经：

- [ ] 安装了 Node.js 18+ 和 npm
- [ ] 安装了 Git
- [ ] 拥有 GitHub 账号
- [ ] 注册了 Supabase 账号（免费）
- [ ] 熟悉 React、TypeScript 基础
- [ ] 了解知识图谱的基本概念

---

## 🚀 第一天：环境搭建

### 1. 克隆项目（5 分钟）

```bash
git clone https://github.com/Jongyuu/word_un.git
cd word_un
```

### 2. 安装依赖（2-3 分钟）

```bash
npm install
```

等待依赖安装完成，项目会下载约 300MB 的 node_modules。

### 3. 配置环境（10 分钟）

#### 方法一：使用配置向导（推荐）
```bash
npm run setup
```

按照提示输入：
1. Supabase Project URL
2. Supabase Anon Key
3. Supabase Service Key（可选）

#### 方法二：手动配置
复制 `.env.example` 为 `.env.local`，然后填写密钥。

**获取 Supabase 密钥：**
1. 访问 https://supabase.com/dashboard
2. 创建新项目（或选择现有项目）
3. 进入 Settings → API
4. 复制 URL 和密钥

### 4. 初始化数据库（15 分钟）

#### 运行迁移
在 Supabase Dashboard 的 SQL Editor 中：
1. 点击 "New query"
2. 复制 `supabase/migrations/001_initial_schema.sql` 的内容
3. 点击 "Run"

#### 导入种子数据
```bash
npm run import-data
```

等待导入完成，应该看到：
- ✅ 成功导入 50 个节点
- ✅ 成功导入 258 个关系

### 5. 验证环境（2 分钟）

```bash
npm run test:setup
```

应该看到：
- ✅ 环境变量已配置
- ✅ Supabase 连接成功
- ✅ 节点数量: 50
- ✅ 关系数量: 258

### 6. 启动项目（1 分钟）

```bash
npm run dev
```

访问 http://localhost:5173，您应该能看到知识图谱！

---

## 🎓 第二天：熟悉代码库

### 项目结构概览

```
word_un/
├── src/
│   ├── components/      # React 组件
│   │   ├── Graph/      # 图谱相关（核心）
│   │   ├── InfoCard/   # 信息展示
│   │   └── Navigation/ # 导航组件
│   ├── hooks/          # 自定义 Hooks
│   ├── api/            # API 客户端
│   ├── store/          # Zustand 状态管理
│   ├── types/          # TypeScript 类型
│   └── utils/          # 工具函数
├── api/                # Vercel Functions（后端）
├── supabase/           # 数据库相关
└── docs/               # 项目文档
```

### 核心文件必读

**从这些文件开始：**
1. `src/App.tsx` - 应用入口
2. `src/components/Graph/GraphCanvas.tsx` - 图谱核心组件
3. `src/hooks/useGraphData.ts` - 数据获取逻辑
4. `src/types/index.ts` - 类型定义
5. `api/graph/initial.ts` - API 端点

### 运行一些命令

```bash
# 查看数据统计
npm run stats

# 检查代码类型
npx tsc --noEmit

# 构建项目
npm run build

# 性能分析
npm run perf
```

### 阅读文档

- [ ] [PRODUCT_DESIGN.md](../PRODUCT_DESIGN.md) - 了解产品设计思路
- [ ] [TECH_ARCHITECTURE.md](../TECH_ARCHITECTURE.md) - 理解技术架构
- [ ] [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - 快速参考

---

## 🔨 第三天：开始开发

### 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

### 开发流程

1. **修改代码** - 使用您喜欢的编辑器
2. **查看效果** - 开发服务器自动热重载
3. **类型检查** - `npx tsc --noEmit`
4. **提交代码** - 遵循 Conventional Commits

### 提交规范

```bash
git add .
git commit -m "feat: 添加搜索功能"
git push origin feature/your-feature-name
```

提交类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

### 创建 Pull Request

1. 在 GitHub 上创建 PR
2. 填写 PR 模板（自动填充）
3. 等待代码审查

---

## 🐛 常见问题

### Q: npm install 失败？
**A**: 尝试：
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: TypeScript 报错？
**A**: 运行 `npx tsc --noEmit` 查看详细错误

### Q: 图谱不显示数据？
**A**: 
1. 检查环境变量
2. 运行 `npm run test:setup`
3. 确认数据已导入

### Q: API 请求 404？
**A**: 
1. 检查 Vercel Dev 是否运行
2. 确认环境变量配置正确

---

## 📚 推荐学习资源

### React Flow
- 官方文档：https://reactflow.dev/
- 教程：https://reactflow.dev/learn

### Supabase
- 官方文档：https://supabase.com/docs
- JavaScript 客户端：https://supabase.com/docs/reference/javascript

### TypeScript
- 官方手册：https://www.typescriptlang.org/docs/
- React + TypeScript：https://react-typescript-cheatsheet.netlify.app/

---

## 🎯 第一个任务建议

选择一个简单的任务开始：

1. **UI 改进**
   - 调整节点颜色
   - 修改动画效果
   - 优化信息卡片样式

2. **功能增强**
   - 添加节点搜索框
   - 实现收藏功能
   - 添加导出图谱功能

3. **数据扩展**
   - 添加新的节点
   - 创建新的关系
   - 扩展节点元数据

---

## 🤝 获取帮助

如果遇到问题：

1. 查看 [常见问题](./QUICK_REFERENCE.md#常见问题)
2. 搜索现有 [Issues](https://github.com/Jongyuu/word_un/issues)
3. 创建新 Issue 描述问题
4. 在 PR 中标记 @Jongyuu

---

## ✅ 入门完成检查

完成以下任务表示您已经准备好开始贡献：

- [ ] 环境配置成功
- [ ] 项目能正常运行
- [ ] 理解项目结构
- [ ] 阅读核心文档
- [ ] 运行过所有工具命令
- [ ] 创建了测试分支
- [ ] 熟悉提交规范

---

**欢迎加入 Word Universe！期待您的贡献！** 🎉
