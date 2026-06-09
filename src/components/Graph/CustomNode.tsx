import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'

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

  // 根据节点类型选择颜色 - Obsidian 风格深色调
  const colorMap: Record<string, { bg: string; glow: string; shadow: string }> = {
    word: {
      bg: 'from-blue-600 to-blue-500',
      glow: 'rgba(59, 130, 246, 0.5)',
      shadow: '0 8px 32px rgba(59, 130, 246, 0.35)'
    },
    topic: {
      bg: 'from-purple-600 to-purple-500',
      glow: 'rgba(139, 92, 246, 0.5)',
      shadow: '0 8px 32px rgba(139, 92, 246, 0.35)'
    },
    root: {
      bg: 'from-amber-600 to-amber-500',
      glow: 'rgba(245, 158, 11, 0.5)',
      shadow: '0 8px 32px rgba(245, 158, 11, 0.35)'
    },
    concept: {
      bg: 'from-emerald-600 to-emerald-500',
      glow: 'rgba(16, 185, 129, 0.5)',
      shadow: '0 8px 32px rgba(16, 185, 129, 0.35)'
    }
  }

  const colors = colorMap[type] || colorMap.word

  // 根据重要性和是否为中心节点计算大小
  const baseSize = isCenter ? 36 : 20 + importance * 12
  const size = `${baseSize * 4}px` // 转换为像素值

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: Math.random() * 0.2
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />

      {/* 主节点容器 */}
      <motion.div
        className={`
          rounded-full
          flex flex-col items-center justify-center
          text-white font-medium
          cursor-pointer
          relative overflow-hidden
          bg-gradient-to-br ${colors.bg}
        `}
        style={{
          width: size,
          height: size,
          boxShadow: isHovered
            ? `${colors.shadow}, 0 0 0 4px rgba(255, 255, 255, 0.1)`
            : colors.shadow
        }}
        whileHover={{
          scale: 1.2,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 15
          }
        }}
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.1 }
        }}
      >
        {/* 中心节点光环 */}
        {isCenter && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* 背景光效 */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0"
          style={{
            background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        {/* 内容区域 */}
        <div className="text-center px-3 relative z-10">
          <motion.div
            className={`font-bold ${isCenter ? 'text-lg' : 'text-sm'}`}
            animate={{
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.div>
          {labelCn && (
            <motion.div
              className={`opacity-90 ${isCenter ? 'text-sm' : 'text-xs'}`}
              animate={{
                opacity: isHovered ? 1 : 0.9
              }}
              transition={{ duration: 0.2 }}
            >
              {labelCn}
            </motion.div>
          )}
        </div>

        {/* 装饰性光点 */}
        {isHovered && (
          <>
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ delay: 0.1 }}
            />
            <motion.div
              className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ delay: 0.15 }}
            />
          </>
        )}
      </motion.div>

      {/* 悬停提示 - 增强可见性 */}
      <AnimatePresence>
        {isHovered && !isCenter && (
          <motion.div
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25
            }}
          >
            <div className="flex items-center gap-2">
              <span>双击切换中心</span>
              <span className="text-blue-400">⚡</span>
            </div>
            {/* 箭头指示 */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </motion.div>
  )
})

CustomNode.displayName = 'CustomNode'
