import json
import socket
import subprocess
import tarfile
import tempfile
import time
import unittest
from pathlib import Path
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "artifacts/linux/hack-minecraft/hack-minecraft-linux-x86_64-v1.0.0.tar.gz"
ARM_ARCHIVE = ROOT / "artifacts/linux/hack-minecraft/hack-minecraft-linux-arm64-v1.0.0.tar.gz"


class LinuxBundleSmokeTests(unittest.TestCase):
    def test_x86_64_bundle_starts_serves_app_and_rejects_wrong_arch(self):
        self.assertTrue(ARCHIVE.is_file() and ARM_ARCHIVE.is_file(), "build both Linux bundles before running this smoke test")
        with tempfile.TemporaryDirectory(prefix="hack-minecraft-test-") as temp:
            for package in (ARCHIVE, ARM_ARCHIVE):
                with tarfile.open(package, "r:gz") as archive:
                    archive.extractall(temp, filter="data")
            bundle = Path(temp) / "hack-minecraft-linux-x86_64-v1.0.0"
            arm_bundle = Path(temp) / "hack-minecraft-linux-arm64-v1.0.0"

            mismatch = subprocess.run([str(arm_bundle / "launch-linux-arm64.sh"), "--no-open"], cwd=arm_bundle, capture_output=True, text=True)
            self.assertEqual(mismatch.returncode, 2)
            self.assertIn("This package is for ARM64", mismatch.stderr)

            with socket.socket() as reservation:
                reservation.bind(("127.0.0.1", 0))
                port = reservation.getsockname()[1]
            server = subprocess.Popen(
                [str(bundle / "launch-linux-x86_64.sh"), "--no-open", "--port", str(port)],
                cwd=bundle, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True,
            )
            try:
                base = f"http://127.0.0.1:{port}"
                for _ in range(30):
                    if server.poll() is not None:
                        self.fail(f"launcher exited early: {server.stderr.read()}")
                    try:
                        with urlopen(base + "/hack-minecraft/", timeout=0.25) as response:
                            page = response.read()
                            self.assertEqual(response.status, 200)
                            break
                    except OSError:
                        time.sleep(0.1)
                else:
                    self.fail("x86-64 Linux launcher did not serve the app")

                self.assertIn(b"Hack Minecraft", page)
                with urlopen(base + "/native/status", timeout=1) as response:
                    status = json.load(response)
                self.assertTrue(status["bridge"])
                self.assertTrue((bundle / "hack-minecraft/app.js").is_file())
                self.assertTrue((bundle / "hack-minecraft/world-core.wasm").is_file())
            finally:
                server.terminate()
                server.wait(timeout=3)
                if server.stderr:
                    server.stderr.close()


if __name__ == "__main__":
    unittest.main()
