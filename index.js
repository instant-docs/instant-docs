// @ts-check
import { metadata } from '#helpers/index.js';
import express from 'express';
import { existsSync, lstatSync, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import { basename, extname, join, relative, resolve, sep } from 'path';
import config from './config.js';
import detectLanguage from './middlewares/detect-language.js';
import { buildFePlugins } from './src/build-fe-plugins.js';
import generatePage from './src/generate-page.js';
import { __dir } from './src/get-current-dir-file.js';
import getHtmlContent from './src/get-html-content.js';
import getLinkFor from './src/get-link-for.js';
import projectDir from './src/get-project-dir.js';
import { toImportPath } from './src/to-import-path.js';
import { searchIndexRouter } from './src/get-full-text-search-index.js';
import getStaticPath from './src/get-static-path.js';
import { copyAndMinify } from './src/copy-and-minify.js';
import putVariables from './src/put-variables-to-text.js';
import getDictionary from './src/get-dictionary.js';
import getVarMap from './src/get-var-map.js';

const { PORT, PROTOCOL, BUILD_DIR, DEFAULT_LANG, GLOBAL_STATIC_PATH } = config;

export const app = express();

app.use(searchIndexRouter);

export const projectBuildDir = join(projectDir, BUILD_DIR);
if (existsSync(projectBuildDir)) {
  rmSync(projectBuildDir, { recursive: true });
}

app.use(detectLanguage);

app.get('/config', (_req, res) => {
  res.json(config);
});

export const onMenuPagesByVersion = {};
export const offMenuPagesByVersion = {};

async function readDirAndSetRoutes({ parent = '/', dir = './versions/latest/on-menu', version = 'latest', dirType = '' } = {}) {
  try {
    const resolved = resolve(dir);
    dirType = dirType || /** @type { 'on-menu' | 'off-menu' | 'static'} */ (resolved.split(sep).at(-1));
    if (dirType === 'static') {
      const staticPath = getStaticPath({ version });
      const targetDir = join(projectBuildDir, staticPath);
      copyAndMinify(resolved, targetDir);
      app.use(staticPath, express.static(targetDir));
      return [];
    }
    const dirs = readdirSync(dir);
    /** @type {Array<{url: string, metas: Record<string, object>}>} */ const pages = [];
    if (!onMenuPagesByVersion[version]) {
      onMenuPagesByVersion[version] = [];
    }
    if (!offMenuPagesByVersion[version]) {
      offMenuPagesByVersion[version] = [];
    }
    for (const element of dirs) {
      const absolute = resolve(dir, element);
      if (statSync(absolute).isDirectory()) {
        const subPages = await readDirAndSetRoutes({ parent: join(parent, element), dir: join(dir, element), version, dirType });
        pages.push(...subPages);
      } else {
        const urlSegment = parent.split(sep).join('/');
        const page = { url: urlSegment, metas: {} };
        const url = getLinkFor({ page, lang: undefined, version });
        if (element.startsWith('content') && !pages.some((page) => page.url === urlSegment)) {
          page.metas = await getMetadatas({dir, version});
          pages.push(page);
          if (dirType === 'on-menu') {
            onMenuPagesByVersion[version].push(page);
          } else {
            offMenuPagesByVersion[version].push(page);
          }
          app.get(url, (req, res) => {
            const lang = req.params.lang || res.locals.detectedLanguage;
            const { content, dictionaryMap } = getHtmlContent(dir, lang);
            const meta = page.metas[lang] ?? page.metas[DEFAULT_LANG];
            const generatedPage = generatePage({ dir, content, meta, lang, version, dictionaryMap });
            res.contentType('html').send(generatedPage);
          });
        }
      }
    }
    return pages;
  } catch (e) {
    console.warn(`Couldn't create page route for ${dir}\n\t${e.message}`);
    return [];
  }
}

export let versions = [];
if (existsSync('./versions')) {
  versions = readdirSync('./versions')
    .filter((dir) => lstatSync(`./versions/${dir}`).isDirectory())
    .sort()
    .reverse();
  versions.forEach(version => {
    mkdirSync(join(projectBuildDir, getStaticPath({ version })), { recursive: true })
  });
}

export const projectStaticDir = join(projectDir, GLOBAL_STATIC_PATH);
if (existsSync(projectStaticDir) && lstatSync(projectStaticDir).isDirectory()) {
  const targetDir = join(projectBuildDir, GLOBAL_STATIC_PATH);
  copyAndMinify(projectStaticDir, targetDir);
  app.use(GLOBAL_STATIC_PATH, express.static(targetDir));
}

const [pages] = await Promise.all(
  versions
    .map((v) => [
      readDirAndSetRoutes({ dir: `./versions/${v}/on-menu`, version: v }),
      readDirAndSetRoutes({ dir: `./versions/${v}/off-menu`, version: v }),
      readDirAndSetRoutes({ dir: `./versions/${v}/static`, version: v }),
    ])
    .flat(),
);

console.log({ pages });

/**
 * @param {{ dir: string, version: string }} options
 * @returns {Promise<Record<string, object>>}
 */
async function getMetadatas({ dir, version }) {
  const files = readdirSync(dir);
  const metaFiles = files.filter((fileName) => fileName.startsWith('meta') && fileName.endsWith('.js'));
  const result = {};
  for(const lang of config.CONTENT_LANGUAGES.split(',')) {
    const metaFile = metaFiles.find(file => file === `meta_${lang}.js`) || metaFiles.find(file => file === `meta.js`);
    if(!metaFile) {
      result[lang] = metadata();
      continue;
    }
    const moduleDir = join(dir, metaFile);
    const scriptDir = __dir(import.meta);
    const metaModule = await import(toImportPath(relative(scriptDir, moduleDir)));
    const pureMeta = metaModule.default;
    const dictionary = getDictionary({ dir, lang });
    const dictionaryMap = Object.fromEntries(Object.keys(dictionary).map(key => [`${config.DICTIONARY_VARIABLE}.${key}`, dictionary[key]]));
    const varMap = getVarMap({ dir, lang, version, dictionaryMap });
    result[lang] = putVariables({ target: pureMeta, source: varMap, placeholderAlreadyWrapped: true, convertToSnakeCase: false });
  }
  return result;
}

buildFePlugins();

export const server = app.listen(PORT, () => {
  console.log(`Running on ${PROTOCOL}://localhost:${PORT}`);
});