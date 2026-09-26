# Linux dashboard builds

The two executables contain the dashboard files and a small local HTTP server. Run one on its matching Linux architecture; it opens the dashboard in the default browser and serves the Story Mode, Kano Code, and Make Art links from the hosted Site. The connected applications need an internet connection. The package requires `xdg-open` and a desktop browser; `KANO_DASHBOARD_NO_OPEN=1` leaves the server running without opening a browser.

Build with `bash src/native/linux/build.sh`. The artifacts are `kano-dashboard-linux-x86_64` and `kano-dashboard-linux-arm64`.
