import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { packageDirectorySync } from 'pkg-dir';
import config from '../config.js';

const projectDir = packageDirectorySync() || '.';

const projectBuildDir = join(projectDir, config.BUILD_DIR);
if (existsSync(projectBuildDir)) {
  rmSync(projectBuildDir, { recursive: true });
}

export default projectDir;

export { projectBuildDir, projectDir };
