# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development Commands

### Starting Development

```bash
npm start              # Standard Electron app only
npm run start:dev      # Full development with package watching + Electron
npm run dev:packages   # Watch packages only (for separate terminal setup)
```

**Recommended Development Setup:**

- Single command: `npm run start:dev` - Runs package watchers + Electron with full hot reload
- Two terminal setup: `npm run dev:packages` (Terminal 1) + `npm start` (Terminal 2)

### Building

```bash
npm run build          # Build packages + main and renderer processes
npm run build:packages # Build workspace packages only
npm run build:main     # Build main process only
npm run build:renderer # Build renderer process only
npm run build:dll      # Build development DLL bundle
```

### Testing and Linting

```bash
npm test              # Run Jest tests
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
```

### Packaging

```bash
npm run package       # Package for production (local platform)
npm run rebuild       # Rebuild native dependencies
```

## Architecture Overview

This is a monorepo containing an Electron React application with shared packages for bug reporting
functionality.

### Monorepo Structure

```
bugctron-external/
├── packages/
│   ├── bugctron-core/    # Backend logic (Node.js/Electron main process)
│   └── bugctron-ui/      # React components (platform-agnostic)
├── src/                  # Electron application
└── package.json          # Workspace root
```

### Shared Packages

- **bugctron-core**: Backend functionality for bug reporting, file system access, and data
  management
- **bugctron-ui**: Reusable React components for bug reporting UI
- Both packages auto-build on `npm install` and can be imported directly:
  ```typescript
  import { BugReporter } from 'bugctron-core';
  import { BugReportWidget } from 'bugctron-ui';
  ```

### Main Architecture

- **Electron Main Process**: `src/main/main.ts` - Controls application lifecycle, creates browser
  windows
- **Electron Renderer Process**: `src/renderer/` - React application that runs in the browser window
- **Preload Scripts**: `src/main/preload.ts` - Secure bridge between main and renderer processes

### Build System

- **Webpack Configuration**: `.erb/configs/` - Separate webpack configs for main, renderer, and
  preload processes
- **Development DLL**: Auto-generated vendor bundle for faster development builds
- **TypeScript**: Full TypeScript support across all processes

### Key Directories

- `src/main/` - Electron main process code (Node.js environment)
- `src/renderer/` - React renderer process code (browser environment)
- `src/__tests__/` - Jest test files
- `.erb/` - Electron React Boilerplate configuration files
- `assets/` - Application icons and build resources
- `release/` - Build output directory

### IPC Communication

- Bug reporter IPC handlers in `src/main/main.ts` (bug-reporter:\* channels)
- API abstraction in `src/renderer/api/BugReporterApi.ts`
- Preload script provides secure API bridge between main and renderer
- Use `ipcMain` in main process and `ipcRenderer` in preload script

Example API usage:

```typescript
import { createBugReport } from './api/BugReporterApi';
const report = await createBugReport('Title', 'Description', 'high');
```

### Development Environment

- **Hot Module Replacement** enabled for renderer process
- **Package watching** with TypeScript compilation for live updates
- **React Developer Tools** automatically installed in development
- **Source maps** enabled for debugging
- **Electronmon** for main process auto-restart

### Package Development Workflow

- Packages auto-build on install via `postinstall` script
- Development watching: `npm run dev:packages` runs `tsc --watch` for both packages
- Changes in package `.tsx/.ts` files trigger recompilation and hot reload
- Package builds output to `packages/*/dist/` directories

### Testing Setup

- Jest configured with jsdom environment for React components
- Testing Library React for component testing
- Module mocking configured for assets and CSS

## Important Notes

- The app uses React Router with MemoryRouter for navigation
- Webpack builds are managed through .erb configurations
- Native dependencies are automatically rebuilt during postinstall
- The build system supports both development and production modes with different optimizations
