#!/usr/bin/env python3
"""Loopback-only static server and MCPI TCP bridge for the Linux web app."""

from __future__ import annotations

import argparse
import json
import re
import socket
import subprocess
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

MCPI_HOST = "127.0.0.1"
MCPI_PORT = 4711
MAX_BODY = 256 * 1024
MAX_COMMANDS = 1024
COMMAND_PATTERN = re.compile(r"^[A-Za-z][A-Za-z0-9_.]*\([^\r\n]{0,2048}\)$")


def mcpi_tcp_call(command: str, host: str = MCPI_HOST, port: int = MCPI_PORT, timeout: float = 0.3) -> str | None:
    """Send one newline-delimited MCPI API command and read its optional reply."""
    if not isinstance(command, str) or not COMMAND_PATTERN.fullmatch(command):
        raise ValueError("Invalid MCPI API command")
    with socket.create_connection((host, port), timeout=timeout) as client:
        client.settimeout(timeout)
        client.sendall((command + "\n").encode("utf-8"))
        if command.startswith(("world.setBlock(", "world.setBlocks(", "player.setPos(", "chat.post(")):
            return None
        result = bytearray()
        try:
            while len(result) <= 4096:
                chunk = client.recv(4096)
                if not chunk:
                    break
                result.extend(chunk)
                if b"\n" in chunk:
                    break
        except TimeoutError:
            pass
    line = bytes(result).split(b"\n", 1)[0].rstrip(b"\r")
    return line.decode("utf-8", errors="replace") if line else None


def game_api_reachable() -> bool:
    try:
        mcpi_tcp_call("world.getPlayerIds()", port=MCPI_PORT, timeout=0.18)
        return True
    except OSError:
        return False


class HackMinecraftHandler(SimpleHTTPRequestHandler):
    server_version = "HackMinecraftLocal/1.0"
    sys_version = ""

    def log_message(self, format: str, *args: object) -> None:
        print("[hack-minecraft] " + (format % args))

    def send_json(self, status: int, value: object) -> None:
        body = json.dumps(value, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def local_origin_allowed(self) -> bool:
        host = self.headers.get("Host", "")
        expected_hosts = {f"127.0.0.1:{self.server.server_port}", f"localhost:{self.server.server_port}"}
        return host in expected_hosts and self.headers.get("Origin") == f"http://{host}"

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/native/status":
            self.send_json(200, {"bridge": True, "game_reachable": game_api_reachable(), "api_host": MCPI_HOST, "api_port": MCPI_PORT})
            return
        if parsed.path == "/":
            self.send_response(302)
            self.send_header("Location", "/hack-minecraft/")
            self.end_headers()
            return
        super().do_GET()

    def do_POST(self) -> None:
        if urlparse(self.path).path != "/native/execute":
            self.send_error(404)
            return
        if not self.local_origin_allowed():
            self.send_error(403, "Local same-origin requests only")
            return
        if not self.headers.get("Content-Type", "").startswith("application/json"):
            self.send_error(415, "application/json required")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length < 1 or length > MAX_BODY:
                self.send_error(413, "Request body size out of range")
                return
            payload = json.loads(self.rfile.read(length))
            commands = payload.get("commands") if isinstance(payload, dict) else None
            if not isinstance(commands, list) or len(commands) > MAX_COMMANDS:
                self.send_error(400, "commands must be a bounded list")
                return
            results = [mcpi_tcp_call(command, port=MCPI_PORT) for command in commands]
        except (UnicodeDecodeError, json.JSONDecodeError, ValueError, OSError) as error:
            self.send_json(503, {"error": str(error)})
            return
        self.send_json(200, {"ok": True, "results": results})


def open_browser(port: int) -> None:
    url = f"http://127.0.0.1:{port}/hack-minecraft/"
    subprocess.Popen(["xdg-open", url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=4173)
    parser.add_argument("--no-open", action="store_true")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    handler = partial(HackMinecraftHandler, directory=str(root))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    server.daemon_threads = True
    print(f"Hack Minecraft: http://127.0.0.1:{args.port}/hack-minecraft/")
    if not args.no_open:
        threading.Timer(0.5, open_browser, args=(args.port,)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Hack Minecraft.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
