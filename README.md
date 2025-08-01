# Bugctron

A monorepo Electron React application for bug reporting functionality.

Built with [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

## Architecture

This is a monorepo containing an Electron React application with shared packages:

```
bugctron-external/
├── packages/
│   ├── bugctron-core/    # Backend logic (Node.js/Electron main process)
│   └── bugctron-ui/      # React components (platform-agnostic)
├── src/                  # Electron application
└── package.json          # Workspace root
```

## Install

Install dependencies:

```bash
npm install
```

## Development

### Starting Development

```bash
npm start              # Standard Electron app only
npm run start:dev      # Full development with package watching + Electron (recommended)
npm run dev:packages   # Watch packages only (for separate terminal setup)
```

### Building

```bash
npm run build          # Build packages + main and renderer processes
npm run build:packages # Build workspace packages only
```

### Testing

```bash
npm test              # Run Jest tests
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)