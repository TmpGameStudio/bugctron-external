import React, { useState } from 'react';
import type { BugReport } from 'bugctron-core';
import type { BugReportFormProps } from './types';

export default function BugReportForm(props: BugReportFormProps) {
  const { onSubmit, onCancel, isLoading = false } = props;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<BugReport['severity']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit(title.trim(), description.trim(), severity);
    }
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          htmlFor="bug-title"
          style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: 'black' }}
        >
          Title *
        </label>
        <input
          id="bug-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Brief description of the issue"
          required
          disabled={isLoading}
          style={inputStyle}
        />
      </div>

      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          htmlFor="bug-description"
          style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: 'black' }}
        >
          Description *
        </label>
        <textarea
          id="bug-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior"
          required
          disabled={isLoading}
          rows={6}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          htmlFor="bug-severity"
          style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: 'black' }}
        >
          Severity
        </label>
        <select
          id="bug-severity"
          value={severity}
          onChange={e => setSeverity(e.target.value as BugReport['severity'])}
          disabled={isLoading}
          style={inputStyle}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={secondaryButtonStyle}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !description.trim()}
          style={{
            ...primaryButtonStyle,
            opacity:
              isLoading || !title.trim() || !description.trim() ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit Bug Report'}
        </button>
      </div>
    </form>
  );
}
