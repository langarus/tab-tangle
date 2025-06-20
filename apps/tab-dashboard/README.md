# Tab Dashboard

A React web application that displays tab information received from the Chrome extension.

## Features

- Real-time display of Chrome tabs
- Grouped by browser windows
- Shows tab titles, URLs, and favicons
- Live connection status
- Server-sent events for real-time updates

## Development

### Start the development server

```bash
pnpm dev
```

This will start the React development server on port 3002.

### Development Mode

The dashboard runs as a single Vite development server - no separate API server needed since we use Chrome's runtime messaging for communication.

## Architecture

The app consists of two parts:

### API Server (`server.js`)

- Express.js server running on port 3001
- Receives tab data from Chrome extension via POST `/api/tabs`
- Provides health check endpoint at `/api/health`
- Streams real-time updates via Server-Sent Events at `/api/tabs/stream`

### React Frontend

- Vite + React app running on port 3002
- Displays tab information in a clean, organized interface
- Uses Tailwind CSS for styling
- Connects to API server via proxy configuration

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/tabs` - Receive tabs from extension
- `GET /api/tabs` - Get current tabs
- `GET /api/tabs/stream` - Server-sent events stream

## Usage

1. Start the dashboard: `pnpm dev`
2. Load the Chrome extension
3. Use the extension to send tabs to the dashboard
4. View real-time tab updates in the web interface

## Files Structure

- `server.js` - Express API server
- `src/App.tsx` - Main React component
- `src/components/TabList.tsx` - Tab display component
- `src/types.ts` - TypeScript type definitions
- `vite.config.ts` - Vite configuration with API proxy
