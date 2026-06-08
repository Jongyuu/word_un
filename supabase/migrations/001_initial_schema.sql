-- 创建 nodes 表
CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  label_cn TEXT,
  definition TEXT NOT NULL,
  importance NUMERIC DEFAULT 0.5 CHECK (importance >= 0 AND importance <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_nodes_type ON nodes(type);
CREATE INDEX idx_nodes_importance ON nodes(importance DESC);
CREATE INDEX idx_nodes_label ON nodes(label);
CREATE INDEX idx_nodes_metadata ON nodes USING GIN(metadata);

-- 创建 relations 表
CREATE TABLE relations (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  strength NUMERIC DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_relations_source ON relations(source_id);
CREATE INDEX idx_relations_target ON relations(target_id);
CREATE INDEX idx_relations_type ON relations(type);

-- 唯一约束（防止重复关系）
CREATE UNIQUE INDEX idx_relations_unique ON relations(source_id, target_id, type);

-- 添加注释
COMMENT ON TABLE nodes IS '知识图谱节点表';
COMMENT ON TABLE relations IS '节点关系表';
