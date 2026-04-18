import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';
import '../styles/nodes.css';

const AutomatedStepNode = ({ data, selected }) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="source" position={Position.Top} id="source-top" />
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="source" position={Position.Left} id="source-left" />
      <div className="node-header">
        <Zap size={14} color="#818cf8" />
        <span>System Action</span>
        <span className="node-badge badge-automated">Auto</span>
      </div>
      <div className="node-content">
        <div><strong>{data.title || 'Automation'}</strong></div>
        <div style={{ marginTop: '4px', opacity: 0.8 }}>Action: {data.actionId || 'None'}</div>
      </div>
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="source" position={Position.Right} id="source-right" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
    </div>
  );
};

export default memo(AutomatedStepNode);
