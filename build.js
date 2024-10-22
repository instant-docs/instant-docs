import axios from 'axios';
import { copyFolder } from 'copy-folder-util';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import config from './config.js';
import { offMenuPages, onMenuPages, server } from './index.js';
import { emitter } from './src/events.js';
import projectDir from './src/get-project-dir.js';

export default function build() {
  return new Promise((resolve, reject) => {
    emitter.on('all-ready', async () => {
      try {
        const allLanguages = config.CONTENT_LANGUAGES.split(',');
        const targetDir = join(projectDir, config.BUILD_DIR);
        rmSync(targetDir, { recursive: true });
        const allPages = [...onMenuPages, ...offMenuPages];
        await Promise.all(
          allLanguages.map(
            async (lang) =>
              await Promise.all(
                allPages.map(async (page) => {
                  const response = await axios.get(page.url, {
                    baseURL: `${config.PROTOCOL}://localhost:${config.PORT}/${lang}`,
                  });
                  const html = response.data;
                  const filepath = join(targetDir, lang, page.url, 'index.html');
                  mkdirSync(dirname(filepath), { recursive: true });
                  writeFileSync(filepath, html);
                }),
              ),
          ),
        );
        const staticDir = join(projectDir, 'static');
        copyFolder.cp(staticDir, targetDir);
        server.close();
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  });
}
