import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
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
        className="fixed right-0 top-0 h-screen w-96 bg-gradient-to-br from-gray-50 to-white shadow-2xl z-50 overflow-y-auto"
        style={{
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15), -2px 0 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 关闭按钮 - 增强交互反馈 */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group z-10"
          aria-label="关闭"
          whileHover={{
            scale: 1.1,
            rotate: 90,
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
        </motion.button>

        {/* 内容区域 */}
        <motion.div
          className="p-6 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* 标题区域 - Obsidian 风格 */}
          <div className="mb-6">
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <motion.span
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg
                  ${node.type === 'word' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : ''}
                  ${node.type === 'topic' ? 'bg-gradient-to-r from-purple-600 to-purple-500' : ''}
                  ${node.type === 'root' ? 'bg-gradient-to-r from-amber-600 to-amber-500' : ''}
                  ${node.type === 'concept' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' : ''}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {node.type.toUpperCase()}
              </motion.span>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-2 tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {node.label}
            </motion.h2>

            {/* 音标和发音 */}
            {(node.metadata?.phonetic || node.metadata?.pronunciation) && (
              <motion.div
                className="flex flex-wrap items-center gap-3 mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.23 }}
              >
                {node.metadata.phonetic && (
                  <motion.span
                    className="text-base text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded"
                    whileHover={{ scale: 1.05 }}
                  >
                    {node.metadata.phonetic}
                  </motion.span>
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
                className="text-xl text-gray-600 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                {node.labelCn}
              </motion.p>
            )}
          </div>

          {/* 定义 - 增强卡片样式 */}
          <motion.div
            className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-sm font-bold text-blue-900 uppercase mb-2 tracking-wide">
              Definition
            </h3>
            <p className="text-gray-800 leading-relaxed">
              {node.definition}
            </p>
          </motion.div>

          {/* 重要性 - 增强视觉效果 */}
          <motion.div
            className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-sm font-bold text-purple-900 uppercase mb-3 tracking-wide">
              Importance
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${node.importance * 100}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <motion.span
                className="text-sm font-bold text-purple-900 min-w-[3rem] text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {(node.importance * 100).toFixed(0)}%
              </motion.span>
            </div>
          </motion.div>

          {/* 元数据 */}
          {node.metadata && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 tracking-wide">
                Metadata
              </h3>
              <div className="space-y-3">
                {node.metadata.etymology && (
                  <motion.div
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
                  >
                    <span className="text-xs text-gray-500 font-semibold block mb-1">Etymology:</span>
                    <p className="text-sm text-gray-800">{node.metadata.etymology}</p>
                  </motion.div>
                )}
                {node.metadata.category && (
                  <motion.div
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
                  >
                    <span className="text-xs text-gray-500 font-semibold block mb-1">Category:</span>
                    <p className="text-sm text-gray-800">{node.metadata.category}</p>
                  </motion.div>
                )}
                {node.metadata.tags && Array.isArray(node.metadata.tags) && (
                  <motion.div
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
                  >
                    <span className="text-xs text-gray-500 font-semibold block mb-2">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {node.metadata.tags.map((tag: string, index: number) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-300 shadow-sm"
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: '#EEF2FF',
                            borderColor: '#818CF8'
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* 时间信息 */}
          {node.createdAt && (
            <motion.div
              className="text-xs text-gray-400 border-t pt-4 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Created: {new Date(node.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
