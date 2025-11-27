# Cross-Browser Extension Guide

This extension now supports both **Chrome/Edge** and **Mozilla Firefox** using the [webextension-polyfill](https://github.com/mozilla/webextension-polyfill/).

## What Was Changed

### 1. Added webextension-polyfill
- Installed `webextension-polyfill` package for cross-browser API compatibility
- Installed `@types/webextension-polyfill` for TypeScript support

### 2. Updated All Source Files
- Replaced `chrome.*` API calls with `browser.*` using the polyfill
- **Background script**: Uses ES module imports (`import browser from "webextension-polyfill"`)
- **Content & Popup scripts**: Use the global `browser` object provided by the polyfill loaded before them
- The polyfill automatically handles differences between browsers

### 3. Created Two Manifests
- **`manifest.json`**: For Chrome/Edge (uses `service_worker`)
- **`manifest.firefox.json`**: For Firefox (uses `scripts` array)
- Added `browser_specific_settings` for Firefox compatibility
- Extension ID: `tab-tangle@example.com` (change this for production)

Why two manifests? Firefox doesn't fully support service workers in Manifest V3 the same way Chrome does yet.

### 4. Updated Build Configuration
- Configured Vite to copy the polyfill to the dist folder
- Background script uses ES modules (supported in Manifest V3 service workers)
- Content and popup scripts load the polyfill separately in the manifest/HTML
- This approach ensures compatibility with both Chrome and Firefox

## Testing the Extension

### On Chrome/Edge

1. Build the extension:
   ```bash
   pnpm run build
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `dist` folder

6. The extension should now appear in your toolbar!

### On Firefox

1. Build the extension (same as Chrome):
   ```bash
   pnpm run build
   ```

2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`

3. Click "Load Temporary Add-on..."

4. **IMPORTANT**: Navigate to the `dist` folder and select **`manifest.firefox.json`** (not `manifest.json`)

5. The extension should now be loaded!

**Note**: Firefox temporary extensions are removed when Firefox closes. For permanent installation, you'll need to sign the extension through [addons.mozilla.org](https://addons.mozilla.org).

**Why a separate manifest?** Firefox doesn't fully support service workers in MV3 the same way Chrome does, so we use `background.scripts` instead of `service_worker`. See [FIREFOX_INSTALL.md](./FIREFOX_INSTALL.md) for details.

## Browser Compatibility

| Feature | Chrome | Edge | Firefox |
|---------|--------|------|---------|
| Tab Management | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ |
| Content Scripts | ✅ | ✅ | ✅ |
| Popup UI | ✅ | ✅ | ✅ |
| ES Modules | ✅ | ✅ | ✅ (109+) |

## Key Technical Details

### Manifest V3 Support
Both Chrome and Firefox now support Manifest V3 with service workers. The extension uses:
- Service workers (instead of background pages)
- Promises for asynchronous operations (instead of callbacks)
- ES modules for background service worker
- Global polyfill for content and popup scripts (loaded via manifest/HTML)

### API Compatibility
The webextension-polyfill ensures:
- Chrome's `chrome.*` namespace works (polyfill adds `browser.*` wrapper)
- Firefox's native `browser.*` namespace works
- Promise-based APIs work everywhere
- Callback-based APIs still work where needed

### How the Polyfill is Loaded
- **Content scripts**: `browser-polyfill.js` is loaded first in manifest's `content_scripts.js` array
- **Popup**: `browser-polyfill.js` is loaded via `<script>` tag before `popup.js`
- **Background (Chrome)**: Uses `importScripts('browser-polyfill.js')` in the service worker
- **Background (Firefox)**: Loads `browser-polyfill.js` first in the `scripts` array

### Minimum Versions
- **Firefox**: 109.0+ (for ES module support in service workers)
- **Chrome**: 109+ (for full Manifest V3 support)
- **Edge**: 109+ (Chromium-based)

## Development Workflow

1. Make changes to source files in `src/`
2. Build with `pnpm run build`
3. Test in both Chrome and Firefox
4. Reload the extension in each browser to see changes

### Auto-rebuild on Changes
```bash
pnpm run dev
```
This watches for file changes and rebuilds automatically.

## Publishing

### For Chrome Web Store
1. Zip the `dist` folder
2. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. The `browser_specific_settings` field is ignored by Chrome

### For Firefox Add-ons (AMO)
1. Zip the `dist` folder
2. Upload to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
3. The `browser_specific_settings.gecko.id` is required for Firefox
4. Change the extension ID before publishing

## Troubleshooting

### Extension Not Loading
- Check browser console for errors
- Ensure all icons exist in the `dist/icons/` folder
- Verify `manifest.json` syntax

### API Errors
- Confirm you're using `browser.*` not `chrome.*` in source files
- Check that webextension-polyfill is properly imported
- Verify the build includes the polyfill code

### Service Worker Issues
- Make sure `"type": "module"` is in manifest for ES module support
- Check service worker console in browser dev tools
- Look for import/export errors

## Resources

- [MDN: Build a cross-browser extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
- [webextension-polyfill GitHub](https://github.com/mozilla/webextension-polyfill/)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Documentation](https://extensionworkshop.com/)

