interface RelationTagsProps {
  relations: Array<{
    type: string
    strength: number
    targetLabel?: string
  }>
}

export function RelationTags({ relations }: RelationTagsProps) {
  if (!relations || relations.length === 0) {
    return (
      <div className="text-sm text-gray-400">
        No relations
      </div>
    )
  }

  const relationTypeColors: Record<string, string> = {
    contains: 'bg-blue-100 text-blue-800 border-blue-200',
    related: 'bg-green-100 text-green-800 border-green-200',
    derived: 'bg-purple-100 text-purple-800 border-purple-200',
    synonym: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    antonym: 'bg-red-100 text-red-800 border-red-200',
    used_in: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }

  const relationTypeLabels: Record<string, string> = {
    contains: '包含',
    related: '相关',
    derived: '派生',
    synonym: '同义',
    antonym: '反义',
    used_in: '应用'
  }

  return (
    <div className="space-y-2">
      {relations.map((relation, index) => {
        const colorClass = relationTypeColors[relation.type] || 'bg-gray-100 text-gray-800 border-gray-200'
        const label = relationTypeLabels[relation.type] || relation.type

        return (
          <div
            key={index}
            className={`
              flex items-center justify-between
              px-3 py-2 rounded-lg border
              ${colorClass}
              transition-all hover:shadow-sm
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase">
                {label}
              </span>
              {relation.targetLabel && (
                <span className="text-sm">
                  → {relation.targetLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-12 h-1.5 bg-white bg-opacity-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-current opacity-60"
                  style={{ width: `${relation.strength * 100}%` }}
                />
              </div>
              <span className="text-xs opacity-60">
                {(relation.strength * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
