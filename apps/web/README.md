# Tab Tangle - Web Dashboard

React web application that serves as the visual dashboard for Tab Tangle.

## Features

- Real-time display of browser tabs
- Multiple view modes: Timeline, Windows, Domains
- Instant search across all tabs
- Duplicate tab detection
- Bulk close operations
- Dark mode support

## Development

```bash
# From the root of the monorepo
pnpm dev

# Or directly
cd apps/web && pnpm dev
```

The dashboard runs on `http://localhost:3002`.

## Architecture

The dashboard communicates with the browser extension via a content script bridge:

1. **Content Script** (`content.ts` in the extension) injects into the dashboard page
2. **CustomEvents** pass messages between the dashboard and content script
3. **Extension Background** manages actual tab operations

This architecture allows:
- Rich web app UI (not limited by extension popup constraints)
- Easy updates (no extension store review needed for dashboard changes)
- Separation of concerns

## Communication Protocol

| Event | Direction | Purpose |
|-------|-----------|---------|
| `TABS_UPDATE` | Extension → Dashboard | Send current tab list |
| `REQUEST_TABS` | Dashboard → Extension | Request fresh tab data |
| `CLOSE_TAB` | Dashboard → Extension | Close a single tab |
| `CLOSE_TABS` | Dashboard → Extension | Close multiple tabs |
| `SWITCH_TO_TAB` | Dashboard → Extension | Focus a specific tab |

## Environment Variables

See `.env.example` for available configuration options.
