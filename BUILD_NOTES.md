# Kano dashboard build notes

## Delivered routes

- `/` is the launcher recreated from the supplied 1280 × 800 screenshot. The screenshot is kept as the desktop background with accessible hotspots for the supported destinations and controls. Smaller screens use an app grid.
- `/story/` contains the existing Kano Story Mode static build. Its game data, JavaScript, WASM, and theme assets were moved under this path without changing their bytes. The route keeps the same site origin, so browser storage remains available, and adds a dashboard return link.
- `/code/` bundles the Kano Code editor. It stores workspaces in local browser storage. Kano World sign-in, sharing, and the separate online project portal are not included in the published editor package.
- `/art/` runs Kano Make Art in its existing offline mode. Drawings and challenge progress are kept in local browser storage; account, sharing, and telemetry services are disabled.

The remaining launcher tiles are shown for fidelity to the supplied image and report that they are unavailable in this browser release.

## Source snapshots

- Kano Code: `KanoComputing/kano-code`, upstream commit `4a913df11888652e33f3e72dfae3fd5b8d0f33cf` (GPL-2.0-or-later). The route uses the published `@kano/code` 3.0.1-alpha.51 package and the upstream default editor profile pattern.
- Kano Make Art: `KanoComputing/make-art`, upstream commit `288a6f02d80e5c729ed85663a159f69ad38b086d` (MIT). The source snapshot includes the offline browser adapter and npm-compatible API client update used by this build. The original API client lock entry referenced a package no longer available from npm.
- Dashboard route wrappers, screenshot reference, Linux launcher, and build scripts are included with the site source.
- Story Mode is an existing supplied build; its source project was not present in the Site checkout.

The source archive excludes dependency directories and generated build output. `src/art/main.js` expects the extracted Make Art snapshot at `../kano-apps/make-art` beside the Site checkout, matching the build workspace used here. Kano Code and Make Art licenses are copied into their published routes.

## Rebuild

Build the two Linux dashboard launchers from the Site checkout with:

```sh
bash src/native/linux/build.sh
```

This produces `artifacts/linux/kano-dashboard-linux-x86_64` and `artifacts/linux/kano-dashboard-linux-arm64`. Each package contains the dashboard screen and a small local HTTP server. It opens the hosted Story Mode, Kano Code, and Make Art routes in the default browser; those apps require an internet connection. A desktop session with `xdg-open` is required to open the browser automatically. Set `KANO_DASHBOARD_NO_OPEN=1` to leave the server running without opening a browser.

The Kano Code route is built from `src/code` using Vite. The Make Art route is built from `src/art` with the adjacent Make Art source snapshot. The complete static output is in `dist/` and can be served as a static directory.

## Verification

- Confirmed the dashboard reference PNG is byte-identical to the supplied screenshot.
- Checked that Story Mode data, script, WASM, and theme assets, plus Kano Code media/locales and Make Art challenge descriptors, are present in the static output.
- Confirmed the launchers are Linux x86-64 and AArch64 ELF executables and fetched the dashboard HTML, CSS, JavaScript, and image through the x86-64 package's local server.
- The managed Site build environment did not provide a compatible visual preview session; checks used the generated static output and the packaged local server.

## Publication

The public Site remains at `https://kano.retiredlake.chatgpt.site`. No custom domain was attached; add one after reviewing and approving the published result.
