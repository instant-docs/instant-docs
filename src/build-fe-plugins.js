// @ts-check
import esbuild from 'esbuild';
import { join } from 'path';
import getJSFiles from './get-js-files.js';
import projectDir from './get-project-dir.js';
import { emitter } from './events.js';

export function buildFePlugins() {
  try {
    const files = getJSFiles(join(projectDir, 'src/plugins/frontend'));
    esbuild.buildSync({
      entryPoints: files,
      bundle: true,
      outdir: join(projectDir, 'static'),
      minify: true,
      treeShaking: true,
      platform: 'browser',
      drop: ['debugger'],
    });
  } catch (e) {
    console.warn(`Couldn't setup FE plugins\n${e.message}`);
  }
  emitter.emit('fe-plugins-ready');
}
