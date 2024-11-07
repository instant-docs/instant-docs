// @ts-check
import esbuild from 'esbuild';
import { join } from 'path';
import getJSFiles from './get-js-files.js';
import projectDir from './get-project-dir.js';
import { emitter } from './events.js';
import { existsSync, mkdirSync } from 'fs';
import config from '../config.js';

export function buildFePlugins() {
  try {
    const files = getJSFiles(join(projectDir, 'src/plugins/frontend'));
    const outdir = join(projectDir, config.PLUGINS_DIR);
    if (!existsSync(outdir)) {
      mkdirSync(outdir, { recursive: true });
    }
    esbuild.buildSync({
      entryPoints: files,
      bundle: true,
      outdir,
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
