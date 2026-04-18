import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Sidebar from './components/Sidebar';
import WorkflowCanvas from './components/WorkflowCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import SandboxPanel from './components/SandboxPanel';
import { useWorkflow } from './hooks/useWorkflow';
import { exportCanvasToPDF } from './utils/exportPdf';
import { Download, Plus, Moon, Sun } from 'lucide-react';
import './App.css';

const Resizer = ({ onDrag, direction = 'horizontal' }) => {
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    let currentX = e.clientX;
    let currentY = e.clientY;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - currentX;
      const dy = moveEvent.clientY - currentY;
      
      currentX = moveEvent.clientX;
      currentY = moveEvent.clientY;

      onDrag(dx, dy);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onDrag]);

  return (
    <div 
      className={direction === 'horizontal' ? 'resize-handle' : 'resize-handle-vertical'} 
      onMouseDown={handleMouseDown} 
    />
  );
};

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const {
    nodes, setNodes,
    edges, setEdges,
    projectName, projectsList, activeProjectId, switchProject, createProject,
    selectedNode, setSelectedNode,
    highlightedNodeId, setHighlightedNodeId,
    onNodeClick, onUpdateNode, isLoaded
  } = useWorkflow();

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(320);
  const [propsHeight, setPropsHeight] = useState(50); // percentage

  const handleSidebarResize = useCallback((dx) => {
    setSidebarWidth((prev) => Math.max(150, Math.min(500, prev + dx)));
  }, []);

  const handleRightResize = useCallback((dx) => {
    setRightWidth((prev) => Math.max(200, Math.min(600, prev - dx)));
  }, []);

  const handleVerticalResize = useCallback((dx, dy) => {
    // dy is pixels. Height percentage change relates to container height.
    // simpler approximation: 10px ~ 1%
    setPropsHeight((prev) => Math.max(10, Math.min(90, prev + (dy * 0.1))));
  }, []);

  return (
    <div className="app-container" style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        
        {/* Left Panel */}
        <div style={{ width: sidebarWidth, flexShrink: 0, height: '100%' }}>
          <Sidebar />
        </div>
        
        <Resizer onDrag={handleSidebarResize} />

        {/* Center Panel */}
        <main className="main-viewport" style={{ flexGrow: 1, minWidth: 300, display: 'flex', flexDirection: 'column' }}>
          <header className="app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <select 
                value={activeProjectId || ''} 
                onChange={(e) => switchProject(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-canvas)', fontWeight: 600, color: 'var(--text-primary)' }}
              >
                {projectsList.map(p => (
                   <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button 
                onClick={() => {
                  const name = window.prompt("Enter new project name:");
                  if (name) createProject(name);
                }}
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> New Project
              </button>
            </div>
            
            <div className="header-actions">
              <span className="node-count" style={{ display: 'flex', alignItems: 'center' }}>{nodes.length} Nodes</span>
              <button 
                onClick={toggleTheme}
                style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {theme === 'light' ? <Moon size={14} color="var(--text-primary)" /> : <Sun size={14} color="var(--text-primary)" />}
              </button>
              <button 
                onClick={() => exportCanvasToPDF(projectName)}
                style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '4px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <Download size={14} color="var(--accent-primary)" /> Export PDF
              </button>
            </div>
          </header>
          
          <div style={{ flexGrow: 1 }}>
            <WorkflowCanvas 
              theme={theme} 
              nodes={nodes} 
              setNodes={setNodes} 
              edges={edges} 
              setEdges={setEdges}
              onNodeClick={onNodeClick}
              onNodeAdded={(node) => setSelectedNode(node)}
            />
          </div>
        </main>

        <Resizer onDrag={handleRightResize} />

        {/* Right Panels */}
        <section className="side-panels" style={{ width: rightWidth, flexShrink: 0, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexShrink: 0 }}>
            <PropertiesPanel 
              selectedNode={selectedNode} 
              onUpdate={onUpdateNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
          <div style={{ flexGrow: 1, borderTop: '1px solid var(--border-color)' }}>
            <SandboxPanel 
              nodes={nodes} 
              edges={edges} 
              onSimulateNode={setHighlightedNodeId}
            />
          </div>
        </section>

      </ReactFlowProvider>
    </div>
  );
}

export default App;
