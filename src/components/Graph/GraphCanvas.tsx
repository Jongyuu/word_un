import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeTypes
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { CustomNode } from './CustomNode'
import { LoadingSkeleton } from './LoadingSkeleton'
import { useInitialGraph, useNodeGraph } from '@/hooks/useGraphData'
import type { GraphResponse } from '@/types'
import { NodeInfoCard } from '@/components/InfoCard/NodeInfoCard'
import { Breadcrumb } from '@/components/Navigation/Breadcrumb'
import { BackButton } from '@/components/Navigation/BackButton'
import { TutorialOverlay } from '@/components/Tutorial/TutorialOverlay'
import type { Node as NodeType } from '@/types'
import { motion } from 'framer-motion'

const nodeTypes: NodeTypes = {
  custom: CustomNode
}

export function GraphCanvas() {
  const [centerNodeId, setCenterNodeId] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null)
  const [history, setHistory] = useState<Array<{ id: string; label: string; labelCn?: string }>>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 获取初始数据
  const { data: initialData, isLoading: isLoadingInitial, error: initialError } = useInitialGraph()

  // 获取切换后的节点数据
  const { data: nodeData, isLoading: isLoadingNode, error: nodeError } = useNodeGraph(centerNodeId)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // 将 API 数据转换为 React Flow 格式
  const transformGraphData = useCallback((data: GraphResponse) => {
    const centerNode = data.centerNode
    const neighbors = data.neighbors

    // 中心节点
    const centerFlowNode: Node = {
      id: centerNode.id,
      type: 'custom',
      position: { x: 400, y: 300 },
      data: {
        label: centerNode.label,
        labelCn: centerNode.labelCn,
        type: centerNode.type,
        importance: centerNode.importance,
        isCenter: true
      }
    }

    // 邻居节点（圆形排列）
    const neighborNodes: Node[] = neighbors.map((item, index) => {
      const angle = (index / neighbors.length) * 2 * Math.PI
      const radius = 250
      const x = 400 + radius * Math.cos(angle)
      const y = 300 + radius * Math.sin(angle)

      return {
        id: item.node.id,
        type: 'custom',
        position: { x, y },
        data: {
          label: item.node.label,
          labelCn: item.node.labelCn,
          type: item.node.type,
          importance: item.node.importance,
          isCenter: false
        }
      }
    })

    // 连线
    const flowEdges: Edge[] = neighbors.map((item) => ({
      id: `${centerNode.id}-${item.node.id}`,
      source: centerNode.id,
      target: item.node.id,
      animated: true,
      style: {
        stroke: '#94a3b8',
        strokeWidth: Math.max(1, item.relation.strength * 3)
      }
    }))

    return {
      nodes: [centerFlowNode, ...neighborNodes],
      edges: flowEdges
    }
  }, [])

  // 初始数据加载
  useEffect(() => {
    if (initialData && !centerNodeId) {
      const { nodes: flowNodes, edges: flowEdges } = transformGraphData(initialData)
      setNodes(flowNodes)
      setEdges(flowEdges)

      // 初始化历史记录
      setHistory([{
        id: initialData.centerNode.id,
        label: initialData.centerNode.label,
        labelCn: initialData.centerNode.labelCn
      }])
    }
  }, [initialData, centerNodeId, transformGraphData, setNodes, setEdges])

  // 节点切换数据加载
  useEffect(() => {
    if (nodeData && centerNodeId) {
      setIsTransitioning(true)

      // 添加短暂延迟以显示过渡效果
      const timer = setTimeout(() => {
        const { nodes: flowNodes, edges: flowEdges } = transformGraphData(nodeData)
        setNodes(flowNodes)
        setEdges(flowEdges)
        setIsTransitioning(false)

        // 添加到历史记录
        setHistory(prev => {
          // 避免重复添加
          if (prev[prev.length - 1]?.id === centerNodeId) {
            return prev
          }
          return [...prev, {
            id: nodeData.centerNode.id,
            label: nodeData.centerNode.label,
            labelCn: nodeData.centerNode.labelCn
          }]
        })
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [nodeData, centerNodeId, transformGraphData, setNodes, setEdges])

  // 检查是否有邻居节点
  const hasNeighbors = (nodeData?.neighbors.length ?? 0) > 0 || (initialData?.neighbors.length ?? 0) > 0

  // 单击节点事件 - 显示信息卡片
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // 查找完整的节点数据
    const nodeDataToShow = nodeData?.centerNode.id === node.id
      ? nodeData.centerNode
      : nodeData?.neighbors.find(n => n.node.id === node.id)?.node
      ?? (initialData?.centerNode.id === node.id
        ? initialData.centerNode
        : initialData?.neighbors.find(n => n.node.id === node.id)?.node)

    if (nodeDataToShow) {
      setSelectedNode(nodeDataToShow)
    }
  }, [nodeData, initialData])

  // 双击节点事件 - 切换中心节点
  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (!node.data.isCenter) {
      setCenterNodeId(node.id)
    }
  }, [])

  // 面包屑导航
  const handleBreadcrumbNavigate = useCallback((nodeId: string) => {
    const targetIndex = history.findIndex(h => h.id === nodeId)
    if (targetIndex !== -1 && targetIndex < history.length - 1) {
      // 截断历史到目标节点
      setHistory(prev => prev.slice(0, targetIndex + 1))
      setCenterNodeId(nodeId)
    }
  }, [history])

  // 返回按钮
  const handleBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      setHistory(newHistory)
      setCenterNodeId(newHistory[newHistory.length - 1].id)
    }
  }, [history])

  if (isLoadingInitial) {
    return <LoadingSkeleton />
  }

  if (initialError) {
    const errorMessage = initialError instanceof Error
      ? ('userMessage' in initialError ? (initialError as Error & { userMessage?: string }).userMessage : initialError.message) || initialError.message
      : '加载失败'

    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-2xl font-bold">加载图谱失败</div>
          <div className="text-gray-400">{errorMessage}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            刷新页面重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative">
      {/* 过渡动画遮罩 */}
      {isTransitioning && (
        <motion.div
          className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-white text-lg font-medium bg-white/10 px-6 py-3 rounded-full backdrop-blur-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            切换中心节点...
          </motion.div>
        </motion.div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={2}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* 空状态提示 */}
      {!hasNeighbors && nodes.length > 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-200 pointer-events-auto">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              这是一个独立节点
            </h3>
            <p className="text-gray-600 mb-4">
              当前节点暂时没有关联的其他节点。这可能是一个新添加的概念，或者是一个独立存在的知识点。
            </p>
            <div className="text-sm text-gray-500">
              点击节点可以查看详细信息
            </div>
          </div>
        </div>
      )}

      {isLoadingNode && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-100 flex items-center gap-3">
          <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-sm text-gray-700">加载节点数据...</div>
        </div>
      )}

      {nodeError && (
        <div className="absolute top-4 right-4 bg-red-50 border border-red-200 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start gap-2">
            <span className="text-red-500 text-lg">⚠️</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-red-800 mb-1">加载节点失败</div>
              <div className="text-xs text-red-600">
                {nodeError instanceof Error
                  ? ('userMessage' in nodeError ? (nodeError as Error & { userMessage?: string }).userMessage : nodeError.message) || nodeError.message
                  : '未知错误'}
              </div>
            </div>
            <button
              onClick={() => setCenterNodeId(null)}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 节点信息卡片 */}
      {selectedNode && (
        <NodeInfoCard
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* 面包屑导航 */}
      {history.length > 0 && (
        <Breadcrumb
          history={history}
          onNavigate={handleBreadcrumbNavigate}
        />
      )}

      {/* 返回按钮 */}
      {history.length > 0 && (
        <BackButton
          onBack={handleBack}
          disabled={history.length <= 1}
        />
      )}

      {/* 新手引导 */}
      <TutorialOverlay />
    </div>
  )
}
