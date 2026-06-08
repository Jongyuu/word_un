# 贡献指南

感谢您对 Word Universe 项目的关注！本文档将帮助您参与项目开发。

## 📋 开发前准备

### 环境要求
- Node.js 18+
- npm 或 pnpm
- Git
- Supabase 账号（免费）

### 初始化项目
```bash
git clone https://github.com/Jongyuu/word_un.git
cd word_un
npm install
npm run setup  # 配置环境变量
```

---

## 🔨 开发流程

### 1. 创建功能分支
```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/bug-description
```

### 2. 开发和测试
```bash
npm run dev           # 启动开发服务器
npm run test:setup    # 测试环境配置
npx tsc --noEmit      # 类型检查
```

### 3. 提交代码
```bash
git add .
git commit -m "feat: 添加新功能"
git push origin feature/your-feature-name
```

### 4. 创建 Pull Request
- 在 GitHub 上创建 PR
- 填写 PR 描述模板
- 等待代码审查

---

## 📝 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建工具或依赖更新

### 示例
```bash
feat(graph): 添加节点搜索功能
fix(api): 修复节点数据加载错误
docs(readme): 更新快速开始指南
```

---

## 🏗️ 项目结构

```
word_un/
├── src/
│   ├── components/       # React 组件
│   ├── hooks/           # 自定义 Hooks
│   ├── api/             # API 客户端
│   ├── store/           # 状态管理
│   ├── types/           # TypeScript 类型
│   └── utils/           # 工具函数
├── api/                 # Vercel Functions
├── supabase/           # 数据库相关
│   ├── migrations/     # 数据库迁移
│   └── seed-data/      # 种子数据
├── scripts/            # 开发脚本
└── public/             # 静态资源
```

---

## 🎨 代码规范

### TypeScript
- 使用严格模式
- 所有函数和组件必须有类型定义
- 避免使用 `any` 类型

### React 组件
- 使用函数组件和 Hooks
- 组件名使用 PascalCase
- 文件名与组件名一致

### 样式
- 使用 Tailwind CSS
- 遵循响应式设计原则
- 保持样式简洁和可维护

### 命名规范
- 变量/函数: camelCase
- 组件: PascalCase
- 常量: UPPER_SNAKE_CASE
- 文件名: kebab-case 或 PascalCase

---

## ✅ PR 检查清单

提交 PR 前请确认：

- [ ] 代码通过 TypeScript 类型检查
- [ ] 代码通过 ESLint 检查
- [ ] 项目能成功构建 (`npm run build`)
- [ ] 添加了必要的注释和文档
- [ ] 遵循了提交规范
- [ ] 更新了相关文档（如有需要）
- [ ] 测试了新功能（如有新功能）

---

## 🐛 报告问题

发现 Bug？请提供以下信息：

1. **问题描述**：清晰描述问题
2. **复现步骤**：如何触发问题
3. **预期行为**：应该发生什么
4. **实际行为**：实际发生了什么
5. **环境信息**：
   - 浏览器版本
   - Node.js 版本
   - 操作系统

---

## 💡 功能建议

有好的想法？欢迎提交 Feature Request：

1. 描述功能需求
2. 说明使用场景
3. 提供实现建议（可选）
4. 附上相关参考（可选）

---

## 📚 参考资源

- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Flow](https://reactflow.dev/)
- [Supabase 文档](https://supabase.com/docs)

---

## 📄 开源协议

本项目采用 MIT 协议，详见 [LICENSE](./LICENSE) 文件。

---

**感谢您的贡献！** 🙌
