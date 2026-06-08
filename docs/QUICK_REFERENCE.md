# Word Universe 快速参考 🚀

## 🔧 常用命令

### 开发
```bash
npm run dev          # 启动开发服务器 (http://localhost:5173)
npm run build        # 构建生产版本
npm run preview      # 预览构建产物
```

### 环境配置
```bash
npm run setup        # 交互式配置向导
npm run test:setup   # 测试环境配置
```

### 数据管理
```bash
npm run import-data  # 导入种子数据
npm run backup       # 备份数据库
npm run stats        # 数据统计
npm run validate     # 数据验证
```

### 质量检查
```bash
npx tsc --noEmit     # TypeScript 类型检查
npm run perf         # 性能分析
npm run deploy:check # 部署前检查
```

---

## 📁 项目结构速查

```
src/
├── components/      # React 组件
│   ├── Graph/      # 图谱组件
│   ├── InfoCard/   # 信息卡片
│   └── Navigation/ # 导航组件
├── hooks/          # 自定义 Hooks
├── api/            # API 客户端
├── store/          # Zustand 状态
├── types/          # TypeScript 类型
└── utils/          # 工具函数
```

---

## 🎯 核心 API

### GraphCanvas 组件
```typescript
import { GraphCanvas } from '@/components/Graph/GraphCanvas'

<GraphCanvas />
```

### 数据 Hooks
```typescript
import { useInitialGraph, useNodeGraph } from '@/hooks/useGraphData'

const { data, isLoading } = useInitialGraph()
const { data } = useNodeGraph(nodeId)
```

### API 客户端
```typescript
import { graphApi } from '@/api/graphApi'

await graphApi.getInitialGraph()
await graphApi.getNodeGraph(nodeId)
```

---

## 🎨 主题颜色

```javascript
const nodeColors = {
  word: '#3B82F6',    // 蓝色
  topic: '#8B5CF6',   // 紫色
  root: '#F59E0B',    // 橙色
  concept: '#10B981'  // 绿色
}

const relationColors = {
  contains: '#3B82F6',  // 蓝色
  related: '#10B981',   // 绿色
  derived: '#8B5CF6',   // 紫色
  synonym: '#F59E0B',   // 橙色
  antonym: '#EF4444',   // 红色
  used_in: '#6366F1'    // 靛蓝
}
```

---

## 🗄️ 数据库表

### nodes 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键 |
| type | TEXT | 节点类型 |
| label | TEXT | 英文标签 |
| label_cn | TEXT | 中文标签 |
| definition | TEXT | 定义 |
| importance | NUMERIC | 重要性 (0-1) |
| metadata | JSONB | 元数据 |

### relations 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键 |
| source_id | TEXT | 源节点 ID |
| target_id | TEXT | 目标节点 ID |
| type | TEXT | 关系类型 |
| strength | NUMERIC | 强度 (0-1) |

---

## 🔑 环境变量

```env
# 前端使用（VITE_ 前缀暴露给浏览器）
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# 后端使用（Vercel Functions）
SUPABASE_SERVICE_KEY=eyJxxx...
```

---

## 🚀 部署命令

```bash
# 部署前检查
npm run deploy:check

# Vercel 部署
vercel          # 预览部署
vercel --prod   # 生产部署
```

---

## 🐛 常见问题

### API 请求 404
- 检查环境变量是否配置
- 确认 Vercel Dev 正在运行

### 节点数据为空
- 运行 `npm run import-data`
- 检查 Supabase 连接

### TypeScript 错误
- 运行 `npx tsc --noEmit`
- 查看具体错误信息

---

## 📚 文档导航

- [README.md](../README.md) - 项目说明
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南
- [CHANGELOG.md](../CHANGELOG.md) - 更新日志
- [PROJECT_PROGRESS.md](../PROJECT_PROGRESS.md) - 开发进度
- [PRODUCT_DESIGN.md](../PRODUCT_DESIGN.md) - 产品设计
- [TECH_ARCHITECTURE.md](../TECH_ARCHITECTURE.md) - 技术架构

---

**提示**: 将此文档加入书签以便快速查阅！ 📌
