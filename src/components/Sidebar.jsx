import React from 'react';
import { Play, UserCheck, ShieldCheck, Zap, Square, LayoutTemplate } from 'lucide-react';
import { NODE_TYPES } from '../constants/workflow';
import '../styles/sidebar.css';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeItems = [
    { type: NODE_TYPES.START, label: 'Start Node', icon: <Play size={18} />, color: '#10b981' },
    { type: NODE_TYPES.TASK, label: 'Task Node', icon: <UserCheck size={18} />, color: '#38bdf8' },
    { type: NODE_TYPES.APPROVAL, label: 'Approval Node', icon: <ShieldCheck size={18} />, color: '#f59e0b' },
    { type: NODE_TYPES.AUTOMATED_STEP, label: 'Auto Step', icon: <Zap size={18} />, color: '#818cf8' },
    { type: NODE_TYPES.END, label: 'End Node', icon: <Square size={18} />, color: '#ef4444' },
    { type: NODE_TYPES.CUSTOM, label: 'Custom Card', icon: <LayoutTemplate size={18} />, color: '#c084fc' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Components</h3>
        <p>Drag nodes to canvas</p>
      </div>
      <div className="node-list">
        {nodeItems.map((item) => (
          <div
            key={item.type}
            className="dndnode"
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
            style={{ '--item-color': item.color }}
          >
            <div className="dndnode-icon">{item.icon}</div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
