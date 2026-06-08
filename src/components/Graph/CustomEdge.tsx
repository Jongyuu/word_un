import { memo } from 'react'
import { EdgeProps, getSmoothStepPath } from '@xyflow/react'

interface CustomEdgeData {
  strength?: number
  type?: string
  showLabel?: boolean
}

export const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // 从 data 中获取关系强度
  const edgeData = data as CustomEdgeData | undefined
  const strength = edgeData?.strength ?? 0.5
  const relationType = edgeData?.type ?? 'related'

  // 根据关系类型设置颜色
  const edgeColors: Record<string, string> = {
    contains: '#3B82F6',    // 蓝色
    related: '#10B981',     // 绿色
    derived: '#8B5CF6',     // 紫色
    synonym: '#F59E0B',     // 橙色
    antonym: '#EF4444',     // 红色
    used_in: '#6366F1'      // 靛蓝
  }

  const strokeColor = edgeColors[relationType] || '#94a3b8'

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: Math.max(1.5, strength * 4),
          strokeOpacity: 0.6
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* 关系类型标签（可选） */}
      {edgeData?.showLabel && (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: 10, fill: strokeColor }}
            startOffset="50%"
            textAnchor="middle"
          >
            {relationType}
          </textPath>
        </text>
      )}
    </>
  )
})

CustomEdge.displayName = 'CustomEdge'
