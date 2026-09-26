# Kano Dashboard build notes

## Routes and behavior

- `/` is a responsive React/Vinext launcher. Story Mode is featured; the app list is data-driven and currently shows only Kano Code and Make Art. A one-page selector is retained for future pages.
- Anonymous visitors see Guest and Sign in with ChatGPT. The server reads Site identity headers and shows the account first name after sign-in. Signed-in visitors see an empty Staff Picks section.
- Settings opens Sign Out and Reset Experience. Reset clears this origin's app storage, IndexedDB databases, and Story Mode save cookies.
- `/code/` serves the Kano Code editor. English Blockly locale JSON is included under `/code/blockly/`, and editor loading errors stay visible.
- `/art/` serves Make Art in offline mode. The wrapper keeps its loading state until startup finishes and shows an error if a dependency fails.
- `/story/` fills the viewport with the game. Dashboard and fullscreen controls remain over the game, including in fullscreen, and Dashboard returns to `/`.

## Story Mode saves

The supplied LÖVE runtime still mounts IndexedDB for compatibility. After its existing save data loads, the patched runtime copies files below `/home/web_user/love` into same-origin cookies. A cookie save takes precedence on later visits; old IndexedDB saves migrate into cookies. The runtime refreshes cookies during play and when the page is hidden or unloaded. `scripts/test-story-cookie.mjs` checks migration, restore, and exit-time updates.

## Sources

- Kano Code: `KanoComputing/kano-code`, upstream commit `4a913df11888652e33f3e72dfae3fd5b8d0f33cf` (GPL-2.0-or-later), bundled from `@kano/code` 3.0.1-alpha.51.
- Kano Make Art: `KanoComputing/make-art`, upstream commit `288a6f02d80e5c729ed85663a159f69ad38b086d` (MIT). `src/art/patch-make-art-init.mjs` tracks the startup-promise patch used by the browser wrapper. Its build expects that source snapshot at `../kano-apps/make-art` beside this checkout.
- Story Mode is based on the supplied game build; the Site checkout contains the static runtime under `src/story`.

## Build and verification

Build the Kano Code workspace with `npm --prefix src/code run build`. Build Make Art with `npm --prefix src/art run build`. Both write to `public/`. The Site build also copies and patches Story Mode assets before compiling the Worker with the Sites `build-site.mjs` helper.

The regular `pnpm run build` command also prepares Story Mode and builds the Worker.

The Linux launchers open the hosted dashboard directly. Build them with `bash src/native/linux/build.sh`; outputs go to `artifacts/linux/`.

## Publication

The existing public Site is `https://kano.retiredlake.chatgpt.site`. No custom domain is attached.
