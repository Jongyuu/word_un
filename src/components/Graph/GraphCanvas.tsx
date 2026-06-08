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

const nodeTypes: NodeTypes = {
  custom: CustomNode
}

export function GraphCanvas() {
  const [centerNodeId, setCenterNodeId] = useState<string | null>(null)

  // 获取初始数据
  const { data: initialData, isLoading: isLoadingInitial } = useInitialGraph()

  // 获取切换后的节点数据
  const { data: nodeData, isLoading: isLoadingNode } = useNodeGraph(centerNodeId)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

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
    }
  }, [initialData, centerNodeId, transformGraphData, setNodes, setEdges])

  // 节点切换数据加载
  useEffect(() => {
    if (nodeData && centerNodeId) {
      const { nodes: flowNodes, edges: flowEdges } = transformGraphData(nodeData)
      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [nodeData, centerNodeId, transformGraphData, setNodes, setEdges])

  // 点击节点事件
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (!node.data.isCenter) {
      setCenterNodeId(node.id)
    }
  }, [])

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
    </div>
  )
}
