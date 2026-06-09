import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MousePointer2, MousePointerClick, Info } from 'lucide-react'

export function TutorialOverlay() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 检查是否是首次访问
    const hasSeenTutorial = localStorage.getItem('word-un-tutorial-seen')
    if (!hasSeenTutorial) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('word-un-tutorial-seen', 'true')
  }

  const handleSkip = () => {
    handleClose()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">欢迎来到 Word Universe</h2>
                  <p className="text-blue-100">在探索中自然学习英语</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid gap-4">
                {/* 单击提示 */}
                <motion.div
                  className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MousePointer2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">单击节点</h3>
                    <p className="text-sm text-gray-600">
                      查看单词的详细信息，包括定义、词源、重要性等
                    </p>
                  </div>
                </motion.div>

                {/* 双击提示 */}
                <motion.div
                  className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MousePointerClick className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">双击节点</h3>
                    <p className="text-sm text-gray-600">
                      将该节点设置为中心，探索它的关联网络
                    </p>
                  </div>
                </motion.div>

                {/* 导航提示 */}
                <motion.div
                  className="flex items-start gap-4 p-4 bg-green-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    ↩
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">面包屑导航</h3>
                    <p className="text-sm text-gray-600">
                      使用左上角的面包屑或返回按钮回到之前访问的节点
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                提示：悬停在节点上可以看到更多交互提示
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                不再显示
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                开始探索
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
