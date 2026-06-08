/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        node: {
          word: '#3B82F6',      // 蓝色 - 普通单词节点
          topic: '#8B5CF6',     // 紫色 - 主题节点
          root: '#F59E0B',      // 橙色 - 根节点
          concept: '#10B981'    // 绿色 - 概念节点
        }
      }
    },
  },
  plugins: [],
}

