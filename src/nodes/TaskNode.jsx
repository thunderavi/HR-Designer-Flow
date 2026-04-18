import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { UserCheck } from 'lucide-react';
import '../styles/nodes.css';

const TaskNode = ({ data, selected }) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="source" position={Position.Top} id="source-top" />
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="source" position={Position.Left} id="source-left" />
      <div className="node-header">
        <UserCheck size={14} color="#38bdf8" />
        <span>Manual Task</span>
        <span className="node-badge badge-task">Task</span>
      </div>
      <div className="node-content">
        <div><strong>{data.title || 'Untitled Task'}</strong></div>
        <div style={{ marginTop: '4px', opacity: 0.8 }}>Assignee: {data.assignee || 'Not assigned'}</div>
      </div>
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="source" position={Position.Right} id="source-right" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
    </div>
  );
};

export default memo(TaskNode);
