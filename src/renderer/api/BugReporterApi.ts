import type { BugReport } from 'bugctron-core';
import log from 'electron-log/renderer';

export async function createBugReport(
  title: string,
  description: string,
  severity: BugReport['severity']
): Promise<BugReport> {
  log.info('Creating bug report', { title, severity });
  try {
    const report = await window.electronAPI.bugReporter.createReport(
      title,
      description,
      severity
    );
    log.info('Bug report created successfully', { id: report.id });
    return report;
  } catch (error) {
    log.error('Failed to create bug report', error);
    throw error;
  }
}

export async function getBugReports(): Promise<BugReport[]> {
  log.info('Fetching bug reports');
  try {
    const reports = await window.electronAPI.bugReporter.getReports();
    log.info('Bug reports fetched successfully', { count: reports.length });
    return reports;
  } catch (error) {
    log.error('Failed to fetch bug reports', error);
    throw error;
  }
}

export async function deleteBugReport(id: string): Promise<boolean> {
  log.info('Deleting bug report', { id });
  try {
    const result = await window.electronAPI.bugReporter.deleteReport(id);
    log.info('Bug report deleted successfully', { id, result });
    return result;
  } catch (error) {
    log.error('Failed to delete bug report', error);
    throw error;
  }
}
