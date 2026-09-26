import "./style.css";

const config = {
  UI_ROOT: "/art/",
  ENV: "production",
  TELEMETRY_URL: null,
  CONFIG: {
    OFFLINE: true,
    API_URL: false,
    // The offline app still constructs its API client during bootstrap. It
    // never sends requests while OFFLINE is true, but the client needs a URL.
    API_URL_V2: "/art/api",
    WORLD_URL: false,
    CHALLENGES_URL: "www/assets/challenges/descriptors",
    AUTH_INTEGRATION_URL: "",
    AUTH_SIGNUP_URL: "",
    AUTH_LOGIN_URL: "",
    DEFAULT_AVATAR: "",
    languageSynonyms: { color: ["colour"], grey: ["gray"] },
  },
};

async function startMakeArt() {
  const loading = document.getElementById("loading");
  const appContainer = document.getElementById("make-art-app");
  let settled = false;

  function reportFailure(error) {
    console.error("Make Art could not start", error);
    showRuntimeError();
  }

  const startupTimer = window.setTimeout(() => {
    if (settled) return;
    settled = true;
    reportFailure(new Error("The Make Art workspace did not finish initializing."));
  }, 45000);

  try {
    if (!loading || !appContainer) throw new Error("The Make Art page is missing its workspace container.");

    // Make Art's Markdown filter expects the UMD `window.marked` global. Vite
    // bundles that file as a module, so expose its export before app modules run.
    const markedModule = await import("../../../kano-apps/make-art/node_modules/marked/marked.min.js");
    window.marked = window.marked || markedModule.default || markedModule;
    if (!window.marked?.Renderer) throw new Error("Make Art Markdown did not initialize.");

    const { MakeArt } = await import("../../../kano-apps/make-art/index.js");
    const app = new MakeArt({ config });
    if (!app.root || !app.ready || typeof app.ready.then !== "function") {
      throw new Error("The Make Art workspace did not expose its startup promise.");
    }
    appContainer.appendChild(app.root);
    await app.ready;
    if (settled) return;
    settled = true;
    window.clearTimeout(startupTimer);
    loading.remove();
  } catch (error) {
    if (!settled) {
      settled = true;
      window.clearTimeout(startupTimer);
    }
    reportFailure(error);
  }
}

function showRuntimeError() {
  let message = document.getElementById("runtime-error");
  if (!message) {
    message = document.createElement("p");
    message.id = "runtime-error";
    message.setAttribute("role", "alert");
    message.className = "runtime-error";
    document.body.appendChild(message);
  }
  message.textContent = "Make Art hit an error. Refresh this page to try again.";
  document.getElementById("loading")?.remove();
}

window.addEventListener("unhandledrejection", (event) => {
  if (document.querySelector("#make-art-app #main")) {
    console.error("Make Art runtime error", event.reason);
    showRuntimeError();
  }
});

void startMakeArt();
