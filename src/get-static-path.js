import config from "../config.js";

export default function getStaticPath({ version }) {
    return config.STATIC_PATH
        .replaceAll('%version%', version);
}