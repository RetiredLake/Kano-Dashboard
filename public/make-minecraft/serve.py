#!/usr/bin/env python3
"""Serve the repository with headers required by the WebAssembly pthread build."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class IsolatedRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
    }

    def end_headers(self):
        # Avoid conditional 304 responses for Emscripten's preloaded .data
        # package and generated assets during local reloads.
        self.send_header("Cache-Control", "no-store")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")
        super().end_headers()

    def send_head(self):
        # SimpleHTTPRequestHandler otherwise answers If-Modified-Since with
        # 304 and no body; Emscripten's package loader expects the data bytes.
        if "If-Modified-Since" in self.headers:
            del self.headers["If-Modified-Since"]
        return super().send_head()


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8124)
    parser.add_argument("--directory", type=Path, default=PROJECT_ROOT)
    args = parser.parse_args(argv)

    directory = args.directory.expanduser().resolve()
    handler = partial(IsolatedRequestHandler, directory=str(directory))
    with ThreadingHTTPServer((args.host, args.port), handler) as server:
        print(
            "Serving {} at http://{}:{}/ (Ctrl+C to stop)".format(
                directory, args.host, args.port
            ),
            flush=True,
        )
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.", flush=True)


if __name__ == "__main__":
    main()
