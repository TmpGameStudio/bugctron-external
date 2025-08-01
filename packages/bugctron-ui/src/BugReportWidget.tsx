import React, { useState } from 'react';
import type { BugReport } from 'bugctron-core';
import BugReportForm from './BugReportForm';
import type { BugReportWidgetProps } from './types';

export default function BugReportWidget(props: BugReportWidgetProps) {
  const { onReportSubmit, onCreateReport, className = '', style } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    title: string,
    description: string,
    severity: BugReport['severity']
  ) => {
    if (!onCreateReport) {
      // eslint-disable-next-line no-console
      console.error('onCreateReport prop is required');
      return;
    }

    setIsLoading(true);
    try {
      const report = await onCreateReport(title, description, severity);
      onReportSubmit?.(report);
      setIsOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create bug report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className={`bug-report-trigger ${className}`}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
          ...style,
        }}
        onClick={() => setIsOpen(true)}
        title="Report a bug"
      >
        🐛
      </button>
    );
  }

  return (
    <div
      className="bug-report-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <h2 style={{ margin: '0 0 16px 0', color: 'black' }}>Report a Bug</h2>
        <BugReportForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
