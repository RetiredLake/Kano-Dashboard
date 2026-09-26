(function () {
  "use strict";

  function installFullscreenControl() {
    var loadingCanvas = document.getElementById("loadingCanvas");
    var gameCanvas = document.getElementById("canvas");
    var stage = document.createElement("div");
    stage.id = "game-stage";
    stage.style.cssText = "position:relative;display:inline-block;line-height:0;background:#000";
    loadingCanvas.parentNode.insertBefore(stage, loadingCanvas);
    stage.appendChild(loadingCanvas);
    stage.appendChild(gameCanvas);

    // Keep only the game canvas and its control visible in fullscreen. The
    // page title and decorative background deliberately remain outside this
    // wrapper, while the canvas retains its aspect ratio inside the screen.
    var fullscreenStyle = document.createElement("style");
    fullscreenStyle.textContent =
      "#game-stage:fullscreen,#game-stage:-webkit-full-screen{" +
      "width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000}" +
      "#game-stage:fullscreen #canvas,#game-stage:-webkit-full-screen #canvas{" +
      "max-width:100vw;max-height:100vh;width:auto;height:auto}";
    document.head.appendChild(fullscreenStyle);

    var button = document.createElement("button");
    button.id = "fullscreen-toggle";
    button.type = "button";
    button.title = "Enter fullscreen";
    button.setAttribute("aria-label", "Enter fullscreen");
    button.style.cssText = "position:fixed;top:14px;right:14px;z-index:1000;width:44px;height:44px;padding:9px;border:0;border-radius:8px;background:rgba(11,86,117,.82);color:#fff;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25);line-height:normal";
    button.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>';

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
        var root = stage;
      if (fullscreenElement()) {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document);
      } else {
        var enter = root.requestFullscreen || root.webkitRequestFullscreen;
        if (enter) enter.call(root);
      }
    });
    document.addEventListener("fullscreenchange", updateLabel);
    document.addEventListener("webkitfullscreenchange", updateLabel);
    // The control belongs to the page chrome, not the game stage. Because the
    // browser only presents descendants of the fullscreen element, it drops
    // out automatically in game fullscreen; Escape is the standard exit path.
    document.body.appendChild(button);
  }

  function showFileProtocolWarning() {
    var loadingCanvas = document.getElementById("loadingCanvas");
    var gameCanvas = document.getElementById("canvas");
    if (loadingCanvas) loadingCanvas.style.display = "none";
    if (gameCanvas) gameCanvas.style.display = "none";

    var warning = document.createElement("section");
    warning.style.cssText = "max-width:760px;margin:3rem auto;padding:1.5rem;background:#fff;color:#0b5675;font:20px/1.5 sans-serif";
    warning.innerHTML = "<h2>A local web server is required</h2>" +
      "<p>This WebAssembly build cannot load its game data from a <code>file://</code> URL. " +
      "Run <code>serve.sh</code> (Linux/macOS) or <code>serve.bat</code> (Windows) in this folder, " +
      "then open <code>http://127.0.0.1:8123/</code>. HTTPS is not required on localhost.</p>";
    document.body.insertBefore(warning, document.body.firstChild);
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

  if (window.location.protocol === "file:") {
    installFullscreenControl();
    showFileProtocolWarning();
    return;
  }

  installFullscreenControl();

  // Preserve love.js's required load order: preload game.data through game.js,
  // then initialize the Emscripten LÖVE runtime.
  loadScript("game.js", function () {
    loadScript("love.js", function () {
      applicationLoad(this);
    });
  });
})();
