export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  userAgent?: string;
  logs?: string[];
  screenshots?: string[];
  systemInfo?: {
    platform: string;
    version: string;
    memory: number;
  };
}

export interface BugReporterConfig {
  reportsDir: string;
  maxReports?: number;
  includeSystemInfo?: boolean;
  includeLogs?: boolean;
}
