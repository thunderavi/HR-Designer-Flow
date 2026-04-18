import { useState, useCallback, useEffect } from 'react';
import { INITIAL_NODES } from '../constants/workflow';

const DB_KEY = 'hr_designer_db';

export const useWorkflow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [projectName, setProjectName] = useState('Loading...');
  const [projectsList, setProjectsList] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);

  const isLoaded = activeProjectId !== null;

  // Load from local storage initially
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(DB_KEY));
      if (data && data.projects && Object.keys(data.projects).length > 0) {
        const activeId = data.activeProjectId || Object.keys(data.projects)[0];
        const activeProj = data.projects[activeId];
        
        setNodes(activeProj.nodes || []);
        setEdges(activeProj.edges || []);
        setProjectName(activeProj.name || 'Untitled Project');
        setActiveProjectId(activeId);
        setProjectsList(Object.values(data.projects).map(p => ({ id: p.id, name: p.name })));
      } else {
        // First time initialization
        const defaultId = 'proj-' + Date.now();
        setNodes(INITIAL_NODES.map((n, i) => ({ ...n, selected: i === 0 })));
        setEdges([]);
        setProjectName('My First Project');
        setActiveProjectId(defaultId);
        setProjectsList([{ id: defaultId, name: 'My First Project' }]);
      }
    } catch (e) {
      console.error(e);
      const errId = 'proj-' + Date.now();
      setNodes(INITIAL_NODES);
      setEdges([]);
      setActiveProjectId(errId);
      setProjectName('Fallback Project');
      setProjectsList([{ id: errId, name: 'Fallback Project' }]);
    }
  }, []);

  // Save changes to local storage auto-magically
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      const data = JSON.parse(localStorage.getItem(DB_KEY)) || { projects: {} };
      
      data.activeProjectId = activeProjectId;
      
      if (!data.projects[activeProjectId]) {
        data.projects[activeProjectId] = { id: activeProjectId, name: projectName };
      }
      
      data.projects[activeProjectId].nodes = nodes;
      data.projects[activeProjectId].edges = edges;
      data.projects[activeProjectId].name = projectName;
      
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      
      setProjectsList(Object.values(data.projects).map(p => ({ id: p.id, name: p.name })));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [nodes, edges, activeProjectId, projectName, isLoaded]);

  // Project Management Actions
  const switchProject = useCallback((id) => {
    try {
      const data = JSON.parse(localStorage.getItem(DB_KEY));
      if (data && data.projects && data.projects[id]) {
        const proj = data.projects[id];
        setSelectedNode(null); // Clear properties context
        setNodes(proj.nodes || []);
        setEdges(proj.edges || []);
        setProjectName(proj.name || 'Untitled Project');
        setActiveProjectId(id);
      }
    } catch (e) {
      console.error("Failed to switch project", e);
    }
  }, []);

  const createProject = useCallback((name) => {
    const newId = 'proj-' + Date.now();
    const startNode = {
      id: `startNode-${Date.now()}`,
      type: 'startNode',
      position: { x: 250, y: 150 },
      data: { label: 'Start', title: 'Start Flow' },
      selected: true
    };
    setSelectedNode(startNode);
    setNodes([startNode]);
    setEdges([]);
    setProjectName(name);
    setActiveProjectId(newId);
  }, []);

  // Event handlers
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onUpdateNode = useCallback((id, data, shouldDelete = false) => {
    if (shouldDelete) {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedNode(null);
      return;
    }
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...data } };
        }
        return node;
      })
    );
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        className: node.id === highlightedNodeId ? 'executing-highlight' : '',
      }))
    );
    
    setEdges((eds) => 
      eds.map((edge) => ({
        ...edge,
        animated: edge.source === highlightedNodeId || edge.animated, 
        style: edge.source === highlightedNodeId 
          ? { stroke: '#38bdf8', strokeWidth: 4, filter: 'drop-shadow(0 0 6px #38bdf8)' } 
          : { stroke: '#818cf8', strokeWidth: 2 }
      }))
    );
  }, [highlightedNodeId, isLoaded]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    
    // Project management
    projectName,
    projectsList,
    activeProjectId,
    switchProject,
    createProject,

    // Existing context
    selectedNode,
    setSelectedNode,
    highlightedNodeId,
    setHighlightedNodeId,
    onNodeClick,
    onUpdateNode,
    isLoaded
  };
};
