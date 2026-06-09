import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Node } from '@/types'

interface NodeInfoCardProps {
  node: Node | null
  onClose: () => void
}

export function NodeInfoCard({ node, onClose }: NodeInfoCardProps) {
  if (!node) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
          mass: 0.8
        }}
        className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 overflow-y-auto"
        style={{
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12), -2px 0 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* 关闭按钮 */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors group"
          aria-label="关闭"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </motion.button>

        {/* 内容区域 */}
        <motion.div
          className="p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* 标题区域 */}
          <div className="mb-6">
            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium text-white
                ${node.type === 'word' ? 'bg-node-word' : ''}
                ${node.type === 'topic' ? 'bg-node-topic' : ''}
                ${node.type === 'root' ? 'bg-node-root' : ''}
                ${node.type === 'concept' ? 'bg-node-concept' : ''}
              `}>
                {node.type}
              </span>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {node.label}
            </motion.h2>

            {/* 音标和发音 */}
            {(node.metadata?.phonetic || node.metadata?.pronunciation) && (
              <motion.div
                className="flex flex-wrap items-center gap-3 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.23 }}
              >
                {node.metadata.phonetic && (
                  <span className="text-base text-blue-600 font-mono">
                    {node.metadata.phonetic}
                  </span>
                )}
                {node.metadata.pronunciation && (
                  <span className="text-sm text-gray-500 italic">
                    {node.metadata.pronunciation}
                  </span>
                )}
              </motion.div>
            )}

            {node.labelCn && (
              <motion.p
                className="text-xl text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                {node.labelCn}
              </motion.p>
            )}
          </div>

          {/* 定义 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Definition
            </h3>
            <p className="text-gray-800 leading-relaxed">
              {node.definition}
            </p>
          </div>

          {/* 重要性 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Importance
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                  style={{ width: `${node.importance * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {(node.importance * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* 元数据 */}
          {node.metadata && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Metadata
              </h3>
              <div className="space-y-2">
                {node.metadata.etymology && (
                  <div>
                    <span className="text-xs text-gray-500">Etymology:</span>
                    <p className="text-sm text-gray-800">{node.metadata.etymology}</p>
                  </div>
                )}
                {node.metadata.category && (
                  <div>
                    <span className="text-xs text-gray-500">Category:</span>
                    <p className="text-sm text-gray-800">{node.metadata.category}</p>
                  </div>
                )}
                {node.metadata.tags && Array.isArray(node.metadata.tags) && (
                  <div>
                    <span className="text-xs text-gray-500">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {node.metadata.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 时间信息 */}
          {node.createdAt && (
            <div className="text-xs text-gray-400 border-t pt-4">
              Created: {new Date(node.createdAt).toLocaleDateString()}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
