import "@webcomponents/shadycss/apply-shim.min.js";
import "@webcomponents/shadycss/scoping-shim.min.js";
import "@webcomponents/webcomponentsjs/webcomponents-bundle.js";
import * as code from "@kano/code/index.js";
import * as i18n from "@kano/code/i18n.js";
import { LocalStoragePlugin } from "@kano/code/dist/app/lib/storage/local-storage.js";
import "./style.css";

class BrowserEditorProfile extends code.DefaultEditorProfile {
  onInstall(editor) {
    super.onInstall(editor);
    this.storage = new LocalStoragePlugin("kano-dashboard-code");
    this.plugins.push(this.storage);
  }
}

async function start() {
  const loading = document.getElementById("loading");
  try {
    const language = i18n.getLang();
    await i18n.load(language, { blockly: true, kanoCodePath: "/code/" });

    const editor = new code.Editor({ BLOCKLY_MEDIA: "/code/media/" });
    const profile = new BrowserEditorProfile();
    editor.registerProfile(profile);
    editor.onDidInject(() => profile.storage.load());
    editor.inject(document.getElementById("editor-root"));
    loading.remove();
  } catch (error) {
    console.error("Kano Code could not start", error);
    loading.textContent = "The editor could not load. Refresh this page to try again.";
    loading.classList.add("error");
  }
}

start();
