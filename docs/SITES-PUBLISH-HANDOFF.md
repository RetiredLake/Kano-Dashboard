[$sites](app://connector_20205bf7d4e99a89d7154bb849718324) Publish the latest Kano Dashboard to the existing Site on my behalf.

Repository: https://github.com/RetiredLake/Kano-Dashboard
Branch: main
Existing Site: https://kano.retiredlake.chatgpt.site
Existing Sites project ID from .openai/hosting.json: appgprj_6ab6cca384ec8191b23b3a2bcb14fc49

Use the latest main commit, including the original-dashboard-icon archive and this handoff. Use the existing checkout in the isolated cloud task; do not create a worktree or a replacement Site. Read repository/agent instructions and the available Sites skill before using its supported build and publication tools. I authorize publication; no additional confirmation is needed. Library saving can be skipped.

This is a publication task. Preserve the original apps, their source, lessons, libraries, static assets and both existing Minecraft runtime copies. Keep login removed. Keep the empty notification bell display-only. Do not add notifications, a wallpaper chooser, a live Staff Picks connector, new generated artwork, or additional dashboard controls. All other original icons are stored for future use, not activated.

The latest changes include:
- Original gear and empty/full/close bell assets, with only the empty bell displayed.
- A page indicator translated from the original QML's 3x3 geometry.
- Twenty native 16:9 Kano wallpapers and the reused existing dashboard wallpaper. No LXDE, lower-resolution variants or duplicate aliases.
- Ten original Staff Picks fallback covers with creator metadata, stored without a live connector or gallery.
- public/dashboard/archives/Kano-OS-4.3.3-Dashboard-Icons.tar.gz: 43 original dashboard images/animations including power, reboot, logout, status and warning symbols; archive manifest and copyright notices are included. Its external manifest is public/dashboard/archives/manifest.json. This archive must be included in the published Site.
- docs/original-os-archives/Kano-OS-4.3.3-Dashboard-Assets.tar.gz: the full extraction, kept outside deployed public assets.
- Generated Python bytecode removal and deployment cache/temp cleanup; original app code is unchanged.

Use Node >=22.13.0 and pnpm 11.25.0. If dependencies need installation, use a frozen lockfile. One verified installation form, run from the checkout root, is:

    COREPACK_HOME="$PWD/.sites-runtime/corepack" CI=true corepack pnpm install --frozen-lockfile --prod=false --store-dir "$PWD/.sites-runtime/pnpm-store" --cache-dir "$PWD/.sites-runtime/pnpm-cache" --package-import-method clone-or-copy

Do not use install:ci during this publication task: its configuration commands modify tracked .npmrc. For a local build without regenerating tracked Story assets, run from the checkout root:

    node --import ./scripts/sites-env.mjs ./node_modules/vinext/dist/cli.js build
    node scripts/trim-deployment.mjs

If the Sites plugin provides its own required build/publication workflow, follow that workflow while preserving original app files. Deploy the resulting server Worker and the complete client static assets through the supported Sites publishing tools; a build alone does not publish. Exclude node_modules, .git, .sites-runtime, .next/.vinext build caches, local .wrangler state, OS image downloads, temporary extraction tools and unrelated research checkouts from the upload. Do not remove original app code or media to meet a size limit. The static payload is about 253 MiB uncompressed; the latest icon archive adds approximately 355 KiB. Investigate a concrete upload error before changing the payload.

Existing validation passed: framework build, TypeScript, four dashboard/Art tests, Story save/restore checks, all five local app routes, wallpaper asset hashes, original icon URLs and fallback covers. Available checks:

    node node_modules/typescript/bin/tsc --noEmit --incremental false
    node --test tests/dashboard-pwa.test.js tests/make-art-navigation.test.js
    node scripts/test-story-cookie.mjs

After publication completes, verify these public URLs and expected content:
- / : dashboard, original settings icon, display-only empty bell, no login.
- /code/ : Kano Code.
- /art/ : Make Art.
- /make-minecraft/minecraft/ : Make Minecraft.
- /hack-minecraft/ : Hack Minecraft.
- /story/ : Story Mode.
- /dashboard/archives/Kano-OS-4.3.3-Dashboard-Icons.tar.gz : downloadable valid archive, including KanoDashboard/Widgets/PowerMenu/power.png and warning images.
- /dashboard/archives/manifest.json : 43 assets with SHA-256 hashes.
- /dashboard/icons/alerts.png : stored nonempty bell.
- /dashboard/wallpapers/manifest.json : twenty native 16:9 wallpapers plus the reused dashboard wallpaper.

Hack and Make Minecraft share /make-minecraft/original-ui/port/game/index.html. Details and measured app sizes are in docs/KANO-OS-DASHBOARD-REPORT.md.

Report the deployed commit/version, the Site URL, completed publication status, and verification results. Earlier sessions lacked Sites connector tools and external requests returned HTTP 403; do not treat those earlier results as a current publication result. If the tools are still unavailable or publication fails, name the concrete blocker and do not claim that GitHub push or a local build published the Site.
