import { promises as fs } from 'fs';
import { join } from 'path';
import log from 'electron-log';
import type { BugReport } from './types';

const logPrefix = '[FileSystemService]';

export default class FileSystemService {
  private reportsDir: string;

  constructor(reportsDir: string) {
    this.reportsDir = reportsDir;
  }

  async saveReport(report: BugReport): Promise<void> {
    await this.ensureReportsDir();
    const filePath = join(this.reportsDir, `${report.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(report, null, 2), 'utf8');
  }

  async loadReports(): Promise<BugReport[]> {
    try {
      await this.ensureReportsDir();
      const files = await fs.readdir(this.reportsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      const reports = await Promise.all(
        jsonFiles.map(async file => {
          try {
            const filePath = join(this.reportsDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            return JSON.parse(content) as BugReport;
          } catch (error) {
            log.warn(`${logPrefix} Failed to load report ${file}:`, error);
            return null;
          }
        })
      );

      const validReports = reports.filter(
        (report): report is BugReport => report !== null
      );

      return validReports.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      log.warn(`${logPrefix} Failed to load reports:`, error);
      return [];
    }
  }

  async deleteReport(id: string): Promise<boolean> {
    try {
      const filePath = join(this.reportsDir, `${id}.json`);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      log.warn(`${logPrefix} Failed to delete report ${id}:`, error);
      return false;
    }
  }

  async saveScreenshot(reportId: string, screenshot: Buffer): Promise<string> {
    await this.ensureReportsDir();
    const screenshotPath = join(this.reportsDir, `${reportId}_screenshot.png`);
    await fs.writeFile(screenshotPath, screenshot);
    return screenshotPath;
  }

  private async ensureReportsDir(): Promise<void> {
    try {
      await fs.access(this.reportsDir);
    } catch {
      await fs.mkdir(this.reportsDir, { recursive: true });
    }
  }
}
