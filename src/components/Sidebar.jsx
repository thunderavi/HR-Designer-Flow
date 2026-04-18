import React from 'react';
import { Play, UserCheck, ShieldCheck, Zap, Square, LayoutTemplate, Network, Box } from 'lucide-react';
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
      {/* Brand Logo Area */}
      <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px dashed var(--border-color)' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: '#fff', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyItems: 'center', boxShadow: 'var(--shadow-md)' }}>
          <Network size={22} strokeWidth={2.5} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>HR Component</h2>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '1px' }}>Workflow Designer</span>
        </div>
      </div>

      <div className="sidebar-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Box size={16} /> Elements</h3>
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
