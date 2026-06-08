# Supabase 设置指南

本指南将帮助您配置 Supabase 数据库并导入种子数据。

## 步骤 1：创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 填写项目信息：
   - Name: `word-universe`
   - Database Password: （设置强密码并保存）
   - Region: 选择距离您最近的区域
4. 等待项目创建完成（约 2 分钟）

## 步骤 2：获取 API 密钥

1. 在项目页面，点击左侧 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJxxx...`（用于前端）
   - **service_role key**: `eyJxxx...`（用于后端，保密！）

## 步骤 3：配置本地环境变量

1. 打开项目根目录的 `.env.local` 文件
2. 填入刚才复制的密钥：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...your-anon-key...
SUPABASE_SERVICE_KEY=eyJxxx...your-service-key...
```

## 步骤 4：运行数据库迁移

### 方法一：使用 Supabase SQL Editor（推荐）

1. 在 Supabase Dashboard，点击左侧 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase/migrations/001_initial_schema.sql` 的内容
4. 粘贴到 SQL Editor 并点击 "Run"
5. 确认看到成功消息

### 方法二：使用 Supabase CLI（可选）

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

## 步骤 5：导入种子数据

### 使用 Supabase Table Editor

1. 在 Supabase Dashboard，点击 "Table Editor"
2. 选择 `nodes` 表
3. 点击 "Insert" → "Import data from CSV/JSON"
4. 选择 `supabase/seed-data/nodes.json`
5. 点击 "Import"
6. 重复步骤 2-5，导入 `relations.json` 到 `relations` 表

### 使用 SQL（备选方案）

```sql
-- 手动插入几个测试节点
INSERT INTO nodes (id, type, label, label_cn, definition, importance, metadata)
VALUES 
  ('universe', 'concept', 'universe', '宇宙', 'All existing matter and space', 1.0, '{"category": "astronomy"}'),
  ('planet', 'word', 'planet', '行星', 'A celestial body orbiting a star', 0.9, '{"category": "astronomy"}');

INSERT INTO relations (id, source_id, target_id, type, strength)
VALUES ('rel_1', 'universe', 'planet', 'contains', 0.95);
```

## 步骤 6：验证数据

在 SQL Editor 中运行：

```sql
-- 检查节点数量
SELECT COUNT(*) FROM nodes;

-- 检查关系数量
SELECT COUNT(*) FROM relations;

-- 查看 universe 节点的邻居
SELECT n.*, r.type, r.strength
FROM nodes n
JOIN relations r ON r.target_id = n.id
WHERE r.source_id = 'universe';
```

预期结果：
- nodes: 50 行
- relations: 258 行
- universe 应该有多个邻居节点

## 步骤 7：配置 Row Level Security（可选）

目前我们允许匿名读取，如果需要限制访问：

```sql
-- 启用 RLS
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE relations ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取
CREATE POLICY "Allow anonymous read" ON nodes FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON relations FOR SELECT TO anon USING (true);
```

## 故障排查

### 问题：迁移失败，提示表已存在
**解决方案**：删除表后重新运行
```sql
DROP TABLE IF EXISTS relations CASCADE;
DROP TABLE IF EXISTS nodes CASCADE;
```

### 问题：导入 JSON 失败
**解决方案**：使用 SQL 手动插入测试数据，或使用 Supabase JS 客户端批量插入

### 问题：API 连接失败
**解决方案**：
1. 确认 `.env.local` 中的 URL 和密钥正确
2. 检查 Supabase 项目是否处于活跃状态
3. 确认防火墙没有阻止连接

## 下一步

配置完成后，运行：

```bash
npm run dev
```

访问 `http://localhost:5173`，开始测试图谱功能！

---

**需要帮助？** 查看 [Supabase 官方文档](https://supabase.com/docs)
