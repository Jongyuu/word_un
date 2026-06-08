import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { validateEnv } from './utils/env'

// 验证环境变量
try {
  validateEnv()
} catch (error) {
  // 显示环境变量配置错误页面
  const rootElement = document.getElementById('root')!
  rootElement.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      padding: 20px;
    ">
      <div style="
        max-width: 600px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      ">
        <div style="font-size: 60px; margin-bottom: 20px;">⚙️</div>
        <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">环境配置错误</h1>
        <pre style="
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 10px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 14px;
          line-height: 1.6;
          margin: 20px 0;
        ">${error instanceof Error ? error.message : '未知错误'}</pre>
        <button onclick="window.location.reload()" style="
          background: white;
          color: #667eea;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          刷新页面
        </button>
      </div>
    </div>
  `
  throw error
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
