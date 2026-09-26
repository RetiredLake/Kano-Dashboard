# Linux launchers

These executables open the Kano Dashboard Site in the default browser. They use the published Site so sign-in and all app routes stay on the same origin.

Build both architectures with:

```sh
bash src/native/linux/build.sh
```

The outputs are `artifacts/linux/kano-dashboard-linux-x86_64` and `artifacts/linux/kano-dashboard-linux-arm64`. Set `KANO_DASHBOARD_URL` to open another Site URL, or set `KANO_DASHBOARD_NO_OPEN=1` to print the address without opening a browser. A desktop Linux session with `xdg-open` is required for automatic browser launch.
