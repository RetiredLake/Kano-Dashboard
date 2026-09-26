# Kano Dashboard

The launcher is a responsive React/Vinext app. `app/dashboard-client.tsx` owns the visible launcher and its one-page app model; add a future app to `launcherPages` there. The current app grid contains Kano Code and Make Art, with Story Mode presented as the featured experience.

## Routes

- `/` — dashboard and optional Sign in with ChatGPT.
- `/story/` — fullscreen Story Mode with Dashboard and fullscreen controls.
- `/code/` — Kano Code editor.
- `/art/` — Make Art workspace.

The two legacy workspaces are built as static Vite apps under `src/code` and `src/art`, then served from `public/code` and `public/art`. Story Mode's source files live in `src/story`; every Site build synchronizes them to `public/story` and patches LÖVE's IndexedDB save mount with cookie backup and restore.

## Development

Use Node.js 22.13 or newer and pnpm from `packageManager` in `package.json`.

```sh
pnpm install
pnpm run dev
pnpm run build
```

To rebuild Kano Code after changing its wrapper, run `npm --prefix src/code install` once and `npm --prefix src/code run build`. To rebuild Make Art, also have the pinned `KanoComputing/make-art` source checkout at `../kano-apps/make-art`; the prebuild step applies the tracked async-startup patch before bundling. Story Mode assets are copied and patched by the Site build.

All app workspaces save locally in the browser. The Settings menu can clear their local data and Story Mode progress; signing out uses the Site's ChatGPT sign-out route.
