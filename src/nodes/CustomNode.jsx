import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { LayoutTemplate } from 'lucide-react';
import '../styles/nodes.css';

const CustomNode = ({ data, selected }) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`} style={{ '--node-color': '#c084fc' }}>
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="source" position={Position.Top} id="source-top" />
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="source" position={Position.Left} id="source-left" />
      <div className="node-header">
        <LayoutTemplate size={14} color="#c084fc" />
        <span>Custom Component</span>
        <span className="node-badge" style={{ background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc' }}>Custom</span>
      </div>
      <div className="node-content">
        <div><strong>{data.title || 'New Custom Card'}</strong></div>
        {data.customFields && data.customFields.slice(0, 2).map((field, idx) => (
          field.key ? <div key={idx} style={{ marginTop: '4px', opacity: 0.8 }}>{field.key}: {field.value}</div> : null
        ))}
        {data.customFields && data.customFields.length > 2 && (
          <div style={{ marginTop: '2px', opacity: 0.5 }}>+{data.customFields.length - 2} more...</div>
        )}
      </div>
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="source" position={Position.Right} id="source-right" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
    </div>
  );
};

export default memo(CustomNode);
