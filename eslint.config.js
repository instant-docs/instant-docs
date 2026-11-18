import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['dist/*', 'versions/*/static/js/**/*.js', '**/bundle.js'],
  },
  {
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/plugins/backend/**/*.[jt]s?(x)'],
    languageOptions: { globals: { ...globals.node, ...globals.browser, backend: 'readonly' } },
  },
  {
    files: ['versions/*/static/**/*.[jt]s?(x)', 'src/plugins/frontend/**/*.[jt]s?(x)'],
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
];
