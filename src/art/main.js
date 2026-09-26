import { MakeArt } from "../../../kano-apps/make-art/index.js";
import "./style.css";

const config = {
  UI_ROOT: "/art/",
  ENV: "production",
  TELEMETRY_URL: null,
  CONFIG: {
    OFFLINE: true,
    API_URL: false,
    API_URL_V2: false,
    WORLD_URL: false,
    CHALLENGES_URL: "www/assets/challenges/descriptors",
    AUTH_INTEGRATION_URL: "",
    AUTH_SIGNUP_URL: "",
    AUTH_LOGIN_URL: "",
    DEFAULT_AVATAR: "",
    languageSynonyms: { color: ["colour"], grey: ["gray"] },
  },
};

const app = new MakeArt({ config });
document.getElementById("make-art-app").appendChild(app.root);
document.getElementById("loading").remove();
