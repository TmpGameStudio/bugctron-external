import React from 'react';
import type { BugReport } from 'bugctron-core';

interface BugReportListProps {
  reports: BugReport[];
  onDeleteReport?: (id: string) => void;
}

export default function BugReportList({
  reports,
  onDeleteReport,
}: BugReportListProps) {
  const getSeverityColor = (severity: BugReport['severity']) => {
    switch (severity) {
      case 'low':
        return '#28a745';
      case 'medium':
        return '#ffc107';
      case 'high':
        return '#fd7e14';
      case 'critical':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  if (reports.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
        No bug reports found.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {reports.map(report => (
        <div
          key={report.id}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {report.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  backgroundColor: getSeverityColor(report.severity),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                {report.severity}
              </span>
              {onDeleteReport && (
                <button
                  type="button"
                  onClick={() => onDeleteReport(report.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  title="Delete report"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <p style={{ margin: '0 0 12px 0', color: '#555', lineHeight: '1.5' }}>
            {report.description}
          </p>

          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            <div>ID: {report.id}</div>
            <div>Created: {formatDate(report.timestamp)}</div>
            {report.systemInfo && (
              <div>
                System: {report.systemInfo.platform} {report.systemInfo.version}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

BugReportList.defaultProps = {
  onDeleteReport: undefined,
};
