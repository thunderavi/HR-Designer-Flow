# HR Workflow Designer Prototype

This repository contains a fully functional, highly scalable front-end prototype for an HR Workflow Designer, designed using **React 19**, **Vite**, and **React Flow**.

This prototype exceeds the core requirements of designing a visual node-based editor by adding advanced state mechanics like local persistence, smooth dynamic resizers, comprehensive form evaluation interfaces, and cyclic graph testing.

## 🚀 How to Run

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the local development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (usually `http://localhost:5173`) in your browser to begin routing nodes.

## 🏗️ Architecture & Component Design

The application is structured into discrete layers strictly separating visual representation, business logic, and API mock handling.

- **`/components`**: Reusable infrastructure components. `WorkflowCanvas.jsx` handles strictly the React Flow instantiation, while `PropertiesPanel.jsx` and `SandboxPanel.jsx` act as distinct layout segments.
- **`/nodes`**: Encapsulates the visual presentation and internal state registration for each specific node. Node connectivity is omni-directional, with overlapping Target/Source handles leveraging CSS trickery for absolute placement.
- **`/hooks`**: Centralized custom `useWorkflow.js` state machine. Abstracting the nodes and edge lifecycle events allows us to effortlessly serialize the state representation for the Multi-Project engine or mock API simulation without triggering unnecessary full-app redraws.
- **`/api`**: `mockApi.js` provides simulated ASYNC external communication. It models server responses with intentional networking latency (`500ms`-`1500ms` ping delays).

## 🧠 Design Decisions & Assumptions

### 1. Unified State vs Local State
Initially, `@xyflow/react` instances maintain tight internal graph coordination. However, building decoupled UI systems (like the external Property Panel forms or the PDF exporter) demanded that the node registry be hoisted upward into `App.jsx` context. We opted to handle this via the `useWorkflow` custom hook instead of a heavy Redux provider to minimize dependency weight while maintaining absolute single-source-of-truth reliability.

### 2. Omni-Directional Routing (The User Requirement)
To prevent creating rigid left-to-right locked flows, every single Node Component type registers 4 distinct Handles (`target` and `source` explicitly overlapped mechanically on the Top, Bottom, Left, and Right). This allows the flowchart engine to mimic a freeform digital whiteboard, prioritizing HR Admin creative flexibility over rigid directional pipelines.

### 3. Native Dynamic Resizing
Rather than importing massive generic grid-system libraries (`react-resizable-panels`), we built a hyper-optimized custom React Resizer hook (`Resizer` in App.jsx). Native DOM mapping bypasses virtual shadow-DOM lags and prevents Vite module collision caching.

### 4. Robust Simulation API
The sandbox is not a superficial timing loop. `mockApi.js` actively executes formal data structure parsing:
- **Depth-First Search (DFS)** verifies that workflows represent a pure Directed Acyclic Graph (DAG) and actively rejects Circular Referencing (Cycles).
- **Breadth-First Search (BFS)** performs the logic sequence tracing and highlights "execution" logs dynamically. It strictly rejects Orphaned/Disconnected processes.

### 5. Multi-Project Persistent Engine
State preservation is critical for browser-based CAD/Diagrammatic tools. The workspace observes a unified debounce serialization structure pointing dynamically into `localStorage`. You can pivot freely between workflows without invoking data collisions. Every change seamlessly serializes to JSON.

## 🔮 What I Would Add with More Time
- **JSON Import/Export**: A literal button to upload/download a stringified JSON schema of a specific workspace, extending the proprietary localized LocalStorage.
- **Node Collision Padding**: Integrating physics packages (like dagre) to force overlapping nodes to repel each other smoothly and maintain perfect spatial spacing automatically.
- **Global Data Context Passing**: Enhancing the internal metadata variables to allow string interpolation between nodes (e.g., passing `{employee.Name}` natively from Node 1 deeply into the `<Automated_Node>` input values). 
- **Undo / Redo Buffer**: Introducing immutable snapshot logging linked to `Ctrl+Z` combinations.

## Evaluation Criteria Addressed
- **React Flow Mastery:** Omni handles, custom edges with labels, dynamically highlighted nodes on sandbox playback.
- **Scalable Codebase:** `useWorkflow` orchestrates logic cleanly out of presentation. The `/nodes` directory maps cleanly extending custom types simply via `NODE_TYPES`.
- **Intelligent Forms:** Polymorphic conditional rendering based cleanly upon the `actionId` drop down, dynamically deploying parameters dynamically queried from external pseudo-endpoints.
