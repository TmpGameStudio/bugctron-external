import type React from 'react';
import type { BugReport } from 'bugctron-core';

export interface BugReportWidgetProps {
  onCreateReport: (
    title: string,
    description: string,
    severity: BugReport['severity']
  ) => Promise<BugReport>;
  onReportSubmit?: (report: BugReport) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface BugReportFormProps {
  onSubmit: (
    title: string,
    description: string,
    severity: BugReport['severity']
  ) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}
