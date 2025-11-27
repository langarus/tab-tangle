# Build Instructions for Tab Tangle Firefox Extension

## Requirements

- **Operating System**: Linux, macOS, or Windows
- **Node.js**: Version 18.x or higher
- **pnpm**: Version 8.x or higher

## Installation

### 1. Install Node.js

Download and install Node.js from https://nodejs.org/ (version 18 or higher)

Verify installation:
```bash
node --version
```

### 2. Install pnpm

```bash
npm install -g pnpm
```

Verify installation:
```bash
pnpm --version
```

## Build Process

### 1. Navigate to the extension directory

```bash
cd apps/chrome-extension
```

### 2. Install dependencies

```bash
pnpm install
```

This will install all required dependencies listed in `package.json`, including:
- vite (build tool)
- typescript (compiler)
- webextension-polyfill (cross-browser compatibility)

### 3. Build the Firefox extension

```bash
pnpm run build-firefox
```

This command:
- Compiles TypeScript files to JavaScript
- Bundles the code using Vite
- Copies the Firefox-specific manifest and static assets
- Outputs the built extension to `dist-firefox/` directory

### 4. Verify the build

The `dist-firefox/` directory should contain:
- `manifest.json` (Firefox-specific manifest)
- `background.js` (background script)
- `content.js` (content script)
- `popup.js` (popup script)
- `popup.html` (popup HTML)
- `browser-polyfill.js` (WebExtension polyfill)
- `icons/` directory with extension icons

## Build Scripts

The build process is automated through the scripts defined in `package.json`:

```json
"build-firefox": "vite build --mode firefox"
```

The build configuration is defined in `vite.config.ts`, which:
- Sets the output directory to `dist-firefox` when mode is `firefox`
- Copies `src/manifest.firefox.json` as `manifest.json`
- Copies static assets (icons, HTML files, polyfill)
- Bundles and minifies the TypeScript source code

## Source Code Structure

```
apps/chrome-extension/
├── src/
│   ├── background.ts       # Background service worker
│   ├── content.ts          # Content script
│   ├── popup.ts            # Popup script
│   ├── popup.html          # Popup HTML
│   ├── manifest.json       # Chrome manifest
│   ├── manifest.firefox.json  # Firefox manifest
│   └── types/
│       └── globals.d.ts    # TypeScript declarations
├── public/
│   ├── icons/              # Extension icons
│   └── browser-polyfill.js # WebExtension polyfill
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Build configuration
└── tsconfig.json           # TypeScript configuration
```

## Notes

- The extension uses TypeScript which is compiled to JavaScript during the build
- Vite bundles and minifies the code for production
- The Firefox build uses a different manifest (`manifest.firefox.json`) than Chrome due to browser-specific requirements
- No external services or APIs are called during the build process
- The build is deterministic and should produce identical output given the same source code and dependency versions


