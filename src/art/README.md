# Make Art web route

This is the Kano Make Art repository's browser app bootstrapped under `/art/`. Its upstream source is MIT-licensed: https://github.com/KanoComputing/make-art. The browser build uses the app's existing offline mode: drawings and challenge progress stay in local browser storage; Kano account, sharing, and telemetry services are disabled. A small compatibility adapter stores completed challenge IDs locally because the API client version pinned by the upstream lockfile depends on a package no longer present in npm.

The route is built with the Vite wrapper here and the upstream source snapshot recorded in `BUILD_NOTES.md` at the Site root.
