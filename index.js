// @ts-check
import express from "express";
import { readdirSync, statSync } from "fs";
import { basename, extname, join, relative, resolve, sep } from "path";
import config from "./config.js";
import { metadata } from "./helpers/index.js";
import detectLanguage from "./middlewares/detect-language.js";
import { buildFePlugins } from "./src/build-fe-plugins.js";
import generatePage from "./src/generate-page.js";
import { __dir } from "./src/get-current-dir-file.js";
import getHtmlContent from "./src/get-html-content.js";
import projectDir from "./src/get-project-dir.js";
import { toImportPath } from "./src/to-import-path.js";

export const app = express();

const {
  PORT
} = config;

app.use(detectLanguage);
app.use('/', express.static('./static'));

async function readDirAndSetRoutes({parent = '/', dir = join(projectDir, 'pages/on-menu')} = {}){
  try{
    const dirs = readdirSync(dir);
    const promises = dirs.map(async (element) => {
    /** @type {Array<{url: string, metas: Record<string, object>}>} */ const pages = [];
      const absolute = resolve(dir, element);
      if (statSync(absolute).isDirectory()) {
        const subPages = await readDirAndSetRoutes({ parent: join(parent, element), dir: join(dir, element) });
        pages.push(...subPages);
      } else {
        if (element.startsWith('content') && !pages.some(page => page.url === absolute)) {
          const url = parent.split(sep).join('/');
          const metas = await getMetadatas(dir);
          pages.push({ url, metas });
          app.get(url, (_req, res) => {
            const { content, lang } = getHtmlContent(dir, res.locals.detectedLanguage);
            const meta = metas[lang] ?? metas[config.DEFAULT_LANG];
            res.contentType('html').send(generatePage({ dir, content, meta, lang }));
          });
        }
      }
      return pages;
    });
    const results = await Promise.all(promises);
    return results.reduce((acc, current) => ([...acc, ...current]), []);
  } catch(e){
    console.warn(`Couldn't create page route for ${dir}\n\t${e.message}`);
    return [];
  }
}

export const onMenuPages = await readDirAndSetRoutes();
export const offMenuPages = await readDirAndSetRoutes({ dir: './pages/off-menu' });

console.log({
  onMenuPages,
  offMenuPages
})

async function getMetadatas(dir) {
  const files =  readdirSync(dir);
  const metaFiles = files.filter(fileName => fileName.startsWith('meta') && fileName.endsWith('.js'));
  if (metaFiles.length === 0) {
    return {
      [config.DEFAULT_LANG]: metadata()
    };
  }
  const result = {};
  for (const file of metaFiles) {
    const fileName = basename(file, extname(file));
    const splittedName = fileName.split('_');
    const fileLang = splittedName.length > 1 ? splittedName.at(-1) : config.DEFAULT_LANG;
    const moduleDir = join(dir, file);
    const scriptDir = __dir(import.meta);
    const metaModule = await import(toImportPath(relative(scriptDir, moduleDir)));
    result[fileLang] = metaModule.default;
  }
  return result;
}

buildFePlugins();

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});