import { ChevronRight } from 'lucide-react'

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
    <nav className="fixed top-4 left-4 z-40">
      <ol className="flex items-center gap-2 bg-white shadow-lg rounded-lg px-4 py-2">
        {displayHistory.map((item, index) => (
          <li key={`${item.id}-${index}`} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            {item.id === '...' ? (
              <span className="text-gray-400 text-sm">...</span>
            ) : (
              <button
                onClick={() => onNavigate(item.id)}
                disabled={index === displayHistory.length - 1}
                className={`
                  text-sm font-medium transition-colors
                  ${index === displayHistory.length - 1
                    ? 'text-blue-600 cursor-default'
                    : 'text-gray-600 hover:text-blue-600 cursor-pointer'
                  }
                `}
              >
                {item.label}
                {item.labelCn && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({item.labelCn})
                  </span>
                )}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
