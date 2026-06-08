import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = '加载中...' }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
        {/* 旋转的圆环 */}
        <motion.div
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* 加载文字 */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800">{message}</p>
          <motion.div
            className="flex gap-1 justify-center mt-2"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
