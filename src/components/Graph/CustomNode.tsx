import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'

export interface NodeData {
  label: string
  labelCn?: string
  type: string
  importance: number
  isCenter?: boolean
}

export const CustomNode = memo(({ data }: NodeProps) => {
  const { label, labelCn, type, importance, isCenter } = data as unknown as NodeData
  const [isHovered, setIsHovered] = useState(false)

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
    <motion.div
      className={`
        ${bgColor} ${size}
        rounded-full
        flex flex-col items-center justify-center
        text-white font-medium
        shadow-lg
        cursor-pointer
        relative
        ${isCenter ? 'ring-4 ring-white ring-opacity-50' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.15,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20
      }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />

      <div className="text-center px-2 relative z-10">
        <motion.div
          className="text-sm font-bold"
          animate={{
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.div>
        {labelCn && (
          <motion.div
            className="text-xs opacity-80"
            animate={{
              opacity: isHovered ? 1 : 0.8
            }}
            transition={{ duration: 0.2 }}
          >
            {labelCn}
          </motion.div>
        )}
      </div>

      {/* 悬停时的光晕效果 */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* 双击提示 */}
      {isHovered && !isCenter && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          双击切换中心
        </motion.div>
      )}

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </motion.div>
  )
})

CustomNode.displayName = 'CustomNode'
