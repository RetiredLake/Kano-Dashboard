Original Kano OS 4.3.3 Hopper dashboard assets. Copied byte-for-byte from /usr/share/icons/Kano/88x88/apps/{kano-code,make-minecraft,kano-draw}.png in the official Stretch image. Favicon uses the original kano-code.png.
Source: https://dl.os.kano.me/Kanux-Beta-latest-stretch-release.img.zip

V17: make-minecraft-logo.png is the original green cube from KanoComputing/kano-apps, kano_qt_apps/fixtures/app_icons/make-minecraft.png. projects-logo.png is apps/icons/projects.png from the same repository. Neither is cropped from a screenshot. PWA icons are resized copies of the existing Kano Code favicon.

V17 original OS artwork, copied byte-for-byte from the Kano OS 4.3.3 kit filesystem:
- wallpaper.png: /usr/share/kano-dashboard/KanoDashboard/wallpaper.png (1920x1080).
- judoka-avatar.png: /usr/share/kano-dashboard/KanoDashboard/Widgets/LiveTile/judoka.png (54x54).
- story-mode-tile.png: deterministic composite of Widgets/StoryMode/story.png (317x316) and story-mode.png (198x132), title resized with nearest-neighbor to 158x105 and placed bottom-left fully visible. No save data or generated artwork.

Original OS asset extraction update:
- icons/settings.png: KanoDashboard/Widgets/Apps/settings.png.
- icons/alerts_empty.png, icons/alerts.png, icons/alerts_close.png: KanoDashboard/Widgets/Notifications/. Unread numbers are separate QML badges.
- The bottom page selector is a CSS translation of the original procedural Kano/Apps/app_grid_control.qml, not a generated illustration or recovered bitmap.
- wallpapers/: twenty native 16:9 wallpapers from the supplied Kano-OS-4.3.3-Wallpapers.tar. The manifest reuses the existing dashboard wallpaper. LXDE, 1024/4:3 variants and aliases are excluded.
- staff-picks/: four current Mercury KESDLTC fallback covers from /usr/share/kesdltc/images and six legacy Make Art covers plus original default_shares.json from /usr/share/kano-dashboard/default_shares. manifest.json retains creator credits and exposes local cover URLs; no online connector exists.

All added PNGs are byte-for-byte original assets. Inventory, behavior, attribution and deployment size findings are in docs/KANO-OS-DASHBOARD-REPORT.md. Original package notices are retained in docs/os-evidence/dashboard-copyright (PNG assets: Kano Computing Ltd., all rights reserved; QML/code: GPL-2+).

Future-use original icon archive: `/dashboard/archives/Kano-OS-4.3.3-Dashboard-Icons.tar.gz` contains 43 original non-wallpaper images/animations under their OS-relative KanoDashboard paths, including power menu and warning symbols. Its manifest records original SHA-256 hashes; original notices are included. No additional controls are activated by this archive.
