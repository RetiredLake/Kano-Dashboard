# Kano Code web route

This route bundles the published Kano Code editor (`@kano/code` 3.0.1-alpha.51) into `/code/`. It uses the upstream `DefaultEditorProfile`, Blockly editor, default output, and local-storage plugin pattern. Blockly locale JSON is published under `/code/blockly/` because the Site runtime reserves `node_modules` URLs. Workspaces stay in browser storage on this Site origin. Kano World account services and the separate online project portal are not part of this editor package.

The package is GPL-2.0-or-later. Source: https://github.com/KanoComputing/kano-code
