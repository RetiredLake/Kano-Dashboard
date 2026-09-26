"use strict";

const { execFile } = require("child_process");

const siteUrl = process.env.KANO_DASHBOARD_URL || "https://kano.retiredlake.chatgpt.site/";
process.stdout.write(`Kano Dashboard: ${siteUrl}\n`);

if (process.env.KANO_DASHBOARD_NO_OPEN === "1") {
  process.stdout.write("Open this address in a browser to continue.\n");
} else {
  execFile("xdg-open", [siteUrl], (error) => {
    if (error) {
      process.stderr.write(`Could not open a browser. Visit ${siteUrl}\n`);
      process.exitCode = 1;
    }
  });
}
