# HR Workflow Designer Prototype

This repository contains the functional prototype for the HR Workflow Designer module, built as part of the Full Stack Engineering assessment for Tredence Analytics. The application provides an intuitive visual editor that allows HR admins to safely build, configure, and simulate complex workflows.

## How to Run

1. Clone or extract the repository folder.
2. Install the necessary dependencies (assumes Node.js is installed locally):
   ```bash
   npm install
   ```
3. Boot the local Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (usually `http://localhost:5173`) in your browser to begin creating workflows.

## Architecture

The application is structured into discrete, highly-modular layers that strictly separate visual presentation, internal component states, and mock external API dependencies.

- **`src/components/`**: Reusable structural interface panels. `WorkflowCanvas.jsx` manages the core React Flow instantiation mapping, while `PropertiesPanel.jsx` and `SandboxPanel.jsx` handle node-specific context mutation and sandbox log streams smoothly.
- **`src/nodes/`**: Encapsulates the explicit visual presentation and layout schemas for defined specific UI node objects (e.g., Task, Approval, Automated). Handle connection schemas are abstracted carefully.
- **`src/hooks/useWorkflow.js`**: A centralized custom state management hook. Hoisting the nodes and edge lifecycle events dynamically to `App.jsx` allows for safe serialization of the system state (for Local Storage persistence and project switching mechanisms) without coupling UI representation layers into heavy generic state components.
- **`src/api/mockApi.js`**: Directly simulates asynchronous external backend communication parameters. It models standardized network processing delays alongside handling complete data integrity validations off thread (DFS cycle processing, BFS pathway simulations).

## Design Decisions

- **Unified Custom Hook over Global Providers:** I decided to maintain the node registry strictly inside a single `useWorkflow` custom hook instead of bloating the ecosystem with Redux. This enforces a 100% reliable single-source-of-truth accessible from any separated UI component safely, directly mapping to standard React lifecycle parameters.
- **Omni-Directional Edge Routing:** To prevent inadvertently building a locked, rigid left-to-right visual pipeline, every Node Component type actively registers four explicit Source and Target connection endpoints. This mechanically enables fluid node branching matching native whiteboard logic without collision mapping issues.
- **Native Dynamic Workspace Resizing:** Instead of importing heavyweight grid-system library dependencies for the app layout structure, the main application panels rely on a completely custom, hyper-optimized React `Resizer` Hook built exclusively tracking raw viewport coordinate deltas for buttery-smooth unconstrained flex adjustments without component lag.
- **Structural API Simulation Constraints:** The mock algorithm does not pretend execution; it structurally evaluates the React Flow nodes logic directly. Utilizing basic algorithmic principles (Depth-First Search DFS), it strictly evaluates and protects the integrity of the Directed Acyclic Graph (DAG) state, gracefully halting when dangerous structural Circular Execution logic (Cycles) or missing path orphans are detected.

## What I Completed vs. What I Would Add with More Time

### What I Completed
- Architected the complete foundational React Flow Canvas, inclusive of specific Node validations, dynamic configurable attribute tracking, and seamless layout transitions.
- Integrated a comprehensive `PropertiesPanel` utilizing polymorphic generic property mapping responding identically dynamically based upon API data responses (the Automations schema generator).
- Delivered a step-by-step visual Sandbox execution engine accurately flagging data structures and emitting runtime logs accurately.
- Additionally enhanced application fidelity by delivering Local Storage Workspace persistency scaling arrays out dynamically for multiple workflows simultaneously alongside a highly integrated zero-dependency DOM-to-PDF export utility context snap capture package structure.

### What I Would Add with More Time
- **Schema Import/Export Utility**: Adding explicit `JSON` parsing modules natively hooking to the local storage interface to allow human users to directly download, pass offline, and directly upload raw `.json` configurations between localized environments easily.
- **Spatial Auto-Layout Optimization**: Implementing directed graph positioning libraries (like `dagre`) mapping to a "Beautify Flow" function to intelligently untangle heavily nested or overly complex structural graph connections programmatically into aligned visual trees.
- **Interconnected Data Contexts**: Defining a secondary schema dictionary bridging early workflow steps deeper into the downstream nodes natively. For instance, parsing raw interpolation strings inside Automated Step Node `To:` emails (e.g. mapping `{employee_email}` generated inside Node 1 dynamically directly resolving cleanly upon node execution sequence later).
- **Undo / Redo Safety Buffers**: Appending a stack buffer mapping into `useWorkflow.js` capable of listening internally and rolling back exact component mutations across arbitrary state jumps safely.
