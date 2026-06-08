-- Create tables for Word Universe
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    label_cn TEXT NOT NULL,
    definition TEXT NOT NULL,
    importance DECIMAL(3,2) NOT NULL CHECK (importance >= 0 AND importance <= 1),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS relations (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    strength DECIMAL(3,2) NOT NULL CHECK (strength >= 0 AND strength <= 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT different_nodes CHECK (source_id != target_id)
);

CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(type);
CREATE INDEX IF NOT EXISTS idx_nodes_importance ON nodes(importance DESC);
CREATE INDEX IF NOT EXISTS idx_relations_source ON relations(source_id);
CREATE INDEX IF NOT EXISTS idx_relations_target ON relations(target_id);

ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE relations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read nodes" ON nodes;
DROP POLICY IF EXISTS "Allow public read relations" ON relations;

CREATE POLICY "Allow public read nodes" ON nodes FOR SELECT USING (true);
CREATE POLICY "Allow public read relations" ON relations FOR SELECT USING (true);
