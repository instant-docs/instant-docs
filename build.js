import axios from 'axios';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import config from './config.js';
import { offMenuPagesByVersion, onMenuPagesByVersion, projectBuildDir, server, versions } from './index.js';
import { checkIsAllReady, emitter } from './src/events.js';
import getLinkFor from './src/get-link-for.js';

async function buildAllPages() {
  const allLanguages = config.CONTENT_LANGUAGES.split(',');
  console.log('Building for languages:', allLanguages);
  await Promise.all(
    versions.map((version) => {
      const allPages = [...onMenuPagesByVersion[version], ...offMenuPagesByVersion[version]];
      return Promise.all(
        allLanguages.map(
          async (lang) =>
            await Promise.all(
              allPages.map(async (page) => {
                const path = getLinkFor({ page, lang, version });
                const response = await axios.get(path, { baseURL: `${config.PROTOCOL}://localhost:${config.PORT}` });
                const html = response.data;
                const filepath = join(projectBuildDir, path, 'index.html');
                console.log('Building', filepath);
                mkdirSync(dirname(filepath), { recursive: true });
                writeFileSync(filepath, html);
              }),
            ),
        ),
      );
    }),
  );
  server.close();
  return true;
}

export default function build() {
  console.log('Building...');
  if (checkIsAllReady()) {
    buildAllPages();
  } else {
    emitter.on('all-ready', buildAllPages);
  }
}
