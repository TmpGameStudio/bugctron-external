import log from 'electron-log';
import { ipcMain, shell } from 'electron';
import FileSystemService from './FileSystemService';
import type { BugReport, BugReporterConfig } from './types';

const logPrefix = '[BugReporter Core]';

export default class BugReporter {
  private config: BugReporterConfig;

  private fsService: FileSystemService;

  constructor(config: BugReporterConfig) {
    this.config = {
      maxReports: 100,
      includeSystemInfo: true,
      includeLogs: true,
      ...config,
    };
    this.fsService = new FileSystemService(this.config.reportsDir);
  }

  init(): void {
    log.info(`${logPrefix} BugReporter: Initializing IPC handlers`);

    ipcMain.handle(
      'bug-reporter:create-report',
      async (event, title: string, description: string, severity: string) => {
        log.info(
          `${logPrefix} BugReporter: Received create-report request - ${title}`
        );
        return this.createReport(title, description, severity as any);
      }
    );

    ipcMain.handle('bug-reporter:get-reports', async () => {
      log.info(`${logPrefix} BugReporter: Received get-reports request`);
      return this.getReports();
    });

    ipcMain.handle('bug-reporter:delete-report', async (event, id: string) => {
      log.info(
        `${logPrefix} BugReporter: Received delete-report request - ${id}`
      );
      return this.deleteReport(id);
    });
  }

  async createReport(
    title: string,
    description: string,
    severity: BugReport['severity'] = 'medium'
  ): Promise<BugReport> {
    const report: BugReport = {
      id: BugReporter.generateId(),
      title,
      description,
      severity,
      timestamp: new Date(),
    };

    if (this.config.includeSystemInfo) {
      report.systemInfo = await BugReporter.getSystemInfo();
    }

    if (this.config.includeLogs) {
      report.logs = await BugReporter.getRecentLogs();
    }

    await this.saveReport(report);
    log.info(`${logPrefix} Bug report created: ${report.id}`);

    // Open the reports folder
    try {
      await shell.openPath(this.config.reportsDir);
      log.info(`${logPrefix} Opened reports folder: ${this.config.reportsDir}`);
    } catch (error) {
      log.error(`${logPrefix} Failed to open reports folder:`, error);
    }

    return report;
  }

  async getReports(): Promise<BugReport[]> {
    return this.fsService.loadReports();
  }

  async deleteReport(id: string): Promise<boolean> {
    return this.fsService.deleteReport(id);
  }

  private async saveReport(report: BugReport): Promise<void> {
    await this.fsService.saveReport(report);
    await this.cleanupOldReports();
  }

  private async cleanupOldReports(): Promise<void> {
    if (!this.config.maxReports) return;

    const reports = await this.getReports();
    if (reports.length > this.config.maxReports) {
      const sortedReports = reports.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const reportsToDelete = sortedReports.slice(this.config.maxReports);
      await Promise.all(
        reportsToDelete.map(report => this.deleteReport(report.id))
      );
    }
  }

  private static generateId(): string {
    return `bug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async getSystemInfo() {
    const os = await import('os');
    return {
      platform: os.platform(),
      version: os.release(),
      memory: os.totalmem(),
    };
  }

  private static async getRecentLogs(): Promise<string[]> {
    return [];
  }
}
