import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onBack: () => void
  disabled?: boolean
}

export function BackButton({ onBack, disabled = false }: BackButtonProps) {
  return (
    <button
      onClick={onBack}
      disabled={disabled}
      className={`
        fixed bottom-8 left-8 z-40
        flex items-center gap-2
        px-4 py-3
        bg-white shadow-lg rounded-full
        transition-all
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-xl hover:scale-105 active:scale-95'
        }
      `}
      aria-label="返回上一个节点"
    >
      <ArrowLeft className="w-5 h-5 text-gray-700" />
      <span className="text-sm font-medium text-gray-700">
        返回
      </span>
    </button>
  )
}
