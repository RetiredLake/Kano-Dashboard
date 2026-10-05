# Hack Minecraft recovery

Recovered from Kano OS 4.3.3 Hopper Stretch, `/usr/share/make-minecraft/www`.
Although the package and executable are named `make-minecraft`, the app title,
launcher descriptor, and UI say **Hack Minecraft**. This is the newer Polymer
powers/challenges editor, separate from the earlier Blockly Make Minecraft UI.

The UI is shipped as bundled HTML/JavaScript, not opaque machine code. Recovery
preserves its templates, blocks, generators, assets and challenge content.
`web-bridge.js` replaces the Qt WebChannel bindings with the existing PE 0.6.1
WebAssembly/Pi API runtime from the Make Minecraft port. There is one shared
game runtime, with independent editor/progress storage. The preserved Tab toggle
is forwarded across the frame boundary. Accounts and remote analytics are disabled.

Compatibility edits: local asset paths, hash routing, v0 Web Components polyfill,
frame input forwarding, native-window geometry mapped to DOM geometry.
