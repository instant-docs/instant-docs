import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  pluginJs.configs.recommended,
  {
    ignores: [
      "dist/*",
      "static/js/fuse_7_0_0.js"
    ],
  },
  {
    languageOptions: { globals: globals.node },
  },
  {
    files: ["static/**/*.[jt]s?(x)", "src/plugins/frontend/**/*.[jt]s?(x)"],
    languageOptions: { globals: globals.browser },
  },
];