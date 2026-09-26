import importlib.util
import socket
import sys
import threading
import unittest
import json
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/native/linux/hack-minecraft/native_server.py"
SPEC = importlib.util.spec_from_file_location("hack_minecraft_native_server", SOURCE)
native = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = native
SPEC.loader.exec_module(native)


def one_shot_server(reply: bytes):
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.bind(("127.0.0.1", 0))
    listener.listen(1)
    port = listener.getsockname()[1]
    seen = []

    def serve():
        with listener:
            connection, _ = listener.accept()
            with connection:
                data = bytearray()
                while not data.endswith(b"\n"):
                    chunk = connection.recv(1024)
                    if not chunk:
                        break
                    data.extend(chunk)
                seen.append(bytes(data))
                if reply:
                    connection.sendall(reply)

    worker = threading.Thread(target=serve, daemon=True)
    worker.start()
    return port, seen, worker


class McpiBridgeTests(unittest.TestCase):
    def test_sends_newline_delimited_command_and_reads_reply(self):
        port, seen, worker = one_shot_server(b"41\n")
        result = native.mcpi_tcp_call("world.getBlock(0,1,0)", port=port, timeout=0.5)
        worker.join(timeout=1)
        self.assertEqual(result, "41")
        self.assertEqual(seen, [b"world.getBlock(0,1,0)\n"])

    def test_commands_cannot_inject_additional_protocol_lines(self):
        with self.assertRaisesRegex(ValueError, "Invalid MCPI API command"):
            native.mcpi_tcp_call("world.setBlock(0,1,0,1)\nchat.post(pwned)")

    def test_no_response_is_allowed_for_write_commands(self):
        port, seen, worker = one_shot_server(b"")
        result = native.mcpi_tcp_call("world.setBlock(0,1,0,1)", port=port, timeout=0.05)
        worker.join(timeout=1)
        self.assertIsNone(result)
        self.assertEqual(seen, [b"world.setBlock(0,1,0,1)\n"])


class LocalSiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        handler = partial(native.HackMinecraftHandler, directory=str(ROOT / "public"))
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.server.daemon_threads = True
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=1)

    def test_local_page_and_native_status_are_served(self):
        with urlopen(self.base + "/hack-minecraft/") as response:
            self.assertEqual(response.status, 200)
            self.assertIn(b"Hack Minecraft", response.read())
        with urlopen(self.base + "/native/status") as response:
            self.assertTrue(json.load(response)["bridge"])

    def test_bridge_blocks_cross_origin_posts_and_forwards_local_commands(self):
        payload = json.dumps({"commands": ["world.getBlock(0,1,0)"]}).encode()
        url = self.base + "/native/execute"
        request = Request(url, data=payload, headers={"Content-Type": "application/json", "Origin": "http://evil.test"})
        with self.assertRaises(HTTPError) as denied:
            urlopen(request)
        self.assertEqual(denied.exception.code, 403)

        port, seen, worker = one_shot_server(b"41\n")
        request = Request(url, data=payload, headers={"Content-Type": "application/json", "Origin": self.base})
        with patch.object(native, "MCPI_PORT", port):
            try:
                with urlopen(request) as response:
                    result = json.load(response)
            except HTTPError as error:
                self.fail(f"local API forwarding failed: {error.read().decode('utf-8', errors='replace')}")
        worker.join(timeout=1)
        self.assertEqual(result["results"], ["41"])
        self.assertEqual(seen, [b"world.getBlock(0,1,0)\n"])


if __name__ == "__main__":
    unittest.main()
