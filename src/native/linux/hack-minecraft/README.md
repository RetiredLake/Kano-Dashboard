# Hack Minecraft Linux bundle

This bundle runs the same Hack Minecraft lesson app and browser MCPI adapter as the hosted Site, including the compiled WebAssembly block store. It serves the files locally and includes a loopback-only HTTP bridge to the MCPI-Reborn TCP API on `127.0.0.1:4711`.

## Run

```sh
tar -xzf hack-minecraft-linux-x86_64-v1.0.0.tar.gz
cd hack-minecraft-linux-x86_64-v1.0.0
./launch-linux-x86_64.sh
```

Use `launch-linux-arm64.sh` for the ARM64 package. Both need Python 3, Bash, and a desktop browser (`xdg-open` is used to open the UI). The architecture wrappers check `uname -m`; the app itself is static HTML, CSS, and JavaScript and has no compiled architecture-specific components.

The local page always runs its own browser sandbox. If an MCPI-Reborn game is already running with its API on port 4711, pressing **MAKE** also sends the corresponding MCPI API commands to that game. The bridge binds only to loopback, accepts same-origin JSON commands, and never exposes the game socket to the network.

Install MCPI-Reborn separately using its official GNU/Linux package for your architecture. Its native client is derived from Minecraft: Pi Edition and expects game data obtained by the user; this bundle contains no Minecraft client binary, textures, sounds, or PE `.so` library. A PE 0.6.1 `libminecraftpe.so` is an optional sound input in MCPI-Reborn's documented setup, not the web lesson runtime.

## Build and test

From the Site checkout, run `bash src/native/linux/hack-minecraft/build-packages.sh`. This creates one x86-64 and one ARM64 tarball with `SHA256SUMS`. Both archives contain the same architecture-independent page assets and standard-library Python bridge. The current environment can smoke-test the x86-64 launcher; ARM64 execution requires an ARM64 Linux host.
