# Kano OS 4.3.3 dashboard investigation

## Right pane: exact OS behavior

Read-only extraction of the official Hopper Stretch image recovered 176 files below `/usr/share/kano-dashboard`. Extracted dashboard/live-tile files were checked against the package MD5 manifests in the same image (177 manifest entries checked). Full SHA-256 inventory: `kano-os-dashboard-assets.json`. The full extraction archive is stored in `docs/original-os-archives/Kano-OS-4.3.3-Dashboard-Assets.tar.gz`, outside the deployed public assets.

`KanoDashboard/Views/Home/content.qml` places Story Mode left, Apps middle, and `LatestView.Notifications` right. The name “Notifications” here refers to the right-pane selector, separate from the header bell. The exact selector is preserved in `os-evidence/right-pane.qml`.

Priority, highest first:
1. No Internet: offline alert.
2. Unmuted major OS update: major-update alert.
3. Unmuted available packages: package-update alert.
4. Unregistered Kano World profile: “Unlock Kano World”, SIGN UP and LOGIN cards (`kano-login --register` / `kano-login`).
5. Registered but unverified account: verification prompt.
6. Otherwise: Staff Picks, a 2×2 tile grid. Clicking a tile opens its URL in Chromium; More Creations launches Kano World.

The website retains its removed-login behavior. This change does not add a login, live connector, notifications behavior, wallpaper chooser, or Staff Picks gallery.

## API, cache and original fallback picks

The 2019 dashboard uses Mercury's KES dashboard live tiles client, not the older Profile `/share?featured=1` API. Its endpoint is `GET https://dlt.os.kes.kano.me/`, returning an object with a `tiles` array. OnlineLoader downloads tile covers. TileManager tries online unless cached-only or within the one-hour cooldown, then local cached tiles, then bundled defaults and initializes the cache. The cache is `$HOME/.kes-dlt-cli/cache.json`. The OS helper `update-dashboard-live-tiles` calls `TileManager.getTiles(False)`. Endpoint requests in this session returned HTTP 403; the older World featured-share endpoint returned HTTP 404. No working current online service is claimed.

The image's `/usr/lib/libmercury.so` contains the same endpoint and default titles as the upstream source below. The four current defaults are:

| Title | Creator | App |
|---|---|---|
| Sparkle Rainbow | holographicleah | Make Art (`kano-draw`) |
| Paints. | mikegreer | Make Apps (`make-apps`) |
| Neon Space Raiders | TyrantLizardRex | Make Art (`kano-draw`) |
| Fractal Tree | hicks | Make Art (`kano-draw`) |

Their exact covers were recovered from `/usr/share/kesdltc/images/`. The older dashboard also contains six Make Art covers and `default_shares.json`: Laughing Emoji Face (Sadness), Giraffe (annekebeatrix), snowy day (aurynlm), flame through the water (eben), Day-after-Day (alexxboo), Spring (TheMaxim3458). These are usable as a static offline gallery with creator attribution. They are covers and metadata, not recovered editable project files; do not promise an open-in-editor action.

Website assets and normalized metadata are at `/dashboard/staff-picks/manifest.json`. The legacy JSON remains byte-for-byte original, so its `cover` fields are OS paths; use the normalized manifest's `coverUrl` for web use. No online API calls have been added to the website.

## Icons and wallpapers

- Settings: byte-for-byte `KanoDashboard/Widgets/Apps/settings.png`.
- Empty bell: byte-for-byte `Widgets/Notifications/alerts_empty.png` (a slashed bell); displayed at the top right with accessible “No notifications” text and no click behavior.
- Nonempty bell: `alerts.png`; also recovered `alerts_close.png`. The OS draws the unread number as a separate badge, not into the bitmap. These states are stored but not implemented.
- Page selector: no bitmap exists. `Kano/Apps/app_grid_control.qml` draws a rounded outlined square with nine cells in a 3×3 grid, filled according to the number of apps on the page. The website now uses this geometry with five filled cells and four outlined cells; original QML is preserved under `os-evidence/`.
- All displayed icons use the original OS dark tint `#455054` through CSS masks, without rewriting the PNGs.
- The supplied wallpaper TAR contributes twenty native 16:9 Kano desktop wallpapers (1,243,543 bytes). The manifest also references the existing 31,773-byte original dashboard wallpaper rather than adding a duplicate. LXDE wallpapers, 1024/4:3 variants and duplicate default aliases are excluded from deployment. No chooser or selection prompt exists.

Original copyright notices are preserved in `os-evidence/dashboard-copyright`. Existing asset provenance is in `public/dashboard/ASSET-SOURCES.md`.

## Size and routes

Sizes are sums of deployed file bytes, uncompressed, after deployment cleanup. Directory allocation and transfer compression differ. Each route is on `https://kano.retiredlake.chatgpt.site`.

| App | MiB | URL |
|---|---:|---|
| Kano Code | 77.03 | https://kano.retiredlake.chatgpt.site/code/ |
| Make Art | 31.76 | https://kano.retiredlake.chatgpt.site/art/ |
| Make Minecraft | 103.97 | https://kano.retiredlake.chatgpt.site/make-minecraft/minecraft/ |
| Hack Minecraft | 25.49 | https://kano.retiredlake.chatgpt.site/hack-minecraft/ |
| Story Mode (additional featured experience) | 11.61 | https://kano.retiredlake.chatgpt.site/story/ |

Hack Minecraft's `web-bridge.js` and Make Minecraft's `original-web-backend.js` both load `/make-minecraft/original-ui/port/game/index.html`. Yes, they share that browser runtime; Hack's own 25.49 MiB directory does not include a second game. Their browser-world save behavior is inherited from that runtime. There is also a byte-identical preserved standalone copy at `/make-minecraft/{index.html,index.js,index.wasm,index.data}` totaling 36,101,904 bytes (34.43 MiB). Both copies are retained to preserve existing standalone routes and original app code.

Three tracked generated Python bytecode files were removed; `.gitignore` now prevents their return. `scripts/trim-deployment.mjs` continues excluding the unused 100,276-byte tutorial backup only from generated deployment output and now removes generated cache directories, `.pyc`/`.pyo`, `.tmp`, `.log` and `.DS_Store` files. Original source, app libraries, lesson data, game runtimes and videos remain intact. The actual build had zero further cache/temp bytes to remove. There is no evidence that deleting cache alone would substantially shrink the 252.33 MiB static payload (264,589,199 bytes). `node_modules` (~978 MiB), `.git`, local runtime state, download images and build caches are excluded from the clean source/deployment archives; runtime dependencies remain installed for development.

## Validation and publication status

Build and TypeScript passed. Four dashboard/Art tests and the Story save migration/restore test passed. Development and production HTTP checks verified all five app routes, twenty-one wallpaper URLs against their SHA-256 hashes, all four icon URLs and ten fallback covers. Dashboard-only ESLint had zero errors and eleven existing warnings. Public site requests returned HTTP 403 in this session, so external route behavior is not verified. Sites and Library connector tools are unavailable here; a local archive is not evidence of publication or a saved connected-library item. The dashboard controls, selected wallpapers and recovered assets were pushed to GitHub main (initial change `086771c`). Release asset upload was rejected with HTTP 401 on uploads.github.com despite working Git/API access; no completed release exists, and the compact extraction archive is committed under docs instead. The original app source is unchanged apart from deleting generated Python bytecode.

## Sources

- Official image: https://dl.os.kano.me/Kanux-Beta-latest-stretch-release.img.zip (redirects to Kano's archived 4.3.3 Hopper Stretch image).
- Supplied `Kano-OS-4.3.3-Wallpapers.tar`, recovered from the same OS version.
- Mercury upstream commit `e16b37ff64a9ac2deb4996a8af0ca024492b44e5`: https://github.com/KanoComputing/mercury/blob/e16b37ff64a9ac2deb4996a8af0ca024492b44e5/src/kes_dashboard_live_tiles_client/TileManager.cpp and neighboring OnlineLoader/DefaultTileLoader sources. Constants: `include/kes_dashboard_live_tiles_client/internal/OnlineLoader.h`.

Temporary downloaded OS ZIP and image partitions were deleted after the extraction archive was verified; 11.92 GiB of allocated workspace space was reclaimed. Clean deployment and source archives were prepared outside the checkout at approximately 127 MiB and 150 MiB compressed. They exclude node_modules, Git metadata and local runtime/download caches. Neither constitutes a published Site or a saved connected-Library item.

## Future-use icon archive

`public/dashboard/archives/Kano-OS-4.3.3-Dashboard-Icons.tar.gz` contains 43 original dashboard images/animations, including power, shutdown, reboot, logout, close, all bell states, audio/network status, boot warnings and speaker warnings. Original OS-relative paths avoid basename collisions; all bytes match the extracted source SHA-256 inventory. The archive includes its manifest and original copyright notices. At 363,156 compressed bytes (693,165 original image bytes), it is stored once in the deployed public assets; these extra symbols are not added as active controls. The companion manifest is `/dashboard/archives/manifest.json`. Website availability requires a successful Sites publication. `SITES-PUBLISH-HANDOFF.md` contains the authorized publication prompt.
