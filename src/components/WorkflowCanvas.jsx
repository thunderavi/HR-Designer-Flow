import React, { useCallback, useRef, useState, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  ConnectionLineType,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedStepNode from '../nodes/AutomatedStepNode';
import EndNode from '../nodes/EndNode';
import CustomNode from '../nodes/CustomNode';
import { NODE_TYPES, INITIAL_NODES } from '../constants/workflow';

import '../styles/canvas.css';

const nodeTypes = {
  [NODE_TYPES.START]: StartNode,
  [NODE_TYPES.TASK]: TaskNode,
  [NODE_TYPES.APPROVAL]: ApprovalNode,
  [NODE_TYPES.AUTOMATED_STEP]: AutomatedStepNode,
  [NODE_TYPES.END]: EndNode,
  [NODE_TYPES.CUSTOM]: CustomNode,
};

const WorkflowCanvas = ({ theme, nodes, setNodes, edges, setEdges, onNodeClick, onNodeAdded }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      type: 'smoothstep', 
      animated: true,
      label: 'Flow Step',
      style: { stroke: '#818cf8', strokeWidth: 2 },
      labelStyle: { fill: '#0f172a', fontWeight: 600, fontSize: 11 },
      labelBgStyle: { fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1 },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 4
    }, eds)),
    [setEdges]
  );

  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      event.preventDefault();
      const newLabel = window.prompt('Enter new label for this connection:', edge.label || '');
      if (newLabel !== null) {
        setEdges((eds) => 
          eds.map((e) => (e.id === edge.id ? { ...e, label: newLabel } : e))
        );
      }
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
        selected: true
      };

      setNodes((nds) => nds.map(n => ({...n, selected: false})).concat(newNode));
      
      if (onNodeAdded) {
        onNodeAdded(newNode);
      }
    },
    [reactFlowInstance, setNodes, onNodeAdded]
  );

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        colorMode={theme}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.type === 'startNode') return '#10b981';
            if (n.type === 'taskNode') return '#38bdf8';
            if (n.type === 'approvalNode') return '#f59e0b';
            if (n.type === 'automatedStepNode') return '#818cf8';
            if (n.type === 'endNode') return '#ef4444';
            return '#fff';
          }}
          nodeColor={(n) => {
            if (n.type === 'startNode') return 'rgba(16, 185, 129, 0.4)';
            if (n.type === 'taskNode') return 'rgba(56, 189, 248, 0.4)';
            if (n.type === 'approvalNode') return 'rgba(245, 158, 11, 0.4)';
            if (n.type === 'automatedStepNode') return 'rgba(129, 140, 248, 0.4)';
            if (n.type === 'endNode') return 'rgba(239, 68, 68, 0.4)';
            return '#fff';
          }}
          maskColor={theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.7)'}
          style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
