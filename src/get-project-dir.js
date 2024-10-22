import { packageDirectorySync } from 'pkg-dir';

const projectDir = packageDirectorySync() || '.';

export default projectDir;
