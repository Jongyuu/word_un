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
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* 内容区域 */}
        <div className="p-6">
          {/* 标题区域 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium text-white
                ${node.type === 'word' ? 'bg-node-word' : ''}
                ${node.type === 'topic' ? 'bg-node-topic' : ''}
                ${node.type === 'root' ? 'bg-node-root' : ''}
                ${node.type === 'concept' ? 'bg-node-concept' : ''}
              `}>
                {node.type}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {node.label}
            </h2>
            {node.labelCn && (
              <p className="text-xl text-gray-600">{node.labelCn}</p>
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
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
