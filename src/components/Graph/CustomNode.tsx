import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'

export interface NodeData {
  label: string
  labelCn?: string
  type: string
  importance: number
  isCenter?: boolean
}

export const CustomNode = memo(({ data }: NodeProps) => {
  const { label, labelCn, type, importance, isCenter } = data as unknown as NodeData

  // 根据节点类型选择颜色
  const colorMap: Record<string, string> = {
    word: 'bg-node-word',
    topic: 'bg-node-topic',
    root: 'bg-node-root',
    concept: 'bg-node-concept'
  }

  const bgColor = colorMap[type] || 'bg-blue-500'

  // 根据重要性计算节点大小
  const size = isCenter ? 'w-32 h-32' : `w-${Math.floor(16 + importance * 8)} h-${Math.floor(16 + importance * 8)}`

  return (
    <div
      className={`
        ${bgColor} ${size}
        rounded-full
        flex flex-col items-center justify-center
        text-white font-medium
        shadow-lg
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        cursor-pointer
        ${isCenter ? 'ring-4 ring-white ring-opacity-50' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />

      <div className="text-center px-2">
        <div className="text-sm font-bold">{label}</div>
        {labelCn && <div className="text-xs opacity-80">{labelCn}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  )
})

CustomNode.displayName = 'CustomNode'
