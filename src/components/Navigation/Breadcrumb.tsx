import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbProps {
  history: Array<{ id: string; label: string; labelCn?: string }>
  onNavigate: (nodeId: string) => void
}

export function Breadcrumb({ history, onNavigate }: BreadcrumbProps) {
  if (history.length === 0) return null

  // 只显示最后 5 个节点
  const displayHistory = history.length > 5
    ? [history[0], { id: '...', label: '...', labelCn: '' }, ...history.slice(-3)]
    : history

  return (
    <motion.nav
      className="fixed top-4 left-4 z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ol className="flex items-center gap-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-4 py-3 border border-gray-100">
        {displayHistory.map((item, index) => (
          <motion.li
            key={`${item.id}-${index}`}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            {item.id === '...' ? (
              <span className="text-gray-400 text-sm">...</span>
            ) : (
              <motion.button
                onClick={() => onNavigate(item.id)}
                disabled={index === displayHistory.length - 1}
                className={`
                  text-sm font-medium transition-all
                  ${index === displayHistory.length - 1
                    ? 'text-blue-600 cursor-default font-semibold'
                    : 'text-gray-600 hover:text-blue-600 cursor-pointer'
                  }
                `}
                whileHover={index !== displayHistory.length - 1 ? { scale: 1.05 } : {}}
                whileTap={index !== displayHistory.length - 1 ? { scale: 0.95 } : {}}
              >
                <span className="inline-block">
                  {item.label}
                  {item.labelCn && (
                    <span className="text-xs text-gray-400 ml-1">
                      ({item.labelCn})
                    </span>
                  )}
                </span>
              </motion.button>
            )}
          </motion.li>
        ))}
      </ol>
    </motion.nav>
  )
}
