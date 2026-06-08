# Word Universe 技术架构文档

> **版本：** v2.0 - 生产级大规模数据架构  
> **更新日期：** 2026-06-08  
> **架构类型：** Vercel + Supabase 全栈方案

---

## 1. 架构调整说明

### 为什么调整架构？

**原方案（v1.0）问题：**
- ❌ 静态 JSON 只能支持 100 个节点
- ❌ 纯前端无法动态扩展内容
- ❌ 全量加载会导致性能瓶颈
- ❌ 无法支持用户数据（进度跟踪）

**新方案（v2.0）目标：**
- ✅ 支持 **1000+ 节点**（可扩展到万级）
- ✅ **免费部署**（Vercel + Supabase 免费额度）
- ✅ **按需加载**（只加载邻居节点）
- ✅ **AI 持续生成**（后台扩展数据）
- ✅ **为未来功能打地基**（用户系统、搜索、推荐）

---

## 2. 技术栈选型

### 前端技术栈

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| React | 18+ | UI 框架 | 组件化开发 |
| TypeScript | 5+ | 类型系统 | 类型安全 |
| Vite | 6+ | 构建工具 | 快速开发 |
| @xyflow/react | 12+ | 图谱引擎 | 节点可视化 |
| Zustand | 5+ | 状态管理 | 轻量级 |
| TanStack Query | 5+ | 数据请求 | 缓存和请求管理 |
| Tailwind CSS | 3+ | 样式方案 | 快速开发 |
| Framer Motion | 11+ | 动画库 | 流畅动画 |

### 后端技术栈

| 技术 | 用途 | 免费额度 |
|------|------|---------|
| Vercel Functions | API 层 | 100GB 带宽/月 |
| Supabase | PostgreSQL 数据库 | 500MB 存储 |
| Supabase Auth | 用户认证（后期） | 50K MAU |

---

## 3. 数据库设计

### 表结构设计

#### nodes（节点表）

```sql
CREATE TABLE nodes (
  id TEXT PRIMARY KEY,                    -- 节点唯一标识
  type TEXT NOT NULL,                     -- 节点类型（word/topic/root/concept等）
  label TEXT NOT NULL,                    -- 英文名称
  label_cn TEXT,                          -- 中文名称
  definition TEXT NOT NULL,               -- 定义/释义
  importance NUMERIC DEFAULT 0.5,         -- 重要性权重（0-1）
  metadata JSONB,                         -- 扩展元数据（词源、分类、标签等）
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_nodes_type ON nodes(type);
CREATE INDEX idx_nodes_importance ON nodes(importance DESC);
CREATE INDEX idx_nodes_label ON nodes(label);
CREATE INDEX idx_nodes_metadata ON nodes USING GIN(metadata);
```

**设计说明：**
- `id`：使用有意义的字符串（如 "planet"），方便调试
- `importance`：影响节点大小和初始显示优先级
- `metadata`：JSONB 类型，灵活存储扩展信息

---

#### relations（关系表）

```sql
CREATE TABLE relations (
  id TEXT PRIMARY KEY,                    -- 关系唯一标识
  source_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                     -- 关系类型（synonym/antonym/derived等）
  strength NUMERIC DEFAULT 0.5,           -- 关系强度（0-1）
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_relations_source ON relations(source_id);
CREATE INDEX idx_relations_target ON relations(target_id);
CREATE INDEX idx_relations_type ON relations(type);

-- 唯一约束（防止重复关系）
CREATE UNIQUE INDEX idx_relations_unique 
  ON relations(source_id, target_id, type);
```

**设计说明：**
- 使用外键确保数据完整性
- `strength`：影响关系显示优先级和视觉权重
- 双向索引：支持快速查询邻居节点

---

#### user_progress（用户进度表 - 后期扩展）

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id TEXT REFERENCES nodes(id) ON DELETE CASCADE,
  visited_at TIMESTAMP DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_node ON user_progress(node_id);
```

---

## 4. API 设计

### API 端点列表

| 端点 | 方法 | 用途 | 响应时间目标 |
|------|------|------|-------------|
| `/api/graph/initial` | GET | 获取初始起点节点 | <500ms |
| `/api/graph/center/:nodeId` | GET | 获取节点及其邻居 | <300ms |
| `/api/nodes/search?q=xxx` | GET | 搜索节点（后期） | <500ms |
| `/api/nodes/:id` | GET | 获取单个节点详情 | <200ms |

---

### API 详细设计

#### GET `/api/graph/initial`

**用途：** 获取应用启动时的初始节点

**响应示例：**
```json
{
  "centerNode": {
    "id": "universe",
    "type": "concept",
    "label": "universe",
    "labelCn": "宇宙",
    "definition": "All existing matter and space considered as a whole",
    "importance": 1.0,
    "metadata": {
      "etymology": "Latin: universum",
      "category": "astronomy"
    }
  },
  "neighbors": [
    {
      "node": {
        "id": "planet",
        "type": "word",
        "label": "planet",
        "labelCn": "行星",
        "definition": "A celestial body moving in orbit around a star",
        "importance": 0.8
      },
      "relation": {
        "type": "contains",
        "strength": 0.9
      }
    }
  ]
}
```

**SQL 查询逻辑：**
```sql
-- 1. 获取 importance 最高的节点作为中心
SELECT * FROM nodes ORDER BY importance DESC LIMIT 1;

-- 2. 查询该节点的邻居（一级关系）
SELECT 
  n.*,
  r.type as relation_type,
  r.strength as relation_strength
FROM nodes n
JOIN relations r ON r.target_id = n.id
WHERE r.source_id = $1
ORDER BY r.strength DESC, n.importance DESC
LIMIT 12;
```

---

#### GET `/api/graph/center/:nodeId`

**用途：** 用户点击节点后，获取新的中心节点及其邻居

**参数：**
- `nodeId`：目标节点 ID

**响应格式：** 同 `/api/graph/initial`

**性能优化：**
- 限制邻居数量为 12 个
- 按 `relation.strength` 和 `node.importance` 排序
- 使用数据库索引加速查询

---

## 5. 数据加载策略

### 按需加载机制

```
用户进入
  ↓
加载 /api/graph/initial
  ↓
显示中心节点 + 12 个邻居
  ↓
用户点击节点 A
  ↓
加载 /api/graph/center/A
  ↓
卸载旧节点，渲染新节点 + 新邻居
```

**关键优化：**
- ✅ 只渲染当前可见的 13 个节点（1个中心 + 12个邻居）
- ✅ React Query 缓存已访问节点（5分钟）
- ✅ 用户返回时直接使用缓存，无需请求

---

## 6. 性能优化策略

### 前端性能优化

#### 6.1 React Flow 优化
```typescript
<ReactFlow
  nodes={visibleNodes}
  edges={visibleEdges}
  fitView
  minZoom={0.5}
  maxZoom={2}
  nodesDraggable={true}
  nodesConnectable={false}    // 禁用连线编辑
  elementsSelectable={false}  // 禁用多选
  zoomOnScroll={true}
  panOnScroll={false}
  // 性能关键配置
  proOptions={{ hideAttribution: true }}
  defaultViewport={{ x: 0, y: 0, zoom: 1 }}
/>
```

#### 6.2 React Query 缓存策略
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['graph', nodeId],
  queryFn: () => fetchGraphData(nodeId),
  staleTime: 5 * 60 * 1000,      // 5分钟内数据不过期
  cacheTime: 10 * 60 * 1000,     // 缓存保留10分钟
  retry: 2                        // 失败重试2次
})
```

#### 6.3 组件懒加载
```typescript
const NodeInfoCard = lazy(() => import('@/components/InfoCard/NodeInfoCard'))
```

---

### 后端性能优化

#### 6.1 SQL 查询优化
```sql
-- 使用 CTE 优化复杂查询
WITH neighbor_relations AS (
  SELECT target_id, type, strength
  FROM relations
  WHERE source_id = $1
  ORDER BY strength DESC
  LIMIT 12
)
SELECT n.*, nr.type as relation_type, nr.strength
FROM nodes n
JOIN neighbor_relations nr ON nr.target_id = n.id;
```

#### 6.2 Vercel Edge Functions（可选）
将高频 API 部署到 Edge，响应时间可降低 50%

```typescript
// api/graph/center/[nodeId].ts
export const config = {
  runtime: 'edge'  // 使用 Edge Runtime
}
```

---

## 7. 部署架构

### 部署流程

```
GitHub Repository
  ↓
Vercel 自动部署
  ├─ 前端静态资源（CDN）
  └─ Serverless Functions（API）
  ↓
Supabase PostgreSQL
```

### 环境变量配置

#### Vercel 环境变量
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# API 端环境变量
SUPABASE_SERVICE_KEY=eyJxxx...  # 后端用（不暴露给前端）
```

#### .env.local（本地开发）
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 8. 成本分析

### 免费额度详情

#### Vercel Free Plan
| 项目 | 额度 | 预计使用 | 足够性 |
|------|------|---------|--------|
| 带宽 | 100GB/月 | ~5GB/月 | ✅ 20倍富余 |
| 构建时间 | 6000分钟/月 | ~10分钟/月 | ✅ 充足 |
| Serverless 调用 | 无限 | ~10K/月 | ✅ 完全够用 |
| 部署 | 无限 | ~50/月 | ✅ 够用 |

#### Supabase Free Plan
| 项目 | 额度 | 预计使用 | 足够性 |
|------|------|---------|--------|
| 数据库存储 | 500MB | ~50MB（1万节点）| ✅ 10倍富余 |
| 数据传输 | 2GB/月 | ~1GB/月 | ✅ 2倍富余 |
| API 请求 | 无限 | ~50K/月 | ✅ 完全够用 |

**结论：完全免费可行，且有很大增长空间**

---

## 9. 数据扩展计划

### AI 数据生成策略

#### 第一批：种子节点（50个）
- 人工精选核心单词
- 涵盖 8 大主题：天文、地理、历史、科学、神话、文学、动物、植物
- 每个节点人工审核质量

#### 第二批：AI 扩展（500个）
- 使用 Claude 为每个种子节点生成 5-10 个关联节点
- 批量生成，人工抽查 20% 质量

#### 第三批：持续扩展（1000+）
- 用户探索时，后台识别"热门路径"
- AI 自动生成更多节点填充路径
- 实时扩展数据库

---

## 10. 技术风险与缓解

| 风险 | 影响 | 概率 | 缓解方案 |
|------|------|------|---------|
| Supabase 免费额度超限 | 高 | 低 | 监控用量，超80%升级或优化查询 |
| API 响应慢 | 中 | 中 | 使用 Edge Functions，添加 CDN 缓存 |
| React Flow 性能不足 | 中 | 低 | 只渲染可见节点，启用虚拟化 |
| AI 生成数据质量差 | 中 | 中 | 建立质量评分机制，人工抽查 |
| 数据库查询慢 | 中 | 低 | 索引优化，查询分析 |

---

## 11. 架构对比总结

| 维度 | v1.0（原方案） | v2.0（新方案） |
|------|---------------|---------------|
| 数据规模 | 100 节点 | 1000+ 节点 |
| 数据存储 | 静态 JSON | PostgreSQL |
| 加载方式 | 全量加载 | 按需加载 |
| 后端 | 无 | Vercel Functions |
| 用户系统 | 不支持 | 支持（Supabase Auth）|
| 搜索功能 | 不支持 | 支持（全文搜索）|
| 可扩展性 | 差 | 强 |
| 部署成本 | 免费 | 免费 |
| 开发时间 | 7 天 | 10 天 |

---

**文档结束 - 准备开始开发**
