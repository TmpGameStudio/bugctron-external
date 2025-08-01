// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import type { BugReport } from 'bugctron-core';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  bugReporter: {
    createReport: (
      title: string,
      description: string,
      severity: BugReport['severity']
    ): Promise<BugReport> =>
      ipcRenderer.invoke(
        'bug-reporter:create-report',
        title,
        description,
        severity
      ),
    getReports: (): Promise<BugReport[]> =>
      ipcRenderer.invoke('bug-reporter:get-reports'),
    deleteReport: (id: string): Promise<boolean> =>
      ipcRenderer.invoke('bug-reporter:delete-report', id),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
contextBridge.exposeInMainWorld('electronAPI', electronHandler);

export type ElectronHandler = typeof electronHandler;
