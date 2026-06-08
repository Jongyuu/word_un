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
import { useInitialGraph, useNodeGraph } from '@/hooks/useGraphData'
import type { GraphResponse } from '@/types'
import { NodeInfoCard } from '@/components/InfoCard/NodeInfoCard'
import { Breadcrumb } from '@/components/Navigation/Breadcrumb'
import { BackButton } from '@/components/Navigation/BackButton'
import type { Node as NodeType } from '@/types'

const nodeTypes: NodeTypes = {
  custom: CustomNode
}

export function GraphCanvas() {
  const [centerNodeId, setCenterNodeId] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null)
  const [history, setHistory] = useState<Array<{ id: string; label: string; labelCn?: string }>>([])

  // 获取初始数据
  const { data: initialData, isLoading: isLoadingInitial } = useInitialGraph()

  // 获取切换后的节点数据
  const { data: nodeData, isLoading: isLoadingNode } = useNodeGraph(centerNodeId)

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
      const { nodes: flowNodes, edges: flowEdges } = transformGraphData(nodeData)
      setNodes(flowNodes)
      setEdges(flowEdges)

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
    }
  }, [nodeData, centerNodeId, transformGraphData, setNodes, setEdges])

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
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl text-white">加载中...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen">
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

      {isLoadingNode && (
        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg">
          <div className="text-sm">加载节点数据...</div>
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
    </div>
  )
}
