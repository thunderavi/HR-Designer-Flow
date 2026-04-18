import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Square } from 'lucide-react';
import '../styles/nodes.css';

const EndNode = ({ data, selected }) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="source" position={Position.Top} id="source-top" />
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="source" position={Position.Left} id="source-left" />
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="source" position={Position.Right} id="source-right" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
      <div className="node-header">
        <Square size={14} color="#ef4444" />
        <span>Termination</span>
        <span className="node-badge badge-end">End</span>
      </div>
      <div className="node-content">
        <strong>{data.message || 'Workflow Completed'}</strong>
      </div>
    </div>
  );
};

export default memo(EndNode);
