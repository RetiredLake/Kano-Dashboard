"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { execFile } = require("child_process");
const { URL } = require("url");

const webRoot = path.join(__dirname, "web");
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  let requested;
  try {
    requested = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "");
  } catch (error) {
    response.writeHead(400).end("Bad request");
    return;
  }
  if (!requested) requested = "index.html";

  const filePath = path.resolve(webRoot, requested);
  if (!filePath.startsWith(webRoot + path.sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    fs.createReadStream(filePath).pipe(response);
  });
});

server.listen(0, "127.0.0.1", () => {
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/`;
  process.stdout.write(`Kano Dashboard is available at ${url}\nPress Ctrl+C to close it.\n`);
  if (process.env.KANO_DASHBOARD_NO_OPEN !== "1") {
    execFile("xdg-open", [url], (error) => {
      if (error) process.stderr.write(`Open this address in a browser: ${url}\n`);
    });
  }
});

function stop() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1500).unref();
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
