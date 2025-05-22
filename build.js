import axios from 'axios';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import config from './config.js';
import { offMenuPagesByVersion, onMenuPagesByVersion, projectBuildDir, server, versions } from './index.js';
import { emitter } from './src/events.js';
import getLinkFor from './src/get-link-for.js';

export default function build() {
  return new Promise((resolve, reject) => {
    emitter.on('all-ready', async () => {
      try {
        const allLanguages = config.CONTENT_LANGUAGES.split(',');
        await Promise.all(
          versions.map((version) => {
            const allPages = [...onMenuPagesByVersion[version], ...offMenuPagesByVersion[version]];
            return Promise.all(
              allLanguages.map(
                async (lang) =>
                  await Promise.all(
                    allPages.map(async (page) => {
                      const response = await axios.get(getLinkFor({ page, lang }), { baseURL: `${config.PROTOCOL}://localhost:${config.PORT}` });
                      const html = response.data;
                      const filepath = join(projectBuildDir, page.url, lang, 'index.html');
                      mkdirSync(dirname(filepath), { recursive: true });
                      writeFileSync(filepath, html);
                    }),
                  ),
              ),
            );
          }),
        );
        server.close();
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  });
}
