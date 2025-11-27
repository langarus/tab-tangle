# Installing on Firefox

## For Firefox Users

When installing on Firefox, you need to use the **Firefox-specific manifest** because Firefox handles background scripts differently than Chrome.

### Installation Steps

1. **Build the extension** (if not already built):
   ```bash
   pnpm run build
   ```

2. **Open Firefox** and navigate to:
   ```
   about:debugging#/runtime/this-firefox
   ```

3. **Click "Load Temporary Add-on..."**

4. **IMPORTANT**: Navigate to the `dist` folder and select **`manifest.firefox.json`** (NOT `manifest.json`)

5. The extension should now load successfully!

## Why Two Manifests?

- **`manifest.json`**: For Chrome/Edge (uses `service_worker`)
- **`manifest.firefox.json`**: For Firefox (uses `scripts` array)

Firefox doesn't fully support service workers in Manifest V3 the same way Chrome does yet, so we need to use the traditional `background.scripts` approach for Firefox.

## What's Different?

### Chrome Manifest (`manifest.json`)
```json
"background": {
  "service_worker": "background.js"
}
```
- Uses a service worker
- Loads polyfill via `importScripts()`

### Firefox Manifest (`manifest.firefox.json`)
```json
"background": {
  "scripts": ["browser-polyfill.js", "background.js"]
}
```
- Uses background scripts array
- Loads polyfill first, then background script

Both approaches work correctly and provide the same functionality!

## Troubleshooting

### Error: "background.service_worker is currently disabled"
This means you tried to load `manifest.json` (Chrome version) in Firefox. Make sure to select **`manifest.firefox.json`** instead.

### Extension Disappears After Restarting Firefox
Temporary add-ons in Firefox are removed when you close the browser. This is normal for development. For permanent installation, you would need to:
1. Package the extension as a `.zip` file
2. Sign it through [addons.mozilla.org](https://addons.mozilla.org)
3. Install the signed version

## Testing

After installation:
1. Open any webpage (including `http://localhost:3002`)
2. The extension icon should appear in your toolbar
3. Click it to test the popup
4. Navigate to your dashboard to test the content script connection

Everything should work identically to the Chrome version!


