import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, List } from 'lucide-react';
import { mockApi } from '../api/mockApi';
import '../styles/sandbox.css';

const SandboxPanel = ({ nodes, edges, onSimulateNode }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('logs');

  const handleSimulate = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      const resp = await mockApi.simulateWorkflow({ nodes, edges });
      setResults(resp);
      
      if (resp.success && resp.logs) {
        // Visual simulation: highlight nodes in sequence
        for (const log of resp.logs) {
          onSimulateNode(log.nodeId);
          await new Promise(r => setTimeout(r, 600));
        }
        onSimulateNode(null); // Clear highlight
      }
    } catch (err) {
      setResults({ success: false, errors: ['Simulation failed unexpectedly'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sandbox-panel">
      <div className="sandbox-header">
        <div className="title">
          <Play size={16} fill="currentColor" />
          <span>Workflow Sandbox</span>
        </div>
        <button 
          className="run-btn" 
          onClick={handleSimulate} 
          disabled={loading}
        >
          {loading ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>

      <div className="sandbox-content">
        {!results && !loading && (
          <div className="empty-state">
            <RotateCcw size={40} opacity={0.2} />
            <p>Click "Run Simulation" to test your workflow logic.</p>
          </div>
        )}

        {results && (
          <>
            <div className="status-banner" data-success={results.success}>
              {results.success ? (
                <><CheckCircle2 size={16} /> Workflow Valid</>
              ) : (
                <><AlertTriangle size={16} /> Validation Errors</>
              )}
            </div>

            <div className="tabs">
              <button 
                className={activeTab === 'logs' ? 'active' : ''} 
                onClick={() => setActiveTab('logs')}
              >
                Logs
              </button>
              <button 
                className={activeTab === 'errors' ? 'active' : ''} 
                onClick={() => setActiveTab('errors')}
              >
                Errors ({results.errors?.length || 0})
              </button>
            </div>

            <div className="tab-pane">
              {activeTab === 'logs' && (
                <div className="log-list">
                  {results.logs?.map((log, i) => (
                    <div key={i} className="log-item">
                      <span className="time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className="msg">Executed <strong>{log.nodeLabel}</strong></span>
                    </div>
                  ))}
                  {(!results.logs || results.logs.length === 0) && <p className="no-data">No logs available</p>}
                </div>
              )}

              {activeTab === 'errors' && (
                <div className="error-list">
                  {results.errors?.map((err, i) => (
                    <div key={i} className="error-item">
                      <AlertTriangle size={14} />
                      <span>{err}</span>
                    </div>
                  ))}
                  {(!results.errors || results.errors.length === 0) && <p className="no-data">No errors found</p>}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SandboxPanel;
