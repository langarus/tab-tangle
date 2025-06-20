# Chrome Extension

A Chrome extension that reads open tabs and sends them to the Tab Dashboard web app.

## Features

- Reads all open tabs from all Chrome windows
- Sends tab information (title, URL, favicon) to the dashboard
- Simple popup interface for manual tab synchronization
- Real-time connection status

## Development

### Build the extension

```bash
pnpm dev
```

This will build the extension and watch for changes in development mode.

### Load the extension in Chrome

1. Build the extension first: `pnpm build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `dist/` folder from this directory

### Usage

1. Make sure the Tab Dashboard app is running on `http://localhost:3002`
2. Open the dashboard in a Chrome tab
3. The extension will automatically connect and start sending live tab updates
4. Click the extension icon to view connection status
5. Click "Open Dashboard" to view the dashboard

## Files Structure

- `src/manifest.json` - Extension configuration
- `src/background.ts` - Background service worker
- `src/popup.ts` - Popup interface logic
- `src/popup.html` - Popup interface HTML
- `src/content.ts` - Content script (runs on pages)
- `vite.config.ts` - Build configuration

## Permissions

The extension requires these permissions:

- `tabs` - To read tab information
- `activeTab` - To access the active tab
- `storage` - For storing extension settings
