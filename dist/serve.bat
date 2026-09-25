@echo off
rem Browsers cannot load the generated WASM data package directly over file://.
rem Loopback HTTP is sufficient; this compatibility build does not require HTTPS.
cd /d "%~dp0"
echo Open http://127.0.0.1:8123/ in your browser.
py -3 -m http.server 8123 --bind 127.0.0.1
