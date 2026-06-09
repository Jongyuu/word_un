import { motion } from 'framer-motion'

export function LoadingSkeleton() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="relative">
        {/* 中心脉冲圆 */}
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* 外围环绕的小圆点 */}
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = (index / 6) * 2 * Math.PI
          const radius = 80
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          return (
            <motion.div
              key={index}
              className="absolute w-8 h-8 rounded-full bg-blue-400"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-16px',
                marginTop: '-16px'
              }}
              animate={{
                x: [0, x, 0],
                y: [0, y, 0],
                scale: [0.8, 1, 0.8],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
              }}
            />
          )
        })}

        {/* 加载文字 */}
        <motion.div
          className="absolute top-full mt-12 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium whitespace-nowrap"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          正在加载知识宇宙...
        </motion.div>
      </div>
    </div>
  )
}
