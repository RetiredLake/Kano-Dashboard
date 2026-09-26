import "./style.css";

async function startEditor() {
  const loading = document.getElementById("loading");
  const editorRoot = document.getElementById("editor-root");
  let settled = false;

  function showError(error) {
    if (settled) return;
    settled = true;
    window.clearTimeout(startupTimer);
    console.error("Kano Code could not start", error);
    if (loading) {
      loading.textContent = "Kano Code could not start. Refresh this page to try again.";
      loading.classList.add("error");
    }
  }

  const startupTimer = window.setTimeout(() => {
    showError(new Error("The Blockly editor did not finish initializing."));
  }, 45000);

  try {
    if (!loading || !editorRoot) throw new Error("The Kano Code page is missing its editor container.");

    await Promise.all([
      import("@webcomponents/shadycss/apply-shim.min.js"),
      import("@webcomponents/shadycss/scoping-shim.min.js"),
      import("@webcomponents/webcomponentsjs/webcomponents-bundle.js"),
    ]);

    // Kano Code's sequencer expects the legacy Tone UMD global. Vite exposes
    // that dependency as a module export, so publish it before loading Kano's
    // editor modules that read window.Tone.
    const toneModule = await import("tone/build/Tone.js");
    window.Tone = window.Tone || toneModule.default || toneModule;
    if (!window.Tone?.Transport) throw new Error("Tone.js did not initialize.");

    const [code, i18n, storageModule] = await Promise.all([
      import("@kano/code/index.js"),
      import("@kano/code/i18n.js"),
      import("@kano/code/dist/app/lib/storage/local-storage.js"),
    ]);
    const { LocalStoragePlugin } = storageModule;

    class BrowserEditorProfile extends code.DefaultEditorProfile {
      onInstall(editor) {
        super.onInstall(editor);
        this.storage = new LocalStoragePlugin("kano-dashboard-code");
        this.plugins.push(this.storage);
      }
    }

    const language = i18n.getLang();
    await i18n.load(language, {
      blockly: true,
      kanoCodePath: "/code/",
      modulesPath: "/code/blockly/",
    });

    const editor = new code.Editor({ mediaPath: "/code/media/" });
    const profile = new BrowserEditorProfile();
    editor.registerProfile(profile);
    editor.onDidInject(() => {
      Promise.resolve(profile.storage.load()).then(() => {
        if (settled) return;
        settled = true;
        window.clearTimeout(startupTimer);
        loading.remove();
      }).catch(showError);
    });
    editor.inject(editorRoot);
  } catch (error) {
    showError(error);
  }
}

void startEditor();
