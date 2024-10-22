import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['dist/*', 'static/js/fuse_7_0_0.js', '**/bundle.js'],
  },
  {
    languageOptions: { globals: globals.node },
  },
  {
    files: ['static/**/*.[jt]s?(x)', 'src/plugins/frontend/**/*.[jt]s?(x)'],
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
];
