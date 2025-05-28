export default {
  PORT: 3000,
  PROTOCOL: 'http',
  /** @type {BufferEncoding} */ ENCODING: "utf-8",
  DEFAULT_LANG: 'en-GB',
  DEFAULT_CONTENT_HEADING_LEVEL: 2,
  ALLOW_SEARCH_IN_OFF_MENU: 'true',
  CONTENT_LANGUAGES: 'en,tr,ar',
  BUILD_DIR: './dist',
  PLUGINS_PATH: '/static/plugins',
  STATIC_PATH: '/static/%version%',
  LINK_FORMAT: '/%lang%/%version%/%slug%',
  DICTIONARY_VARIABLE: '%d%',
};
