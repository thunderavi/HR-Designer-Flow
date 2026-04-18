/**
 * Mock API Layer for HR Workflow Designer
 */

const mockAutomations = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'add_to_slack', label: 'Notify Slack Channel', params: ['channel', 'message'] },
  { id: 'update_crm', label: 'Update HRIS Record', params: ['employeeId', 'status'] },
];

export const mockApi = {
  getAutomations: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAutomations;
  },

  simulateWorkflow: async (workflow) => {
    // Simulate complex processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { nodes, edges } = workflow;
    const errors = [];
    const logs = [];

    // Basic validation
    const startNode = nodes.find(n => n.type === 'startNode');
    if (!startNode) errors.push('Missing Start Node');

    const endNode = nodes.find(n => n.type === 'endNode');
    if (!endNode) errors.push('Missing End Node');

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // 1. Check for cycles using DFS (White-Gray-Black algorithm)
    const state = {}; // 0 = unvisited, 1 = visiting, 2 = visited
    nodes.forEach(n => state[n.id] = 0);
    let hasCycle = false;

    const dfs = (nodeId) => {
      state[nodeId] = 1; // visiting
      const outgoing = edges.filter(e => e.source === nodeId);
      for (let edge of outgoing) {
        if (state[edge.target] === 1) {
          hasCycle = true;
          return;
        }
        if (state[edge.target] === 0) {
          dfs(edge.target);
        }
      }
      state[nodeId] = 2; // visited
    };

    if (startNode) {
      dfs(startNode.id);
    } else {
      nodes.forEach(n => { if (state[n.id] === 0) dfs(n.id) });
    }

    if (hasCycle) {
      errors.push('Cycle Detected: Workflows must be Directed Acyclic Graphs (DAG). Please remove circular references.');
      return { success: false, errors };
    }

    // 2. Simple BFS to simulate execution path
    const visited = new Set();
    const queue = [startNode.id];
    
    while (queue.length > 0) {
      const currentId = queue.shift();
      if (visited.has(currentId)) continue;
      
      const node = nodes.find(n => n.id === currentId);
      visited.add(currentId);
      
      logs.push({
        nodeId: currentId,
        nodeLabel: node.data.label || node.data.title || node.type,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED'
      });

      // Find outgoing edges
      const outgoingEdges = edges.filter(e => e.source === currentId);
      outgoingEdges.forEach(e => queue.push(e.target));
    }

    // 3. Check for orphans
    if (visited.size < nodes.length) {
      const orphans = nodes.filter(n => !visited.has(n.id));
      logs.push({
        nodeId: 'system',
        nodeLabel: 'System Note',
        timestamp: new Date().toISOString(),
        status: `WARNING: ${orphans.length} node(s) were ignored because they weren't connected to the Start path.`
      });
    }

    return {
      success: errors.length === 0,
      logs,
      errors
    };
  }
};
