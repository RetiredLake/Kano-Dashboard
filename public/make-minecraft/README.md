# Make Minecraft — PE 0.6.1-alpha reference web port

From this extracted folder run:

```sh
python3 serve.py --directory . --port 8124
```

Open http://127.0.0.1:8124/make-minecraft.html for the coding app, or
http://127.0.0.1:8124/minecraftpe.html for the standalone game.
Do not use file://. Localhost HTTP works; remote hosting should use HTTPS,
serve `.wasm` as `application/wasm`, and retain the included server's
cross-origin isolation headers. This reference runtime uses Asyncify rather
than the older custom build's pthreads.

Built with Emscripten 5.0.1 from SanGraphic/MCPEweb's recovered `web-build.zip`,
with Kano's preserved original HTML/CSS/Blockly interface, seed, generators and lesson predicates,
and a direct in-process Pi API bridge. No LÖVE runtime is used. The original
source archive is not modified. See SOURCE.json and SHA256SUMS for provenance.

World saves use IndexedDB mounted at `/games`; world files are at
`/games/com.mojang/minecraftWorlds/`. Lesson progress uses localStorage.
Both are tied to the browser profile and exact origin, including port.
Clearing site data deletes them. The previous custom web build's `/persist`
saves are not automatically migrated. Quit to the game title before closing;
the runtime synchronizes world files to IndexedDB after closing world storage.
Double-click the centered Kano World card to enter it. If a quick click is
missed, use a brief held click. Single-click reliability remains under review.
Escape opens the pause menu.

Reset Kano World is available after quitting to title. It retains the previous
world in a timestamped backup and leaves other worlds and lesson progress alone.
All 13 minimal lesson fixtures passed in a real Chromium game with advancing
frames; restored seed and recoverable backup survived an actual reload.
Normal gameplay save/reload also passed after fixing the missing quit-path
IndexedDB sync: a changed block survived Quit to title, page reload and reopening.
The original interface's Make button, lessons 1 and 2, original XP awards and
progress after reload were tested interactively. The user confirmed audible
game sound and successful block placement. These checks do not prove every
tutorial solution or full input parity. Retired online services are not restored.

The default editor is under `original-ui/make-minecraft/minecraft/`.
Make opens the game over the editor; Back to Make Minecraft returns to coding.
Select Kano World on first launch. Export and import use browser downloads and
the file picker. Challenge progress starts at 1 in a separate original-interface
profile, preserving earlier custom-editor progress. The former custom editor is
retained at `custom-make-minecraft.html` for archival comparison.

This is an archival development release, not an official Kano or Mojang release.
Original assets retain their upstream licenses; do not assume permission to
redistribute proprietary assets publicly.
