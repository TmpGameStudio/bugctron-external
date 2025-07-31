# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting Development
```bash
npm start
```
Starts the app in development environment with hot reload. This runs both the main process and renderer process with webpack dev server.

### Building
```bash
npm run build          # Build both main and renderer processes
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

This is an Electron React Boilerplate application with the following structure:

### Main Architecture
- **Electron Main Process**: `src/main/main.ts` - Controls application lifecycle, creates browser windows
- **Electron Renderer Process**: `src/renderer/` - React application that runs in the browser window
- **Preload Scripts**: `src/main/preload.ts` - Secure bridge between main and renderer processes

### Build System
- **Webpack Configuration**: `.erb/configs/` - Separate webpack configs for main, renderer, and preload processes
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
- IPC example implementation in `src/main/main.ts` (ipc-example channel)
- Preload script provides secure API bridge between main and renderer
- Use `ipcMain` in main process and `ipcRenderer` in preload script

### Development Environment
- Hot Module Replacement enabled for renderer process
- React Developer Tools automatically installed in development
- Source maps enabled for debugging
- Electronmon for main process auto-restart

### Testing Setup
- Jest configured with jsdom environment for React components
- Testing Library React for component testing
- Module mocking configured for assets and CSS

## Important Notes

- The app uses React Router with MemoryRouter for navigation
- Webpack builds are managed through .erb configurations
- Native dependencies are automatically rebuilt during postinstall
- The build system supports both development and production modes with different optimizations