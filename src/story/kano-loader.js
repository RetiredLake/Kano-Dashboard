(function () {
  "use strict";

  function installStageControls() {
    var loadingCanvas = document.getElementById("loadingCanvas");
    var gameCanvas = document.getElementById("canvas");
    var stage = document.createElement("main");
    stage.id = "game-stage";
    stage.className = "game-stage";
    loadingCanvas.parentNode.insertBefore(stage, loadingCanvas);
    stage.appendChild(loadingCanvas);
    stage.appendChild(gameCanvas);

    var dashboard = document.createElement("a");
    dashboard.id = "launcher-link";
    dashboard.href = "/";
    dashboard.target = "_top";
    dashboard.setAttribute("aria-label", "Return to the Kano dashboard");
    dashboard.textContent = "‹ Dashboard";
    stage.appendChild(dashboard);

    var button = document.createElement("button");
    button.id = "fullscreen-toggle";
    button.type = "button";
    button.title = "Enter fullscreen";
    button.setAttribute("aria-label", "Enter fullscreen");
    button.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>';

    function fullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || null;
    }

    function updateLabel() {
      var exiting = Boolean(fullscreenElement());
      var label = exiting ? "Exit fullscreen" : "Enter fullscreen";
      button.title = label;
      button.setAttribute("aria-label", label);
    }

    button.addEventListener("click", function () {
      if (fullscreenElement()) {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document);
        return;
      }
      var enter = stage.requestFullscreen || stage.webkitRequestFullscreen;
      if (enter) {
        var result = enter.call(stage);
        if (result && typeof result.catch === "function") {
          result.catch(function (error) { console.error("Could not enter fullscreen", error); });
        }
      }
    });

    document.addEventListener("fullscreenchange", updateLabel);
    document.addEventListener("webkitfullscreenchange", updateLabel);
    stage.appendChild(button);
  }

  function showFileProtocolWarning() {
    var loadingCanvas = document.getElementById("loadingCanvas");
    var gameCanvas = document.getElementById("canvas");
    if (loadingCanvas) loadingCanvas.style.display = "none";
    if (gameCanvas) gameCanvas.style.display = "none";

    var warning = document.createElement("section");
    warning.className = "file-protocol-warning";
    warning.innerHTML = "<h1>A local web server is required</h1>" +
      "<p>This WebAssembly build cannot load its game data from a <code>file://</code> URL. " +
      "Run <code>serve.sh</code> (Linux/macOS) or <code>serve.bat</code> (Windows) in this folder, " +
      "then open <code>http://127.0.0.1:8123/</code>.</p>";
    document.body.appendChild(warning);
  }

  function loadScript(source, onload) {
    var script = document.createElement("script");
    script.src = source;
    script.onload = onload;
    script.onerror = function () {
      Module.setStatus("Could not load " + source + "; check the browser console");
    };
    document.body.appendChild(script);
  }

  installStageControls();

  if (window.location.protocol === "file:") {
    showFileProtocolWarning();
    return;
  }

  // The game data is preloaded by game.js, so keep the Emscripten load order.
  loadScript("game.js", function () {
    loadScript("love.js", function () {
      applicationLoad(this);
    });
  });
})();
