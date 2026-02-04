# Tab Tangle 🐱

**Tame your wild tabs.** A privacy-first browser extension for recovering tab hoarders.

Your browser looks like a squeezed accordion. You have 47 tabs open and you're scared to close any of them. Sound familiar?

Tab Tangle helps you wrangle the chaos — with a little help from some friendly cats.

> No tracking. No data collection. Your tabs stay on your device, where they belong.

https://github.com/user-attachments/assets/9c818a65-55d8-46db-bc79-c30ac1d92a07

## Features

- **Visual Dashboard** — See all your tabs organized by timeline, windows, or domains
- **Instant Search** — Find any tab in milliseconds (yes, even that recipe from 3 weeks ago)
- **Duplicate Detection** — Spot and squash duplicate tabs with one click
- **Bulk Actions** — Close 20 tabs at once. It's okay. Let them go.
- **Cat-Named Windows** — Your browser windows are now managed by Whiskers, Luna, Oliver, and friends 🐈
- **Dark Mode** — For late-night tab hunting

## Installation

**Get the extension:**

| Browser | Link                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| Chrome  | [Chrome Web Store](https://chromewebstore.google.com/detail/tab-tangle/glflinnnffehfcoppoelhapbiclbkaap)      |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tab-tangle/)                                 |
| Edge    | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tab-tangle/bjodmggncigdnbhhmjpkblmnajhpnlmf) |

**Use the dashboard:** [tab-tangle.com](https://www.tab-tangle.com)

## How It Works

Tab Tangle uses a neat trick: the extension is just a lightweight messenger. The real magic happens in a full web dashboard.

```
🧩 Extension          →  listens to your tabs
📨 Content Script     →  bridges the communication
🖥️ Web Dashboard      →  where you actually see and manage everything
```

Why? Because web apps are nicer than tiny popups. And we can update the dashboard without waiting for extension store reviews.

## Development

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0

### Quick Start

```bash
# Clone it
git clone https://github.com/langarus/tab-tangle.git
cd tab-tangle

# Install dependencies
pnpm install

# Start development
pnpm dev
```

This runs:

- Web dashboard at `http://localhost:3002`
- Extension build in watch mode

### Building

```bash
pnpm build
```

Outputs:

- `apps/web/dist/` — Web dashboard
- `apps/chrome-extension/dist-chrome/` — Chrome extension
- `apps/chrome-extension/dist-firefox/` — Firefox extension

### Loading the Extension Locally

**Chrome:**

1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" → select `apps/chrome-extension/dist-chrome`

**Firefox:**

1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on" → select `apps/chrome-extension/dist-firefox/manifest.json`

### Environment Variables

```bash
cp apps/web/.env.example apps/web/.env
```

Firebase config is optional — only needed if you want auth features.

## Project Structure

```
tab-tangle/
├── apps/
│   ├── web/                 # React dashboard (Vite + TailwindCSS)
│   └── chrome-extension/    # Browser extension (works on Chrome/Firefox/Edge)
└── packages/
    ├── eslint-config/       # Shared lint rules
    └── typescript-config/   # Shared TS config
```

## Privacy

This is a **privacy-first** project:

- All data stays in your browser
- No analytics, no tracking, no telemetry
- No accounts required
- Nothing leaves your device
- Open source — don't trust us, verify

## Tech Stack

- React 18 + TypeScript
- TailwindCSS
- Vite + Turborepo
- WebExtension API with browser-polyfill

## Contributing

Found a bug? Want a feature? PRs welcome!

## Support

If Tab Tangle helped you tame your tabs, consider buying me a coffee:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/chaos67)

## License

[MIT](LICENSE) — do whatever you want with it.

---

_Built for tab hoarders, by a recovering tab hoarder._ 🐱
