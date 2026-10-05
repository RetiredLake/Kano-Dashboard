// Browser adapter for the unmodified kit-app-ui shipped with Kano OS 4.3.3.
// Native updates/devices are unavailable here; lessons and progress stay local.
class LocalBus {
  constructor() { this.listeners = new Map(); }
  on(name, callback) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(callback);
    return this;
  }
  removeListener(name, callback) { this.listeners.get(name)?.delete(callback); return this; }
  removeAllListeners(name) { name ? this.listeners.delete(name) : this.listeners.clear(); return this; }
  once(name, callback) {
    const once = (...args) => { this.removeListener(name, once); callback(...args); };
    return this.on(name, once);
  }
  emit(name, message) {
    if (name === "req") {
      queueMicrotask(() => this.deliver("res", { eventId: message.eventId, data: false }));
    } else if (name === "request-available-devices" || name === "request-saved-devices") {
      const response = name === "request-available-devices" ? "available-devices" : "saved-devices";
      queueMicrotask(() => this.deliver(response, { eventId: message.eventId, data: [] }));
    }
    return true;
  }
  deliver(name, message) { this.listeners.get(name)?.forEach(callback => callback(message)); }
}

window.NativeBus = new LocalBus();
window.KitAppShellConfig = {
  UI_ROOT: "/code/kit/", UI_VERSION: "1.0.0-local-v16", PROFILE: "kano-os",
  OS_PLATFORM: "kano", OS_VERSION: "4.3.3", ENV: "production", DEBUG: false,
  MODULE_TYPE: "system", TELEMETRY_DISABLED: true,
  API_URL: "/code/kit/offline-api/",
  UPDATER: { WIN32_FEED_URL: "", DARWIN_FEED_URL: "" },
};

function installLocalRouting() {
  const Main = customElements.get("ka-main");
  // Preserve original route state in a hash so refreshing never leaves /code/.
  Main.prototype.activate = function () {
    this._activated = true;
    this._router.updatePath(location.hash.slice(1) || "/map/draw");
    this._router.updateParams(this.__query);
  };
  Main.prototype._onPathChanged = function () {};
  const setupRouter = Main.prototype._setupRouter;
  Main.prototype._setupRouter = function () {
    setupRouter.call(this);
    this._router.onDidUpdateRoute(route => {
      if (route) history.replaceState({}, "", `/code/kit/#${route.path}`);
    });
    // The original subscriber writes root paths; keep those writes in the iframe.
    const pushState = history.pushState.bind(history);
    history.pushState = (state, title, url) => {
      const target = new URL(url, location.href);
      return pushState(state, title, `/code/kit/#${target.pathname}`);
    };
  };
  window.addEventListener("popstate", () => {
    window.KanoLocalApp?.appEl?._router.updatePath(location.hash.slice(1) || "/map/draw");
  });
  document.addEventListener("click", event => {
    const anchor = event.composedPath().find(node => node instanceof HTMLAnchorElement);
    if (!anchor || anchor.target === "_blank") return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin) { event.preventDefault(); return; }
    if (/^\/(map|challenges|demo|remix)(\/|$)/.test(url.pathname)) {
      event.preventDefault();
      window.KanoLocalApp.appEl._router.updatePath(url.pathname);
    }
  }, true);
}

window.Shell = {
  define(UIClass) {
    const load = UIClass.prototype.load;
    UIClass.prototype.load = function () {
      return load.call(this).then(() => installLocalRouting());
    };
    const setupApp = UIClass.prototype.setupApp;
    UIClass.prototype.setupApp = function (profile) {
      const activate = profile.activate.bind(profile);
      profile.activate = context => {
        const result = activate(context);
        context.creations.disable();
        context.userProfile.disable();
        context.auth.disable();
        return result;
      };
      return setupApp.call(this, profile);
    };
    const app = new UIClass(window.NativeBus, window.KitAppShellConfig);
    window.KanoLocalApp = app;
    document.body.appendChild(app.root);
    const animateAppIn = app.animateAppIn.bind(app);
    app.animateAppIn = () => {
      animateAppIn();
      parent.postMessage({ type: "kano-code-ready" }, location.origin);
    };
  },
};
window.addEventListener("unhandledrejection", event => {
  console.error("Kano Code", event.reason);
  parent.postMessage({ type: "kano-code-error", message: String(event.reason) }, location.origin);
});
requirejs(["/code/kit/index.js"]);
