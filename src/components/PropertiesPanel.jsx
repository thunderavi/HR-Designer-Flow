import React, { useEffect, useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { NODE_TYPES } from '../constants/workflow';
import { mockApi } from '../api/mockApi';
import '../styles/properties.css';

const KeyValueEditor = ({ items = [], onChange }) => {
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    onChange(newItems);
  };

  const addItem = () => onChange([...items, { key: '', value: '' }]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="dynamic-params">
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input placeholder="Key" value={item.key} onChange={(e) => updateItem(i, 'key', e.target.value)} style={{ flex: 1 }} />
          <input placeholder="Value" value={item.value} onChange={(e) => updateItem(i, 'value', e.target.value)} style={{ flex: 1 }} />
          <button onClick={() => removeItem(i)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      ))}
      <button onClick={addItem} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px', borderRadius: '4px', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
        <Plus size={14} /> Add Field
      </button>
    </div>
  );
};

const PropertiesPanel = ({ selectedNode, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({});
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data || {});
    }
  }, [selectedNode]);

  useEffect(() => {
    mockApi.getAutomations().then(setAutomations);
  }, []);

  if (!selectedNode) return null;

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(selectedNode.id, updatedData);
  };

  const renderField = (label, field, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        value={formData[field] || ''}
        placeholder={placeholder}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    </div>
  );

  const renderForm = () => {
    switch (selectedNode.type) {
      case NODE_TYPES.START:
        return (
          <>
            {renderField('Start Title', 'title', 'text', 'e.g., Onboarding')}
            <div className="form-group">
              <label>Metadata Key-Value Pairs</label>
              <KeyValueEditor items={formData.metadata || []} onChange={(val) => handleChange('metadata', val)} />
              <p className="field-hint">Add custom keys for workflow tracking</p>
            </div>
          </>
        );

      case NODE_TYPES.TASK:
        return (
          <>
            {renderField('Task Title', 'title')}
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            {renderField('Assignee', 'assignee', 'text', 'Search users...')}
            {renderField('Due Date', 'dueDate', 'date')}
            <div className="form-group">
              <label>Optional Custom Fields</label>
              <KeyValueEditor items={formData.customFields || []} onChange={(val) => handleChange('customFields', val)} />
            </div>
          </>
        );

      case NODE_TYPES.APPROVAL:
        return (
          <>
            {renderField('Approval Title', 'title')}
            <div className="form-group">
              <label>Approver Role</label>
              <select
                value={formData.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
              </select>
            </div>
            {renderField('Auto-approve Threshold (%)', 'threshold', 'number')}
          </>
        );

      case NODE_TYPES.AUTOMATED_STEP:
        return (
          <>
            {renderField('Step Title', 'title')}
            <div className="form-group">
              <label>Action</label>
              <select
                value={formData.actionId || ''}
                onChange={(e) => handleChange('actionId', e.target.value)}
              >
                <option value="">Select Action</option>
                {automations.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
            {formData.actionId && (
              <div className="dynamic-params" style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '16px', fontWeight: 'bold' }}>Action Parameters</label>
                {automations.find(a => a.id === formData.actionId)?.params.map(param => (
                  <div key={param} className="form-group" style={{ marginBottom: '12px' }}>
                    <label style={{ textTransform: 'capitalize' }}>{param}</label>
                    <input
                      placeholder={`Enter ${param}...`}
                      value={formData.params?.[param] || ''}
                      onChange={(e) => {
                        const newParams = { ...(formData.params || {}), [param]: e.target.value };
                        handleChange('params', newParams);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        );

      case NODE_TYPES.END:
        return (
          <>
            {renderField('End Message', 'message')}
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="summary-flag"
                checked={!!formData.summaryFlag}
                onChange={(e) => handleChange('summaryFlag', e.target.checked)}
              />
              <label htmlFor="summary-flag">Include Summary Report</label>
            </div>
          </>
        );

      case NODE_TYPES.CUSTOM:
        return (
          <>
            {renderField('Card Title', 'title', 'text', 'e.g., My Custom Card')}
            <div className="form-group">
              <label>Custom Fields</label>
              <KeyValueEditor items={formData.customFields || []} onChange={(val) => handleChange('customFields', val)} />
            </div>
          </>
        );

      default:
        return <p>Select a node to edit its properties.</p>;
    }
  };

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>Edit Node</h3>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      <div className="panel-content">
        {renderForm()}
      </div>
      <div className="panel-footer">
        <button className="btn-delete" onClick={() => onUpdate(selectedNode.id, null, true)}>
          <Trash2 size={16} /> Delete Node
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
